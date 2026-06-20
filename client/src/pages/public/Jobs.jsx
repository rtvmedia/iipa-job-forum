import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../api/axios';
import JobCard from '../../components/JobCard';

const TYPES      = ['full-time','part-time','contract','remote','internship'];
const CATEGORIES = ['Technology','Finance','Human Resources','Marketing','Engineering','Healthcare','Education','Sales'];

export default function Jobs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const search   = searchParams.get('search')   || '';
  const category = searchParams.get('category') || '';
  const type     = searchParams.get('type')     || '';

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search)   params.search   = search;
    if (category) params.category = category;
    if (type)     params.type     = type;
    api.get('/jobs', { params })
      .then(r => setJobs(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, category, type]);

  const set = (key, val) => {
    const p = Object.fromEntries(searchParams);
    if (val) p[key] = val; else delete p[key];
    setSearchParams(p);
  };

  const FilterPanel = () => (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <h3 className="font-semibold text-[#1a237e] mb-4 text-sm" style={{ fontFamily:'system-ui' }}>Filters</h3>

      <div className="mb-5">
        <input
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#1a237e] transition"
          style={{ fontFamily:'system-ui' }}
          placeholder="Search jobs..."
          defaultValue={search}
          onKeyDown={e => e.key === 'Enter' && set('search', e.target.value)}
        />
      </div>

      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2" style={{ fontFamily:'system-ui' }}>Job Type</p>
        {TYPES.map(t => (
          <label key={t} className="flex items-center gap-2 py-1 cursor-pointer">
            <input type="radio" name="type" checked={type===t} onChange={() => set('type', type===t ? '' : t)}
              className="accent-[#1a237e]" />
            <span className="text-sm text-gray-700 capitalize" style={{ fontFamily:'system-ui' }}>{t}</span>
          </label>
        ))}
        {type && (
          <button onClick={() => set('type','')} className="text-xs text-[#FF9933] mt-1 hover:underline" style={{ fontFamily:'system-ui' }}>
            Clear
          </button>
        )}
      </div>

      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2" style={{ fontFamily:'system-ui' }}>Category</p>
        {CATEGORIES.map(c => (
          <label key={c} className="flex items-center gap-2 py-1 cursor-pointer">
            <input type="radio" name="cat" checked={category===c} onChange={() => set('category', category===c ? '' : c)}
              className="accent-[#1a237e]" />
            <span className="text-sm text-gray-700" style={{ fontFamily:'system-ui' }}>{c}</span>
          </label>
        ))}
        {category && (
          <button onClick={() => set('category','')} className="text-xs text-[#FF9933] mt-1 hover:underline" style={{ fontFamily:'system-ui' }}>
            Clear
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-10">
      {/* Page header */}
      <div className="mb-6">
        <h1 style={{ fontFamily:"'Georgia',serif", color:'#1a237e', fontWeight:700 }}
          className="text-2xl md:text-3xl">
          Find Your Next Role
        </h1>
        <p className="text-gray-500 mt-1 text-sm" style={{ fontFamily:'system-ui' }}>{jobs.length} jobs found</p>
      </div>

      {/* Mobile filter toggle */}
      <button
        onClick={() => setShowFilters(f => !f)}
        className="lg:hidden mb-4 flex items-center gap-2 text-sm font-semibold text-[#1a237e] border border-[#1a237e] px-4 py-2 rounded-lg hover:bg-[#1a237e] hover:text-white transition"
        style={{ fontFamily:'system-ui' }}
      >
        <span>⚙</span>
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>

      {/* Mobile filters (collapsible) */}
      {showFilters && (
        <div className="lg:hidden mb-6">
          <FilterPanel />
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Desktop sidebar filters */}
        <aside className="hidden lg:block lg:w-64 shrink-0">
          <div className="sticky top-20">
            <FilterPanel />
          </div>
        </aside>

        {/* Job list */}
        <main className="flex-1 min-w-0">
          {loading ? (
            <div className="text-center py-20 text-gray-400" style={{ fontFamily:'system-ui' }}>Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-gray-500 text-sm" style={{ fontFamily:'system-ui' }}>No jobs match your search. Try adjusting the filters.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {jobs.map(job => <JobCard key={job.id} job={job} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
