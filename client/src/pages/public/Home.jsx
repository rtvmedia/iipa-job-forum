import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const STATS = [
  { value:'2,400+',  label:'Active Jobs' },
  { value:'850+',    label:'Companies' },
  { value:'18,000+', label:'Professionals' },
  { value:'94%',     label:'Placement Rate' },
];

const CATEGORIES = [
  { name:'Technology',      icon:'💻', count:420 },
  { name:'Finance',         icon:'📊', count:310 },
  { name:'Human Resources', icon:'👥', count:185 },
  { name:'Marketing',       icon:'📣', count:260 },
  { name:'Engineering',     icon:'⚙️',  count:340 },
  { name:'Healthcare',      icon:'🏥', count:215 },
  { name:'Education',       icon:'🎓', count:190 },
  { name:'Sales',           icon:'🤝', count:275 },
];

const W = '1128px';

export default function Home() {
  const [search, setSearch] = useState('');
  const [jobs, setJobs]     = useState([]);
  const [news, setNews]     = useState([]);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/jobs?limit=6').then(r => setJobs(r.data.slice(0,6))).catch(()=>{});
    api.get('/news').then(r => setNews(r.data.slice(0,3))).catch(()=>{});
    api.get('/events').then(r => setEvents(r.data.slice(0,4))).catch(()=>{});
  }, []);

  const handleSearch = e => { e.preventDefault(); navigate(`/jobs?search=${encodeURIComponent(search)}`); };

  return (
    <div>
      <style>{`
        .h-form { display:flex; flex-wrap:wrap; gap:8px; max-width:600px; margin:0 auto; }
        .h-form input { flex:1 1 200px; min-width:0; padding:12px 16px; border-radius:6px; border:none; font-size:14px; outline:none; }
        .h-form button { flex:0 0 auto; padding:12px 24px; background:#FF9933; color:#1a237e; font-weight:700; font-size:14px; border:none; border-radius:6px; cursor:pointer; white-space:nowrap; }
        .h-tags { display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin-top:16px; }
        .h-tags button { background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.25); color:rgba(255,255,255,0.85); font-size:12px; padding:4px 12px; border-radius:12px; cursor:pointer; }
        .stats-bar { display:grid; grid-template-columns:repeat(2,1fr); max-width:800px; margin:40px auto 0; background:rgba(255,255,255,0.08); border-radius:8px; overflow:hidden; border:1px solid rgba(255,255,255,0.12); }
        @media(min-width:640px){ .stats-bar{ grid-template-columns:repeat(4,1fr); } }
        .journey { display:grid; grid-template-columns:1fr; gap:16px; }
        @media(min-width:768px){ .journey{ grid-template-columns:1fr 1fr; } }
        .cat-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; }
        @media(min-width:480px){ .cat-grid{ grid-template-columns:repeat(3,1fr); } }
        @media(min-width:768px){ .cat-grid{ grid-template-columns:repeat(4,1fr); } }
        .jobs-grid { display:grid; grid-template-columns:1fr; gap:12px; }
        @media(min-width:640px){ .jobs-grid{ grid-template-columns:repeat(2,1fr); } }
        @media(min-width:1024px){ .jobs-grid{ grid-template-columns:repeat(3,1fr); } }
        .news-grid { display:grid; grid-template-columns:1fr; gap:16px; }
        @media(min-width:768px){ .news-grid{ grid-template-columns:repeat(3,1fr); } }
        .events-grid { display:grid; grid-template-columns:1fr; gap:12px; }
        @media(min-width:480px){ .events-grid{ grid-template-columns:repeat(2,1fr); } }
        @media(min-width:1024px){ .events-grid{ grid-template-columns:repeat(4,1fr); } }
        .cat-card:hover { background:#1a237e !important; }
        .cat-card:hover .cat-name { color:white !important; }
        .cat-card:hover .cat-cnt { color:rgba(255,200,100,0.9) !important; }
      `}</style>

      {/* HERO */}
      <section style={{ background:'linear-gradient(135deg, #1a237e 0%, #283593 100%)', padding:'56px 16px 48px', textAlign:'center' }}>
        <div style={{ maxWidth:W, margin:'0 auto' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'6px', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,153,51,0.4)', color:'#FF9933', fontSize:'12px', padding:'4px 14px', borderRadius:'20px', marginBottom:'20px', fontWeight:500 }}>
            <span style={{ width:'5px', height:'5px', background:'#FF9933', borderRadius:'50%', display:'inline-block' }} />
            India's Premier Professional Network
          </div>
          <h1 style={{ fontSize:'clamp(1.8rem, 4vw, 2.8rem)', fontWeight:700, color:'white', lineHeight:1.2, marginBottom:'12px' }}>
            Find Your <span style={{ color:'#FF9933' }}>Dream Career</span> with IIPA Job Forum
          </h1>
          <p style={{ color:'rgba(255,255,255,0.75)', fontSize:'clamp(14px, 2vw, 16px)', maxWidth:'560px', margin:'0 auto 28px', lineHeight:1.6 }}>
            Connecting top talent with leading employers. Discover thousands of opportunities tailored to your skills and ambitions.
          </p>
          <form onSubmit={handleSearch} className="h-form">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Job title, company, or keyword..." />
            <button type="submit">Search Jobs</button>
          </form>
          <div className="h-tags">
            {['React Developer','HR Manager','Data Analyst','Marketing Lead','Node.js'].map(t => (
              <button key={t} onClick={() => navigate(`/jobs?search=${t}`)}>{t}</button>
            ))}
          </div>
        </div>
        <div className="stats-bar">
          {STATS.map(s => (
            <div key={s.label} style={{ padding:'18px 12px', textAlign:'center' }}>
              <div style={{ color:'#FF9933', fontWeight:700, fontSize:'1.4rem' }}>{s.value}</div>
              <div style={{ color:'rgba(255,255,255,0.6)', fontSize:'12px', marginTop:'2px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* JOURNEY CTA */}
      <section style={{ maxWidth:W, margin:'0 auto', padding:'24px 16px' }}>
        <div className="journey">
          <div style={{ background:'white', borderRadius:'8px', padding:'24px', boxShadow:'0 0 0 1px rgba(0,0,0,0.08)', display:'flex', flexDirection:'column', gap:'12px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              <span style={{ fontSize:'1.6rem' }}>🔍</span>
              <h2 style={{ fontWeight:700, fontSize:'18px', color:'#1a237e' }}>I'm a Job Seeker</h2>
            </div>
            <p style={{ color:'#555', fontSize:'14px', lineHeight:1.6 }}>Build your profile, discover thousands of opportunities, and track every application in one place.</p>
            <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
              <Link to="/register?role=seeker" style={{ background:'#FF9933', color:'#1a237e', fontWeight:600, fontSize:'14px', padding:'8px 20px', borderRadius:'20px' }}>Create Profile</Link>
              <Link to="/jobs" style={{ color:'#1a237e', fontSize:'14px', fontWeight:500, padding:'8px 20px', border:'1px solid #1a237e', borderRadius:'20px' }}>Browse Jobs</Link>
            </div>
          </div>
          <div style={{ background:'#1a237e', borderRadius:'8px', padding:'24px', boxShadow:'0 0 0 1px rgba(0,0,0,0.08)', display:'flex', flexDirection:'column', gap:'12px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              <span style={{ fontSize:'1.6rem' }}>🏢</span>
              <h2 style={{ fontWeight:700, fontSize:'18px', color:'white' }}>I'm an Employer</h2>
            </div>
            <p style={{ color:'rgba(255,255,255,0.75)', fontSize:'14px', lineHeight:1.6 }}>Post vacancies, review matched candidates, and manage your hiring pipeline with ease.</p>
            <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
              <Link to="/register?role=recruiter" style={{ background:'#FF9933', color:'#1a237e', fontWeight:600, fontSize:'14px', padding:'8px 20px', borderRadius:'20px' }}>Post a Job</Link>
              <Link to="/login" style={{ color:'white', fontSize:'14px', fontWeight:500, padding:'8px 20px', border:'1px solid rgba(255,255,255,0.4)', borderRadius:'20px' }}>Sign In</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ background:'white', padding:'32px 16px', borderTop:'1px solid #e0e0e0', borderBottom:'1px solid #e0e0e0', marginBottom:'8px' }}>
        <div style={{ maxWidth:W, margin:'0 auto' }}>
          <h2 style={{ fontWeight:700, fontSize:'18px', color:'#1a237e', marginBottom:'4px' }}>Browse by Category</h2>
          <p style={{ color:'#666', fontSize:'13px', marginBottom:'20px' }}>Explore opportunities across all industries</p>
          <div className="cat-grid">
            {CATEGORIES.map(c => (
              <Link key={c.name} to={`/jobs?category=${encodeURIComponent(c.name)}`} className="cat-card"
                style={{ background:'#f9f9f9', borderRadius:'8px', padding:'16px 12px', textAlign:'center', border:'1px solid #ebebeb', display:'block', transition:'all 0.15s' }}>
                <div style={{ fontSize:'1.6rem', marginBottom:'6px' }}>{c.icon}</div>
                <div className="cat-name" style={{ fontWeight:600, fontSize:'13px', color:'#1a237e' }}>{c.name}</div>
                <div className="cat-cnt" style={{ fontSize:'12px', color:'#888', marginTop:'2px' }}>{c.count} jobs</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED JOBS */}
      <section style={{ maxWidth:W, margin:'0 auto', padding:'24px 16px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'16px' }}>
          <h2 style={{ fontWeight:700, fontSize:'18px', color:'#1a237e' }}>Featured Vacancies</h2>
          <Link to="/jobs" style={{ color:'#FF9933', fontSize:'13px', fontWeight:600 }}>View All →</Link>
        </div>
        {jobs.length === 0 ? (
          <div style={{ textAlign:'center', color:'#999', padding:'48px 0' }}>
            <div style={{ fontSize:'2rem', marginBottom:'8px' }}>📋</div>
            Loading jobs...
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.map(job => (
              <div key={job.id} style={{ background:'white', borderRadius:'8px', boxShadow:'0 0 0 1px rgba(0,0,0,0.08)', padding:'16px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', gap:'8px', marginBottom:'8px' }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <Link to={`/jobs/${job.id}`} style={{ fontWeight:600, color:'#1a237e', fontSize:'15px' }}>{job.title}</Link>
                    <p style={{ color:'#666', fontSize:'13px', marginTop:'2px' }}>{job.company}</p>
                  </div>
                  <span style={{ background:'#fff3e0', color:'#e65100', fontSize:'11px', fontWeight:600, padding:'3px 10px', borderRadius:'12px', whiteSpace:'nowrap' }}>{job.type}</span>
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'10px', fontSize:'13px', color:'#666' }}>
                  <span>📍 {job.location}</span>
                  <span>💼 {job.category}</span>
                </div>
                {job.salaryMin && <p style={{ color:'#138808', fontSize:'13px', fontWeight:500, marginTop:'6px' }}>₹ {(job.salaryMin/1000).toFixed(0)}k – {(job.salaryMax/1000).toFixed(0)}k / month</p>}
                <Link to={`/jobs/${job.id}`} style={{ marginTop:'12px', display:'inline-block', fontSize:'13px', fontWeight:600, color:'#1a237e', border:'1px solid #1a237e', padding:'5px 14px', borderRadius:'16px' }}>Apply Now</Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* NEWS */}
      {news.length > 0 && (
        <section style={{ background:'white', borderTop:'1px solid #e0e0e0', borderBottom:'1px solid #e0e0e0', padding:'32px 16px' }}>
          <div style={{ maxWidth:W, margin:'0 auto' }}>
            <h2 style={{ fontWeight:700, fontSize:'18px', color:'#1a237e', marginBottom:'20px' }}>News & Insights</h2>
            <div className="news-grid">
              {news.map(n => (
                <div key={n.id} style={{ background:'white', borderRadius:'8px', border:'1px solid #ebebeb', overflow:'hidden' }}>
                  <div style={{ height:'3px', background:'linear-gradient(to right,#FF9933,#138808)' }} />
                  <div style={{ padding:'16px' }}>
                    <span style={{ fontSize:'11px', background:'rgba(26,35,126,0.08)', color:'#1a237e', padding:'2px 8px', borderRadius:'10px', fontWeight:500 }}>{n.category}</span>
                    <h3 style={{ fontWeight:600, color:'#1a1a1a', marginTop:'8px', fontSize:'14px', lineHeight:1.4 }}>{n.title}</h3>
                    <p style={{ color:'#666', fontSize:'13px', marginTop:'6px', lineHeight:1.5 }}>{n.excerpt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EVENTS */}
      {events.length > 0 && (
        <section style={{ maxWidth:W, margin:'0 auto', padding:'24px 16px' }}>
          <h2 style={{ fontWeight:700, fontSize:'18px', color:'#1a237e', marginBottom:'16px' }}>Upcoming Events</h2>
          <div className="events-grid">
            {events.map(ev => (
              <div key={ev.id} style={{ background:'white', borderRadius:'8px', borderLeft:'3px solid #FF9933', boxShadow:'0 0 0 1px rgba(0,0,0,0.08)', padding:'16px' }}>
                <div style={{ fontSize:'1.3rem', marginBottom:'6px' }}>{ev.isOnline ? '🌐' : '📍'}</div>
                <h3 style={{ fontWeight:600, color:'#1a237e', fontSize:'14px', lineHeight:1.4 }}>{ev.title}</h3>
                <p style={{ color:'#666', fontSize:'12px', marginTop:'4px' }}>{new Date(ev.eventDate).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</p>
                <span style={{ marginTop:'8px', display:'inline-block', fontSize:'11px', padding:'2px 10px', borderRadius:'10px', background:ev.isOnline?'#e8f5e9':'#fff3e0', color:ev.isOnline?'#2e7d32':'#e65100', fontWeight:500 }}>
                  {ev.isOnline ? 'Online' : 'In Person'}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* FINAL CTA */}
      <section style={{ background:'#1a237e', padding:'48px 16px', textAlign:'center' }}>
        <div style={{ display:'flex', justifyContent:'center', gap:'8px', marginBottom:'20px' }}>
          <div style={{ width:'28px', height:'3px', background:'#FF9933', borderRadius:'2px' }} />
          <div style={{ width:'28px', height:'3px', background:'white', borderRadius:'2px' }} />
          <div style={{ width:'28px', height:'3px', background:'#138808', borderRadius:'2px' }} />
        </div>
        <h2 style={{ fontWeight:700, fontSize:'clamp(1.3rem,3vw,1.8rem)', color:'white', marginBottom:'8px' }}>Ready to Take the Next Step?</h2>
        <p style={{ color:'rgba(255,255,255,0.7)', marginBottom:'24px', maxWidth:'480px', margin:'0 auto 24px', fontSize:'14px', lineHeight:1.6 }}>
          Join thousands of professionals already using IIPA Job Forum to advance their careers across India.
        </p>
        <div style={{ display:'flex', justifyContent:'center', gap:'12px', flexWrap:'wrap' }}>
          <Link to="/register" style={{ background:'#FF9933', color:'#1a237e', fontWeight:700, fontSize:'14px', padding:'10px 28px', borderRadius:'20px' }}>Create Free Account</Link>
          <Link to="/jobs" style={{ color:'white', fontSize:'14px', fontWeight:500, padding:'10px 28px', border:'1px solid rgba(255,255,255,0.35)', borderRadius:'20px' }}>Browse Jobs</Link>
        </div>
      </section>
    </div>
  );
}
