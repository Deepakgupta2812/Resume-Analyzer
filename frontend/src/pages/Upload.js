import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UploadCloud, FileCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Upload() {
  const [roles, setRoles] = useState([]);
  const [file, setFile] = useState(null);
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch available roles from backend
    axios.get('/api/resume/roles')
      .then(res => {
        setRoles(res.data);
        const firstCategory = Object.keys(res.data)[0];
        if(firstCategory && res.data[firstCategory].length > 0) {
          setRole(res.data[firstCategory][0]);
        }
      })
      .catch(err => console.error("Error fetching roles:", err));
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please upload a resume (PDF/DOC)');
    if (!role) return setError('Please select a domain or job role');

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobRole', role);

    try {
      const res = await axios.post('/api/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true  // send auth cookie so org uploads get stamped with organizationId
      });
      navigate(`/result/${res.data.id}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Analysis failed. Make sure backend is running.');
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 120 }}
      style={{ maxWidth: '600px', margin: '60px auto' }}
    >
      <div className="glass-panel" style={{ padding: '40px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Upload Your Resume</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '30px' }}>
          Select the domain or job role you are targeting and upload your file.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontWeight: 500, display: 'block', marginBottom: '8px' }}>Target Domain / Job Role</label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)} 
              className="select-role"
            >
              {Object.entries(roles).map(([category, roleList]) => (
                <optgroup key={category} label={category}>
                  {roleList.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <motion.label 
            animate={{ scale: file ? 1 : [1, 1.02, 1] }}
            transition={{ repeat: file ? 0 : Infinity, duration: 2, ease: "easeInOut" }}
            className="dropzone" 
            onDragOver={(e) => e.preventDefault()} 
            onDrop={handleDrop}
            style={{ display: 'block' }}
          >
            <input type="file" className="file-input" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
            {file ? (
              <div style={{ color: 'var(--success-color)' }}>
                <FileCheck size={48} style={{ margin: '0 auto 10px' }} />
                <p style={{ fontWeight: 600 }}>{file.name}</p>
                <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>Ready for analysis</p>
              </div>
            ) : (
              <div>
                <UploadCloud size={48} color="var(--accent-color)" style={{ margin: '0 auto 10px' }} />
                <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>Drag & drop your resume</p>
                <p style={{ color: 'var(--text-muted)', marginTop: '5px' }}>or click to browse (PDF, DOCX)</p>
              </div>
            )}
          </motion.label>

          {error && <div style={{ color: 'var(--danger-color)', marginTop: '20px', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px' }}>{error}</div>}

          <motion.button whileTap={{ scale: 0.95 }} type="submit" className="btn-primary" style={{ width: '100%', marginTop: '30px', justifyContent: 'center' }} disabled={loading}>
            {loading ? <div className="loader"></div> : 'Analyze Resume'}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
