import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isCurrent = (path) => location.pathname === path;
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="border-b-4 border-black bg-[#f0f0f0] sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center uppercase font-black tracking-tighter text-black">
          {}
          <Link to="/" className="text-2xl flex items-center gap-1 group transition-transform hover:-translate-y-0.5">
            <span className="bg-black text-[#00F0FF] px-2 py-0.5 border-2 border-black shadow-[3px_3px_0px_0px_#00F0FF]">AI</span> 
            <span className="tracking-widest ml-1">ASSIST</span>
          </Link>
          
          {}
          <div className="flex items-center space-x-4 sm:space-x-6 text-xs sm:text-sm">
            {token ? (
              <>
                <Link 
                  to="/" 
                  className={`px-4 py-1.5 border-2 border-black transition-all font-bold ${isCurrent('/') ? 'bg-[#00F0FF] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]' : 'bg-white hover:bg-slate-100 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'}`}
                >
                  TERMINAL
                </Link>
                <Link 
                  to="/profile" 
                  className={`px-4 py-1.5 border-2 border-black transition-all font-bold ${isCurrent('/profile') ? 'bg-[#00F0FF] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]' : 'bg-black text-white hover:bg-slate-800 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'}`}
                >
                  DATA.CONFIG
                </Link>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-1.5 bg-red-600 text-white border-2 border-black font-bold uppercase transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`px-4 py-1.5 border-2 border-black transition-all font-bold ${isCurrent('/login') ? 'bg-[#00F0FF]' : 'bg-white'}`}
                >
                  LOGIN
                </Link>
                <Link 
                  to="/register" 
                  className={`px-4 py-1.5 border-2 border-black transition-all font-bold ${isCurrent('/register') ? 'bg-[#00F0FF]' : 'bg-black text-white'}`}
                >
                  JOIN
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
