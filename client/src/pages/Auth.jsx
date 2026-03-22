import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Auth({ mode = 'login' }) {
  const isLogin = mode === 'login';
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const res = await api.post(endpoint, payload);
      login(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      if (!isLogin) {
        await api.post('/profile', {
          personal: {
            name: formData.name,
            email: formData.email
          }
        });
        navigate('/profile?setup=true');
        return;
      }

      try {
        const profileRes = await api.get('/profile');
        if (profileRes.data) {
          navigate('/chat');
        } else {
          navigate('/profile?setup=true');
        }
      } catch {
        navigate('/profile?setup=true');
      }

    } catch (err) {
      setMessage({
        text: err.response?.data?.message || 'Authentication error. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#e5e5e5] flex items-center justify-center p-4">
      <div className="w-full max-w-md border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-8">
        <div className="mb-8 p-4 border-4 border-black bg-[#00F0FF] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
          <h1 className="text-2xl font-black text-black uppercase tracking-tighter">
            {isLogin ? 'SYS.LOGIN' : 'SYS.REGISTER'}
          </h1>
        </div>

        {message.text && (
          <div className={`p-3 mb-6 border-4 border-black font-black uppercase tracking-wider text-xs ${message.type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-500 text-black'}`}>
            &gt; {message.text}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          {!isLogin && (
            <div className="flex flex-col">
              <label className="text-xs font-black uppercase tracking-wider text-black mb-1">Full Name</label>
              <input
                type="text"
                required={!isLogin}
                placeholder="e.g. Moid Sufiyan"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 border-4 border-black focus:bg-[#00F0FF]/10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none text-[15px] font-bold bg-white transition-all placeholder:font-medium placeholder:text-slate-400"
              />
            </div>
          )}

          <div className="flex flex-col">
            <label className="text-xs font-black uppercase tracking-wider text-black mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="e.g. you@email.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 border-4 border-black focus:bg-[#00F0FF]/10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none text-[15px] font-bold bg-white transition-all placeholder:font-medium placeholder:text-slate-400"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-black uppercase tracking-wider text-black mb-1">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className="w-full p-3 border-4 border-black focus:bg-[#00F0FF]/10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none text-[15px] font-bold bg-white transition-all placeholder:font-medium placeholder:text-slate-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 bg-[#00F0FF] border-4 border-black text-black font-black text-lg tracking-widest uppercase hover:bg-black hover:text-[#00F0FF] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'PROCESSING...' : isLogin ? 'INIT_SESSION' : 'REGISTER_USER'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs font-black uppercase tracking-widest text-slate-500">
            {isLogin ? 'No identity matrix?' : 'Already registered?'}
            <Link
              to={isLogin ? '/register' : '/login'}
              className="ml-2 text-black hover:underline font-black hover:text-[#00F0FF] transition-colors"
            >
              {isLogin ? 'CREATE_ONE' : 'LOGIN_HERE'} »
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
