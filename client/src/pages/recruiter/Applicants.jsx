import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const STATUSES   = ['applied','shortlisted','interview','hired','rejected'];
const STATUS_STYLES = {
  applied:     'bg-blue-100 text-blue-700',
  shortlisted: 'bg-yellow-100 text-yellow-700',
  interview:   'bg-purple-100 text-purple-700',
  hired:       'bg-green-100 text-green-700',
  rejected:    'bg-red-100 text-red-700',
};

export default function Applicants() {
  const { jobId } = useParams();
  const navigate   = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [job, setJob]               = useState(null);
  const [loading, setLoading]       = useState(true);
  const [updating, setUpdating]     = useState(null);

  useEffect(() => {
    Promise.all([
      api.get(`/applications/job/${jobId}`),
      api.get(`/jobs/${jobId}`)
    ]).then(([appsRes, jobRes]) => {
      setApplicants(appsRes.data);
      setJob(jobRes.data);
    }).catch(() => navigate('/recruiter/dashboard'))
      .finally(() => setLoading(false));
  }, [jobId]);

  const updateStatus = async (appId, status) => {
    setUpdating(appId);
    try {
      const res = await api.put(`/applications/${appId}/status`, { status });
      setApplicants(prev => prev.map(a => a.id === appId ? { ...a, status: res.data.status } : a));
    } catch {}
    setUpdating(null);
  };

  const pipelineCount = (s) => applicants.filter(a => a.status === s).length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <button onClick={() => navigate('/recruiter/dashboard')}
        className="text-sm text-[#c9a84c] hover:underline mb-6 block" style={{ fontFamily:'system-ui' }}>
        ← Back to Dashboard
      </button>

      {job && (
        <div className="mb-6">
          <h1 style={{ fontFamily:"'Georgia',serif", color:'#0a2342', fontSize:'1.8rem', fontWeight:700 }}>
            {job.title}
          </h1>
          <p className="text-gray-500 text-sm mt-1" style={{ fontFamily:'system-ui' }}>
            {job.company} · {job.location} · {applicants.length} applicant(s)
          </p>
        </div>
      )}

      {/* Pipeline overview */}
      <div className="grid grid-cols-5 gap-3 mb-8">
        {STATUSES.map(s => (
          <div key={s} className={`rounded-xl p-3 text-center ${STATUS_STYLES[s]}`}>
            <div style={{ fontFamily:'system-ui', fontSize:'1.4rem', fontWeight:700 }}>{pipelineCount(s)}</div>
            <div style={{ fontFamily:'system-ui', fontSize:'0.7rem' }} className="capitalize">{s}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 style={{ fontFamily:"'Georgia',serif", color:'#0a2342', fontSize:'1.2rem', fontWeight:700 }}>Applicants</h2>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400" style={{ fontFamily:'system-ui' }}>Loading...</div>
        ) : applicants.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">👥</div>
            <p className="text-gray-500" style={{ fontFamily:'system-ui' }}>No applicants yet for this position.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {applicants.map(app => (
              <div key={app.id} className="px-6 py-5 hover:bg-gray-50 transition">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <div style={{ background:'#0a2342' }}
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {app.seeker?.fullName?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-semibold text-[#0a2342] text-sm" style={{ fontFamily:'system-ui' }}>
                          {app.seeker?.fullName}
                        </p>
                        <p className="text-gray-500 text-xs" style={{ fontFamily:'system-ui' }}>
                          {app.seeker?.email} · {app.seeker?.phone}
                        </p>
                      </div>
                    </div>
                    {app.seeker?.headline && (
                      <p className="text-gray-500 text-xs mt-2 ml-12" style={{ fontFamily:'system-ui' }}>{app.seeker.headline}</p>
                    )}
                    {app.coverLetter && (
                      <p className="text-gray-500 text-xs mt-2 ml-12 leading-relaxed line-clamp-2" style={{ fontFamily:'system-ui' }}>
                        "{app.coverLetter}"
                      </p>
                    )}
                    <p className="text-gray-400 text-xs mt-2 ml-12" style={{ fontFamily:'system-ui' }}>
                      Applied {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[app.status]}`}
                      style={{ fontFamily:'system-ui' }}>
                      {app.status}
                    </span>
                    <select
                      value={app.status}
                      disabled={updating === app.id}
                      onChange={e => updateStatus(app.id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-[#0a2342]"
                      style={{ fontFamily:'system-ui' }}>
                      {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
