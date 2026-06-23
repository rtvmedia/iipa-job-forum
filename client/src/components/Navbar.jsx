import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const F = "inherit";

const dashboardPath = (role) => ({
  recruiter:   '/recruiter/dashboard',
  admin:       '/admin/dashboard',
  coordinator: '/coordinator/dashboard',
}[role] || '/seeker/dashboard');

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState(null);

  useEffect(() => {
    api.get('/settings').then(r => setLogoUrl(r.data?.headerLogoUrl || null)).catch(() => {});
  }, []);

  const handleLogout = () => { logout(); navigate('/'); setOpen(false); };

  return (
    <nav style={{ background:'#1a237e', position:'sticky', top:0, zIndex:50, boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }}>
      <div className="tricolor" />
      <div style={{ maxWidth:'1128px', margin:'0 auto', padding:'0 16px', display:'flex', alignItems:'center', justifyContent:'space-between', height:'78px' }}>

        {/* Logo */}
        <Link to="/" onClick={() => setOpen(false)} style={{ display:'flex', alignItems:'center', gap:'12px' }}>
          {logoUrl && (
            <span style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
              <span style={{
                display:'flex', alignItems:'center', justifyContent:'center',
                width:'46px', height:'46px', borderRadius:'50%', background:'#fff',
                boxShadow:'0 2px 8px rgba(0,0,0,0.25)', border:'2px solid #FF9933',
                overflow:'hidden',
              }}>
                <img src={logoUrl} alt="Logo" style={{ width:'92%', height:'92%', objectFit:'contain', borderRadius:'50%' }} />
              </span>
              <span style={{ color:'rgba(255,255,255,0.7)', fontSize:'7.5px', fontWeight:600, lineHeight:1.2, textAlign:'center', marginTop:'2px', letterSpacing:'0.01em' }}>
                International Indian<br />Professionals Association
              </span>
            </span>
          )}
          <span style={{ display:'flex', flexDirection:'column', justifyContent:'center', gap:'1px' }}>
            <span style={{ display:'flex', alignItems:'baseline', gap:'6px' }}>
              <span style={{ color:'#FF9933', fontWeight:700, fontSize:'19px' }}>IIPA</span>
              <span style={{ color:'white', fontWeight:600, fontSize:'17px' }}>JOBS</span>
            </span>
            <span className="brand-tagline" style={{
              color:'#FFC766', fontSize:'11.5px', fontWeight:600, letterSpacing:'0.02em',
              fontStyle:'italic', textShadow:'0 1px 2px rgba(0,0,0,0.35)',
            }}>
              Connecting Talents with Opportunities
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display:'flex', alignItems:'center', gap:'24px', fontSize:'14px' }} className="desk-nav">
          <Link to="/jobs"    style={{ color:'rgba(255,255,255,0.85)' }} onMouseEnter={e=>e.target.style.color='#FF9933'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.85)'}>Find Jobs</Link>
          <Link to="/about"   style={{ color:'rgba(255,255,255,0.85)' }} onMouseEnter={e=>e.target.style.color='#FF9933'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.85)'}>About</Link>
          <Link to="/contact" style={{ color:'rgba(255,255,255,0.85)' }} onMouseEnter={e=>e.target.style.color='#FF9933'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.85)'}>Contact</Link>
        </div>

        {/* Desktop auth */}
        <div style={{ display:'flex', alignItems:'center', gap:'12px' }} className="desk-nav">
          {user ? (
            <>
              <Link to={dashboardPath(user.role)}
                style={{ color:'rgba(255,255,255,0.85)', fontSize:'14px', maxWidth:'140px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {user.fullName}
              </Link>
              <button onClick={handleLogout}
                style={{ background:'#FF9933', color:'#1a237e', fontWeight:600, fontSize:'13px', padding:'6px 16px', borderRadius:'16px', border:'none' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color:'rgba(255,255,255,0.85)', fontSize:'14px' }}>Sign In</Link>
              <Link to="/register"
                style={{ background:'#FF9933', color:'#1a237e', fontWeight:600, fontSize:'13px', padding:'6px 16px', borderRadius:'16px' }}>
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button onClick={() => setOpen(o => !o)} className="mob-menu"
          style={{ background:'none', border:'none', display:'flex', flexDirection:'column', gap:'5px', padding:'4px' }}>
          <span style={{ display:'block', width:'22px', height:'2px', background:'white', borderRadius:'2px', transition:'all 0.2s', transform: open ? 'rotate(45deg) translate(5px,5px)' : 'none' }} />
          <span style={{ display:'block', width:'22px', height:'2px', background:'white', borderRadius:'2px', opacity: open ? 0 : 1, transition:'all 0.2s' }} />
          <span style={{ display:'block', width:'22px', height:'2px', background:'white', borderRadius:'2px', transition:'all 0.2s', transform: open ? 'rotate(-45deg) translate(5px,-5px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile drawer backdrop */}
      <div className={`mob-backdrop ${open ? 'mob-backdrop-open' : ''}`} onClick={() => setOpen(false)} />

      {/* Mobile drawer */}
      <div className={`mob-drawer ${open ? 'mob-drawer-open' : ''}`}>
        <div style={{ display:'flex', justifyContent:'flex-end', padding:'12px 16px 0' }}>
          <button onClick={() => setOpen(false)} style={{ background:'none', border:'none', color:'white', fontSize:'22px', lineHeight:1, padding:'4px 8px', cursor:'pointer' }}>×</button>
        </div>
        <div style={{ padding:'4px 20px 24px', display:'flex', flexDirection:'column', gap:'4px' }}>
          {[['Find Jobs','/jobs'],['About','/about'],['Contact','/contact']].map(([label,path]) => (
            <Link key={path} to={path} onClick={() => setOpen(false)}
              style={{ color:'rgba(255,255,255,0.85)', fontSize:'16px', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.1)' }}>
              {label}
            </Link>
          ))}
          <div style={{ paddingTop:'16px', display:'flex', flexDirection:'column', gap:'10px' }}>
            {user ? (
              <>
                <Link to={dashboardPath(user.role)} onClick={() => setOpen(false)}
                  style={{ color:'rgba(255,255,255,0.85)', fontSize:'15px' }}>
                  {user.fullName}
                </Link>
                <button onClick={handleLogout}
                  style={{ background:'#FF9933', color:'#1a237e', fontWeight:600, fontSize:'14px', padding:'12px', borderRadius:'8px', border:'none', textAlign:'center' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)}
                  style={{ color:'rgba(255,255,255,0.85)', fontSize:'15px', textAlign:'center', padding:'12px', border:'1px solid rgba(255,255,255,0.3)', borderRadius:'8px' }}>
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setOpen(false)}
                  style={{ background:'#FF9933', color:'#1a237e', fontWeight:600, fontSize:'14px', padding:'12px', borderRadius:'8px', textAlign:'center' }}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .desk-nav { display: flex; }
        .mob-menu { display: none; }
        @media (max-width: 480px) {
          .brand-tagline { display: none !important; }
        }
        @media (max-width: 767px) {
          .desk-nav { display: none !important; }
          .mob-menu { display: flex !important; }
        }
        .mob-backdrop {
          position: fixed; inset: 0; background: rgba(0,0,0,0); pointer-events: none;
          transition: background 0.25s ease; z-index: 60;
        }
        .mob-backdrop-open { background: rgba(0,0,0,0.45); pointer-events: auto; }
        .mob-drawer {
          position: fixed; top: 0; right: 0; height: 100vh; width: min(78vw, 300px);
          background: #1a237e; box-shadow: -8px 0 24px rgba(0,0,0,0.3);
          transform: translateX(100%); transition: transform 0.28s ease; z-index: 61;
          overflow-y: auto;
        }
        .mob-drawer-open { transform: translateX(0); }
      `}</style>
    </nav>
  );
}
