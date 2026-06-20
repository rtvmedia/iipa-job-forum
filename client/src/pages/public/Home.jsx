import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const STATS = [
  { value: '2,400+',  label: 'Active Jobs' },
  { value: '850+',    label: 'Companies' },
  { value: '18,000+', label: 'Professionals' },
  { value: '94%',     label: 'Placement Rate' },
];

const CATEGORIES = [
  { name: 'Technology',      icon: '💻', count: 420 },
  { name: 'Finance',         icon: '📊', count: 310 },
  { name: 'Human Resources', icon: '👥', count: 185 },
  { name: 'Marketing',       icon: '📣', count: 260 },
  { name: 'Engineering',     icon: '⚙️',  count: 340 },
  { name: 'Healthcare',      icon: '🏥', count: 215 },
  { name: 'Education',       icon: '🎓', count: 190 },
  { name: 'Sales',           icon: '🤝', count: 275 },
];

export default function Home() {
  const [search, setSearch] = useState('');
  const [jobs, setJobs]     = useState([]);
  const [news, setNews]     = useState([]);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/jobs?limit=6').then(r => setJobs(r.data.slice(0, 6))).catch(() => {});
    api.get('/news').then(r => setNews(r.data.slice(0, 3))).catch(() => {});
    api.get('/events').then(r => setEvents(r.data.slice(0, 4))).catch(() => {});
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    navigate(`/jobs?search=${encodeURIComponent(search)}`);
  };

  return (
    <div>
      <style>{`
        .hero-form { display:flex; flex-wrap:wrap; gap:12px; width:100%; max-width:640px; margin:0 auto; }
        .hero-form input { flex:1 1 220px; min-width:0; }
        .hero-form button { flex:0 0 auto; }
        .stats-grid { display:grid; grid-template-columns:repeat(2,1fr); }
        @media(min-width:640px){ .stats-grid{ grid-template-columns:repeat(4,1fr); } }
        .journey-grid { display:grid; grid-template-columns:1fr; gap:24px; }
        @media(min-width:768px){ .journey-grid{ grid-template-columns:1fr 1fr; } }
        .cat-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:16px; }
        @media(min-width:640px){ .cat-grid{ grid-template-columns:repeat(4,1fr); } }
        .jobs-grid { display:grid; grid-template-columns:1fr; gap:20px; }
        @media(min-width:768px){ .jobs-grid{ grid-template-columns:repeat(2,1fr); } }
        @media(min-width:1024px){ .jobs-grid{ grid-template-columns:repeat(3,1fr); } }
        .news-grid { display:grid; grid-template-columns:1fr; gap:24px; }
        @media(min-width:768px){ .news-grid{ grid-template-columns:repeat(3,1fr); } }
        .events-grid { display:grid; grid-template-columns:1fr; gap:20px; }
        @media(min-width:640px){ .events-grid{ grid-template-columns:repeat(2,1fr); } }
        @media(min-width:1024px){ .events-grid{ grid-template-columns:repeat(4,1fr); } }
        .cta-buttons { display:flex; flex-wrap:wrap; gap:12px; justify-content:center; }
        .tag-row { display:flex; flex-wrap:wrap; gap:8px; justify-content:center; }
        .section-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:32px; }
      `}</style>

      {/* ── HERO ── */}
      <section style={{
        background: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #1a237e 100%)',
        position: 'relative', overflow: 'hidden', color: 'white',
        padding: '80px 16px',
      }}>
        <div style={{ position:'absolute', top:'-80px', right:'-80px', width:'400px', height:'400px', borderRadius:'50%', background:'rgba(255,153,51,0.08)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-60px', left:'-40px', width:'300px', height:'300px', borderRadius:'50%', background:'rgba(19,136,8,0.07)', pointerEvents:'none' }} />

        <div style={{ maxWidth:'960px', margin:'0 auto', textAlign:'center', position:'relative' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,153,51,0.3)', color:'#FF9933', fontSize:'13px', padding:'6px 16px', borderRadius:'999px', marginBottom:'24px' }}>
            <span style={{ width:'6px', height:'6px', background:'#FF9933', borderRadius:'50%', display:'inline-block' }} />
            India's Premier Professional Network
          </div>

          <h1 style={{ fontFamily:"'Georgia', serif", fontWeight:700, lineHeight:1.15, color:'white', fontSize:'clamp(2rem, 5vw, 3.5rem)', marginBottom:'16px' }}>
            Find Your <span style={{ color:'#FF9933' }}>Dream Career</span><br />
            with IIPA Job Forum
          </h1>

          <p style={{ color:'#cbd5e1', fontSize:'clamp(1rem, 2vw, 1.2rem)', maxWidth:'600px', margin:'0 auto 32px', fontFamily:'system-ui', lineHeight:1.6 }}>
            Connecting top talent with leading employers. Discover thousands of opportunities tailored to your skills and ambitions.
          </p>

          <form onSubmit={handleSearch} className="hero-form">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Job title, company, or keyword..."
              style={{ fontFamily:'system-ui', padding:'14px 20px', borderRadius:'12px', border:'none', fontSize:'15px', outline:'none', boxShadow:'0 4px 12px rgba(0,0,0,0.15)', color:'#1e293b' }}
            />
            <button
              type="submit"
              style={{ background:'#FF9933', fontFamily:'system-ui', fontWeight:600, padding:'14px 32px', borderRadius:'12px', border:'none', color:'#1a237e', fontSize:'15px', cursor:'pointer', whiteSpace:'nowrap', boxShadow:'0 4px 12px rgba(0,0,0,0.15)' }}
            >
              Search Jobs
            </button>
          </form>

          <div className="tag-row" style={{ marginTop:'20px' }}>
            {['React Developer', 'HR Manager', 'Data Analyst', 'Marketing Lead', 'Node.js'].map(t => (
              <button key={t} onClick={() => navigate(`/jobs?search=${t}`)}
                style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', padding:'4px 14px', borderRadius:'999px', color:'#e2e8f0', fontSize:'13px', cursor:'pointer', fontFamily:'system-ui' }}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ maxWidth:'900px', margin:'56px auto 0', background:'rgba(255,255,255,0.05)', borderRadius:'16px', border:'1px solid rgba(255,255,255,0.1)', overflow:'hidden' }}>
          {STATS.map(s => (
            <div key={s.label} style={{ padding:'20px', textAlign:'center', background:'rgba(255,255,255,0.03)' }}>
              <div style={{ color:'#FF9933', fontFamily:'system-ui', fontSize:'1.6rem', fontWeight:700 }}>{s.value}</div>
              <div style={{ color:'#94a3b8', fontFamily:'system-ui', fontSize:'13px', marginTop:'4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DUAL JOURNEY CTA ── */}
      <section style={{ maxWidth:'1280px', margin:'0 auto', padding:'64px 16px' }}>
        <div className="journey-grid">
          <div style={{ background:'linear-gradient(135deg,#1a237e,#283593)', borderRadius:'16px', padding:'32px', color:'white', boxShadow:'0 8px 30px rgba(26,35,126,0.3)' }}>
            <div style={{ fontSize:'2rem', marginBottom:'12px' }}>🔍</div>
            <h2 style={{ fontFamily:"'Georgia',serif", fontSize:'1.6rem', fontWeight:700, color:'white', marginBottom:'8px' }}>I'm a Job Seeker</h2>
            <p style={{ color:'#cbd5e1', fontSize:'14px', lineHeight:1.6, fontFamily:'system-ui', marginBottom:'24px' }}>
              Build your profile, discover thousands of opportunities, and track every application in one place.
            </p>
            <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
              <Link to="/register?role=seeker"
                style={{ background:'#FF9933', fontFamily:'system-ui', fontWeight:600, padding:'10px 20px', borderRadius:'10px', color:'#1a237e', fontSize:'14px', textDecoration:'none' }}>
                Create Profile
              </Link>
              <Link to="/jobs"
                style={{ fontFamily:'system-ui', padding:'10px 20px', borderRadius:'10px', border:'1px solid rgba(255,255,255,0.3)', color:'white', fontSize:'14px', textDecoration:'none' }}>
                Browse Jobs
              </Link>
            </div>
          </div>

          <div style={{ background:'linear-gradient(135deg,#0a5c0a,#138808)', borderRadius:'16px', padding:'32px', color:'white', boxShadow:'0 8px 30px rgba(19,136,8,0.3)' }}>
            <div style={{ fontSize:'2rem', marginBottom:'12px' }}>🏢</div>
            <h2 style={{ fontFamily:"'Georgia',serif", fontSize:'1.6rem', fontWeight:700, color:'white', marginBottom:'8px' }}>I'm an Employer</h2>
            <p style={{ color:'#dcfce7', fontSize:'14px', lineHeight:1.6, fontFamily:'system-ui', marginBottom:'24px' }}>
              Post vacancies, review matched candidates, and manage your hiring pipeline with ease.
            </p>
            <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
              <Link to="/register?role=recruiter"
                style={{ background:'#FF9933', fontFamily:'system-ui', fontWeight:600, padding:'10px 20px', borderRadius:'10px', color:'#1a237e', fontSize:'14px', textDecoration:'none' }}>
                Post a Job
              </Link>
              <Link to="/login"
                style={{ fontFamily:'system-ui', padding:'10px 20px', borderRadius:'10px', border:'1px solid rgba(255,255,255,0.4)', color:'white', fontSize:'14px', textDecoration:'none' }}>
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section style={{ background:'white', padding:'64px 16px' }}>
        <div style={{ maxWidth:'1280px', margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'40px' }}>
            <h2 style={{ fontFamily:"'Georgia',serif", color:'#1a237e', fontSize:'clamp(1.5rem,3vw,2rem)', fontWeight:700 }}>Browse by Category</h2>
            <p style={{ color:'#6b7280', marginTop:'8px', fontFamily:'system-ui', fontSize:'15px' }}>Explore opportunities across all industries</p>
          </div>
          <div className="cat-grid">
            {CATEGORIES.map(c => (
              <Link key={c.name} to={`/jobs?category=${encodeURIComponent(c.name)}`}
                style={{ background:'#f9fafb', borderRadius:'12px', padding:'20px', textAlign:'center', border:'1px solid #f1f5f9', textDecoration:'none', display:'block', transition:'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background='#1a237e'; e.currentTarget.querySelector('.cat-name').style.color='white'; e.currentTarget.querySelector('.cat-count').style.color='#fca5a5'; }}
                onMouseLeave={e => { e.currentTarget.style.background='#f9fafb'; e.currentTarget.querySelector('.cat-name').style.color='#1f2937'; e.currentTarget.querySelector('.cat-count').style.color='#9ca3af'; }}>
                <div style={{ fontSize:'2rem', marginBottom:'8px' }}>{c.icon}</div>
                <div className="cat-name" style={{ fontFamily:'system-ui', fontWeight:600, fontSize:'14px', color:'#1f2937' }}>{c.name}</div>
                <div className="cat-count" style={{ fontFamily:'system-ui', fontSize:'12px', color:'#9ca3af', marginTop:'2px' }}>{c.count} jobs</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED JOBS ── */}
      <section style={{ maxWidth:'1280px', margin:'0 auto', padding:'64px 16px' }}>
        <div className="section-header">
          <h2 style={{ fontFamily:"'Georgia',serif", color:'#1a237e', fontSize:'clamp(1.5rem,3vw,2rem)', fontWeight:700 }}>Featured Vacancies</h2>
          <Link to="/jobs" style={{ fontFamily:'system-ui', color:'#FF9933', fontSize:'14px', fontWeight:600, textDecoration:'none' }}>View All →</Link>
        </div>

        {jobs.length === 0 ? (
          <div style={{ textAlign:'center', color:'#9ca3af', padding:'48px 0', fontFamily:'system-ui' }}>
            <div style={{ fontSize:'2.5rem', marginBottom:'12px' }}>📋</div>
            Loading jobs...
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.map(job => (
              <div key={job.id} style={{ background:'white', borderRadius:'12px', border:'1px solid #f1f5f9', boxShadow:'0 1px 4px rgba(0,0,0,0.06)', padding:'20px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'8px', marginBottom:'12px' }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <Link to={`/jobs/${job.id}`} style={{ fontFamily:'system-ui', fontWeight:600, color:'#1a237e', fontSize:'15px', textDecoration:'none', display:'block' }}>
                      {job.title}
                    </Link>
                    <p style={{ fontFamily:'system-ui', color:'#6b7280', fontSize:'13px', marginTop:'2px' }}>{job.company}</p>
                  </div>
                  <span style={{ background:'#fff7ed', color:'#c2410c', fontSize:'12px', padding:'2px 10px', borderRadius:'999px', whiteSpace:'nowrap', fontFamily:'system-ui' }}>
                    {job.type}
                  </span>
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', fontSize:'13px', color:'#6b7280', fontFamily:'system-ui' }}>
                  <span>📍 {job.location}</span>
                  <span>💼 {job.category}</span>
                </div>
                {job.salaryMin && (
                  <p style={{ fontFamily:'system-ui', fontSize:'13px', color:'#138808', fontWeight:600, marginTop:'8px' }}>
                    ₹ {(job.salaryMin/1000).toFixed(0)}k – {(job.salaryMax/1000).toFixed(0)}k / month
                  </p>
                )}
                <Link to={`/jobs/${job.id}`}
                  style={{ marginTop:'12px', display:'inline-block', fontSize:'13px', fontWeight:600, color:'#1a237e', border:'1px solid #1a237e', padding:'6px 14px', borderRadius:'8px', textDecoration:'none', fontFamily:'system-ui' }}>
                  Apply Now
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── NEWS ── */}
      {news.length > 0 && (
        <section style={{ background:'#f8fafc', padding:'64px 16px' }}>
          <div style={{ maxWidth:'1280px', margin:'0 auto' }}>
            <h2 style={{ fontFamily:"'Georgia',serif", color:'#1a237e', fontSize:'clamp(1.5rem,3vw,2rem)', fontWeight:700, marginBottom:'32px' }}>News & Insights</h2>
            <div className="news-grid">
              {news.map(n => (
                <div key={n.id} style={{ background:'white', borderRadius:'12px', border:'1px solid #f1f5f9', boxShadow:'0 1px 4px rgba(0,0,0,0.06)', overflow:'hidden' }}>
                  <div style={{ height:'4px', background:'linear-gradient(to right, #FF9933, #138808)' }} />
                  <div style={{ padding:'20px' }}>
                    <span style={{ fontFamily:'system-ui', fontSize:'12px', background:'rgba(26,35,126,0.08)', color:'#1a237e', padding:'2px 10px', borderRadius:'999px' }}>{n.category}</span>
                    <h3 style={{ fontFamily:"'Georgia',serif", fontWeight:600, color:'#1f2937', marginTop:'10px', fontSize:'15px', lineHeight:1.4 }}>{n.title}</h3>
                    <p style={{ fontFamily:'system-ui', color:'#6b7280', fontSize:'14px', marginTop:'8px', lineHeight:1.6 }}>{n.excerpt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── EVENTS ── */}
      {events.length > 0 && (
        <section style={{ maxWidth:'1280px', margin:'0 auto', padding:'64px 16px' }}>
          <h2 style={{ fontFamily:"'Georgia',serif", color:'#1a237e', fontSize:'clamp(1.5rem,3vw,2rem)', fontWeight:700, marginBottom:'32px' }}>Upcoming Events</h2>
          <div className="events-grid">
            {events.map(ev => (
              <div key={ev.id} style={{ background:'white', borderRadius:'12px', borderLeft:'4px solid #FF9933', boxShadow:'0 1px 4px rgba(0,0,0,0.06)', padding:'20px' }}>
                <div style={{ fontSize:'1.5rem', marginBottom:'8px' }}>{ev.isOnline ? '🌐' : '📍'}</div>
                <h3 style={{ fontFamily:'system-ui', fontWeight:600, color:'#1a237e', fontSize:'14px', lineHeight:1.4 }}>{ev.title}</h3>
                <p style={{ fontFamily:'system-ui', color:'#6b7280', fontSize:'12px', marginTop:'4px' }}>
                  {new Date(ev.eventDate).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                </p>
                <span style={{ marginTop:'8px', display:'inline-block', fontSize:'12px', padding:'2px 10px', borderRadius:'999px', background: ev.isOnline ? '#dcfce7' : '#fff7ed', color: ev.isOnline ? '#166534' : '#c2410c', fontFamily:'system-ui' }}>
                  {ev.isOnline ? 'Online' : 'In Person'}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── FINAL CTA ── */}
      <section style={{ background:'linear-gradient(135deg,#1a237e,#283593)', padding:'64px 16px', textAlign:'center', color:'white' }}>
        <div style={{ display:'flex', justifyContent:'center', gap:'12px', marginBottom:'24px' }}>
          <div style={{ width:'32px', height:'4px', borderRadius:'999px', background:'#FF9933' }} />
          <div style={{ width:'32px', height:'4px', borderRadius:'999px', background:'white' }} />
          <div style={{ width:'32px', height:'4px', borderRadius:'999px', background:'#138808' }} />
        </div>
        <h2 style={{ fontFamily:"'Georgia',serif", fontSize:'clamp(1.5rem,3vw,2.2rem)', fontWeight:700, color:'white', marginBottom:'12px' }}>
          Ready to Take the Next Step?
        </h2>
        <p style={{ color:'#cbd5e1', marginBottom:'32px', maxWidth:'520px', margin:'0 auto 32px', fontFamily:'system-ui', fontSize:'15px' }}>
          Join thousands of professionals already using IIPA Job Forum to advance their careers across India.
        </p>
        <div className="cta-buttons">
          <Link to="/register"
            style={{ background:'#FF9933', fontFamily:'system-ui', fontWeight:600, padding:'12px 32px', borderRadius:'12px', color:'#1a237e', textDecoration:'none', fontSize:'15px', boxShadow:'0 4px 12px rgba(0,0,0,0.2)' }}>
            Create Free Account
          </Link>
          <Link to="/jobs"
            style={{ fontFamily:'system-ui', padding:'12px 32px', borderRadius:'12px', border:'1px solid rgba(255,255,255,0.3)', color:'white', textDecoration:'none', fontSize:'15px' }}>
            Browse Jobs
          </Link>
        </div>
      </section>
    </div>
  );
}
