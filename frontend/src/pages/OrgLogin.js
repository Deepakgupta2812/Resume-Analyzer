import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Building2, Mail, Lock, KeyRound, ArrowLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function OrgLogin() {
  const [mode, setMode] = useState('login');   // 'login' | 'forgot'
  const [step, setStep] = useState(1);          // 1 = enter email, 2 = enter OTP + new password

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const resetFlow = () => {
    setStep(1);
    setOtp('');
    setGeneratedOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setPassword(''); // clear login password field so user types the new one fresh
  };

  // --- Login ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/org/login',
        { email, password },
        { withCredentials: true }
      );
      login(res.data.user);
      toast.success('Login Successful! Welcome back.');
      navigate('/org/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    }
    setLoading(false);
  };

  // --- Step 1: Request OTP ---
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your organization email');
    setLoading(true);
    try {
      const res = await axios.post('/api/org/forgot-password', { email });
      // In mock mode the OTP is returned in the response for testing
      if (res.data.otp) {
        setGeneratedOtp(res.data.otp);
        toast.success(`(Test Mode) OTP: ${res.data.otp}`, { duration: 8000 });
      } else {
        toast.success('Recovery code sent to your organization email!');
      }
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send recovery code');
    }
    setLoading(false);
  };

  // --- Step 2: Verify OTP + Reset ---
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword || !confirmPassword) return toast.error('Please fill in all fields');
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');
    if (newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await axios.post('/api/org/reset-password', {
        email,
        otp: otp.trim(),
        newPassword
      });
      toast.success('Password reset! Please log in with your new password.');
      // Keep email, clear everything else so user just types new password
      resetFlow();
      setMode('login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to reset password');
    }
    setLoading(false);
  };

  // Shared input style
  const inputStyle = {
    width: '100%',
    padding: '10px 14px 10px 40px',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    background: 'var(--input-bg)',
    color: 'var(--text-main)',
    fontFamily: 'Outfit, sans-serif',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box'
  };

  const iconStyle = { position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ maxWidth: '440px', margin: '60px auto', padding: '0 16px' }}
    >
      <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>

        {/* Top accent bar */}
        <div style={{ height: '4px', background: 'linear-gradient(90deg, #3b82f6, #6366f1)' }} />

        <div style={{ padding: '40px' }}>

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ display: 'inline-flex', padding: '14px', borderRadius: '50%', background: 'rgba(59,130,246,0.12)', marginBottom: '12px' }}>
              <Building2 size={32} color="#3b82f6" />
            </div>
            <h2 style={{ fontWeight: 700, fontSize: '1.5rem', color: 'var(--text-main)', marginBottom: '6px' }}>
              {mode === 'login' ? 'Recruiter Portal' : 'Account Recovery'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {mode === 'login' && 'Sign in to your organization account'}
              {mode === 'forgot' && step === 1 && 'Enter your organization email to receive a reset code'}
              {mode === 'forgot' && step === 2 && (generatedOtp
                ? `(Test Mode) Your OTP is: ${generatedOtp}`
                : `Enter the 6-digit code sent to ${email}`
              )}
            </p>
          </div>

          <AnimatePresence mode="wait">

            {/* LOGIN FORM */}
            {mode === 'login' && (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                onSubmit={handleLogin}
              >
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontWeight: 500, marginBottom: '7px', color: 'var(--text-main)' }}>Business Email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={iconStyle} />
                    <input type="email" required placeholder="hr@company.com" style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                </div>

                <div style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', fontWeight: 500, marginBottom: '7px', color: 'var(--text-main)' }}>Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={iconStyle} />
                    <input type="password" required placeholder="••••••••" style={inputStyle} value={password} onChange={e => setPassword(e.target.value)} />
                  </div>
                </div>

                <motion.button whileTap={{ scale: 0.97 }} type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                  {loading ? <Loader2 size={20} className="animate-spin" /> : 'Login as Organization'}
                </motion.button>

                {/* Forgot Password link */}
                <div style={{ textAlign: 'center', marginTop: '14px' }}>
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); resetFlow(); }}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem' }}
                  >
                    Forgot Password?
                  </button>
                </div>

                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                  Don't have an account?{' '}
                  <Link to="/org/signup" style={{ color: 'var(--accent-color)', fontWeight: 500, textDecoration: 'none' }}>Register here</Link>
                </p>
              </motion.form>
            )}

            {/* FORGOT — STEP 1: Enter email */}
            {mode === 'forgot' && step === 1 && (
              <motion.form
                key="forgot1"
                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
                onSubmit={handleForgotPassword}
              >
                <div style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', fontWeight: 500, marginBottom: '7px', color: 'var(--text-main)' }}>Organization Email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={18} style={iconStyle} />
                    <input type="email" required placeholder="hr@company.com" style={inputStyle} value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                </div>

                <motion.button whileTap={{ scale: 0.97 }} type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                  {loading ? <Loader2 size={20} className="animate-spin" /> : 'Send Recovery Code'}
                </motion.button>

                <div style={{ textAlign: 'center', marginTop: '14px' }}>
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem' }}
                  >
                    <ArrowLeft size={15} /> Back to Login
                  </button>
                </div>
              </motion.form>
            )}

            {/* FORGOT — STEP 2: Enter OTP + new password */}
            {mode === 'forgot' && step === 2 && (
              <motion.form
                key="forgot2"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                onSubmit={handleResetPassword}
              >
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontWeight: 500, marginBottom: '7px', color: 'var(--text-main)' }}>Recovery Code</label>
                  <div style={{ position: 'relative' }}>
                    <KeyRound size={18} style={iconStyle} />
                    <input
                      type="text"
                      autoFocus
                      maxLength="6"
                      placeholder="123456"
                      style={{ ...inputStyle, letterSpacing: '10px', textAlign: 'center', paddingLeft: '14px' }}
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontWeight: 500, marginBottom: '7px', color: 'var(--text-main)' }}>New Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={iconStyle} />
                    <input type="password" placeholder="Create a new password" style={inputStyle} value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                  </div>
                </div>

                <div style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', fontWeight: 500, marginBottom: '7px', color: 'var(--text-main)' }}>Confirm New Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} style={iconStyle} />
                    <input type="password" placeholder="Repeat new password" style={inputStyle} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                  </div>
                </div>

                <motion.button whileTap={{ scale: 0.97 }} type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                  {loading ? <Loader2 size={20} className="animate-spin" /> : 'Reset Password'}
                </motion.button>

                <div style={{ textAlign: 'center', marginTop: '14px' }}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem' }}
                  >
                    <ArrowLeft size={15} /> Use a different email
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
