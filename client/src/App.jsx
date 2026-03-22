import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import Auth from './pages/Auth';
import Landing from './pages/Landing';
import ProtectedRoute from './components/ProtectedRoute';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-[#e5e5e5]">
      <div className="p-8 border-4 border-black bg-black text-[#00F0FF] shadow-[8px_8px_0px_0px_#00F0FF] text-center max-w-md">
        <p className="text-7xl font-black mb-4">404</p>
        <p className="font-black uppercase tracking-widest text-lg text-white mb-2">ROUTE_NOT_FOUND</p>
        <p className="text-sm font-semibold text-slate-400">The path you requested does not exist.</p>
        <a href="/" className="mt-6 inline-block px-6 py-2 bg-[#00F0FF] text-black border-2 border-white font-black uppercase tracking-wider shadow-[3px_3px_0px_0px_white] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_white] transition-all text-sm">
          &lt;&lt; RETURN HOME
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-[#e5e5e5] font-sans">
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Auth mode="login" />} />
            <Route path="/register" element={<Auth mode="register" />} />

            <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/saved" element={<ProtectedRoute><div className="p-10 font-black uppercase text-center mt-10">Saved module under loaded memory</div></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
