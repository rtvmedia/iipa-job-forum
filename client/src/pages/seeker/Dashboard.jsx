import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const STATUS_STYLES = {
  applied:     'bg-blue-100 text-blue-700',
  shortlisted: 'bg-yellow-100 text-yellow-700',
  interview:   'bg-purple-100 text-purple-700',
  hired:       'bg-green-100 text-green-700',
  rejected:    'bg-red-100 text-red-700',
};

export default function SeekerDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications/my')
      .then(r => setApplications(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    total:       applications.length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    interview:   applications.filter(a => a.status === 'interview').length,
    hired:       applications.filter(a => a.status === 'hired').length,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 style={{ fontFamily:"'Georgia',serif", color:'#0a2342', fontSize:'1.8rem', fontWeight:700 }}>
            Welcome back, {user?.fullName?.split(' ')[0]}!
          </h1>
          <p className="text-gray-500 text-sm mt-1" style={{ fontFamily:'system-ui' }}>Track your job applications and career progress</p>
        </div>
        <div className="flex gap-3">
          <Link to="/jobs"
            style={{ background:'#c9a84c', fontFamily:'system-ui', fontWeight:600 }}
            className="px-5 py-2.5 rounded-xl text-[#0a2342] text-sm hover:bg-yellow-400 transition">
            🔍 Find Jobs
          </Link>
          <Link to="/seeker/profile"
            style={{ fontFamily:'system-ui' }}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-sm hover:bg-gray-50 transition">
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label:'Total Applied',  value: counts.total,       color:'#0a2342', bg:'#e8edf5' },
          { label:'Shortlisted',    value: counts.shortlisted, color:'#92700a', bg:'#fef9e7' },
          { label:'Interview',      value: counts.interview,   color:'#6b21a8', bg:'#f3e8ff' },
          { label:'Hired',          value: counts.hired,       color:'#166534', bg:'#dcfce7' },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg }} className="rounded-xl p-5 text-center">
            <div style={{ color: s.color, fontFamily:'system-ui', fontSize:'2rem', fontWeight:700 }}>{s.value}</div>
            <div style={{ color: s.color, fontFamily:'system-ui', fontSize:'0.75rem' }} className="mt-0.5 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 style={{ fontFamily:"'Georgia',serif", color:'#0a2342', fontSize:'1.2rem', fontWeight:700 }}>
            My Applications
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400" style={{ fontFamily:'system-ui' }}>Loading...</div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-gray-500 mb-4" style={{ fontFamily:'system-ui' }}>You haven't applied to any jobs yet.</p>
            <Link to="/jobs" style={{ background:'#0a2342', fontFamily:'system-ui', fontWeight:600 }}
              className="inline-block px-6 py-2.5 rounded-xl text-white text-sm hover:bg-[#0d3060] transition">
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {applications.map(app => (
              <div key={app.id} className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition">
                <div className="flex-1 min-w-0">
                  <Link to={`/jobs/${app.jobId}`}
                    className="font-semibold text-[#0a2342] hover:text-[#c9a84c] transition text-sm block truncate"
                    style={{ fontFamily:'system-ui' }}>
                    {app.job?.title}
                  </Link>
                  <p className="text-gray-500 text-xs mt-0.5" style={{ fontFamily:'system-ui' }}>
                    {app.job?.company} · {app.job?.location}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5" style={{ fontFamily:'system-ui' }}>
                    Applied {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize whitespace-nowrap ${STATUS_STYLES[app.status] || 'bg-gray-100 text-gray-600'}`}
                  style={{ fontFamily:'system-ui' }}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
