import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { User, GraduationCap, Briefcase, Award, Calendar, BookOpen, Camera, Save, Edit3, Loader2, ChevronLeft, ChevronRight, Trash2, ImagePlus } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    education: '',
    certification: '',
    position: '',
    graduation: '',
    graduationYear: '',
    cgpa: '',
    profilePicture: '',
    uploadedCertificates: []
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [certIndex, setCertIndex] = useState(0);
  const [certUploading, setCertUploading] = useState(false);
  
  const fileInputRef = useRef(null);
  const certInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      axios.get('/api/profile', { withCredentials: true })
        .then(res => {
          setProfile(res.data);
          setLoading(false);
        })
        .catch(() => {
          toast.error("Failed to load profile data");
          setLoading(false);
        });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await axios.put('/api/profile', profile, { withCredentials: true });
      setProfile(res.data);
      toast.success("Profile saved successfully");
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to save profile");
    }
    setSaving(false);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.mimetype?.startsWith('image/') && !file.type.startsWith('image/')) {
      return toast.error('Please select a valid image file');
    }

    const formData = new FormData();
    formData.append('profilePicture', file);

    setUploading(true);
    try {
      const res = await axios.post('/api/profile/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      setProfile(prev => ({ ...prev, profilePicture: res.data.profilePicture }));
      toast.success("Profile picture updated");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to upload picture");
    }
    setUploading(false);
  };

  const handleCertFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) return toast.error("File exceeds 3MB limit");
    if (!file.mimetype?.startsWith('image/') && !file.type.startsWith('image/')) return toast.error('Only images are allowed');

    const formData = new FormData();
    formData.append('certificate', file);

    setCertUploading(true);
    try {
      const res = await axios.post('/api/profile/upload-certificate', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });
      setProfile(prev => ({ ...prev, uploadedCertificates: res.data.uploadedCertificates }));
      setCertIndex(res.data.uploadedCertificates.length - 1);
      toast.success("Certificate uploaded successfully!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to upload certificate");
    }
    setCertUploading(false);
    if(certInputRef.current) certInputRef.current.value = '';
  };

  const handleRemovePicture = async () => {
    if (!profile.profilePicture) return;
    if (!window.confirm("Are you sure you want to remove your profile picture?")) return;
    setUploading(true);
    try {
      await axios.delete('/api/profile/picture', { withCredentials: true });
      setProfile(prev => ({ ...prev, profilePicture: "" }));
      toast.success("Profile picture removed");
    } catch (err) {
      toast.error("Failed to remove profile picture");
    }
    setUploading(false);
  };

  const handleDeleteCert = async (idx) => {
    if (!window.confirm("Delete this certificate?")) return;
    try {
      const res = await axios.delete(`/api/profile/certificate/${idx}`, { withCredentials: true });
      setProfile(prev => ({ ...prev, uploadedCertificates: res.data.uploadedCertificates }));
      if (certIndex >= res.data.uploadedCertificates.length) setCertIndex(Math.max(0, res.data.uploadedCertificates.length - 1));
      toast.success("Certificate deleted");
    } catch(err) {
      toast.error("Failed to delete certificate");
    }
  }

  if (authLoading || loading) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}><div className="loader"></div></div>;
  if (!user) return <Navigate to="/login" />;

  const backendUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="container"
      style={{ marginTop: '40px', maxWidth: '800px' }}
    >
      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        
        {/* Header Background */}
        <div style={{ height: '160px', background: 'var(--accent-color)', opacity: 0.8 }}></div>

        <div style={{ padding: '0 40px 40px', position: 'relative' }}>
          
          {/* Profile Picture Overlay */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-60px', marginBottom: '30px' }}>
            <div style={{ position: 'relative' }}>
              <div 
                style={{
                  width: '120px', height: '120px', borderRadius: '50%', background: 'var(--panel-bg)',
                  border: '4px solid var(--bg-color)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              >
                {uploading ? (
                   <Loader2 className="animate-spin" color="var(--accent-color)" size={32} />
                ) : profile.profilePicture ? (
                   <img src={`${backendUrl}${profile.profilePicture}`} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                   <User size={64} color="var(--text-muted)" />
                )}
              </div>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                style={{
                  position: 'absolute', bottom: '0', right: '0', background: 'var(--accent-color)', color: 'white',
                  border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', zIndex: 5
                }}
                title="Update Picture"
              >
                <Camera size={18} />
              </button>

              {profile.profilePicture && !uploading && (
                <button 
                  onClick={handleRemovePicture}
                  style={{
                    position: 'absolute', top: '0', right: '0', background: 'rgba(239, 68, 68, 0.9)', color: 'white',
                    border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', zIndex: 5
                  }}
                  title="Remove Picture"
                >
                  <Trash2 size={16} />
                </button>
              )}

              <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
            </div>

            <div>
              {!isEditing ? (
                <button className="btn-secondary" onClick={() => setIsEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Edit3 size={18} /> Edit Profile
                </button>
              ) : (
                <button className="btn-primary" onClick={handleSaveProfile} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save Changes
                </button>
              )}
            </div>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '5px' }}>{user.name}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>{user.identifier}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
            
            {/* Form Fields */}
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-muted)' }}>
                <Briefcase size={18} /> Current Position / Target Role
              </label>
              {isEditing ? (
                <input type="text" name="position" value={profile.position} onChange={handleInputChange} placeholder="e.g. Software Engineer" className="select-role" style={{ width: '100%', boxSizing: 'border-box' }} />
              ) : (
                <div style={{ padding: '12px 16px', background: 'var(--item-bg)', borderRadius: '8px', minHeight: '45px' }}>
                  {profile.position || <span style={{ opacity: 0.5 }}>Not specified</span>}
                </div>
              )}
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-muted)' }}>
                <GraduationCap size={18} /> Highest Education
              </label>
              {isEditing ? (
                <input type="text" name="education" value={profile.education} onChange={handleInputChange} placeholder="e.g. Master of Computer Science" className="select-role" style={{ width: '100%', boxSizing: 'border-box' }} />
              ) : (
                <div style={{ padding: '12px 16px', background: 'var(--item-bg)', borderRadius: '8px', minHeight: '45px' }}>
                  {profile.education || <span style={{ opacity: 0.5 }}>Not specified</span>}
                </div>
              )}
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-muted)' }}>
                <BookOpen size={18} /> Graduation Degree
              </label>
              {isEditing ? (
                <input type="text" name="graduation" value={profile.graduation} onChange={handleInputChange} placeholder="e.g. B.Tech CS" className="select-role" style={{ width: '100%', boxSizing: 'border-box' }} />
              ) : (
                <div style={{ padding: '12px 16px', background: 'var(--item-bg)', borderRadius: '8px', minHeight: '45px' }}>
                  {profile.graduation || <span style={{ opacity: 0.5 }}>Not specified</span>}
                </div>
              )}
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-muted)' }}>
                <Calendar size={18} /> Year of Graduation
              </label>
              {isEditing ? (
                <input type="text" name="graduationYear" value={profile.graduationYear} onChange={handleInputChange} placeholder="e.g. 2024" className="select-role" style={{ width: '100%', boxSizing: 'border-box' }} />
              ) : (
                <div style={{ padding: '12px 16px', background: 'var(--item-bg)', borderRadius: '8px', minHeight: '45px' }}>
                  {profile.graduationYear || <span style={{ opacity: 0.5 }}>Not specified</span>}
                </div>
              )}
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-muted)' }}>
                <Award size={18} /> CGPA
              </label>
              {isEditing ? (
                <input type="text" name="cgpa" value={profile.cgpa} onChange={handleInputChange} placeholder="e.g. 8.5" className="select-role" style={{ width: '100%', boxSizing: 'border-box' }} />
              ) : (
                <div style={{ padding: '12px 16px', background: 'var(--item-bg)', borderRadius: '8px', minHeight: '45px' }}>
                  {profile.cgpa || <span style={{ opacity: 0.5 }}>Not specified</span>}
                </div>
              )}
            </div>

            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--text-muted)' }}>
                <Award size={18} /> Additional Certifications
              </label>
              {isEditing ? (
                <textarea 
                  name="certification" value={profile.certification} onChange={handleInputChange} 
                  placeholder="List your major certifications..." 
                  className="select-role" style={{ width: '100%', boxSizing: 'border-box', minHeight: '100px', resize: 'vertical' }} 
                />
              ) : (
                <div style={{ padding: '12px 16px', background: 'var(--item-bg)', borderRadius: '8px', minHeight: '100px', whiteSpace: 'pre-wrap' }}>
                  {profile.certification || <span style={{ opacity: 0.5 }}>Not specified</span>}
                </div>
              )}
            </div>

          </div>

          <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Award size={22} color="var(--accent-color)" /> Certificate Gallery
            </h3>
            <button className="btn-secondary" onClick={() => certInputRef.current?.click()} disabled={certUploading} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {certUploading ? <Loader2 className="animate-spin" size={16} /> : <ImagePlus size={16} />} Upload Certificate
            </button>
            <input type="file" ref={certInputRef} onChange={handleCertFileChange} accept="image/*" style={{ display: 'none' }} />
          </div>

          {!profile.uploadedCertificates || profile.uploadedCertificates.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', background: 'var(--item-bg)', borderRadius: '12px', color: 'var(--text-muted)' }}>
              <ImagePlus size={48} style={{ opacity: 0.3, margin: '0 auto 15px' }} />
              <p>No certificates uploaded yet.</p>
            </div>
          ) : (
            <div style={{ position: 'relative', width: '100%', height: '400px', background: 'var(--item-bg)', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              
              <AnimatePresence mode="wait">
                <motion.img
                  key={certIndex}
                  src={`${backendUrl}${profile.uploadedCertificates[certIndex]}`}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  alt={`Certificate ${certIndex + 1}`}
                />
              </AnimatePresence>

              {/* Navigation Controls */}
              {profile.uploadedCertificates.length > 1 && (
                <>
                  <button 
                    onClick={() => setCertIndex(prev => (prev === 0 ? profile.uploadedCertificates.length - 1 : prev - 1))}
                    style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <ChevronLeft />
                  </button>
                  <button 
                    onClick={() => setCertIndex(prev => (prev === profile.uploadedCertificates.length - 1 ? 0 : prev + 1))}
                    style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <ChevronRight />
                  </button>
                </>
              )}
              
              <div style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 10, display: 'flex', gap: '10px' }}>
                <div style={{ background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 12px', fontSize: '0.8rem', borderRadius: '20px' }}>
                  {certIndex + 1} / {profile.uploadedCertificates.length}
                </div>
                <button 
                  onClick={() => handleDeleteCert(certIndex)}
                  style={{ background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', padding: '6px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Delete Certificate"
                >
                  <Trash2 size={16} />
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </motion.div>
  );
}
