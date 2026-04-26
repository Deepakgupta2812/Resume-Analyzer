import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Ensure all axios requests attach cookies automatically
axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is logged in
    axios.get('/api/auth/me')
      .then(res => {
        setUser(res.data.user);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
