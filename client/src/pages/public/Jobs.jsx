import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import JobCard from '../../components/JobCard';

const TYPES      = ['full-time','part-time','contract','remote','internship'];
const CATEGORIES = ['Technology','Finance','Human Resources','Marketing','Engineering','Healthcare','Education','Sales'];
const BLUE = '#0a66c2';

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const search   = searchParams.get('search')   || '';
  const category = searchParams.get('category') || '';
  const type     = searchParams.get('type')     || '';
  const location = searchParams.get('location') || '';
  const view     = searchParams.get('view')     || '';

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search)   params.search   = search;
    if (category) params.category = category;
    if (type)     params.type     = type;
    if (location) params.location = location;
    api.get('/jobs', { params }).then(r => setJobs(r.data)).catch(()=>{}).finally(() => setLoading(false));
  }, [search, category, type, location]);

  const groupBy = (key) => {
    const groups = {};
    jobs.forEach(j => {
      const k = j[key] || 'Other';
      (groups[k] = groups[k] || []).push(j);
    });
    return groups;
  };

  const sortedBySalary = [...jobs].sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));

  const set = (key, val) => {
    const p = Object.fromEntries(searchParams);
    if (val) p[key] = val; else delete p[key];
    setSearchParams(p);
  };

  const inp = { width:'100%', border:'1px solid #ddd', borderRadius:'6px', padding:'8px 10px', fontSize:'13px', outline:'none', boxSizing:'border-box' };

  const FilterPanel = () => (
    <div style={{ background:'#fff', borderRadius:'8px', border:'1px solid #e0e0e0', padding:'16px' }}>
      <h3 style={{ fontWeight:700, color:'#1a1a1a', fontSize:'14px', marginBottom:'14px' }}>Filters</h3>
      <div style={{ marginBottom:'16px' }}>
        <input style={inp} placeholder="Search jobs..."
          defaultValue={search}
          onFocus={e=>e.target.style.borderColor=BLUE} onBlur={e=>e.target.style.borderColor='#ddd'}
          onKeyDown={e => e.key==='Enter' && set('search', e.target.value)} />
      </div>
      <div style={{ marginBottom:'16px' }}>
        <p style={{ fontSize:'11px', fontWeight:700, color:'#888', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'8px' }}>Job Type</p>
        {TYPES.map(t => (
          <label key={t} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'4px 0', cursor:'pointer' }}>
            <input type="radio" name="type" checked={type===t} onChange={() => set('type', type===t ? '' : t)}
              style={{ accentColor:BLUE }} />
            <span style={{ fontSize:'13px', color:'#333', textTransform:'capitalize' }}>{t}</span>
          </label>
        ))}
        {type && <button onClick={() => set('type','')} style={{ fontSize:'12px', color:BLUE, background:'none', border:'none', cursor:'pointer', padding:'4px 0' }}>Clear</button>}
      </div>
      <div>
        <p style={{ fontSize:'11px', fontWeight:700, color:'#888', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'8px' }}>Category</p>
        {CATEGORIES.map(c => (
          <label key={c} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'4px 0', cursor:'pointer' }}>
            <input type="radio" name="cat" checked={category===c} onChange={() => set('category', category===c ? '' : c)}
              style={{ accentColor:BLUE }} />
            <span style={{ fontSize:'13px', color:'#333' }}>{c}</span>
          </label>
        ))}
        {category && <button onClick={() => set('category','')} style={{ fontSize:'12px', color:BLUE, background:'none', border:'none', cursor:'pointer', padding:'4px 0' }}>Clear</button>}
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth:'1320px', margin:'0 auto', padding:'24px 16px' }}>
      <div style={{ marginBottom:'20px' }}>
        <h1 style={{ fontWeight:700, color:'#1a1a1a', fontSize:'22px' }}>
          {view === 'location' ? 'Jobs by Location' : view === 'companies' ? 'Jobs by Companies' : view === 'salaries' ? 'Jobs by Salary' : 'Find Your Next Role'}
        </h1>
        <p style={{ color:'#666', fontSize:'13px', marginTop:'4px' }}>{jobs.length} jobs found</p>
      </div>

      {/* Mobile filter toggle */}
      <button onClick={() => setShowFilters(f=>!f)}
        style={{ display:'none', marginBottom:'14px', alignItems:'center', gap:'6px', fontSize:'13px', fontWeight:600, color:BLUE, border:`1px solid ${BLUE}`, padding:'7px 16px', borderRadius:'16px', background:'#fff', cursor:'pointer' }}
        className="mob-filter-btn">
        ⚙ {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>

      <style>{`
        @media(max-width:1023px){ .mob-filter-btn{ display:flex !important; } }
        @media(max-width:1023px){ .desk-filters{ display:none !important; } }
        @media(max-width:1023px){ .mob-filters{ display:block !important; } }
        .mob-filters { display:none; margin-bottom:16px; }
        .jobs-layout { display:flex; gap:20px; }
        .desk-filters { width:224px; flex-shrink:0; }
        .jobs-main { flex:1; min-width:0; }
      `}</style>

      {showFilters && <div className="mob-filters"><FilterPanel /></div>}

      <div className="jobs-layout">
        <aside className="desk-filters"><div style={{ position:'sticky', top:'72px' }}><FilterPanel /></div></aside>
        <main className="jobs-main">
          {loading ? (
            <div style={{ textAlign:'center', padding:'60px 0', color:'#999' }}>Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div style={{ textAlign:'center', padding:'60px 0' }}>
              <div style={{ fontSize:'2.5rem', marginBottom:'10px' }}>🔍</div>
              <p style={{ color:'#666', fontSize:'14px' }}>No jobs match your filters. Try adjusting your search.</p>
            </div>
          ) : view === 'location' ? (
            Object.entries(groupBy('location')).map(([loc, list]) => (
              <div key={loc} style={{ marginBottom:'24px' }}>
                <h3 style={{ fontWeight:700, fontSize:'14px', color:'#1a1a1a', marginBottom:'10px' }}>📍 {loc} <span style={{ color:'#888', fontWeight:500 }}>({list.length})</span></h3>
                <div style={{ display:'grid', gap:'10px' }}>{list.map(job => <JobCard key={job.id} job={job} />)}</div>
              </div>
            ))
          ) : view === 'companies' ? (
            Object.entries(groupBy('company')).map(([comp, list]) => (
              <div key={comp} style={{ marginBottom:'24px' }}>
                <h3 style={{ fontWeight:700, fontSize:'14px', color:'#1a1a1a', marginBottom:'10px' }}>🏢 {comp} <span style={{ color:'#888', fontWeight:500 }}>({list.length})</span></h3>
                <div style={{ display:'grid', gap:'10px' }}>{list.map(job => <JobCard key={job.id} job={job} />)}</div>
              </div>
            ))
          ) : view === 'salaries' ? (
            <div style={{ display:'grid', gap:'10px' }}>
              {sortedBySalary.map(job => <JobCard key={job.id} job={job} />)}
            </div>
          ) : (
            <div style={{ display:'grid', gap:'10px' }}>
              {jobs.map(job => <JobCard key={job.id} job={job} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
