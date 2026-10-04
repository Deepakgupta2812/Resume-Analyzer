// Browser-compatible resume text extraction
export const extractTextFromBrowser = async (file) => {
  const fileName = file.name.toLowerCase();

  // 1. Plain text or Markdown
  if (fileName.endsWith('.txt') || fileName.endsWith('.md')) {
    return await file.text();
  }

  // 2. DOCX file (ZIP archive containing word/document.xml)
  if (fileName.endsWith('.docx')) {
    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const textDecoder = new TextDecoder('utf-8', { fatal: false });
      const raw = textDecoder.decode(bytes);
      
      // Extract all <w:t>...</w:t> contents from document.xml
      const textMatches = raw.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
      if (textMatches && textMatches.length > 0) {
        return textMatches
          .map(t => t.replace(/<[^>]+>/g, ''))
          .join(' ')
          .replace(/\s+/g, ' ');
      }
    } catch (e) {
      console.warn("DOCX text extraction fallback:", e);
    }
  }

  // 3. PDF File (Binary Stream Text Extraction)
  if (fileName.endsWith('.pdf')) {
    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const textDecoder = new TextDecoder('latin1');
      const raw = textDecoder.decode(bytes);

      // Extract text inside Tj and TJ operators in PDF streams
      const chunks = [];
      
      // Matches (Text) Tj
      const tjMatches = raw.match(/\((.*?)\)\s*Tj/g);
      if (tjMatches) {
        for (const m of tjMatches) {
          const content = m.replace(/\)\s*Tj$/, '').replace(/^\(/, '');
          if (content.length > 1) chunks.push(content);
        }
      }

      // Matches [(T)10(ext)] TJ
      const tjArrayMatches = raw.match(/\[(.*?)\]\s*TJ/g);
      if (tjArrayMatches) {
        for (const m of tjArrayMatches) {
          const inner = m.match(/\((.*?)\)/g);
          if (inner) {
            chunks.push(inner.map(s => s.slice(1, -1)).join(''));
          }
        }
      }

      // If operators found enough words
      const extracted = chunks.join(' ').replace(/\\([()\\])/g, '$1').replace(/\s+/g, ' ');
      if (extracted.trim().length > 50) {
        return extracted;
      }

      // Fallback: extract continuous ASCII printable strings (works on all text PDFs)
      const asciiMatches = raw.match(/[a-zA-Z0-9.,;:+\-#/ ]{4,}/g);
      if (asciiMatches && asciiMatches.length > 0) {
        // Filter out PDF internal syntax keywords
        const filtered = asciiMatches.filter(s => 
          !s.includes('Obj') && !s.includes('stream') && !s.includes('endobj') && !s.includes('Font')
        );
        return filtered.join(' ').replace(/\s+/g, ' ');
      }
    } catch (e) {
      console.warn("PDF client text extraction fallback:", e);
    }
  }

  // Final fallback: try reading as text
  try {
    return await file.text();
  } catch (err) {
    return file.name;
  }
};
