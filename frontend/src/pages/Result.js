import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { ArrowLeft, CheckCircle2, XCircle, Lightbulb, Brain, Download } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Result() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    axios.get(`/api/resume/${id}`)
      .then(res => {
        setData(res.data);
        setLoading(false);
        if (res.data.missingSkills && res.data.missingSkills.length > 0) {
          setAiLoading(true);
          axios.post('/api/resume/ai-suggestions', {
            missingSkills: res.data.missingSkills,
            jobRole: res.data.jobRole
          }).then(aiRes => {
            setAiSuggestions(aiRes.data.aiSuggestions);
            setAiLoading(false);
          }).catch(() => setAiLoading(false));
        }
      })
      .catch(err => { console.error(err); setLoading(false); });
  }, [id]);

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Average';
    return 'Needs Work';
  };

  // Build a clean standalone HTML page and open print dialog
  const handleDownload = async () => {
    setDownloading(true);
    const scoreColor = getScoreColor(data.atsScore);
    const scoreLabel = getScoreLabel(data.atsScore);
    const date = new Date(data.uploadedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const allSuggestions = [...(data.suggestions || []), ...(aiSuggestions || [])];

    const badgeStyle = (type) => type === 'success'
      ? 'background:#d1fae5;color:#065f46;border:1px solid #6ee7b7;'
      : 'background:#fee2e2;color:#991b1b;border:1px solid #fca5a5;';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>ATS Report — ${data.fileName || 'Resume'}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', sans-serif;
      background: #f8fafc;
      color: #1e293b;
      font-size: 13px;
      line-height: 1.6;
    }

    /* ---- PAGE BREAK CONTROL ---- */
    .no-break  { page-break-inside: avoid; break-inside: avoid; }
    .page-break { page-break-before: always; break-before: always; }

    /* ---- HEADER ---- */
    .header {
      background: linear-gradient(135deg, #1e3a5f 0%, #1e40af 50%, #4f46e5 100%);
      color: #fff;
      padding: 36px 48px 28px;
    }
    .header-top { display: flex; justify-content: space-between; align-items: flex-start; }
    .brand { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
    .brand span { color: #93c5fd; }
    .meta { font-size: 11px; color: #bfdbfe; text-align: right; line-height: 1.8; }
    .header-title { margin-top: 20px; }
    .header-title h1 { font-size: 26px; font-weight: 700; }
    .header-title p  { color: #bfdbfe; margin-top: 4px; font-size: 13px; }

    /* ---- SCORE HERO ---- */
    .score-hero {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      margin: 28px 48px;
      padding: 32px 40px;
      display: flex;
      align-items: center;
      gap: 40px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    }
    .score-circle {
      width: 130px; height: 130px; flex-shrink: 0;
      border-radius: 50%;
      background: conic-gradient(${scoreColor} 0% ${data.atsScore}%, #e2e8f0 ${data.atsScore}% 100%);
      display: flex; align-items: center; justify-content: center;
      position: relative;
    }
    .score-circle-inner {
      width: 96px; height: 96px;
      background: #fff;
      border-radius: 50%;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
    }
    .score-number { font-size: 28px; font-weight: 800; color: ${scoreColor}; line-height: 1; }
    .score-pct    { font-size: 11px; color: #64748b; font-weight: 500; }
    .score-info   { flex: 1; }
    .score-info h2 { font-size: 20px; font-weight: 700; color: #0f172a; }
    .score-info .label {
      display: inline-block; margin-top: 6px;
      padding: 3px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;
      background: ${scoreColor}22; color: ${scoreColor};
    }
    .score-info p { margin-top: 10px; color: #475569; font-size: 13px; }
    .score-bars { margin-top: 20px; display: flex; flex-direction: column; gap: 10px; }
    .bar-row { display: flex; align-items: center; gap: 10px; }
    .bar-label { width: 90px; font-size: 12px; color: #475569; font-weight: 500; }
    .bar-track { flex: 1; height: 8px; background: #e2e8f0; border-radius: 4px; overflow: hidden; }
    .bar-fill   { height: 100%; border-radius: 4px; }
    .bar-value  { width: 40px; text-align: right; font-size: 12px; font-weight: 600; color: #1e293b; }

    /* ---- SECTION ---- */
    .section { margin: 0 48px 24px; }
    .section-title {
      font-size: 15px; font-weight: 700; color: #1e293b;
      padding-bottom: 8px;
      border-bottom: 2px solid #e2e8f0;
      margin-bottom: 16px;
      display: flex; align-items: center; gap: 8px;
    }
    .section-title .dot {
      width: 10px; height: 10px; border-radius: 50%;
      display: inline-block; flex-shrink: 0;
    }

    /* ---- CARDS ---- */
    .card {
      background: #fff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }
    .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

    /* ---- BADGES ---- */
    .badge {
      display: inline-block;
      padding: 4px 10px; border-radius: 20px;
      font-size: 11px; font-weight: 600;
      margin: 3px;
    }

    /* ---- SUGGESTION LIST ---- */
    .suggestion-item {
      display: flex; gap: 10px; align-items: flex-start;
      padding: 10px 14px;
      background: #f8fafc;
      border-left: 3px solid #3b82f6;
      border-radius: 0 8px 8px 0;
      margin-bottom: 8px;
      font-size: 12.5px;
      color: #334155;
    }
    .suggestion-num {
      background: #3b82f6; color: #fff;
      width: 20px; height: 20px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 10px; font-weight: 700; flex-shrink: 0;
    }

    /* ---- FOOTER ---- */
    .footer {
      margin: 32px 48px 0;
      padding: 16px 0;
      border-top: 1px solid #e2e8f0;
      display: flex; justify-content: space-between; align-items: center;
      font-size: 11px; color: #94a3b8;
    }

    @media print {
      body { background: #fff; }
      .no-break  { page-break-inside: avoid; break-inside: avoid; }
      .page-break { page-break-before: always; break-before: always; }
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <div class="header no-break">
    <div class="header-top">
      <div class="brand">ATS<span>Genius</span></div>
      <div class="meta">
        <div>Resume Analysis Report</div>
        <div>Generated: ${date}</div>
        <div>File: ${data.fileName || 'N/A'}</div>
      </div>
    </div>
    <div class="header-title">
      <h1>Resume Analysis Report</h1>
      <p>Target Role: ${data.jobRole}</p>
    </div>
  </div>

  <!-- SCORE HERO -->
  <div class="score-hero no-break">
    <div class="score-circle">
      <div class="score-circle-inner">
        <span class="score-number">${data.atsScore}</span>
        <span class="score-pct">/ 100</span>
      </div>
    </div>
    <div class="score-info">
      <h2>ATS Match Score</h2>
      <span class="label">${scoreLabel}</span>
      <p>Your resume scored <strong>${data.atsScore}/100</strong> for the <strong>${data.jobRole}</strong> role based on skills, keywords, and structure analysis.</p>
      <div class="score-bars">
        ${[
          { label: 'Skills (40%)',    value: data.skillsMatchScore, max: 40, color: '#3b82f6' },
          { label: 'Keywords (30%)', value: data.keywordsScore,    max: 30, color: '#8b5cf6' },
          { label: 'Structure (30%)',value: data.structureScore,   max: 30, color: '#10b981' }
        ].map(b => `
          <div class="bar-row">
            <span class="bar-label">${b.label}</span>
            <div class="bar-track"><div class="bar-fill" style="width:${Math.round((b.value/b.max)*100)}%;background:${b.color}"></div></div>
            <span class="bar-value">${b.value}/${b.max}</span>
          </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- SKILLS -->
  <div class="section no-break">
    <div class="section-title"><span class="dot" style="background:#10b981"></span> Skills Analysis</div>
    <div class="two-col">
      <div class="card">
        <div style="font-size:13px;font-weight:600;color:#065f46;margin-bottom:10px">✔ Matched Skills (${data.matchedSkills.length})</div>
        <div>${data.matchedSkills.length > 0
          ? data.matchedSkills.map(s => `<span class="badge" style="${badgeStyle('success')}">${s}</span>`).join('')
          : '<span style="color:#94a3b8;font-size:12px">No matched skills found</span>'}
        </div>
      </div>
      <div class="card">
        <div style="font-size:13px;font-weight:600;color:#991b1b;margin-bottom:10px">✘ Missing Skills (${data.missingSkills.length})</div>
        <div>${data.missingSkills.length > 0
          ? data.missingSkills.map(s => `<span class="badge" style="${badgeStyle('danger')}">${s}</span>`).join('')
          : '<span style="color:#94a3b8;font-size:12px">All skills matched!</span>'}
        </div>
      </div>
    </div>
  </div>

  <!-- SUGGESTIONS -->
  <div class="section">
    <div class="section-title"><span class="dot" style="background:#f59e0b"></span> Improvement Suggestions</div>
    <div class="card">
      ${allSuggestions.length > 0
        ? allSuggestions.map((s, i) => `
          <div class="suggestion-item no-break">
            <div class="suggestion-num">${i + 1}</div>
            <div>${s}</div>
          </div>`).join('')
        : '<p style="color:#94a3b8;font-size:12px">No suggestions — your resume looks great!</p>'}
    </div>
  </div>

  <!-- FOOTER -->
  <div class="footer no-break">
    <span>Generated by ATSGenius &mdash; Resume Analyzer</span>
    <span>Confidential &mdash; For candidate use only</span>
  </div>

</body>
</html>`;

    // Open in new window and trigger print-to-PDF
    const win = window.open('', '_blank', 'width=900,height=700');
    win.document.write(html);
    win.document.close();
    win.onload = () => {
      setTimeout(() => {
        win.focus();
        win.print();
        setDownloading(false);
      }, 800); // wait for fonts to load
    };
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px' }}><div className="loader" style={{ margin: '0 auto' }}></div></div>;
  if (!data) return <div style={{ textAlign: 'center', marginTop: '100px' }}><h3>Result not found</h3></div>;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
      transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
      style={{ paddingBottom: '50px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <Link to="/upload" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <ArrowLeft size={18} /> Back to Upload
        </Link>
        <button onClick={handleDownload} className="btn-secondary" disabled={downloading} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', opacity: downloading ? 0.7 : 1 }}>
          <Download size={18} /> {downloading ? 'Preparing...' : 'Download Report'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        {/* Left Column: Overall Score */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
          className="glass-panel" 
          style={{ padding: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          <h2 style={{ marginBottom: '5px' }}>ATS Match Score</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>for {data.jobRole}</p>
          
          <div style={{ width: '200px', marginBottom: '30px' }}>
            <svg style={{ height: 0 }}>
              <defs>
                <linearGradient id="gradient" gradientTransform="rotate(90)">
                  <stop offset="0%" stopColor={getScoreColor(data.atsScore)} />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <CircularProgressbar 
              value={data.atsScore} 
              text={`${data.atsScore}%`}
              styles={buildStyles({
                textColor: 'var(--score-value)',
                pathColor: 'url(#gradient)',
                trailColor: 'rgba(255,255,255,0.05)',
                pathTransitionDuration: 1.5
              })}
            />
          </div>

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {[
              { label: 'Skills', pct: '40%', value: data.skillsMatchScore, max: 40 },
              { label: 'Keywords', pct: '30%', value: data.keywordsScore, max: 30 },
              { label: 'Structure', pct: '30%', value: data.structureScore, max: 30 }
            ].map(({ label, pct, value, max }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--score-row-bg)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--score-row-text)', fontWeight: 500 }}>{label} <span style={{ color: 'var(--score-label)', fontSize: '0.85rem' }}>({pct})</span></span>
                <span style={{ fontWeight: 700, color: 'var(--score-row-value)', fontSize: '1rem' }}>{value}<span style={{ color: 'var(--score-label)', fontWeight: 400, fontSize: '0.85rem' }}>/{max}</span></span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column: Details */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 150 }}
          style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}
        >
          
          <div className="glass-panel" style={{ padding: '30px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}><Lightbulb color="#f59e0b" /> Insightful Suggestions</h3>
            <ul style={{ listStylePosition: 'inside', color: 'var(--text-main)', display: 'grid', gap: '10px' }}>
              {data.suggestions.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          </div>

          <div className="glass-panel" style={{ padding: '30px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Brain color="#3b82f6" /> AI-powered Improvement Plan
            </h3>
            {aiLoading ? (
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                 <div className="loader" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                 <span>AI is generating strategic advice...</span>
               </div>
            ) : aiSuggestions.length > 0 ? (
               <ul style={{ listStylePosition: 'inside', color: 'var(--text-main)', display: 'grid', gap: '10px' }}>
                 {aiSuggestions.map((s, i) => <li key={i}>{s}</li>)}
               </ul>
            ) : (
               <p style={{ color: 'var(--text-muted)' }}>You've matched all required skills perfectly. No critical gaps identified.</p>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', color: '#34d399' }}><CheckCircle2 size={18} /> Found Skills</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {data.matchedSkills.length > 0 ? data.matchedSkills.map(s => <span key={s} className="badge success">{s}</span>) : <span className="badge">None</span>}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', color: '#f87171' }}><XCircle size={18} /> Missing Skills</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {data.missingSkills.length > 0 ? data.missingSkills.map(s => <span key={s} className="badge danger">{s}</span>) : <span className="badge">None</span>}
              </div>
            </div>
          </div>

        </motion.div>
      </div>
    </motion.div>
  );
}
