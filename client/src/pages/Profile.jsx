import { useState, useEffect } from 'react';
import axios from 'axios';

const API = '/api/profile';

const emptyEducation = () => ({ degree: '', college: '', cgpa: '', year: '' });
const emptyProject = () => ({ name: '', description: '', techStack: '' });
const emptyExperience = () => ({ role: '', company: '', duration: '', description: '' });

function SectionHeader({ title }) {
  return (
    <div className="mb-6 border-b-4 border-black pb-2">
      <h2 className="text-xl font-black uppercase text-black bg-[#00F0FF] px-3 py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block border-2 border-black tracking-widest">
        {title}
      </h2>
    </div>
  );
}

function InputField({ label, value, onChange, type = 'text', required = false, placeholder = '' }) {
  return (
    <div className="flex flex-col">
      <label className="text-xs font-black uppercase tracking-wider text-black mb-1">{label} {required && '*'}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full p-3 border-4 border-black focus:bg-[#00F0FF]/10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] outline-none text-[15px] font-bold bg-white transition-all placeholder:font-medium placeholder:text-slate-400"
      />
    </div>
  );
}

function TagInput({ label, items, setItems, placeholder }) {
  const [input, setInput] = useState('');

  const add = () => {
    const val = input.trim();
    if (val && !items.includes(val)) {
      setItems([...items, val]);
      setInput('');
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); add(); }
  };

  return (
    <div className="flex flex-col">
      <label className="text-xs font-black uppercase tracking-wider text-black mb-1">{label}</label>
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={placeholder}
          className="flex-1 p-3 border-4 border-black focus:bg-[#00F0FF]/10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none text-[15px] font-bold bg-white transition-all placeholder:font-medium placeholder:text-slate-400"
        />
        <button type="button" onClick={add} className="px-5 py-2 bg-black text-[#00F0FF] shadow-[4px_4px_0px_0px_#00F0FF] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#00F0FF] font-black uppercase text-sm border-2 border-black transition-all">
          SYS.ADD
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-2 bg-white border-2 border-black text-black px-3 py-1 text-sm font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {item}
            <button type="button" onClick={() => setItems(items.filter((_, j) => j !== i))} className="text-red-600 hover:text-white hover:bg-red-600 px-1 leading-none font-black transition-colors">X</button>
          </span>
        ))}
      </div>
    </div>
  );
}

function DynamicList({ items, setItems, emptyFn, renderItem, addLabel }) {
  const add = () => setItems([...items, emptyFn()]);
  const remove = (i) => setItems(items.filter((_, j) => j !== i));
  const update = (i, field, value) => setItems(items.map((item, j) => j === i ? { ...item, [field]: value } : item));

  return (
    <div className="space-y-6">
      {items.map((item, i) => (
        <div key={i} className="relative p-5 border-4 border-black bg-[#f9f9f9] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
          <div className="absolute top-0 right-0 bg-black text-white px-2 py-1 text-xs font-black uppercase">
            IDX_{(i+1).toString().padStart(2, '0')}
          </div>
          <button type="button" onClick={() => remove(i)} className="absolute -top-4 -right-4 bg-red-600 text-white border-2 border-black w-8 h-8 flex items-center justify-center font-black hover:bg-black hover:text-red-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-colors z-10">
            X
          </button>
          {renderItem(item, i, update)}
        </div>
      ))}
      <button type="button" onClick={add} className="w-full py-4 bg-white border-4 border-dashed border-black text-black hover:bg-[#00F0FF] hover:border-solid font-black uppercase tracking-widest transition-all shadow-none hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm">
        + {addLabel}
      </button>
    </div>
  );
}

