import { useState, useRef, useEffect } from 'react';
import api from '../utils/api';

const QUICK_PROMPTS = [
  'Tell me about myself',
  'List my skills',
  'Describe my projects',
  'Generate SOP',
  'Why should we hire you'
];

export default function Chat() {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chat_history');
    return (saved && saved !== "[]") ? JSON.parse(saved) : [
      { sender: 'ai', text: 'SYSTEM_READY :: ACTIVE.\nYou can provide info here to update your profile automatically.' }
    ];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentUpdate, setCurrentUpdate] = useState(null);
  const chatEndRef = useRef(null);

  const handleApproveUpdate = async () => {
    if (!currentUpdate) return;
    try {
      await api.patch('/profile', currentUpdate);
      setMessages(prev => [...prev, { sender: 'ai', text: '✅ CONFIG_MATRIX :: PROFILE UPDATED SUCCESSFULLY' }]);
      setCurrentUpdate(null);
    } catch {
      setMessages(prev => [...prev, { sender: 'ai', text: '❌ ERR_UPDATE_FAILED :: SAVE COMMAND ABORTED' }]);
    }
  };
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem('chat_history', JSON.stringify(messages));
  }, [messages, loading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const clearChat = () => {
    if (loading) return;
    const initialMsg = [{ sender: 'ai', text: 'MEMORY WIPED :: ACTIVE.\nProvide query to begin.' }];
    setMessages(initialMsg);
    localStorage.setItem('chat_history', JSON.stringify(initialMsg));
  };

  const sendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { sender: 'user', text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const res = await api.post('/chat', { userQuery: userMessage.text });
      setMessages((prev) => [...prev, { sender: 'ai', text: res.data.answer }]);
      if (res.data.proposedUpdate) {
        setCurrentUpdate(res.data.proposedUpdate);
      }
    } catch {
      setMessages((prev) => [...prev, { sender: 'ai', text: 'ERR_TIMEOUT :: FAILED TO REACH AI CLUSTER.' }]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const sendWithQuery = async (query) => {
    if (loading) return;
    setInput('');
    const userMessage = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    try {
      const res = await api.post('/chat', { userQuery: query });
      setMessages((prev) => [...prev, { sender: 'ai', text: res.data.answer }]);
    } catch {
      setMessages((prev) => [...prev, { sender: 'ai', text: 'ERR_TIMEOUT :: FAILED TO REACH AI CLUSTER.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#e5e5e5] font-sans overflow-hidden">
      <div className="flex-1 overflow-y-auto w-full scroll-smooth p-4 sm:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-4 sm:p-5 min-w-[200px] border-4 border-black group relative ${
                msg.sender === 'user' 
                  ? 'bg-white max-w-[90%] sm:max-w-[70%] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]' 
                  : 'bg-[#00F0FF] max-w-[95%] sm:max-w-[85%] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
              }`}>
                          <div className="flex justify-between items-center mb-3 pb-2 border-b-2 border-black/20">
                    <span className="font-extrabold uppercase tracking-widest text-xs">
                        {msg.sender === 'user' ? 'USER_INPUT' : 'TERMINAL_OUTPUT'}
                    </span>
                    {msg.sender === 'ai' && (
                        <button 
                            onClick={() => copyToClipboard(msg.text)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity uppercase text-[10px] font-bold bg-black text-white px-2 py-1 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:shadow-[1px_1px_0px_0px_rgba(255,255,255,1)] hover:translate-x-[1px] hover:translate-y-[1px]"
                            title="Copy response"
                        >
                            COPY
                        </button>
                    )}
                </div>
                          <p className={`whitespace-pre-wrap leading-relaxed font-semibold ${msg.sender === 'user' ? 'text-slate-900 text-[15px] sm:text-[17px]' : 'text-black text-[15px]'}`}>{msg.text}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="p-4 sm:p-5 border-4 border-black bg-black text-[#00F0FF] max-w-[95%] sm:max-w-[85%] shadow-[6px_6px_0px_0px_#00F0FF]">
                 <div className="font-extrabold uppercase tracking-widest text-xs mb-3 pb-2 border-b-2 border-[#00F0FF]/30">
                    TERMINAL_OUTPUT
                 </div>
                 <div className="flex items-center space-x-3 py-1">
                    <span className="w-3 h-3 bg-[#00F0FF] animate-ping border border-black"></span>
                    <span className="font-mono text-sm tracking-wider uppercase font-bold text-white">Generating Payload...</span>
                 </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>

      <div className="bg-[#f0f0f0] border-t-4 border-black px-4 py-4 sm:py-6">
        <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap gap-2 mb-4">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendWithQuery(prompt)}
                disabled={loading}
                className="px-3 py-1.5 text-xs font-black uppercase tracking-wider text-black bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &gt; {prompt}
              </button>
            ))}
            {messages.length > 1 && (
              <button
                type="button"
                onClick={clearChat}
                disabled={loading}
                className="px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white bg-red-600 border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all ml-auto disabled:opacity-50"
              >
                KILL_SESSION
              </button>
            )}
          </div>
          <form onSubmit={sendMessage} className="relative flex bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] focus-within:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-within:translate-x-[4px] focus-within:translate-y-[4px] transition-all">
            <textarea 
              ref={textareaRef}
              placeholder="ENTER COMMAND..." 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim() && !loading) {
                    sendMessage();
                  }
                }
              }}
              rows={1}
              className="w-full py-4 pl-5 pr-16 bg-transparent resize-none outline-none text-black font-bold text-[16px] max-h-[200px]"
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()} 
              className="absolute right-3 bottom-3 p-2 bg-[#00F0FF] border-2 border-black text-black font-black disabled:bg-slate-300 disabled:text-slate-500 hover:bg-black hover:text-[#00F0FF] transition-colors flex items-center justify-center h-10 w-10 uppercase text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
            >
              RUN
            </button>
          </form>
        </div>
      </div>

      {currentUpdate && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md bg-[#ffff00] border-4 border-black p-4 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] z-50">
           <p className="text-xs font-black uppercase text-black mb-1">&gt;&gt; AI DETECTED PROFILE BINDING:</p>
           <div className="bg-white p-2 border-2 border-black text-xs font-mono mb-3 max-h-32 overflow-auto text-black">
              {JSON.stringify(currentUpdate, null, 2)}
           </div>
           <div className="flex gap-2">
               <button onClick={handleApproveUpdate} className="flex-1 py-2 bg-emerald-500 text-white font-black border-2 border-black shadow-[2px_2px_0px_0px] text-xs hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">APPROVE</button>
               <button onClick={() => setCurrentUpdate(null)} className="flex-1 py-2 bg-red-600 text-white font-black border-2 border-black shadow-[2px_2px_0px_0px] text-xs hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">DISMISS</button>
           </div>
        </div>
      )}

    </div>
  );
}
