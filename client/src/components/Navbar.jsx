import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const dashboardPath = (role) => ({
  recruiter:   '/recruiter/dashboard',
  admin:       '/admin/dashboard',
  coordinator: '/coordinator/dashboard',
}[role] || '/seeker/dashboard');

const FIND_JOBS_MENU = [
  { label:'Job Search',        to:'/jobs' },
  { label:'Jobs by Location',  to:'/jobs?view=location' },
  { label:'Jobs by Companies', to:'/jobs?view=companies' },
  { label:'Executive Jobs',    to:'/jobs?search=Executive' },
  { label:'Remote Jobs',       to:'/jobs?type=remote' },
  { label:'Salaries',          to:'/jobs?view=salaries' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isEmployerContext = location.pathname.startsWith('/employers');
  const [open, setOpen] = useState(false);
  const [findJobsOpen, setFindJobsOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    api.get('/settings').then(r => setLogoUrl(r.data?.headerLogoUrl || null)).catch(() => {});
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setFindJobsOpen(false);
    };
    document.addEventListener('click', onClickOutside);
    return () => document.removeEventListener('click', onClickOutside);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); setOpen(false); };

  return (
    <nav style={{ background:'#1a237e', position:'sticky', top:0, zIndex:50, boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }}>
      <div className="tricolor" />
      <div style={{ maxWidth:'1320px', margin:'0 auto', padding:'0 16px', display:'flex', alignItems:'center', justifyContent:'space-between', height:'86px' }}>

        {/* Logo */}
        <Link to="/" onClick={() => setOpen(false)} style={{ display:'flex', alignItems:'center', gap:'12px', flexShrink:0 }}>
          {logoUrl && (
            <span style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
              <img src={logoUrl} alt="Logo" style={{
                width:'54px', height:'54px', objectFit:'cover', borderRadius:'50%', display:'block',
                filter:'drop-shadow(0 2px 6px rgba(0,0,0,0.35))',
              }} />
              <span style={{ color:'rgba(255,255,255,0.8)', fontSize:'9.5px', fontWeight:600, lineHeight:1.25, textAlign:'center', marginTop:'3px', letterSpacing:'0.01em' }}>
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
        <div style={{ display:'flex', alignItems:'center', gap:'22px', fontSize:'14px' }} className="desk-nav" ref={menuRef}>
          <Link to="/" style={{ color:'rgba(255,255,255,0.85)' }} onMouseEnter={e=>e.target.style.color='#FF9933'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.85)'}>Home</Link>

          {isEmployerContext ? (
            <>
              <Link to="/employers?tab=postjob" style={{ color:'rgba(255,255,255,0.85)' }} onMouseEnter={e=>e.target.style.color='#FF9933'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.85)'}>Post a Job</Link>
              <Link to="/employers?tab=candidates" style={{ color:'rgba(255,255,255,0.85)' }} onMouseEnter={e=>e.target.style.color='#FF9933'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.85)'}>Find Candidates</Link>
            </>
          ) : (
            <>
              <div style={{ position:'relative' }}>
                <button onClick={() => setFindJobsOpen(o => !o)}
                  style={{ background:'none', border:'none', color:'rgba(255,255,255,0.85)', fontSize:'14px', cursor:'pointer', display:'flex', alignItems:'center', gap:'4px', padding:0 }}
                  onMouseEnter={e=>e.currentTarget.style.color='#FF9933'} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.85)'}>
                  Find Jobs <span style={{ fontSize:'10px', transform: findJobsOpen ? 'rotate(180deg)' : 'none', transition:'transform 0.15s' }}>▾</span>
                </button>
                {findJobsOpen && (
                  <div style={{ position:'absolute', top:'28px', left:0, background:'#fff', borderRadius:'10px', boxShadow:'0 12px 30px rgba(0,0,0,0.2)', minWidth:'190px', overflow:'hidden', zIndex:80 }}>
                    {FIND_JOBS_MENU.map((item, i) => (
                      <Link key={item.label} to={item.to} onClick={() => setFindJobsOpen(false)}
                        style={{ display:'block', padding:'10px 16px', fontSize:'13.5px', color:'#333', borderBottom: i < FIND_JOBS_MENU.length-1 ? '1px solid #f0f0f0' : 'none' }}
                        onMouseEnter={e=>e.target.style.background='#f5f7ff'} onMouseLeave={e=>e.target.style.background='transparent'}>
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/register?role=seeker" style={{ color:'rgba(255,255,255,0.85)' }} onMouseEnter={e=>e.target.style.color='#FF9933'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.85)'}>Create Profile</Link>
            </>
          )}
        </div>

        {/* Desktop auth */}
        <div style={{ display:'flex', alignItems:'center', gap:'10px' }} className="desk-nav">
          {user ? (
            <>
              <Link to={dashboardPath(user.role)}
                style={{ color:'rgba(255,255,255,0.85)', fontSize:'14px', maxWidth:'130px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {user.fullName}
              </Link>
              <button onClick={handleLogout}
                style={{ background:'#FF9933', color:'#1a237e', fontWeight:600, fontSize:'13px', padding:'6px 16px', borderRadius:'16px', border:'none' }}>
                Logout
              </button>
            </>
          ) : isEmployerContext ? (
            <>
              <Link to="/login" style={{ color:'rgba(255,255,255,0.85)', fontSize:'14px' }}>Sign In</Link>
              <Link to="/register?role=recruiter"
                style={{ background:'linear-gradient(135deg, #138808, #0d6b06)', color:'#fff', fontWeight:700, fontSize:'13px', padding:'6px 16px', borderRadius:'16px', boxShadow:'0 2px 8px rgba(19,136,8,0.4)' }}>
                Register as Employer
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color:'rgba(255,255,255,0.85)', fontSize:'14px' }}>Sign In</Link>
              <Link to="/register?role=seeker"
                style={{ background:'#FF9933', color:'#1a237e', fontWeight:600, fontSize:'13px', padding:'6px 16px', borderRadius:'16px' }}>
                Get Started
              </Link>
              <Link to="/employers"
                style={{ background:'linear-gradient(135deg, #138808, #0d6b06)', color:'#fff', fontWeight:700, fontSize:'13px', padding:'6px 16px', borderRadius:'16px', boxShadow:'0 2px 8px rgba(19,136,8,0.4)' }}>
                Are you an Employer?
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
          <Link to="/" onClick={() => setOpen(false)} style={{ color:'rgba(255,255,255,0.85)', fontSize:'16px', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.1)' }}>Home</Link>
          {isEmployerContext ? (
            <>
              <Link to="/employers?tab=postjob" onClick={() => setOpen(false)} style={{ color:'rgba(255,255,255,0.85)', fontSize:'16px', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.1)' }}>Post a Job</Link>
              <Link to="/employers?tab=candidates" onClick={() => setOpen(false)} style={{ color:'rgba(255,255,255,0.85)', fontSize:'16px', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.1)' }}>Find Candidates</Link>
            </>
          ) : (
            <>
              {FIND_JOBS_MENU.map(item => (
                <Link key={item.label} to={item.to} onClick={() => setOpen(false)}
                  style={{ color:'rgba(255,255,255,0.7)', fontSize:'14px', padding:'10px 0 10px 14px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                  {item.label}
                </Link>
              ))}
              <Link to="/register?role=seeker" onClick={() => setOpen(false)} style={{ color:'rgba(255,255,255,0.85)', fontSize:'16px', padding:'12px 0', borderBottom:'1px solid rgba(255,255,255,0.1)' }}>Create Profile</Link>
            </>
          )}

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
            ) : isEmployerContext ? (
              <>
                <Link to="/login" onClick={() => setOpen(false)}
                  style={{ color:'rgba(255,255,255,0.85)', fontSize:'15px', textAlign:'center', padding:'12px', border:'1px solid rgba(255,255,255,0.3)', borderRadius:'8px' }}>
                  Sign In
                </Link>
                <Link to="/register?role=recruiter" onClick={() => setOpen(false)}
                  style={{ background:'#138808', color:'#fff', fontWeight:700, fontSize:'14px', padding:'12px', borderRadius:'8px', textAlign:'center' }}>
                  Register as Employer
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)}
                  style={{ color:'rgba(255,255,255,0.85)', fontSize:'15px', textAlign:'center', padding:'12px', border:'1px solid rgba(255,255,255,0.3)', borderRadius:'8px' }}>
                  Sign In
                </Link>
                <Link to="/register?role=seeker" onClick={() => setOpen(false)}
                  style={{ background:'#FF9933', color:'#1a237e', fontWeight:600, fontSize:'14px', padding:'12px', borderRadius:'8px', textAlign:'center' }}>
                  Get Started
                </Link>
                <Link to="/employers" onClick={() => setOpen(false)}
                  style={{ background:'#138808', color:'#fff', fontWeight:700, fontSize:'14px', padding:'12px', borderRadius:'8px', textAlign:'center' }}>
                  Are you an Employer?
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
        @media (max-width: 900px) {
          .desk-nav { display: none !important; }
          .mob-menu { display: flex !important; }
        }
        .mob-backdrop {
          position: fixed; inset: 0; background: rgba(0,0,0,0); pointer-events: none;
          transition: background 0.25s ease; z-index: 60;
        }
        .mob-backdrop-open { background: rgba(0,0,0,0.45); pointer-events: auto; }
        .mob-drawer {
          position: fixed; top: 0; right: 0; height: 100vh; width: min(82vw, 320px);
          background: #1a237e; box-shadow: -8px 0 24px rgba(0,0,0,0.3);
          transform: translateX(100%); transition: transform 0.28s ease; z-index: 61;
          overflow-y: auto;
        }
        .mob-drawer-open { transform: translateX(0); }
      `}</style>
    </nav>
  );
}
