import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link, Navigate } from 'react-router-dom';
import { FileText, ArrowRight, Activity, Clock, Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      axios.get('/api/resume/history')
        .then(res => {
          setHistory(res.data);
          setLoading(false);
        })
        .catch(() => {
          toast.error("Failed to load history");
          setLoading(false);
        });
    }
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this analysis?")) return;
    try {
      await axios.delete(`/api/resume/${id}`);
      setHistory(prev => prev.filter(r => r._id !== id));
      toast.success("Analysis deleted");
    } catch (err) {
      toast.error("Failed to delete analysis");
    }
  };

  if (authLoading) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}><div className="loader"></div></div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ type: 'spring', stiffness: 150 }}
      className="container"
      style={{ marginTop: '40px' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2>My Dashboard</h2>
        <Link to="/upload" className="btn-primary">New Analysis</Link>
      </div>

      <div className="glass-panel" style={{ padding: '30px' }}>
        <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Activity size={24} color="var(--accent-color)" /> Recent Analyses
        </h3>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><div className="loader"></div></div>
        ) : history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            <FileText size={48} style={{ opacity: 0.3, margin: '0 auto 15px' }} />
            <p>No resumes analyzed yet. Upload your first resume to get started!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {history.map((resume, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, type: 'spring', stiffness: 200, damping: 15 }}
                key={resume._id} 
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '20px',
                  background: 'var(--item-bg)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div>
                  <h4 style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '5px' }}>{resume.fileName}</h4>
                  <p style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--accent-color)' }}>{resume.jobRole}</span> • 
                    <Clock size={14} /> {new Date(resume.uploadedAt).toLocaleDateString()}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: 'bold', color: resume.atsScore >= 75 ? 'var(--success-color)' : resume.atsScore >= 50 ? 'var(--warning-color)' : 'var(--danger-color)' }}>
                      {resume.atsScore}%
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--score-label)' }}>ATS Score</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button 
                      onClick={() => handleDelete(resume._id)}
                      style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.2)', border: 'none', borderRadius: '50%', color: 'var(--danger-color)', display: 'flex', cursor: 'pointer' }}
                      title="Delete Analysis"
                    >
                      <Trash2 size={20} />
                    </button>
                    <Link to={`/result/${resume._id}`} style={{ padding: '10px', background: 'var(--accent-color)', borderRadius: '50%', color: 'white', display: 'flex' }} title="View Results">
                      <ArrowRight size={20} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
