import { Link, Navigate } from 'react-router-dom';

export default function Landing() {
  const token = localStorage.getItem('token');

  
  if (token) {
    return <Navigate to="/chat" replace />;
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#e5e5e5] text-black font-sans">
      
      {}
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-12 text-center flex flex-col items-center justify-center">
        <div className="inline-block border-4 border-black bg-black text-[#00F0FF] px-4 py-1 text-xs font-black uppercase tracking-widest mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          AI_POWERED_V1.0
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none max-w-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          Your AI Application <span className="text-[#00F0FF] bg-black px-2 shadow-[4px_4px_0px_0px_#00F0FF]">Assistant</span>
        </h1>

        <p className="mt-6 text-sm md:text-lg font-bold max-w-xl border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-slate-700">
          Build accurate, context-aware AI cover letters, statements, and responses tailored strictly to your data. No generic boilerplate.
        </p>

        {}
        <div className="flex gap-4 mt-8">
          <Link 
            to="/register" 
            className="px-8 py-4 bg-[#00F0FF] border-4 border-black font-black uppercase tracking-wider text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-sm md:text-base"
          >
            SIGN_UP_NOW
          </Link>
          <Link 
            to="/login" 
            className="px-8 py-4 bg-white border-4 border-black font-black uppercase tracking-wider text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all text-sm md:text-base"
          >
            LOGIN_MATRIX
          </Link>
        </div>
      </section>

      {}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col">
            <div className="text-xl font-black bg-black text-[#00F0FF] w-10 h-10 flex items-center justify-center border-2 border-black mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              01
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight mb-2">Store profile once</h3>
            <p className="text-sm font-bold text-slate-600 flex-grow">
              Fill out your education, skills, and experience configuration matrix. Your data stays 100% secure.
            </p>
          </div>

          <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col">
            <div className="text-xl font-black bg-black text-[#00F0FF] w-10 h-10 flex items-center justify-center border-2 border-black mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              02
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight mb-2">Generate answers instantly</h3>
            <p className="text-sm font-bold text-slate-600 flex-grow">
              Ask AI to structure SOPs, pitch decks, or interview questions. The AI references your exact datasets.
            </p>
          </div>

          <div className="border-4 border-black bg-white p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col">
            <div className="text-xl font-black bg-black text-[#00F0FF] w-10 h-10 flex items-center justify-center border-2 border-black mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              03
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight mb-2">Save and reuse responses</h3>
            <p className="text-sm font-bold text-slate-600 flex-grow">
              Quick buffers cache your favorite prompt responses for repeated use across different applications systems.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}
