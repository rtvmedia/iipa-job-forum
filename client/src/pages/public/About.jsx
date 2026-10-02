import { Link } from 'react-router-dom';

const BLUE = '#0a66c2';
const W = '1320px';

const AUDIENCES = [
  { icon:'🎓', title:'Indian Professionals', desc:'Explore roles that fit your skills and experience, in India and in international markets.' },
  { icon:'🔍', title:'Job Seekers', desc:'Build a profile, upload your CV, save jobs and apply in a few clicks.' },
  { icon:'🏢', title:'Employers', desc:'Post vacancies and reach professionals looking for their next opportunity.' },
  { icon:'🤝', title:'Recruiters', desc:'Review applicants and manage your hiring pipeline in one place.' },
];

export default function About() {
  return (
    <div>
      <section style={{ background:'linear-gradient(135deg, #062b56 0%, #0a4a8c 100%)', padding:'48px 16px', textAlign:'center' }}>
        <h1 style={{ fontWeight:700, fontSize:'clamp(1.6rem,3vw,2.2rem)', color:'white', marginBottom:'10px' }}>About IIPA Jobs</h1>
        <p style={{ color:'rgba(255,255,255,0.8)', maxWidth:'620px', margin:'0 auto', fontSize:'15px', lineHeight:1.6 }}>
          IIPA Jobs is a platform designed to help Indian professionals discover career opportunities in India and abroad.
        </p>
      </section>

      <section style={{ maxWidth:W, margin:'0 auto', padding:'40px 16px' }}>
        <div style={{ maxWidth:'760px', margin:'0 auto 32px', textAlign:'center' }}>
          <h2 style={{ fontWeight:700, fontSize:'20px', color:'#1a1a1a', marginBottom:'12px' }}>Who We Connect</h2>
          <p style={{ color:'#555', lineHeight:1.7, fontSize:'14.5px' }}>
            IIPA Jobs brings together Indian professionals, job seekers, employers and recruiters, connecting them with career opportunities across India and international markets.
          </p>
        </div>
        <div className="about-audience">
          <style>{`.about-audience { display:grid; grid-template-columns:1fr; gap:14px; } @media(min-width:640px){ .about-audience{ grid-template-columns:repeat(2,1fr); } } @media(min-width:1024px){ .about-audience{ grid-template-columns:repeat(4,1fr); } }`}</style>
          {AUDIENCES.map(a => (
            <div key={a.title} style={{ background:'white', borderRadius:'10px', border:'1px solid #e0e0e0', padding:'20px', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize:'1.5rem', marginBottom:'8px' }}>{a.icon}</div>
              <h3 style={{ fontWeight:600, color:BLUE, fontSize:'15px', marginBottom:'4px' }}>{a.title}</h3>
              <p style={{ color:'#666', fontSize:'13px', lineHeight:1.55 }}>{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background:'#f0f7ff', padding:'48px 16px', textAlign:'center' }}>
        <h2 style={{ fontWeight:700, fontSize:'1.6rem', color:'#1a1a1a', marginBottom:'8px' }}>Join IIPA Jobs</h2>
        <p style={{ color:'#666', marginBottom:'24px', fontSize:'14px' }}>Create your profile and start exploring opportunities.</p>
        <div style={{ display:'flex', justifyContent:'center', gap:'12px', flexWrap:'wrap' }}>
          <Link to="/register" style={{ background:BLUE, color:'white', fontWeight:700, fontSize:'14px', padding:'10px 28px', borderRadius:'20px' }}>Create Account</Link>
          <Link to="/jobs" style={{ color:BLUE, fontSize:'14px', padding:'10px 28px', border:`1px solid ${BLUE}`, borderRadius:'20px', background:'white' }}>Browse Jobs</Link>
        </div>
      </section>
    </div>
  );
}
