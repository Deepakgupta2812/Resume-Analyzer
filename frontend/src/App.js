import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { FileText, LogIn, LayoutDashboard, LogOut, Sun, Moon, User } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, AuthContext } from './context/AuthContext';
import './App.css';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Result from './pages/Result';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import OrgLogin from './pages/OrgLogin';
import OrgSignup from './pages/OrgSignup';
import OrgDashboard from './pages/OrgDashboard';
import { Building2 } from 'lucide-react';

function Navigation({ theme, toggleTheme }) {
  const { user, logout } = React.useContext(AuthContext);
  
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <FileText size={28} />
        Resume Analyzer
      </Link>
      <div style={{ display: 'flex', gap: '15px' }}>
        <button 
          onClick={toggleTheme} 
          style={{ 
            background: theme === 'dark' ? 'rgba(250, 204, 21, 0.15)' : 'rgba(99, 102, 241, 0.15)', 
            border: `1px solid ${theme === 'dark' ? 'rgba(250, 204, 21, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`, 
            color: theme === 'dark' ? '#facc15' : '#6366f1', 
            cursor: 'pointer', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
          title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        {user ? (
          <>
            {user.role === 'organization' ? (
              <Link to="/org/dashboard" className="btn-secondary" style={{ background: 'var(--item-bg)', color: 'var(--text-main)', textDecoration: 'none', padding: '10px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                <Building2 size={18} /> Org Dashboard
              </Link>
            ) : (
              <>
                <Link to="/dashboard" className="btn-secondary" style={{ background: 'var(--item-bg)', color: 'var(--text-main)', textDecoration: 'none', padding: '10px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
                <Link to="/profile" className="btn-secondary" style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)', textDecoration: 'none', padding: '10px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }} title="My Profile">
                  <User size={18} />
                </Link>
              </>
            )}
            <button onClick={logout} className="btn-secondary" style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-main)', cursor: 'pointer', padding: '10px 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
              <LogOut size={18} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/org/login" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={18} /> For Organizations
            </Link>
            <Link to="/login" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LogIn size={18} /> Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/result/:id" element={<Result />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Recruiter Routes */}
        <Route path="/org/login" element={<OrgLogin />} />
        <Route path="/org/signup" element={<OrgSignup />} />
        <Route path="/org/dashboard" element={<OrgDashboard />} />
      </Routes>
    </AnimatePresence>
  );
}

function Footer() {
  return (
    <footer style={{
      marginTop: 'auto',
      padding: '40px 20px',
      textAlign: 'center',
      borderTop: '1px solid var(--border-color)',
      color: 'var(--text-muted)',
      background: 'transparent',
      fontSize: '0.9rem'
    }}>
      <div style={{ marginBottom: '10px' }}>
        <p style={{ margin: '0 0 5px', fontSize: '1.2rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <FileText size={20} color="var(--accent-color)" /> <strong>ATS Genius</strong> — Resume Analyzer
        </p>
        <p style={{ margin: '8px 0 0' }}>
          Designed and Developed by <strong style={{ color: 'var(--text-main)' }}>Deepak Gupta</strong>
        </p>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px' }}>
        <a href="https://github.com/Deepakgupta2812" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: 500 }}>GitHub Profile</a>
        <span style={{ opacity: 0.3 }}>|</span>
        <a href="https://linkedin.com/in/" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: 500 }}>LinkedIn</a>
        <span style={{ opacity: 0.3 }}>|</span>
        <a href="mailto:" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontWeight: 500 }}>Contact</a>
      </div>
      <p style={{ marginTop: '25px', fontSize: '0.8rem', opacity: 0.5 }}>
        &copy; {new Date().getFullYear()} ATS Genius. All rights reserved.
      </p>
    </footer>
  );
}

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-center" toastOptions={{ style: { background: 'var(--panel-bg)', color: 'var(--text-main)', border: '1px solid var(--border-color)' } }} />
        
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navigation theme={theme} toggleTheme={toggleTheme} />
          
          <div className="container" style={{ flex: 1, paddingBottom: '60px' }}>
            <AnimatedRoutes />
          </div>
          
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
