import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob]           = useState(null);
  const [loading, setLoading]   = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied]   = useState(false);
  const [cover, setCover]       = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError]       = useState('');

  useEffect(() => {
    api.get(`/jobs/${id}`)
      .then(r => setJob(r.data))
      .catch(() => navigate('/jobs'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async e => {
    e.preventDefault();
    if (!user) return navigate('/login');
    setApplying(true); setError('');
    try {
      await api.post('/applications', { jobId: id, coverLetter: cover });
      setApplied(true); setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Application failed');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-400" style={{ fontFamily:'system-ui' }}>Loading...</div>;
  if (!job)    return null;

  const salary = job.salaryMin ? `PKR ${(job.salaryMin/1000).toFixed(0)}k – ${(job.salaryMax/1000).toFixed(0)}k / month` : 'Not disclosed';

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link to="/jobs" className="text-sm text-[#c9a84c] hover:underline mb-6 inline-block" style={{ fontFamily:'system-ui' }}>
        ← Back to Jobs
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div style={{ background:'linear-gradient(135deg,#0a2342,#0d3060)' }} className="p-8 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 style={{ fontFamily:"'Georgia',serif", fontSize:'1.8rem', fontWeight:700, color:'white' }} className="mb-1">
                {job.title}
              </h1>
              <p style={{ fontFamily:'system-ui' }} className="text-gray-300 text-lg">{job.company}</p>
            </div>
            <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full capitalize" style={{ fontFamily:'system-ui' }}>
              {job.type}
            </span>
          </div>
          <div className="flex flex-wrap gap-5 mt-5 text-sm text-gray-300" style={{ fontFamily:'system-ui' }}>
            <span>📍 {job.location || 'Pakistan'}</span>
            <span>💼 {job.category}</span>
            <span>💰 {salary}</span>
            {job.deadline && <span>📅 Deadline: {new Date(job.deadline).toLocaleDateString()}</span>}
          </div>
        </div>

        <div className="p-8">
          {/* Description */}
          <section className="mb-8">
            <h2 style={{ fontFamily:"'Georgia',serif", color:'#0a2342', fontSize:'1.2rem', fontWeight:700 }} className="mb-3">
              About this Role
            </h2>
            <p className="text-gray-600 leading-relaxed" style={{ fontFamily:'system-ui' }}>{job.description}</p>
          </section>

          {job.requirements && (
            <section className="mb-8">
              <h2 style={{ fontFamily:"'Georgia',serif", color:'#0a2342', fontSize:'1.2rem', fontWeight:700 }} className="mb-3">
                Requirements
              </h2>
              <p className="text-gray-600 leading-relaxed" style={{ fontFamily:'system-ui' }}>{job.requirements}</p>
            </section>
          )}

          {/* Apply section */}
          {user?.role === 'seeker' && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              {applied ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700" style={{ fontFamily:'system-ui' }}>
                  ✅ Application submitted successfully!
                </div>
              ) : showForm ? (
                <form onSubmit={handleApply} className="space-y-4">
                  <textarea
                    value={cover}
                    onChange={e => setCover(e.target.value)}
                    placeholder="Cover letter (optional) — tell the employer why you're a great fit..."
                    rows={5}
                    style={{ fontFamily:'system-ui' }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#0a2342] resize-none"
                  />
                  {error && <p className="text-red-500 text-sm" style={{ fontFamily:'system-ui' }}>{error}</p>}
                  <div className="flex gap-3">
                    <button type="submit" disabled={applying}
                      style={{ background:'#0a2342', fontFamily:'system-ui', fontWeight:600 }}
                      className="px-6 py-2.5 rounded-xl text-white text-sm hover:bg-[#0d3060] disabled:opacity-50 transition">
                      {applying ? 'Submitting…' : 'Submit Application'}
                    </button>
                    <button type="button" onClick={() => setShowForm(false)}
                      style={{ fontFamily:'system-ui' }}
                      className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition">
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button onClick={() => setShowForm(true)}
                  style={{ background:'#c9a84c', fontFamily:'system-ui', fontWeight:600 }}
                  className="px-8 py-3 rounded-xl text-[#0a2342] hover:bg-yellow-400 transition shadow-md text-sm">
                  Apply for this Position
                </button>
              )}
            </div>
          )}

          {!user && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <Link to="/login"
                style={{ background:'#c9a84c', fontFamily:'system-ui', fontWeight:600 }}
                className="inline-block px-8 py-3 rounded-xl text-[#0a2342] hover:bg-yellow-400 transition shadow-md text-sm">
                Sign In to Apply
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
