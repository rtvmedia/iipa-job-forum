import { Link } from 'react-router-dom';

const BLUE = '#0a66c2';
const W = '1128px';

export default function About() {
  return (
    <div>
      <section style={{ background:'linear-gradient(135deg, #062b56 0%, #0a4a8c 100%)', padding:'48px 16px', textAlign:'center' }}>
        <h1 style={{ fontWeight:700, fontSize:'clamp(1.6rem,3vw,2.2rem)', color:'white', marginBottom:'10px' }}>About IIPA Job Forum</h1>
        <p style={{ color:'rgba(255,255,255,0.75)', maxWidth:'560px', margin:'0 auto', fontSize:'15px', lineHeight:1.6 }}>
          India's trusted career platform connecting ambitious professionals with forward-thinking employers.
        </p>
      </section>

      <section style={{ maxWidth:W, margin:'0 auto', padding:'40px 16px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:'40px' }} className="about-grid">
          <div>
            <h2 style={{ fontWeight:700, fontSize:'20px', color:'#1a1a1a', marginBottom:'12px' }}>Our Mission</h2>
            <p style={{ color:'#555', lineHeight:1.7, fontSize:'14px', marginBottom:'12px' }}>
              IIPA Job Forum was founded with a single purpose: to remove the friction from hiring and job searching in India. We believe every professional deserves access to quality opportunities, and every employer deserves to find the right talent efficiently.
            </p>
            <p style={{ color:'#555', lineHeight:1.7, fontSize:'14px' }}>
              Our platform provides two distinct, purpose-built workspaces — one for job seekers to discover, apply, and grow, and another for recruiters to post roles, screen candidates, and manage their hiring pipeline.
            </p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            {[
              { icon:'🎯', title:'Purpose-Built',  desc:'Separate, focused experiences for seekers and recruiters' },
              { icon:'🤖', title:'AI-Assisted',    desc:'Smart matching and career guidance powered by AI' },
              { icon:'🔒', title:'Trusted',         desc:'Verified employers and professional-grade security' },
              { icon:'🚀', title:'Scalable',        desc:'Built for India\'s growing professional workforce' },
            ].map(f => (
              <div key={f.title} style={{ background:'white', borderRadius:'8px', border:'1px solid #e0e0e0', padding:'16px', boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ fontSize:'1.4rem', marginBottom:'8px' }}>{f.icon}</div>
                <h3 style={{ fontWeight:600, color:BLUE, fontSize:'14px', marginBottom:'4px' }}>{f.title}</h3>
                <p style={{ color:'#666', fontSize:'13px', lineHeight:1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <style>{`.about-grid { } @media(min-width:768px){ .about-grid{ grid-template-columns:1fr 1fr; } }`}</style>
      </section>

      <section style={{ background:'white', borderTop:'1px solid #e0e0e0', borderBottom:'1px solid #e0e0e0', padding:'40px 16px' }}>
        <div style={{ maxWidth:W, margin:'0 auto', textAlign:'center' }}>
          <h2 style={{ fontWeight:700, fontSize:'20px', color:'#1a1a1a', marginBottom:'28px' }}>Platform by the Numbers</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'16px', maxWidth:'700px', margin:'0 auto' }}>
            {[
              { value:'2,400+', label:'Active Vacancies' },
              { value:'850+',   label:'Partner Companies' },
              { value:'18,000+',label:'Registered Professionals' },
              { value:'94%',    label:'Placement Rate' },
            ].map(s => (
              <div key={s.label} style={{ background:'#f0f7ff', borderRadius:'8px', border:'1px solid #dbeafe', padding:'20px' }}>
                <div style={{ color:BLUE, fontWeight:700, fontSize:'1.6rem' }}>{s.value}</div>
                <div style={{ color:'#555', fontSize:'13px', marginTop:'4px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background:'#f0f7ff', padding:'48px 16px', textAlign:'center' }}>
        <h2 style={{ fontWeight:700, fontSize:'1.6rem', color:'#1a1a1a', marginBottom:'8px' }}>Join the IIPA Community</h2>
        <p style={{ color:'#666', marginBottom:'24px', fontSize:'14px' }}>Start your journey today — it's free.</p>
        <div style={{ display:'flex', justifyContent:'center', gap:'12px', flexWrap:'wrap' }}>
          <Link to="/register" style={{ background:BLUE, color:'white', fontWeight:700, fontSize:'14px', padding:'10px 28px', borderRadius:'20px' }}>Create Account</Link>
          <Link to="/jobs" style={{ color:BLUE, fontSize:'14px', padding:'10px 28px', border:`1px solid ${BLUE}`, borderRadius:'20px', background:'white' }}>Browse Jobs</Link>
        </div>
      </section>
    </div>
  );
}
