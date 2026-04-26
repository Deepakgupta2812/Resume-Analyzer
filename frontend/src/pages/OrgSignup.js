import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Building2, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrgSignup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleOrgSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    try {
      const res = await axios.post('/api/org/signup', 
        { name, email, password },
        { withCredentials: true }
      );
      login(res.data.user);
      navigate('/org/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-center items-center min-h-[80vh] px-4"
    >
      <div className="glass-panel p-8 max-w-md w-full relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        <div className="text-center mb-8">
          <div className="bg-blue-100 dark:bg-blue-900/40 p-4 rounded-full inline-block mb-4">
            <Building2 className="text-blue-600 dark:text-blue-400" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-main)]">Register Organization</h2>
          <p className="text-[var(--text-muted)] mt-2">Create a portal to find top candidates</p>
        </div>

        {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm text-center mb-4">{error}</div>}

        <form onSubmit={handleOrgSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Company Name</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                required 
                className="w-full pl-10 pr-4 py-2 border border-[var(--border-color)] bg-[var(--item-bg)] text-[var(--text-main)] rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Acme Corp"
                value={name} onChange={(e) => setName(e.target.value)} 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Business Email (No Gmail/Yahoo)</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="email" 
                required 
                className="w-full pl-10 pr-4 py-2 border border-[var(--border-color)] bg-[var(--item-bg)] text-[var(--text-main)] rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="hr@acmecorp.com"
                value={email} onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                required 
                className="w-full pl-10 pr-4 py-2 border border-[var(--border-color)] bg-[var(--item-bg)] text-[var(--text-main)] rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-main)] mb-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="password" 
                required 
                className="w-full pl-10 pr-4 py-2 border border-[var(--border-color)] bg-[var(--item-bg)] text-[var(--text-main)] rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="••••••••"
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} 
              />
            </div>
          </div>
          <motion.button whileTap={{ scale: 0.95 }} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors mt-2">
            Create Organization
          </motion.button>
        </form>
        <p className="text-center mt-6 text-sm text-[var(--text-muted)]">
          Already have an account? <Link to="/org/login" className="text-blue-500 hover:underline">Log in</Link>
        </p>
      </div>
    </motion.div>
  );
}
