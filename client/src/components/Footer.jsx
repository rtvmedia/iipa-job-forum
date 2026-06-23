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
          <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'4px' }}>
            {logoUrl && <img src={logoUrl} alt="Logo" style={{ height:'26px', width:'auto', marginRight:'2px' }} />}
            <span style={{ color:'#FF9933', fontWeight:700, fontSize:'18px' }}>IIPA</span>
            <span style={{ color:'white', fontWeight:600, fontSize:'15px' }}>JOBS</span>
          </div>
          <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.5)', marginBottom:'10px' }}>Connecting Talents with Opportunities</p>
          <p style={{ fontSize:'13px', lineHeight:1.6 }}>Your trusted career partner — connecting professionals with leading employers across India.</p>
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
