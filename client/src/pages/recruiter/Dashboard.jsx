import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/jobs/my')
      .then(r => setJobs(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalApplicants = jobs.reduce((s, j) => s + (j.applications?.length || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 style={{ fontFamily:"'Georgia',serif", color:'#1a237e', fontWeight:700 }}
            className="text-xl md:text-2xl lg:text-3xl">
            Recruiter Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1" style={{ fontFamily:'system-ui' }}>
            Manage your job postings and applicant pipeline
          </p>
        </div>
        <Link to="/recruiter/post-job"
          style={{ background:'#FF9933', fontFamily:'system-ui', fontWeight:600 }}
          className="self-start sm:self-auto px-5 py-2.5 rounded-xl text-[#1a237e] text-sm hover:bg-orange-400 transition">
          + Post New Job
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-8">
        {[
          { label:'Active Jobs',      value: jobs.filter(j => j.isActive).length, bg:'#e8edf5', color:'#1a237e' },
          { label:'Total Applicants', value: totalApplicants,                      bg:'#fff3e0', color:'#e65100' },
          { label:'Jobs Posted',      value: jobs.length,                          bg:'#e8f5e9', color:'#166534' },
        ].map(s => (
          <div key={s.label} style={{ background: s.bg }} className="rounded-xl p-4 md:p-5 text-center">
            <div style={{ color: s.color, fontFamily:'system-ui', fontWeight:700 }}
              className="text-2xl md:text-3xl">
              {s.value}
            </div>
            <div style={{ color: s.color, fontFamily:'system-ui' }}
              className="text-xs mt-0.5 font-medium leading-tight">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Jobs list */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 md:px-6 py-4 border-b border-gray-100">
          <h2 style={{ fontFamily:"'Georgia',serif", color:'#1a237e', fontWeight:700 }}
            className="text-base md:text-lg">
            My Job Postings
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm" style={{ fontFamily:'system-ui' }}>Loading...</div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-gray-500 mb-4 text-sm" style={{ fontFamily:'system-ui' }}>No job postings yet.</p>
            <Link to="/recruiter/post-job"
              style={{ background:'#1a237e', fontFamily:'system-ui', fontWeight:600 }}
              className="inline-block px-6 py-2.5 rounded-xl text-white text-sm hover:bg-[#283593] transition">
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {jobs.map(job => (
              <div key={job.id} className="px-5 md:px-6 py-4 flex items-center gap-3 hover:bg-gray-50 transition">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#1a237e] text-sm truncate" style={{ fontFamily:'system-ui' }}>
                    {job.title}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5 truncate" style={{ fontFamily:'system-ui' }}>
                    {job.location} · {job.type} · {job.applications?.length || 0} applicant(s)
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`hidden sm:inline-block text-xs px-2 py-0.5 rounded-full ${job.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                    style={{ fontFamily:'system-ui' }}>
                    {job.isActive ? 'Active' : 'Closed'}
                  </span>
                  <Link to={`/recruiter/applicants/${job.id}`}
                    className="text-xs text-[#1a237e] border border-[#1a237e] px-3 py-1.5 rounded-lg hover:bg-[#1a237e] hover:text-white transition whitespace-nowrap"
                    style={{ fontFamily:'system-ui' }}>
                    View Applicants
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
