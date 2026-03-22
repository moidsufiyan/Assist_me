import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import api from '../utils/api';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const res = await api.get('/profile');
        setHasProfile(!!res.data);
      } catch {
        setHasProfile(false);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      checkProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-[#e5e5e5]">
        <div className="p-4 border-4 border-black bg-black text-[#00F0FF] font-black uppercase shadow-[4px_4px_0px_0px_#00F0FF] animate-pulse">
          VALIDATING_DATA_MATRIX...
        </div>
      </div>
    );
  }

  
  if (!hasProfile && location.pathname === '/chat') {
    return <Navigate to="/profile?setup=true" replace />;
  }

  return children;
}
