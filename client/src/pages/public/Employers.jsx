import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const GOLD = '#d97706';
const BLUE = '#0a66c2';

const TABS = [
  { key:'home',       label:'Home' },
  { key:'postjob',    label:'Post a Job' },
  { key:'candidates', label:'Find Candidates' },
];

export default function Employers() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [tab, setTabState] = useState(['home','postjob','candidates'].includes(tabParam) ? tabParam : 'home');
  const setTab = (key) => { setTabState(key); setSearchParams(key === 'home' ? {} : { tab: key }); };

  return (
    <div>
      <style>{`
        .emp-tabs { display:flex; gap:6px; border-bottom:1px solid #e0e0e0; max-width:1320px; margin:0 auto; padding:0 16px; }
        .emp-tab { padding:14px 18px; font-size:14px; font-weight:600; color:#666; cursor:pointer; border:none; background:none; position:relative; }
        .emp-tab.active { color:${BLUE}; }
        .emp-tab.active::after { content:''; position:absolute; left:0; right:0; bottom:-1px; height:3px; background:${BLUE}; border-radius:3px 3px 0 0; }
        .emp-grid { display:grid; grid-template-columns:1fr; gap:16px; }
        @media(min-width:768px){ .emp-grid{ grid-template-columns:repeat(3,1fr); } }
        .emp-card { background:#fff; border-radius:12px; border:1px solid #e0e0e0; padding:20px; box-shadow:0 4px 14px rgba(0,0,0,0.06); }
      `}</style>

      {/* Hero */}
      <section style={{ background:'linear-gradient(135deg, #062b56 0%, #0a4a8c 60%, #0f5fb5 100%)', padding:'44px 16px 32px', textAlign:'center' }}>
        <div style={{ maxWidth:'1320px', margin:'0 auto' }}>
          <span style={{ display:'inline-block', background:GOLD, color:'#fff', fontWeight:700, fontSize:'11px', letterSpacing:'0.08em', padding:'5px 16px', borderRadius:'16px', marginBottom:'14px' }}>FOR EMPLOYERS</span>
          <h1 style={{ fontSize:'clamp(1.5rem,3.2vw,2.1rem)', fontWeight:700, color:'white', marginBottom:'10px' }}>
            Hire Top Talent Across India and the GCC
          </h1>
          <p style={{ color:'rgba(255,255,255,0.75)', maxWidth:'560px', margin:'0 auto 22px', fontSize:'14px', lineHeight:1.6 }}>
            Post vacancies, reach thousands of verified job seekers, and manage your entire hiring pipeline from one dashboard.
          </p>
          <div style={{ display:'flex', justifyContent:'center', gap:'12px', flexWrap:'wrap' }}>
            <Link to="/login" style={{ color:'#fff', fontSize:'14px', fontWeight:600, padding:'10px 26px', border:'1px solid rgba(255,255,255,0.5)', borderRadius:'20px' }}>Sign In</Link>
            <Link to="/register?role=recruiter" style={{ background:GOLD, color:'#fff', fontWeight:700, fontSize:'14px', padding:'10px 26px', borderRadius:'20px' }}>Register as Employer</Link>
          </div>
        </div>
      </section>

      <div className="emp-tabs">
        {TABS.map(t => (
          <button key={t.key} className={`emp-tab ${tab===t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>{t.label}</button>
        ))}
      </div>

      <div style={{ maxWidth:'1320px', margin:'0 auto', padding:'32px 16px' }}>
        {tab === 'home' && (
          <>
            <h2 style={{ fontWeight:700, fontSize:'18px', color:'#1a1a1a', marginBottom:'18px' }}>Why hire with IIPA JOBS</h2>
            <div className="emp-grid">
              {[
                { icon:'🎯', title:'Targeted Reach', desc:'Connect with thousands of pre-screened professionals across India and the GCC.' },
                { icon:'⚡', title:'Fast Hiring', desc:'Post a role in minutes and start reviewing applicants the same day.' },
                { icon:'📊', title:'Hiring Dashboard', desc:'Track applicants, manage your pipeline, and measure performance in one place.' },
              ].map(f => (
                <div key={f.title} className="emp-card">
                  <div style={{ fontSize:'1.6rem', marginBottom:'8px' }}>{f.icon}</div>
                  <h3 style={{ fontWeight:700, fontSize:'15px', color:'#1a1a1a', marginBottom:'6px' }}>{f.title}</h3>
                  <p style={{ color:'#666', fontSize:'13.5px', lineHeight:1.6 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'postjob' && (
          <>
            <h2 style={{ fontWeight:700, fontSize:'18px', color:'#1a1a1a', marginBottom:'10px' }}>Post a Job in Minutes</h2>
            <p style={{ color:'#666', fontSize:'14px', lineHeight:1.6, marginBottom:'18px', maxWidth:'640px' }}>
              Sign in or register as an employer to publish your vacancy. Add role details, requirements, and salary range, and your job goes live for thousands of job seekers to discover.
            </p>
            <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
              <Link to="/register?role=recruiter" style={{ background:BLUE, color:'#fff', fontWeight:700, fontSize:'14px', padding:'11px 28px', borderRadius:'20px' }}>Register & Post a Job</Link>
              <Link to="/login" style={{ color:BLUE, fontSize:'14px', fontWeight:600, padding:'11px 28px', border:`1px solid ${BLUE}`, borderRadius:'20px' }}>Already Registered? Sign In</Link>
            </div>
          </>
        )}

        {tab === 'candidates' && (
          <>
            <h2 style={{ fontWeight:700, fontSize:'18px', color:'#1a1a1a', marginBottom:'10px' }}>Find the Right Candidates</h2>
            <p style={{ color:'#666', fontSize:'14px', lineHeight:1.6, marginBottom:'18px', maxWidth:'640px' }}>
              Once registered, search candidate applications against your live roles, filter by skills and experience, and reach out directly through your recruiter dashboard.
            </p>
            <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
              <Link to="/register?role=recruiter" style={{ background:BLUE, color:'#fff', fontWeight:700, fontSize:'14px', padding:'11px 28px', borderRadius:'20px' }}>Get Started</Link>
              <Link to="/login" style={{ color:BLUE, fontSize:'14px', fontWeight:600, padding:'11px 28px', border:`1px solid ${BLUE}`, borderRadius:'20px' }}>Sign In</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
