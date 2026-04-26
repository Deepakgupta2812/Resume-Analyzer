import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShieldCheck, Zap, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
      style={{ textAlign: 'center', marginTop: '60px' }}
    >
      <h1 style={{ fontSize: '3.5rem', marginBottom: '20px', background: 'linear-gradient(to right, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Unlock Your Career Potential
      </h1>
      <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '50px', maxWidth: '600px', margin: '0 auto 50px' }}>
        Upload your resume and instantly receive a comprehensive ATS compatibility score, skill gap analysis, and tailored suggestions for your dream role.
      </p>

      <motion.div
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        style={{ display: 'inline-block' }}
      >
        <Link to={user ? "/upload" : "/login"} className="btn-primary" style={{ fontSize: '1.2rem', padding: '16px 36px', borderRadius: '30px' }}>
          Get Started Now
        </Link>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', marginTop: '80px', textAlign: 'left' }}>
        <motion.div 
          whileHover={{ scale: 1.05, y: -10, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)' }} 
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="glass-panel delay-100" style={{ padding: '30px', cursor: 'pointer' }}>
          <Zap size={40} color="#3b82f6" style={{ marginBottom: '20px' }} />
          <h3>Instant AI Analysis</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Our advanced algorithms match your resume against industry-standard requirements in seconds.</p>
        </motion.div>
        
        <motion.div 
          whileHover={{ scale: 1.05, y: -10, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)' }} 
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="glass-panel delay-200" style={{ padding: '30px', cursor: 'pointer' }}>
          <ShieldCheck size={40} color="#10b981" style={{ marginBottom: '20px' }} />
          <h3>ATS Optimized</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Ensure your resume isn't blocked by Applicant Tracking Systems by identifying critical missing keywords.</p>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.05, y: -10, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)' }} 
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="glass-panel delay-300" style={{ padding: '30px', cursor: 'pointer' }}>
          <BarChart2 size={40} color="#c084fc" style={{ marginBottom: '20px' }} />
          <h3>Detailed Metrics</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>Get a breakdown by Skills, Keywords, and Structure with actionable advice on what to improve.</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
