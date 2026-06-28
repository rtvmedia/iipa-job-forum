import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import {
  CpuChipIcon, BanknotesIcon, UserGroupIcon, MegaphoneIcon,
  WrenchScrewdriverIcon, HeartIcon, AcademicCapIcon, ChartBarIcon,
  MagnifyingGlassIcon, BuildingOffice2Icon, MapPinIcon,
} from '@heroicons/react/24/outline';

const CATEGORIES = [
  { name:'Technology',      Icon:CpuChipIcon },
  { name:'Finance',         Icon:BanknotesIcon },
  { name:'Human Resources', Icon:UserGroupIcon },
  { name:'Marketing',       Icon:MegaphoneIcon },
  { name:'Engineering',     Icon:WrenchScrewdriverIcon },
  { name:'Healthcare',      Icon:HeartIcon },
  { name:'Education',       Icon:AcademicCapIcon },
  { name:'Sales',           Icon:ChartBarIcon },
];

const LOCATIONS = [
  { country:'India', cities:['Mumbai','Delhi','Bangalore','Hyderabad','Chennai','Pune','Kolkata'] },
  { country:'Saudi Arabia', cities:['Riyadh','Jeddah','Dammam','Khobar','Mecca','Medina','Jubail','Eastern Province'] },
  { country:'UAE', cities:['Dubai','Abu Dhabi','Sharjah','Ajman'] },
  { country:'Qatar', cities:['Doha'] },
  { country:'Kuwait', cities:['Kuwait City'] },
  { country:'Oman', cities:['Muscat'] },
  { country:'Bahrain', cities:['Manama'] },
];

const W = '1320px';
const BLUE = '#0a66c2';
const BLUE_DARK = '#004182';

function LocationDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef(null);

  useEffect(() => {
    const onClick = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = LOCATIONS.map(g => ({
    country: g.country,
    cities: g.cities.filter(c => !q || c.toLowerCase().includes(q) || g.country.toLowerCase().includes(q)),
  })).filter(g => !q || g.country.toLowerCase().includes(q) || g.cities.length > 0);

  return (
    <div ref={ref} style={{ position:'relative', flex:'1 1 200px', minWidth:0 }}>
      <button type="button" onClick={() => setOpen(o => !o)}
        style={{ width:'100%', display:'flex', alignItems:'center', gap:'6px', padding:'13px 14px', border:'none', borderRadius:'6px', background:'#f3f5f8', fontSize:'14px', color: value ? '#1a1a1a' : '#888', cursor:'pointer', textAlign:'left' }}>
        <MapPinIcon style={{ width:'17px', height:'17px', flexShrink:0, color:'#888' }} />
        <span style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{value || 'Any Location'}</span>
      </button>
      {open && (
        <div style={{ position:'absolute', top:'46px', left:0, right:0, background:'#fff', borderRadius:'10px', boxShadow:'0 12px 30px rgba(0,0,0,0.25)', zIndex:90, maxHeight:'320px', overflowY:'auto', textAlign:'left' }}>
          <div style={{ padding:'10px' }}>
            <input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Search country or city..."
              style={{ width:'100%', border:'1px solid #ddd', borderRadius:'6px', padding:'8px 10px', fontSize:'13px', outline:'none', boxSizing:'border-box' }} />
          </div>
          <div onClick={() => { onChange(''); setOpen(false); setQuery(''); }}
            style={{ padding:'8px 14px', fontSize:'13.5px', fontWeight:600, color:BLUE, cursor:'pointer' }}>Any Location</div>
          {filtered.map(g => (
            <div key={g.country}>
              <div onClick={() => { onChange(g.country); setOpen(false); setQuery(''); }}
                style={{ padding:'8px 14px', fontSize:'13.5px', fontWeight:700, color:'#1a1a1a', cursor:'pointer', background:'#f8f9fb' }}>
                {g.country}
              </div>
              {g.cities.map(c => (
                <div key={c} onClick={() => { onChange(`${g.country} - ${c}`); setOpen(false); setQuery(''); }}
                  style={{ padding:'7px 14px 7px 26px', fontSize:'13px', color:'#444', cursor:'pointer' }}
                  onMouseEnter={e=>e.currentTarget.style.background='#f0f4fb'} onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                  {g.country} · {c}
                </div>
              ))}
            </div>
          ))}
          {filtered.length === 0 && <p style={{ padding:'12px', fontSize:'13px', color:'#999' }}>No matches.</p>}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [search, setSearch]     = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs]         = useState([]);
  const [allJobs, setAllJobs]   = useState([]);
  const [news, setNews]         = useState([]);
  const [events, setEvents]     = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/jobs').then(r => { setAllJobs(r.data); setJobs(r.data.slice(0,6)); }).catch(()=>{});
    api.get('/news').then(r => setNews(r.data.slice(0,3))).catch(()=>{});
    api.get('/events').then(r => setEvents(r.data.slice(0,4))).catch(()=>{});
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (location) params.set('location', location.includes(' - ') ? location.split(' - ')[1].trim() : location);
    navigate(`/jobs?${params.toString()}`);
  };

  const activeJobs = allJobs.length;
  const companies  = new Set(allJobs.map(j => j.company)).size;
  const categoryCounts = CATEGORIES.map(c => ({
    ...c,
    count: allJobs.filter(j => (j.category || '').toLowerCase() === c.name.toLowerCase()).length,
  }));

  const STATS = [
    { value: activeJobs ? `${activeJobs}+` : '0', label:'Active Jobs' },
    { value: companies  ? `${companies}+`  : '0', label:'Companies' },
    { value:'18,000+', label:'Professionals' },
    { value:'94%',     label:'Placement Rate' },
  ];

  return (
    <div>
      <style>{`
        .h-form {
          display:flex; flex-wrap:wrap; gap:8px; max-width:680px; margin:0 auto;
          background:#fff; padding:8px; border-radius:10px;
          box-shadow:0 8px 28px rgba(0,0,0,0.25), 0 0 0 3px rgba(255,153,51,0.35);
        }
        .h-form input { flex:1 1 200px; min-width:0; padding:13px 16px; border-radius:6px; border:none; font-size:14px; outline:none; background:#f3f5f8; }
        .h-form button { flex:0 0 auto; padding:13px 26px; background:linear-gradient(135deg, #FF9933, #e07b00); color:#fff; font-weight:700; font-size:14px; border:none; border-radius:6px; cursor:pointer; white-space:nowrap; box-shadow:0 4px 10px rgba(224,123,0,0.35); }
        .h-form button:hover { background:linear-gradient(135deg, #e07b00, #c66800); }
        .h-tags { display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin-top:14px; }
        .h-tags button { background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.3); color:rgba(255,255,255,0.9); font-size:12px; padding:4px 12px; border-radius:12px; cursor:pointer; }
        .strip-badge {
          display:inline-block; background:linear-gradient(90deg, #FF9933 0%, #ffffff 50%, #138808 100%);
          color:#0a1f44; font-weight:800; font-size:12px; letter-spacing:0.1em; padding:6px 18px;
          border-radius:20px; margin-bottom:14px; box-shadow:0 4px 14px rgba(0,0,0,0.25);
        }
        .stats-bar { display:grid; grid-template-columns:repeat(2,1fr); max-width:760px; margin:36px auto 0; background:rgba(255,255,255,0.1); border-radius:8px; overflow:hidden; border:1px solid rgba(255,255,255,0.15); }
        @media(min-width:600px){ .stats-bar{ grid-template-columns:repeat(4,1fr); } }
        .hero-layout { display:grid; grid-template-columns:1fr; gap:20px; align-items:stretch; }
        @media(min-width:920px){ .hero-layout{ grid-template-columns:260px 1fr 260px; } }
        .hero-side-card {
          position:relative; display:flex; flex-direction:column; text-align:left; cursor:pointer; overflow:hidden;
          border-radius:20px; padding:26px; min-height:300px;
          box-shadow:0 14px 34px rgba(0,0,0,0.22);
          transition:transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hero-side-card:hover { transform:translateY(-6px); box-shadow:0 20px 44px rgba(0,0,0,0.3); }
        .hero-side-card.seeker { background:linear-gradient(160deg, #0d9488 0%, #0f766e 60%, #115e59 100%); }
        .hero-side-card.employer { background:linear-gradient(160deg, #f59e0b 0%, #d97706 60%, #b45309 100%); }
        .hero-icon-badge { width:52px; height:52px; border-radius:14px; background:rgba(255,255,255,0.18); display:flex; align-items:center; justify-content:center; margin-bottom:14px; }
        .hero-stat-chip { display:inline-flex; align-items:center; gap:6px; background:rgba(255,255,255,0.16); border-radius:10px; padding:8px 12px; font-size:12px; color:#fff; font-weight:600; margin-top:auto; }
        .cat-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; }
        @media(min-width:480px){ .cat-grid{ grid-template-columns:repeat(3,1fr); } }
        @media(min-width:768px){ .cat-grid{ grid-template-columns:repeat(4,1fr); } }
        .jobs-grid { display:grid; grid-template-columns:1fr; gap:14px; }
        @media(min-width:640px){ .jobs-grid{ grid-template-columns:repeat(2,1fr); } }
        @media(min-width:1024px){ .jobs-grid{ grid-template-columns:repeat(3,1fr); } }
        .news-grid { display:grid; grid-template-columns:1fr; gap:14px; }
        @media(min-width:768px){ .news-grid{ grid-template-columns:repeat(3,1fr); } }
        .events-grid { display:grid; grid-template-columns:1fr; gap:12px; }
        @media(min-width:480px){ .events-grid{ grid-template-columns:repeat(2,1fr); } }
        @media(min-width:1024px){ .events-grid{ grid-template-columns:repeat(4,1fr); } }

        .cat-card {
          background:linear-gradient(160deg, #ffffff 0%, #f3f8ff 100%);
          border-radius:12px; padding:20px 12px; text-align:center; display:block;
          border:1px solid #dbe8fb; box-shadow:0 4px 14px rgba(10,102,194,0.08);
          transition:transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
        }
        .cat-card:hover { transform:translateY(-4px); border-color:${BLUE}; box-shadow:0 10px 24px rgba(10,102,194,0.22); }
        .cat-card:hover .cat-name { color:${BLUE} !important; }
        .cat-icon-wrap { width:44px; height:44px; border-radius:12px; background:#eaf2fe; display:flex; align-items:center; justify-content:center; margin:0 auto 8px; transition:background 0.18s; }
        .cat-card:hover .cat-icon-wrap { background:${BLUE}; }
        .cat-card:hover .cat-icon-wrap svg { color:#fff !important; }

        .job-card {
          background:linear-gradient(160deg, #ffffff 0%, #f6f9ff 100%);
          border-radius:12px; border:1px solid #dbe8fb; padding:18px;
          box-shadow:0 4px 14px rgba(10,102,194,0.08);
          transition:transform 0.18s ease, box-shadow 0.18s ease;
        }
        .job-card:hover { transform:translateY(-4px); box-shadow:0 12px 26px rgba(10,102,194,0.2); border-color:${BLUE}; }

        .apply-btn { display:inline-block; font-size:13px; font-weight:600; color:${BLUE}; border:1px solid ${BLUE}; padding:5px 16px; border-radius:16px; transition:all 0.15s; }
        .apply-btn:hover { background:${BLUE}; color:#fff; }
        .section-divider { border:none; border-top:1px solid #e0e0e0; margin:0; }

        .news-card {
          background:linear-gradient(160deg, #ffffff 0%, #f6f9ff 100%);
          border-radius:12px; border:1px solid #dbe8fb; overflow:hidden;
          box-shadow:0 4px 14px rgba(10,102,194,0.08);
          transition:transform 0.18s ease, box-shadow 0.18s ease;
        }
        .news-card:hover { transform:translateY(-4px); box-shadow:0 12px 26px rgba(10,102,194,0.2); }

        .event-card {
          background:linear-gradient(160deg, #ffffff 0%, #f6f9ff 100%);
          border-radius:12px; border:1px solid #dbe8fb; padding:16px;
          box-shadow:0 4px 14px rgba(10,102,194,0.08);
          transition:transform 0.18s ease, box-shadow 0.18s ease;
        }
        .event-card:hover { transform:translateY(-4px); box-shadow:0 12px 26px rgba(10,102,194,0.2); }
      `}</style>

      {/* HERO */}
      <section style={{ background:'linear-gradient(135deg, #062b56 0%, #0a4a8c 60%, #0f5fb5 100%)', padding:'44px 16px 44px' }}>
        <div style={{ maxWidth:W, margin:'0 auto' }}>
          <div className="hero-layout">

            {/* Job Seeker card */}
            <div className="hero-side-card seeker" onClick={() => navigate('/jobs')} role="button" tabIndex={0}>
              <div className="hero-icon-badge"><MagnifyingGlassIcon style={{ width:'26px', height:'26px', color:'#fff' }} /></div>
              <h2 style={{ fontWeight:700, fontSize:'18px', color:'#fff', marginBottom:'8px' }}>I'm a Job Seeker</h2>
              <p style={{ color:'rgba(255,255,255,0.85)', fontSize:'13px', lineHeight:1.6, marginBottom:'16px' }}>Build your profile, discover thousands of opportunities, and track every application — all in one place.</p>
              <span className="hero-stat-chip">👥 {activeJobs ? `${activeJobs}+` : ''} roles open now</span>
            </div>

            {/* Center content */}
            <div style={{ textAlign:'center' }}>
              <span className="strip-badge">STAFFING AND CAREER SOLUTIONS</span>
              <h1 style={{ fontSize:'clamp(1.4rem, 3vw, 2rem)', fontWeight:700, color:'white', lineHeight:1.3, marginBottom:'22px' }}>
                Connecting Professionals to the Right Opportunities
              </h1>
              <form onSubmit={handleSearch} className="h-form">
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Job title, company, or keyword..." />
                <LocationDropdown value={location} onChange={setLocation} />
                <button type="submit">Search Jobs</button>
              </form>
              <div className="h-tags">
                {['React Developer','HR Manager','Data Analyst','Marketing Lead','Node.js'].map(t => (
                  <button key={t} onClick={() => navigate(`/jobs?search=${t}`)}>{t}</button>
                ))}
              </div>
            </div>

            {/* Employer card */}
            <div className="hero-side-card employer" onClick={() => navigate('/employers')} role="button" tabIndex={0}>
              <div className="hero-icon-badge"><BuildingOffice2Icon style={{ width:'26px', height:'26px', color:'#fff' }} /></div>
              <h2 style={{ fontWeight:700, fontSize:'18px', color:'#fff', marginBottom:'8px' }}>I'm an Employer</h2>
              <p style={{ color:'rgba(255,255,255,0.9)', fontSize:'13px', lineHeight:1.6, marginBottom:'16px' }}>Post vacancies, review matched candidates, and manage your full hiring pipeline with ease.</p>
              <span className="hero-stat-chip">🏢 {companies ? `${companies}+` : ''} companies hiring</span>
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
        </div>
      </section>

      <hr className="section-divider" />

      {/* CATEGORIES */}
      <section style={{ background:'#fff', padding:'28px 16px' }}>
        <div style={{ maxWidth:W, margin:'0 auto' }}>
          <h2 style={{ fontWeight:700, fontSize:'17px', color:'#1a1a1a', marginBottom:'4px' }}>Browse by Category</h2>
          <p style={{ color:'#666', fontSize:'13px', marginBottom:'16px' }}>Explore opportunities across all industries</p>
          <div className="cat-grid">
            {categoryCounts.map(c => (
              <Link key={c.name} to={`/jobs?category=${encodeURIComponent(c.name)}`} className="cat-card">
                <div className="cat-icon-wrap"><c.Icon style={{ width:'22px', height:'22px', color:BLUE }} /></div>
                <div className="cat-name" style={{ fontWeight:600, fontSize:'13px', color:'#1a1a1a' }}>{c.name}</div>
                <div style={{ fontSize:'12px', color:'#888', marginTop:'2px' }}>{c.count} jobs</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* CURRENT ENQUIRIES */}
      <section style={{ maxWidth:W, margin:'0 auto', padding:'28px 16px' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px' }}>
          <h2 style={{ fontWeight:700, fontSize:'17px', color:'#1a1a1a' }}>Current Enquiries</h2>
          <Link to="/jobs" style={{ color:BLUE, fontSize:'13px', fontWeight:600 }}>View All →</Link>
        </div>
        {jobs.length === 0 ? (
          <div style={{ textAlign:'center', color:'#999', padding:'40px 0' }}>
            <div style={{ fontSize:'2rem', marginBottom:'8px' }}>📋</div>
            No jobs posted yet.
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
                  <div key={n.id} className="news-card">
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
                <div key={ev.id} className="event-card" style={{ borderLeft:`3px solid ${BLUE}` }}>
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
    </div>
  );
}
