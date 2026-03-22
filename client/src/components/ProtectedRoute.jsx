import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import api from '../utils/api';

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState('loading');
  const [hasProfile, setHasProfile] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const verify = async () => {
      try {
        await api.get('/auth/me');
        try {
          const profileRes = await api.get('/profile');
          setHasProfile(!!profileRes.data);
        } catch {
          setHasProfile(false);
        }
        setStatus('authenticated');
      } catch {
        setStatus('unauthenticated');
      }
    };

    verify();
  }, []);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-[#e5e5e5]">
        <div className="p-4 border-4 border-black bg-black text-[#00F0FF] font-black uppercase shadow-[4px_4px_0px_0px_#00F0FF] animate-pulse">
          VALIDATING_SESSION...
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />;
  }

  if (!hasProfile && location.pathname === '/chat') {
    return <Navigate to="/profile?setup=true" replace />;
  }

  return children;
}