export default function Profile() {
  const [personal, setPersonal] = useState({ name: '', email: '', phone: '', location: '' });
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [strengths, setStrengths] = useState([]);
  const [weaknesses, setWeaknesses] = useState([]);
  const [goals, setGoals] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    axios.get(API)
      .then(res => {
        const d = res.data;
        setPersonal(d.personal || { name: '', email: '', phone: '', location: '' });
        setEducation(d.education || []);
        setSkills(d.skills || []);
        setProjects(d.projects?.map(p => ({ ...p, techStack: p.techStack.join(', ') })) || []);
        setExperience(d.experience || []);
        setAchievements(d.achievements || []);
        setStrengths(d.extra?.strengths || []);
        setWeaknesses(d.extra?.weaknesses || []);
        setGoals(d.extra?.goals || '');
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });
    try {
      await axios.post(API, {
        personal,
        education,
        skills,
        projects: projects.map(p => ({ ...p, techStack: p.techStack.split(',').map(t => t.trim()).filter(Boolean) })),
        experience,
        achievements,
        extra: { strengths, weaknesses, goals }
      });
      setMessage({ text: 'DATA_WRITTEN :: SUCCESS', type: 'success' });
    } catch {
      setMessage({ text: 'ERR_WRITE_FAILED :: RETRY', type: 'error' });
    } finally {
      setSaving(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] bg-[#e5e5e5]">
      <div className="p-6 border-4 border-black bg-black text-[#00F0FF] shadow-[8px_8px_0px_0px_#00F0FF]">
        <div className="flex items-center space-x-3">
          <span className="w-4 h-4 bg-[#00F0FF] animate-ping border-2 border-black"></span>
          <span className="font-mono text-lg font-black uppercase tracking-widest">FETCHING_DATA...</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#e5e5e5] font-sans pb-20">
      <div className="max-w-4xl mx-auto px-4 py-10">
        
        {/* Header Tape */}
        <div className="mb-10 p-6 border-4 border-black bg-[#00F0FF] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 text-xs font-black opacity-30 tracking-widest transform rotate-90 origin-bottom-right">FORM//0X01</div>
          <h1 className="text-4xl font-black text-black uppercase tracking-tighter mb-2">SYSTEM.DATABASE</h1>
          <p className="text-black font-bold text-sm uppercase tracking-wider bg-white inline-block px-2 py-0.5 border-2 border-black">Ensure parameters are accurate for ML alignment.</p>
        </div>

        {message.text && (
          <div className={`p-4 mb-8 border-4 border-black font-black uppercase tracking-wider text-sm ${message.type === 'success' ? 'bg-[#00F0FF] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'bg-red-600 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}>
            &gt; {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-12">

          {/* Personal */}
          <div className="bg-white p-6 sm:p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <SectionHeader title="01. Identity_Matrix" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InputField label="Full Name" value={personal.name} onChange={e => setPersonal({ ...personal, name: e.target.value })} required placeholder="e.g. Moid Sufiyan" />
              <InputField label="Email Address" type="email" value={personal.email} onChange={e => setPersonal({ ...personal, email: e.target.value })} required placeholder="e.g. you@email.com" />
              <InputField label="Phone Node" value={personal.phone} onChange={e => setPersonal({ ...personal, phone: e.target.value })} placeholder="e.g. +91 9876543210" />
              <InputField label="Zone / Sector" value={personal.location} onChange={e => setPersonal({ ...personal, location: e.target.value })} placeholder="e.g. Hyderabad, India" />
            </div>
          </div>

          {/* Education */}
          <div className="bg-white p-6 sm:p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <SectionHeader title="02. ACADEMIC_RECORDS" />
            <DynamicList
              items={education}
              setItems={setEducation}
              emptyFn={emptyEducation}
              addLabel="INIT_NEW_RECORD"
              renderItem={(item, i, update) => (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
                  <InputField label="Degree / Status" value={item.degree} onChange={e => update(i, 'degree', e.target.value)} placeholder="e.g. B.Tech CSE" />
                  <InputField label="Institution" value={item.college} onChange={e => update(i, 'college', e.target.value)} placeholder="e.g. Vardhaman College" />
                  <InputField label="Metrics (CGPA/%)" value={item.cgpa} onChange={e => update(i, 'cgpa', e.target.value)} placeholder="e.g. 8.5" />
                  <InputField label="Lifecycle (Years)" value={item.year} onChange={e => update(i, 'year', e.target.value)} placeholder="e.g. 2021 – 2025" />
                </div>
              )}
            />
          </div>

          {/* Skills */}
          <div className="bg-white p-6 sm:p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <SectionHeader title="03. TECH_PARAMETERS" />
            <TagInput items={skills} setItems={setSkills} label="Indexed Capabilities" placeholder="Type module and fire ADD" />
          </div>

          {/* Projects */}
          <div className="bg-white p-6 sm:p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <SectionHeader title="04. DEPLOYMENTS" />
            <DynamicList
              items={projects}
              setItems={setProjects}
              emptyFn={emptyProject}
              addLabel="INIT_NEW_DEPLOYMENT"
              renderItem={(item, i, update) => (
                <div className="space-y-4 mt-2">
                  <InputField label="Application Designation" value={item.name} onChange={e => update(i, 'name', e.target.value)} placeholder="e.g. AI Resume Builder" />
                  <div className="flex flex-col">
                    <label className="text-xs font-black uppercase tracking-wider text-black mb-1">Architecture Summary</label>
                    <textarea
                      value={item.description}
                      onChange={e => update(i, 'description', e.target.value)}
                      placeholder="Brief description..."
                      rows={3}
                      className="w-full p-3 border-4 border-black focus:bg-[#00F0FF]/10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none text-[15px] font-bold bg-white transition-all resize-none placeholder:font-medium placeholder:text-slate-400"
                    />
                  </div>
                  <InputField label="Tech Array (comma separated)" value={item.techStack} onChange={e => update(i, 'techStack', e.target.value)} placeholder="e.g. React, Node.js, Vercel" />
                </div>
              )}
            />
          </div>

          {/* Experience */}
          <div className="bg-white p-6 sm:p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <SectionHeader title="05. ORG_HISTORY" />
            <DynamicList
              items={experience}
              setItems={setExperience}
              emptyFn={emptyExperience}
              addLabel="INIT_NEW_HISTORY"
              renderItem={(item, i, update) => (
                <div className="space-y-4 mt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <InputField label="Role Designation" value={item.role} onChange={e => update(i, 'role', e.target.value)} placeholder="e.g. Frontend Developer" />
                    <InputField label="Entity / Corp." value={item.company} onChange={e => update(i, 'company', e.target.value)} placeholder="e.g. TechCorp Pvt. Ltd." />
                    <InputField label="Active Cycles" value={item.duration} onChange={e => update(i, 'duration', e.target.value)} placeholder="e.g. Jun 2024 – Present" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-black uppercase tracking-wider text-black mb-1">Operational Summary</label>
                    <textarea
                      value={item.description}
                      onChange={e => update(i, 'description', e.target.value)}
                      placeholder="Key directives accomplished..."
                      rows={3}
                      className="w-full p-3 border-4 border-black focus:bg-[#00F0FF]/10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none text-[15px] font-bold bg-white transition-all resize-none placeholder:font-medium placeholder:text-slate-400"
                    />
                  </div>
                </div>
              )}
            />
          </div>

          {/* Achievements */}
          <div className="bg-white p-6 sm:p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <SectionHeader title="06. VALIDATIONS" />
            <TagInput items={achievements} setItems={setAchievements} label="Awards & Certifications" placeholder="Type and fire ADD" />
          </div>

          {/* Extra */}
          <div className="bg-white p-6 sm:p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <SectionHeader title="07. META_VARIABLES" />
            <div className="space-y-6">
              <TagInput items={strengths} setItems={setStrengths} label="Core Strengths" placeholder="e.g. Fast processing, Architecture..." />
              <TagInput items={weaknesses} setItems={setWeaknesses} label="Vulnerabilities" placeholder="e.g. Rust, legacy code..." />
              <div className="flex flex-col">
                <label className="text-xs font-black uppercase tracking-wider text-black mb-1">Future Directives (Goals)</label>
                <textarea
                  value={goals}
                  onChange={e => setGoals(e.target.value)}
                  placeholder="Short/Long term operational goals..."
                  rows={4}
                  className="w-full p-3 border-4 border-black focus:bg-[#00F0FF]/10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none text-[15px] font-bold bg-white transition-all resize-none placeholder:font-medium placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="sticky bottom-6 z-40 bg-[#f0f0f0] border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center">
             <div className="hidden sm:block">
               <span className="text-black font-black uppercase tracking-widest text-xs">STATUS:</span>
               <span className={`ml-2 font-bold uppercase text-xs ${saving ? 'text-red-500 animate-pulse' : 'text-slate-500'}`}>
                 {saving ? 'UPLOADING...' : 'AWAITING_COMMIT'}
               </span>
             </div>
             <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#00F0FF] border-4 border-black text-black font-black text-lg tracking-widest uppercase hover:bg-black hover:text-[#00F0FF] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50 disabled:hover:bg-[#00F0FF] disabled:hover:text-black flex items-center justify-center gap-2"
             >
              {saving ? 'SYNC_ACTIVE...' : 'COMMIT.DATA()'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
