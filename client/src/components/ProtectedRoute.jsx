import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const [profileChecked, setProfileChecked] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      setProfileChecked(true);
      return;
    }
    api.get('/profile')
      .then(res => setHasProfile(!!res.data))
      .catch(() => setHasProfile(false))
      .finally(() => setProfileChecked(true));
  }, [user]);

  if (loading || !profileChecked) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-[#e5e5e5]">
        <div className="p-4 border-4 border-black bg-black text-[#00F0FF] font-black uppercase shadow-[4px_4px_0px_0px_#00F0FF] animate-pulse">
          VALIDATING_SESSION...
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (!hasProfile && location.pathname === '/chat') {
    return <Navigate to="/profile?setup=true" replace />;
  }

  return children;
}
