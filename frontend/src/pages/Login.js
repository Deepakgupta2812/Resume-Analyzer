import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, KeyRound, Loader2, User, ArrowLeft, Lock } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [mode, setMode] = useState('login'); // 'login', 'signup', 'forgot'
  const [step, setStep] = useState(1); // Used only in forgot-password flow (1 & 2)
  
  const [identifier, setIdentifier] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const resetFormValues = () => {
    setPassword('');
    setConfirmPassword('');
    setOtp('');
    setGeneratedOtp('');
    setNewPassword('');
    setStep(1);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!identifier || !password) return toast.error('Please fill in all fields');
    
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/login', { identifier, password });
      setUser(res.data.user);
      toast.success('Logged in successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    }
    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !identifier || !password || !confirmPassword) return toast.error('Please fill in all fields');
    if (password !== confirmPassword) return toast.error('Passwords do not match');
    
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/signup', { name, identifier, password });
      setUser(res.data.user);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Signup failed');
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!identifier) return toast.error('Please enter your email or phone number');
    
    setLoading(true);
    try {
      const res = await axios.post('/api/auth/forgot-password', { identifier });
      if (res.data.otp) {
        toast.success(`Recovery code generated: ${res.data.otp}`, { duration: 6000 });
        setGeneratedOtp(res.data.otp);
      } else {
        toast.success('Recovery code sent!');
      }
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send recovery code');
    }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword) return toast.error('Please fill in all fields');
    
    setLoading(true);
    try {
      await axios.post('/api/auth/reset-password', { identifier, otp, newPassword });
      toast.success('Password reset successfully! You can now log in.');
      setMode('login');
      resetFormValues();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to reset password');
    }
    setLoading(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ maxWidth: '420px', margin: '80px auto' }}
    >
      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        
        {mode !== 'forgot' && (
          <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)' }}>
            <button 
              onClick={() => { setMode('login'); resetFormValues(); }}
              style={{
                flex: 1, padding: '15px', background: 'transparent', border: 'none', cursor: 'pointer',
                fontWeight: 600, fontSize: '1rem', color: mode === 'login' ? 'var(--accent-color)' : 'var(--text-muted)',
                borderBottom: mode === 'login' ? '2px solid var(--accent-color)' : '2px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              Log In
            </button>
            <button 
              onClick={() => { setMode('signup'); resetFormValues(); }}
              style={{
                flex: 1, padding: '15px', background: 'transparent', border: 'none', cursor: 'pointer',
                fontWeight: 600, fontSize: '1rem', color: mode === 'signup' ? 'var(--accent-color)' : 'var(--text-muted)',
                borderBottom: mode === 'signup' ? '2px solid var(--accent-color)' : '2px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              Sign Up
            </button>
          </div>
        )}

        <div style={{ padding: '40px' }}>
          
          {mode === 'forgot' ? (
             <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Account Recovery</h2>
          ) : (
            <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>
              {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
            </h2>
          )}
          
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '30px' }}>
            {mode === 'forgot' && step === 1 && 'Enter your email or phone to receive a code.'}
            {mode === 'forgot' && step === 2 && (generatedOtp ? `(Test Mode) Your OTP is: ${generatedOtp}` : `Enter the 6-digit code sent to ${identifier}.`)}
            {mode !== 'forgot' && 'Unlock AI-powered insights for your career.'}
          </p>

          <AnimatePresence mode="wait">
            
            {/* LOG IN FORM */}
            {mode === 'login' && (
              <motion.form key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleLogin}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: '8px' }}>Phone or Email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input type="text" placeholder="john@example.com" className="select-role" style={{ paddingLeft: '40px', width: '100%', boxSizing: 'border-box' }} value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
                  </div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: '8px' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input type="password" placeholder="••••••••" className="select-role" style={{ paddingLeft: '40px', width: '100%', boxSizing: 'border-box' }} value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : 'Log In'}
                </button>
                <div style={{ textAlign: 'center', marginTop: '15px' }}>
                  <button type="button" onClick={() => { setMode('forgot'); resetFormValues(); }} style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontWeight: 500 }}>
                    Forgot Password?
                  </button>
                </div>
              </motion.form>
            )}

            {/* SIGN UP FORM */}
            {mode === 'signup' && (
              <motion.form key="signup" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleSignup}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: '8px' }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input type="text" placeholder="John Doe" className="select-role" style={{ paddingLeft: '40px', width: '100%', boxSizing: 'border-box' }} value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: '8px' }}>Phone or Email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input type="text" placeholder="john@example.com" className="select-role" style={{ paddingLeft: '40px', width: '100%', boxSizing: 'border-box' }} value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
                  </div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: '8px' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input type="password" placeholder="Create a password" className="select-role" style={{ paddingLeft: '40px', width: '100%', boxSizing: 'border-box' }} value={password} onChange={(e) => setPassword(e.target.value)} />
                  </div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: '8px' }}>Confirm Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input type="password" placeholder="Confirm your password" className="select-role" style={{ paddingLeft: '40px', width: '100%', boxSizing: 'border-box' }} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </div>
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
                </button>
              </motion.form>
            )}

            {/* FORGOT PASSWORD FORM */}
            {mode === 'forgot' && step === 1 && (
              <motion.form key="forgot1" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} onSubmit={handleForgotPassword}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: '8px' }}>Identifier</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input type="text" placeholder="Email or Phone Number" className="select-role" style={{ paddingLeft: '40px', width: '100%', boxSizing: 'border-box' }} value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
                  </div>
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : 'Send Recovery Code'}
                </button>
                <div style={{ textAlign: 'center', marginTop: '15px' }}>
                  <button type="button" onClick={() => setMode('login')} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 500 }}>
                    <ArrowLeft size={16} /> Back to Login
                  </button>
                </div>
              </motion.form>
            )}

            {/* RESET PASSWORD FORM (STEP 2) */}
            {mode === 'forgot' && step === 2 && (
              <motion.form key="forgot2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} onSubmit={handleResetPassword}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: '8px' }}>Security Code</label>
                  <div style={{ position: 'relative' }}>
                    <KeyRound size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input type="text" autoFocus maxLength="6" placeholder="123456" className="select-role" style={{ paddingLeft: '40px', width: '100%', boxSizing: 'border-box', letterSpacing: '8px', textAlign: 'center' }} value={otp} onChange={(e) => setOtp(e.target.value)} />
                  </div>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontWeight: 500, display: 'block', marginBottom: '8px' }}>New Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                    <input type="password" placeholder="Create a new password" className="select-role" style={{ paddingLeft: '40px', width: '100%', boxSizing: 'border-box' }} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  </div>
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                  {loading ? <Loader2 className="animate-spin" /> : 'Reset Password'}
                </button>
                <div style={{ textAlign: 'center', marginTop: '15px' }}>
                  <button type="button" onClick={() => setStep(1)} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 500 }}>
                    <ArrowLeft size={16} /> Enter a different identifier
                  </button>
                </div>
              </motion.form>
            )}

          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
