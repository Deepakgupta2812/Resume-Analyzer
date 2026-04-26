import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Navigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Users, Filter, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function OrgDashboard() {
  const { user } = useContext(AuthContext);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ jobRole: '', minScore: 70 });

  useEffect(() => {
    fetchCandidates();
  }, [filters]);

  const fetchCandidates = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.jobRole) params.append('jobRole', filters.jobRole);
      if (filters.minScore) params.append('minScore', filters.minScore);
      const res = await axios.get(`/api/org/resumes?${params.toString()}`, { withCredentials: true });
      setCandidates(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this candidate record?')) return;
    try {
      await axios.delete(`/api/org/resumes/${id}`, { withCredentials: true });
      setCandidates(prev => prev.filter(c => c._id !== id));
      toast.success('Candidate record deleted');
    } catch {
      toast.error('Failed to delete record');
    }
  };

  if (!user || user.role !== 'organization') {
    return <Navigate to="/org/login" />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-main)] flex items-center gap-3">
            <Users className="text-blue-500" size={32} />
            Organization Dashboard
          </h1>
          <p className="text-[var(--text-muted)] mt-1">View and manage resumes uploaded within your organization</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel p-4 mb-8 flex flex-col md:flex-row gap-4 items-center rounded-xl" style={{ background: 'var(--panel-bg)', border: '1px solid var(--border-color)' }}>
        <div className="flex items-center gap-2 font-semibold w-full md:w-auto" style={{ color: 'var(--text-main)' }}>
          <Filter size={18} style={{ color: 'var(--accent-color)' }} /> 
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>Filters:</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '100%', maxWidth: '260px' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--score-label)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Min ATS Score</label>
          <select 
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              background: 'var(--input-bg)',
              color: 'var(--score-row-value)',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '0.95rem',
              fontWeight: 500,
              outline: 'none',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease'
            }}
            value={filters.minScore}
            onChange={(e) => setFilters({...filters, minScore: e.target.value})}
          >
            <option value="0">All Scores</option>
            <option value="50">Score &gt; 50%</option>
            <option value="70">Score &gt; 70% (Eligible)</option>
            <option value="85">Score &gt; 85% (Top Tier)</option>
          </select>
        </div>
      </div>

      {/* Candidates List */}
      <div className="glass-panel overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--item-bg)] text-[var(--text-muted)] border-b border-[var(--border-color)]">
                <th className="p-4 font-semibold">Candidate</th>
                <th className="p-4 font-semibold">Job Role Applied</th>
                <th className="p-4 font-semibold text-center">ATS Score</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="p-8 text-center text-[var(--text-muted)]">Loading candidates...</td></tr>
              ) : candidates.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-[var(--text-muted)]">No candidates found matching criteria.</td></tr>
              ) : (
                candidates.map(cert => {
                  const isEligible = cert.atsScore >= 70;
                  return (
                    <motion.tr 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      key={cert._id} 
                      className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--item-bg)] transition-colors"
                    >
                      <td className="p-4">
                        <div className="font-semibold text-[var(--text-main)]">{cert.user?.name || cert.fileName}</div>
                        <div className="text-sm text-[var(--text-muted)]">{cert.user?.identifier || 'Guest Upload'}</div>
                      </td>
                      <td className="p-4 text-[var(--text-main)]">{cert.jobRole}</td>
                      <td className="p-4 text-center">
                        <span className={`font-bold ${isEligible ? 'text-green-500' : 'text-orange-500'}`}>
                          {cert.atsScore}%
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {isEligible ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm font-medium">
                            <CheckCircle size={14} /> Eligible
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-sm font-medium">
                            <XCircle size={14} /> Not Eligible
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                          <Link
                            to={`/result/${cert._id}`}
                            className="text-blue-500 hover:text-blue-600 font-medium inline-flex items-center gap-1 border border-blue-500/30 px-3 py-1 rounded-lg hover:bg-blue-500/10 transition"
                          >
                            View Analysis
                          </Link>
                          <button
                            onClick={() => handleDelete(cert._id)}
                            title="Delete Record"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '6px',
                              background: 'rgba(239, 68, 68, 0.12)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: '8px',
                              color: 'var(--danger-color)',
                              cursor: 'pointer',
                              transition: 'background 0.2s ease'
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)'}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
