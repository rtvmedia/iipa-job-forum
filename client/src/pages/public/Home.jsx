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
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>

      {/* ── HERO ── */}
      <section style={{
        background: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #1a237e 100%)',
        position: 'relative', overflow: 'hidden',
      }} className="text-white py-24 px-4">
        {/* saffron decorative circle */}
        <div style={{ position:'absolute', top:'-80px', right:'-80px', width:'400px', height:'400px',
          borderRadius:'50%', background:'rgba(255,153,51,0.08)', pointerEvents:'none' }} />
        {/* green decorative circle */}
        <div style={{ position:'absolute', bottom:'-60px', left:'-40px', width:'300px', height:'300px',
          borderRadius:'50%', background:'rgba(19,136,8,0.07)', pointerEvents:'none' }} />

        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-[#FF9933]/30 text-[#FF9933] text-sm px-4 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-[#FF9933] rounded-full animate-pulse" />
            India's Premier Professional Network
          </div>

          <h1 style={{ fontFamily:"'Georgia', serif", fontWeight:700, lineHeight:1.15 }}
            className="text-4xl md:text-6xl text-white mb-4">
            Find Your <span style={{ color:'#FF9933' }}>Dream Career</span><br />
            with IIPA Job Forum
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10" style={{ fontFamily:'system-ui' }}>
            Connecting top talent with leading employers. Discover thousands of opportunities tailored to your skills and ambitions.
          </p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Job title, company, or keyword..."
              style={{ fontFamily:'system-ui' }}
              className="flex-1 px-5 py-3.5 rounded-xl text-gray-900 text-base outline-none shadow-lg"
            />
            <button
              type="submit"
              style={{ background:'#FF9933', fontFamily:'system-ui', fontWeight:600 }}
              className="px-8 py-3.5 rounded-xl text-[#1a237e] text-base hover:bg-orange-400 transition shadow-lg whitespace-nowrap"
            >
              Search Jobs
            </button>
          </form>

          <div className="flex flex-wrap justify-center gap-2 mt-5 text-sm" style={{ fontFamily:'system-ui' }}>
            {['React Developer', 'HR Manager', 'Data Analyst', 'Marketing Lead', 'Node.js'].map(t => (
              <button key={t} onClick={() => navigate(`/jobs?search=${t}`)}
                className="bg-white/10 border border-white/20 px-3 py-1 rounded-full hover:bg-white/20 transition text-gray-200">
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* stats bar */}
        <div className="max-w-4xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10">
          {STATS.map(s => (
            <div key={s.label} className="bg-white/5 py-5 text-center backdrop-blur-sm">
              <div className="text-2xl font-bold text-[#FF9933]" style={{ fontFamily:'system-ui' }}>{s.value}</div>
              <div className="text-gray-400 text-sm mt-0.5" style={{ fontFamily:'system-ui' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DUAL JOURNEY CTA ── */}
      <section className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-6">
        {/* Job Seeker — India Blue */}
        <div style={{ background:'linear-gradient(135deg,#1a237e,#283593)' }}
          className="rounded-2xl p-8 text-white flex flex-col justify-between min-h-48 shadow-xl">
          <div>
            <div className="text-3xl mb-3">🔍</div>
            <h2 style={{ fontFamily:"'Georgia',serif", fontSize:'1.6rem', fontWeight:700, color:'white' }}>
              I'm a Job Seeker
            </h2>
            <p className="text-gray-300 mt-2 text-sm leading-relaxed" style={{ fontFamily:'system-ui' }}>
              Build your profile, discover thousands of opportunities, and track every application in one place.
            </p>
          </div>
          <div className="flex gap-3 mt-6">
            <Link to="/register?role=seeker"
              style={{ background:'#FF9933', fontFamily:'system-ui', fontWeight:600 }}
              className="px-5 py-2.5 rounded-xl text-[#1a237e] text-sm hover:bg-orange-400 transition">
              Create Profile
            </Link>
            <Link to="/jobs" style={{ fontFamily:'system-ui' }}
              className="px-5 py-2.5 rounded-xl border border-white/30 text-white text-sm hover:bg-white/10 transition">
              Browse Jobs
            </Link>
          </div>
        </div>

        {/* Employer — India Green */}
        <div style={{ background:'linear-gradient(135deg,#0a5c0a,#138808)' }}
          className="rounded-2xl p-8 text-white flex flex-col justify-between min-h-48 shadow-xl">
          <div>
            <div className="text-3xl mb-3">🏢</div>
            <h2 style={{ fontFamily:"'Georgia',serif", fontSize:'1.6rem', fontWeight:700, color:'white' }}>
              I'm an Employer
            </h2>
            <p className="text-green-100 mt-2 text-sm leading-relaxed" style={{ fontFamily:'system-ui' }}>
              Post vacancies, review matched candidates, and manage your hiring pipeline with ease.
            </p>
          </div>
          <div className="flex gap-3 mt-6">
            <Link to="/register?role=recruiter"
              style={{ background:'#FF9933', fontFamily:'system-ui', fontWeight:600 }}
              className="px-5 py-2.5 rounded-xl text-[#1a237e] text-sm hover:bg-orange-400 transition">
              Post a Job
            </Link>
            <Link to="/login" style={{ fontFamily:'system-ui' }}
              className="px-5 py-2.5 rounded-xl border border-white/40 text-white text-sm hover:bg-white/10 transition">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 style={{ fontFamily:"'Georgia',serif", color:'#1a237e', fontSize:'2rem', fontWeight:700 }}>
              Browse by Category
            </h2>
            <p className="text-gray-500 mt-2" style={{ fontFamily:'system-ui' }}>Explore opportunities across all industries</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {CATEGORIES.map(c => (
              <Link key={c.name} to={`/jobs?category=${encodeURIComponent(c.name)}`}
                className="bg-gray-50 hover:bg-[#1a237e] group rounded-xl p-5 text-center border border-gray-100 hover:border-[#1a237e] transition-all duration-200 hover:shadow-md">
                <div className="text-3xl mb-2">{c.icon}</div>
                <div className="font-semibold text-gray-800 group-hover:text-white text-sm transition-colors" style={{ fontFamily:'system-ui' }}>{c.name}</div>
                <div className="text-gray-400 group-hover:text-orange-300 text-xs mt-0.5 transition-colors" style={{ fontFamily:'system-ui' }}>{c.count} jobs</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED JOBS ── */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 style={{ fontFamily:"'Georgia',serif", color:'#1a237e', fontSize:'2rem', fontWeight:700 }}>
            Featured Vacancies
          </h2>
          <Link to="/jobs" style={{ fontFamily:'system-ui', color:'#FF9933' }}
            className="text-sm font-semibold hover:underline">
            View All →
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center text-gray-400 py-12" style={{ fontFamily:'system-ui' }}>
            <div className="text-4xl mb-3">📋</div>
            Loading jobs...
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map(job => (
              <div key={job.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition p-5">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <Link to={`/jobs/${job.id}`}
                      className="font-semibold text-[#1a237e] hover:text-[#FF9933] transition leading-tight block"
                      style={{ fontFamily:'system-ui', fontSize:'0.95rem' }}>
                      {job.title}
                    </Link>
                    <p className="text-gray-500 text-xs mt-0.5" style={{ fontFamily:'system-ui' }}>{job.company}</p>
                  </div>
                  <span className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full whitespace-nowrap" style={{ fontFamily:'system-ui' }}>
                    {job.type}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-gray-500" style={{ fontFamily:'system-ui' }}>
                  <span>📍 {job.location}</span>
                  <span>💼 {job.category}</span>
                </div>
                {job.salaryMin && (
                  <p className="text-xs text-[#138808] font-medium mt-2" style={{ fontFamily:'system-ui' }}>
                    ₹ {(job.salaryMin/1000).toFixed(0)}k – {(job.salaryMax/1000).toFixed(0)}k / month
                  </p>
                )}
                <Link to={`/jobs/${job.id}`}
                  className="mt-3 inline-block text-xs font-semibold text-[#1a237e] border border-[#1a237e] px-3 py-1.5 rounded-lg hover:bg-[#1a237e] hover:text-white transition"
                  style={{ fontFamily:'system-ui' }}>
                  Apply Now
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── NEWS ── */}
      {news.length > 0 && (
        <section className="bg-gray-50 py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 style={{ fontFamily:"'Georgia',serif", color:'#1a237e', fontSize:'2rem', fontWeight:700 }} className="mb-8">
              News & Insights
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {news.map(n => (
                <div key={n.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition">
                  <div className="h-2" style={{ background:'linear-gradient(to right, #FF9933, #138808)' }} />
                  <div className="p-5">
                    <span className="text-xs bg-[#1a237e]/10 text-[#1a237e] px-2 py-0.5 rounded-full" style={{ fontFamily:'system-ui' }}>
                      {n.category}
                    </span>
                    <h3 className="font-semibold text-gray-900 mt-2 leading-tight" style={{ fontFamily:"'Georgia',serif", fontSize:'1rem' }}>
                      {n.title}
                    </h3>
                    <p className="text-gray-500 text-sm mt-2 leading-relaxed line-clamp-3" style={{ fontFamily:'system-ui' }}>
                      {n.excerpt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── EVENTS ── */}
      {events.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 style={{ fontFamily:"'Georgia',serif", color:'#1a237e', fontSize:'2rem', fontWeight:700 }} className="mb-8">
            Upcoming Events
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {events.map(ev => (
              <div key={ev.id} className="bg-white rounded-xl border-l-4 border-[#FF9933] shadow-sm p-5 hover:shadow-md transition">
                <div className="text-2xl mb-2">{ev.isOnline ? '🌐' : '📍'}</div>
                <h3 className="font-semibold text-[#1a237e] text-sm leading-snug" style={{ fontFamily:'system-ui' }}>{ev.title}</h3>
                <p className="text-gray-500 text-xs mt-1" style={{ fontFamily:'system-ui' }}>
                  {new Date(ev.eventDate).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                </p>
                <p className="text-gray-400 text-xs mt-0.5" style={{ fontFamily:'system-ui' }}>{ev.location}</p>
                <span className={`mt-2 inline-block text-xs px-2 py-0.5 rounded-full ${ev.isOnline ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}
                  style={{ fontFamily:'system-ui' }}>
                  {ev.isOnline ? 'Online' : 'In Person'}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── FINAL CTA ── */}
      <section style={{ background:'linear-gradient(135deg,#1a237e,#283593)' }} className="py-16 px-4 text-center text-white">
        {/* tricolor stripe */}
        <div className="flex justify-center gap-3 mb-6">
          <div className="w-8 h-1 rounded-full bg-[#FF9933]" />
          <div className="w-8 h-1 rounded-full bg-white" />
          <div className="w-8 h-1 rounded-full bg-[#138808]" />
        </div>
        <h2 style={{ fontFamily:"'Georgia',serif", fontSize:'2.2rem', fontWeight:700, color:'white' }} className="mb-3">
          Ready to Take the Next Step?
        </h2>
        <p className="text-gray-300 mb-8 max-w-xl mx-auto" style={{ fontFamily:'system-ui' }}>
          Join thousands of professionals already using IIPA Job Forum to advance their careers across India.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/register"
            style={{ background:'#FF9933', fontFamily:'system-ui', fontWeight:600 }}
            className="px-8 py-3 rounded-xl text-[#1a237e] hover:bg-orange-400 transition shadow-lg">
            Create Free Account
          </Link>
          <Link to="/jobs"
            style={{ fontFamily:'system-ui' }}
            className="px-8 py-3 rounded-xl border border-white/30 text-white hover:bg-white/10 transition">
            Browse Jobs
          </Link>
        </div>
      </section>
    </div>
  );
}
