import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const { user } = useAuth();
  const [settings, setSettings] = useState({});

  useEffect(() => {
    api.get('/settings').then(r => setSettings(r.data || {})).catch(() => {});
  }, []);

  const logoUrl = settings.footerLogoUrl;
  const showSeekerBarcode   = user?.role === 'seeker'    && settings.seekerBarcodeUrl;
  const showEmployerBarcode = user?.role === 'recruiter' && settings.employerBarcodeUrl;

  return (
    <footer style={{ background:'#1a237e', color:'rgba(255,255,255,0.75)', marginTop:'auto' }}>
      <div className="tricolor" />
      <div style={{ maxWidth:'1320px', margin:'0 auto', padding:'40px 16px 24px', display:'grid', gap:'32px', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))' }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'8px' }}>
            {logoUrl && (
              <span style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                <img src={logoUrl} alt="Logo" style={{
                  width:'48px', height:'48px', objectFit:'contain', display:'block',
                  filter:'drop-shadow(0 2px 6px rgba(0,0,0,0.35))',
                }} />
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
          {settings.linkedinUrl && (
            <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer"
              style={{ display:'inline-flex', alignItems:'center', gap:'6px', color:'rgba(255,255,255,0.7)', fontSize:'13px', marginTop:'8px' }}
              onMouseEnter={e=>e.currentTarget.style.color='#FF9933'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.7)'}>
              <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:'22px', height:'22px', borderRadius:'4px', background:'#0a66c2', color:'#fff', fontWeight:700, fontSize:'12px' }}>in</span>
              LinkedIn
            </a>
          )}
        </div>
        <div>
          <h4 style={{ color:'white', fontWeight:600, fontSize:'14px', marginBottom:'12px' }}>For Job Seekers</h4>
          <div style={{ display:'flex', flexDirection:'column', gap:'8px', fontSize:'13px' }}>
            <Link to="/jobs"             style={{ color:'rgba(255,255,255,0.65)' }} onMouseEnter={e=>e.target.style.color='#FF9933'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.65)'}>Browse Jobs</Link>
            <Link to="/register"         style={{ color:'rgba(255,255,255,0.65)' }} onMouseEnter={e=>e.target.style.color='#FF9933'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.65)'}>Create Profile</Link>
            <Link to="/seeker/dashboard" style={{ color:'rgba(255,255,255,0.65)' }} onMouseEnter={e=>e.target.style.color='#FF9933'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.65)'}>My Applications</Link>
          </div>
          {showSeekerBarcode && (
            <a href={settings.seekerWhatsappUrl || '#'} target="_blank" rel="noopener noreferrer" style={{ display:'inline-block', marginTop:'14px' }}>
              <img src={settings.seekerBarcodeUrl} alt="Job Seekers WhatsApp Group" style={{ width:'88px', height:'88px', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.2)' }} />
              <p style={{ fontSize:'11px', color:'rgba(255,255,255,0.6)', marginTop:'4px' }}>Join Seekers WhatsApp Group</p>
            </a>
          )}
        </div>
        <div>
          <h4 style={{ color:'white', fontWeight:600, fontSize:'14px', marginBottom:'12px' }}>For Employers</h4>
          <div style={{ display:'flex', flexDirection:'column', gap:'8px', fontSize:'13px' }}>
            <Link to="/employers"           style={{ color:'rgba(255,255,255,0.65)' }} onMouseEnter={e=>e.target.style.color='#FF9933'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.65)'}>Post a Job</Link>
            <Link to="/recruiter/dashboard" style={{ color:'rgba(255,255,255,0.65)' }} onMouseEnter={e=>e.target.style.color='#FF9933'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.65)'}>Recruiter Dashboard</Link>
          </div>
          {showEmployerBarcode && (
            <a href={settings.employerWhatsappUrl || '#'} target="_blank" rel="noopener noreferrer" style={{ display:'inline-block', marginTop:'14px' }}>
              <img src={settings.employerBarcodeUrl} alt="Recruiter WhatsApp Group" style={{ width:'88px', height:'88px', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.2)' }} />
              <p style={{ fontSize:'11px', color:'rgba(255,255,255,0.6)', marginTop:'4px' }}>Join Recruiter WhatsApp Group</p>
            </a>
          )}
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
