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
const BLUE = '#0a66c2';
const BLUE_DARK = '#004182';

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
        .h-form { display:flex; flex-wrap:wrap; gap:8px; max-width:580px; margin:0 auto; }
        .h-form input { flex:1 1 200px; min-width:0; padding:12px 16px; border-radius:6px; border:none; font-size:14px; outline:none; }
        .h-form button { flex:0 0 auto; padding:12px 24px; background:${BLUE}; color:#fff; font-weight:700; font-size:14px; border:none; border-radius:6px; cursor:pointer; white-space:nowrap; }
        .h-form button:hover { background:${BLUE_DARK}; }
        .h-tags { display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin-top:14px; }
        .h-tags button { background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.3); color:rgba(255,255,255,0.9); font-size:12px; padding:4px 12px; border-radius:12px; cursor:pointer; }
        .stats-bar { display:grid; grid-template-columns:repeat(2,1fr); max-width:760px; margin:36px auto 0; background:rgba(255,255,255,0.1); border-radius:8px; overflow:hidden; border:1px solid rgba(255,255,255,0.15); }
        @media(min-width:600px){ .stats-bar{ grid-template-columns:repeat(4,1fr); } }
        .journey { display:grid; grid-template-columns:1fr; gap:12px; }
        @media(min-width:720px){ .journey{ grid-template-columns:1fr 1fr; } }
        .cat-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; }
        @media(min-width:480px){ .cat-grid{ grid-template-columns:repeat(3,1fr); } }
        @media(min-width:768px){ .cat-grid{ grid-template-columns:repeat(4,1fr); } }
        .jobs-grid { display:grid; grid-template-columns:1fr; gap:10px; }
        @media(min-width:640px){ .jobs-grid{ grid-template-columns:repeat(2,1fr); } }
        @media(min-width:1024px){ .jobs-grid{ grid-template-columns:repeat(3,1fr); } }
        .news-grid { display:grid; grid-template-columns:1fr; gap:12px; }
        @media(min-width:768px){ .news-grid{ grid-template-columns:repeat(3,1fr); } }
        .events-grid { display:grid; grid-template-columns:1fr; gap:10px; }
        @media(min-width:480px){ .events-grid{ grid-template-columns:repeat(2,1fr); } }
        @media(min-width:1024px){ .events-grid{ grid-template-columns:repeat(4,1fr); } }
        .cat-card { background:#fff; border-radius:8px; padding:16px 12px; text-align:center; border:1px solid #e0e0e0; display:block; transition:all 0.15s; }
        .cat-card:hover { border-color:${BLUE}; box-shadow:0 2px 8px rgba(10,102,194,0.12); }
        .cat-card:hover .cat-name { color:${BLUE} !important; }
        .job-card { background:#fff; border-radius:8px; border:1px solid #e0e0e0; padding:16px; transition:box-shadow 0.15s; }
        .job-card:hover { box-shadow:0 2px 10px rgba(0,0,0,0.1); }
        .apply-btn { display:inline-block; font-size:13px; font-weight:600; color:${BLUE}; border:1px solid ${BLUE}; padding:5px 16px; border-radius:16px; transition:all 0.15s; }
        .apply-btn:hover { background:${BLUE}; color:#fff; }
        .section-divider { border:none; border-top:1px solid #e0e0e0; margin:0; }
      `}</style>

      {/* HERO */}
      <section style={{ background:'linear-gradient(135deg, #062b56 0%, #0a4a8c 60%, #0f5fb5 100%)', padding:'52px 16px 44px', textAlign:'center' }}>
        <div style={{ maxWidth:W, margin:'0 auto' }}>
          <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'12px', fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'14px' }}>
            India's Premier Professional Network
          </p>
          <h1 style={{ fontSize:'clamp(1.7rem, 4vw, 2.6rem)', fontWeight:700, color:'white', lineHeight:1.2, marginBottom:'10px' }}>
            Find Your Next Career Opportunity
          </h1>
          <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'clamp(14px,2vw,16px)', maxWidth:'520px', margin:'0 auto 24px', lineHeight:1.6 }}>
            Connecting top talent with leading employers across India. Thousands of opportunities, one platform.
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
            <div key={s.label} style={{ padding:'16px 12px', textAlign:'center' }}>
              <div style={{ color:'#fff', fontWeight:700, fontSize:'1.3rem' }}>{s.value}</div>
              <div style={{ color:'rgba(255,255,255,0.55)', fontSize:'12px', marginTop:'2px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* JOURNEY CTA */}
      <section style={{ maxWidth:W, margin:'0 auto', padding:'20px 16px' }}>
        <div className="journey">
          <div style={{ background:'#fff', borderRadius:'8px', padding:'22px', border:'1px solid #e0e0e0', display:'flex', flexDirection:'column', gap:'10px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              <span style={{ fontSize:'1.5rem' }}>🔍</span>
              <h2 style={{ fontWeight:700, fontSize:'17px', color:'#1a1a1a' }}>I'm a Job Seeker</h2>
            </div>
            <p style={{ color:'#555', fontSize:'14px', lineHeight:1.6 }}>Build your profile, discover thousands of opportunities, and track every application in one place.</p>
            <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
              <Link to="/register?role=seeker" style={{ background:BLUE, color:'#fff', fontWeight:600, fontSize:'13px', padding:'8px 18px', borderRadius:'16px' }}>Create Profile</Link>
              <Link to="/jobs" style={{ color:BLUE, fontSize:'13px', fontWeight:500, padding:'8px 18px', border:`1px solid ${BLUE}`, borderRadius:'16px' }}>Browse Jobs</Link>
            </div>
          </div>
          <div style={{ background:'#fff', borderRadius:'8px', padding:'22px', border:'1px solid #e0e0e0', display:'flex', flexDirection:'column', gap:'10px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              <span style={{ fontSize:'1.5rem' }}>🏢</span>
              <h2 style={{ fontWeight:700, fontSize:'17px', color:'#1a1a1a' }}>I'm an Employer</h2>
            </div>
            <p style={{ color:'#555', fontSize:'14px', lineHeight:1.6 }}>Post vacancies, review matched candidates, and manage your hiring pipeline with ease.</p>
            <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
              <Link to="/register?role=recruiter" style={{ background:BLUE, color:'#fff', fontWeight:600, fontSize:'13px', padding:'8px 18px', borderRadius:'16px' }}>Post a Job</Link>
              <Link to="/login" style={{ color:BLUE, fontSize:'13px', fontWeight:500, padding:'8px 18px', border:`1px solid ${BLUE}`, borderRadius:'16px' }}>Sign In</Link>
            </div>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* CATEGORIES */}
      <section style={{ background:'#fff', padding:'28px 16px' }}>
        <div style={{ maxWidth:W, margin:'0 auto' }}>
          <h2 style={{ fontWeight:700, fontSize:'17px', color:'#1a1a1a', marginBottom:'4px' }}>Browse by Category</h2>
          <p style={{ color:'#666', fontSize:'13px', marginBottom:'16px' }}>Explore opportunities across all industries</p>
          <div className="cat-grid">
            {CATEGORIES.map(c => (
              <Link key={c.name} to={`/jobs?category=${encodeURIComponent(c.name)}`} className="cat-card">
                <div style={{ fontSize:'1.5rem', marginBottom:'6px' }}>{c.icon}</div>
                <div className="cat-name" style={{ fontWeight:600, fontSize:'13px', color:'#1a1a1a' }}>{c.name}</div>
                <div style={{ fontSize:'12px', color:'#888', marginTop:'2px' }}>{c.count} jobs</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* FEATURED JOBS */}
      <section style={{ maxWidth:W, margin:'0 auto', padding:'28px 16px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px' }}>
          <h2 style={{ fontWeight:700, fontSize:'17px', color:'#1a1a1a' }}>Featured Vacancies</h2>
          <Link to="/jobs" style={{ color:BLUE, fontSize:'13px', fontWeight:600 }}>View All →</Link>
        </div>
        {jobs.length === 0 ? (
          <div style={{ textAlign:'center', color:'#999', padding:'40px 0' }}>
            <div style={{ fontSize:'2rem', marginBottom:'8px' }}>📋</div>
            Loading jobs...
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.map(job => (
              <div key={job.id} className="job-card">
                <div style={{ display:'flex', justifyContent:'space-between', gap:'8px', marginBottom:'8px' }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <Link to={`/jobs/${job.id}`} style={{ fontWeight:600, color:BLUE, fontSize:'15px' }}>{job.title}</Link>
                    <p style={{ color:'#555', fontSize:'13px', marginTop:'2px' }}>{job.company}</p>
                  </div>
                  <span style={{ background:'#f0f7ff', color:BLUE, fontSize:'11px', fontWeight:600, padding:'3px 10px', borderRadius:'12px', whiteSpace:'nowrap', border:`1px solid #c8e0f9` }}>{job.type}</span>
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'10px', fontSize:'13px', color:'#666' }}>
                  <span>📍 {job.location}</span>
                  <span>💼 {job.category}</span>
                </div>
                {job.salaryMin && <p style={{ color:'#057642', fontSize:'13px', fontWeight:500, marginTop:'6px' }}>₹ {(job.salaryMin/1000).toFixed(0)}k – {(job.salaryMax/1000).toFixed(0)}k / month</p>}
                <Link to={`/jobs/${job.id}`} className="apply-btn" style={{ marginTop:'12px' }}>Apply Now</Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* NEWS */}
      {news.length > 0 && (
        <>
          <hr className="section-divider" />
          <section style={{ background:'#fff', padding:'28px 16px' }}>
            <div style={{ maxWidth:W, margin:'0 auto' }}>
              <h2 style={{ fontWeight:700, fontSize:'17px', color:'#1a1a1a', marginBottom:'16px' }}>News & Insights</h2>
              <div className="news-grid">
                {news.map(n => (
                  <div key={n.id} style={{ background:'#f9f9f9', borderRadius:'8px', border:'1px solid #e0e0e0', overflow:'hidden' }}>
                    <div style={{ height:'3px', background:BLUE }} />
                    <div style={{ padding:'16px' }}>
                      <span style={{ fontSize:'11px', background:'#e8f1fb', color:BLUE, padding:'2px 8px', borderRadius:'10px', fontWeight:500 }}>{n.category}</span>
                      <h3 style={{ fontWeight:600, color:'#1a1a1a', marginTop:'8px', fontSize:'14px', lineHeight:1.4 }}>{n.title}</h3>
                      <p style={{ color:'#666', fontSize:'13px', marginTop:'6px', lineHeight:1.5 }}>{n.excerpt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* EVENTS */}
      {events.length > 0 && (
        <>
          <hr className="section-divider" />
          <section style={{ maxWidth:W, margin:'0 auto', padding:'28px 16px' }}>
            <h2 style={{ fontWeight:700, fontSize:'17px', color:'#1a1a1a', marginBottom:'14px' }}>Upcoming Events</h2>
            <div className="events-grid">
              {events.map(ev => (
                <div key={ev.id} style={{ background:'#fff', borderRadius:'8px', borderLeft:`3px solid ${BLUE}`, border:`1px solid #e0e0e0`, borderLeftWidth:'3px', padding:'16px' }}>
                  <div style={{ fontSize:'1.2rem', marginBottom:'6px' }}>{ev.isOnline ? '🌐' : '📍'}</div>
                  <h3 style={{ fontWeight:600, color:'#1a1a1a', fontSize:'14px', lineHeight:1.4 }}>{ev.title}</h3>
                  <p style={{ color:'#666', fontSize:'12px', marginTop:'4px' }}>{new Date(ev.eventDate).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</p>
                  <span style={{ marginTop:'8px', display:'inline-block', fontSize:'11px', padding:'2px 10px', borderRadius:'10px', background:ev.isOnline?'#e8f5e9':'#e8f1fb', color:ev.isOnline?'#057642':BLUE, fontWeight:500 }}>
                    {ev.isOnline ? 'Online' : 'In Person'}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* FINAL CTA */}
      <section style={{ background:'#f0f7ff', borderTop:'1px solid #c8e0f9', padding:'40px 16px', textAlign:'center' }}>
        <h2 style={{ fontWeight:700, fontSize:'clamp(1.2rem,3vw,1.6rem)', color:'#1a1a1a', marginBottom:'8px' }}>Ready to Take the Next Step?</h2>
        <p style={{ color:'#555', marginBottom:'20px', maxWidth:'440px', margin:'0 auto 20px', fontSize:'14px', lineHeight:1.6 }}>
          Join thousands of professionals already using IIPA Job Forum to advance their careers across India.
        </p>
        <div style={{ display:'flex', justifyContent:'center', gap:'12px', flexWrap:'wrap' }}>
          <Link to="/register" style={{ background:BLUE, color:'#fff', fontWeight:700, fontSize:'14px', padding:'10px 28px', borderRadius:'20px' }}>Create Free Account</Link>
          <Link to="/jobs" style={{ color:BLUE, fontSize:'14px', fontWeight:600, padding:'10px 28px', border:`1px solid ${BLUE}`, borderRadius:'20px' }}>Browse Jobs</Link>
        </div>
      </section>
    </div>
  );
}
