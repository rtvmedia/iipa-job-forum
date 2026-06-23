import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Footer() {
  const [logoUrl, setLogoUrl] = useState(null);

  useEffect(() => {
    api.get('/settings').then(r => setLogoUrl(r.data?.footerLogoUrl || null)).catch(() => {});
  }, []);

  return (
    <footer style={{ background:'#1a237e', color:'rgba(255,255,255,0.75)', marginTop:'auto' }}>
      <div className="tricolor" />
      <div style={{ maxWidth:'1128px', margin:'0 auto', padding:'40px 16px 24px', display:'grid', gap:'32px', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))' }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'8px' }}>
            {logoUrl && (
              <span style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                <span style={{
                  display:'flex', alignItems:'center', justifyContent:'center',
                  width:'42px', height:'42px', borderRadius:'50%', background:'#fff',
                  boxShadow:'0 2px 8px rgba(0,0,0,0.25)', border:'2px solid #FF9933',
                  overflow:'hidden',
                }}>
                  <img src={logoUrl} alt="Logo" style={{ width:'92%', height:'92%', objectFit:'contain', borderRadius:'50%' }} />
                </span>
                <span style={{ color:'rgba(255,255,255,0.55)', fontSize:'7px', fontWeight:600, lineHeight:1.2, textAlign:'center', marginTop:'2px' }}>
                  International Indian<br />Professionals Association
                </span>
              </span>
            )}
            <span style={{ display:'flex', flexDirection:'column', justifyContent:'center', gap:'1px' }}>
              <span style={{ display:'flex', alignItems:'baseline', gap:'6px' }}>
                <span style={{ color:'#FF9933', fontWeight:700, fontSize:'18px' }}>IIPA</span>
                <span style={{ color:'white', fontWeight:600, fontSize:'15px' }}>JOBS</span>
              </span>
              <span style={{ color:'#FFC766', fontSize:'11px', fontWeight:600, fontStyle:'italic', letterSpacing:'0.02em' }}>
                Connecting Talents with Opportunities
              </span>
            </span>
          </div>
        </div>
        <div>
          <h4 style={{ color:'white', fontWeight:600, fontSize:'14px', marginBottom:'12px' }}>For Job Seekers</h4>
          <div style={{ display:'flex', flexDirection:'column', gap:'8px', fontSize:'13px' }}>
            <Link to="/jobs"             style={{ color:'rgba(255,255,255,0.65)' }} onMouseEnter={e=>e.target.style.color='#FF9933'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.65)'}>Browse Jobs</Link>
            <Link to="/register"         style={{ color:'rgba(255,255,255,0.65)' }} onMouseEnter={e=>e.target.style.color='#FF9933'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.65)'}>Create Profile</Link>
            <Link to="/seeker/dashboard" style={{ color:'rgba(255,255,255,0.65)' }} onMouseEnter={e=>e.target.style.color='#FF9933'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.65)'}>My Applications</Link>
          </div>
        </div>
        <div>
          <h4 style={{ color:'white', fontWeight:600, fontSize:'14px', marginBottom:'12px' }}>For Employers</h4>
          <div style={{ display:'flex', flexDirection:'column', gap:'8px', fontSize:'13px' }}>
            <Link to="/register"            style={{ color:'rgba(255,255,255,0.65)' }} onMouseEnter={e=>e.target.style.color='#FF9933'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.65)'}>Post a Job</Link>
            <Link to="/recruiter/dashboard" style={{ color:'rgba(255,255,255,0.65)' }} onMouseEnter={e=>e.target.style.color='#FF9933'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.65)'}>Recruiter Dashboard</Link>
          </div>
        </div>
        <div>
          <h4 style={{ color:'white', fontWeight:600, fontSize:'14px', marginBottom:'12px' }}>Company</h4>
          <div style={{ display:'flex', flexDirection:'column', gap:'8px', fontSize:'13px' }}>
            <Link to="/about"   style={{ color:'rgba(255,255,255,0.65)' }} onMouseEnter={e=>e.target.style.color='#FF9933'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.65)'}>About Us</Link>
            <Link to="/contact" style={{ color:'rgba(255,255,255,0.65)' }} onMouseEnter={e=>e.target.style.color='#FF9933'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.65)'}>Contact</Link>
          </div>
        </div>
      </div>
      <div style={{ borderTop:'1px solid rgba(255,255,255,0.1)', textAlign:'center', padding:'16px', fontSize:'12px', color:'rgba(255,255,255,0.4)' }}>
        © {new Date().getFullYear()} IIPA JOBS. All rights reserved.
      </div>
    </footer>
  );
}
