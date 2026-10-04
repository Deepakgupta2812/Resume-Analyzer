import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Ensure all axios requests attach cookies automatically
axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
axios.defaults.timeout = 15000; // 15 second timeout to avoid indefinite freezing

// Attach token from storage if available
const storedToken = localStorage.getItem('token');
if (storedToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
}

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is logged in
    axios.get('/api/auth/me')
      .then(res => {
        setUser(res.data.user || res.data);
        setLoading(false);
      })
      .catch(() => {
        // Clear stale token if unauthorized
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setLoading(false);
      });
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (err) {
      console.error(err);
    } finally {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
