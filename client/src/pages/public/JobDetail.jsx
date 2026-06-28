import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useSavedJobs } from '../../context/SavedJobsContext';

const BLUE = '#0a66c2';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const savedCtx = useSavedJobs();
  const navigate = useNavigate();
  const [job, setJob]           = useState(null);
  const [loading, setLoading]   = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied]   = useState(false);
  const [cover, setCover]       = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError]       = useState('');

  useEffect(() => {
    api.get(`/jobs/${id}`).then(r => setJob(r.data)).catch(() => navigate('/jobs')).finally(() => setLoading(false));
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
    } finally { setApplying(false); }
  };

  if (loading) return <div style={{ textAlign:'center', padding:'60px', color:'#999' }}>Loading...</div>;
  if (!job)    return null;

  const isSaved = savedCtx?.savedIds?.has(job.id);
  const salary = job.salaryMin ? `₹ ${(job.salaryMin/1000).toFixed(0)}k – ${(job.salaryMax/1000).toFixed(0)}k / month` : 'Not disclosed';
  const inp = { width:'100%', border:'1px solid #ddd', borderRadius:'6px', padding:'10px 12px', fontSize:'14px', outline:'none', boxSizing:'border-box', resize:'none' };

  return (
    <div style={{ maxWidth:'800px', margin:'0 auto', padding:'24px 16px' }}>
      <Link to="/jobs" style={{ fontSize:'13px', color:BLUE, fontWeight:500, display:'inline-block', marginBottom:'16px' }}>← Back to Jobs</Link>

      <div style={{ background:'#fff', borderRadius:'8px', border:'1px solid #e0e0e0', overflow:'hidden' }}>
        {/* Header */}
        <div style={{ background:'linear-gradient(135deg, #062b56 0%, #0a4a8c 100%)', padding:'24px' }}>
          <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'space-between', alignItems:'flex-start', gap:'12px' }}>
            <div style={{ flex:1, minWidth:0 }}>
              <h1 style={{ fontWeight:700, fontSize:'clamp(1.2rem,3vw,1.6rem)', color:'white', lineHeight:1.2, marginBottom:'6px' }}>
                {job.title}
              </h1>
              <p style={{ color:'rgba(255,255,255,0.75)', fontSize:'15px' }}>{job.company}</p>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', flexShrink:0 }}>
              {user?.role === 'seeker' && (
                <button onClick={() => savedCtx?.toggleSave(job.id)} title={isSaved ? 'Unsave job' : 'Save job'}
                  style={{ background:'rgba(255,255,255,0.15)', border:'none', borderRadius:'12px', cursor:'pointer', fontSize:'18px', padding:'4px 10px', lineHeight:1, color: isSaved ? '#FFC766' : '#fff' }}>
                  {isSaved ? '★' : '☆'}
                </button>
              )}
              <span style={{ background:'rgba(255,255,255,0.15)', color:'white', fontSize:'12px', fontWeight:600, padding:'4px 12px', borderRadius:'12px', textTransform:'capitalize', whiteSpace:'nowrap' }}>
                {job.type}
              </span>
            </div>
          </div>
          <div style={{ display:'flex', flexWrap:'wrap', gap:'16px', marginTop:'14px', fontSize:'13px', color:'rgba(255,255,255,0.7)' }}>
            <span>📍 {job.location || 'India'}</span>
            <span>💼 {job.category}</span>
            <span>💰 {salary}</span>
            {job.deadline && <span>📅 Deadline: {new Date(job.deadline).toLocaleDateString('en-IN')}</span>}
          </div>
        </div>

        <div style={{ padding:'24px' }}>
          <section style={{ marginBottom:'24px' }}>
            <h2 style={{ fontWeight:700, fontSize:'16px', color:'#1a1a1a', marginBottom:'10px' }}>About this Role</h2>
            <p style={{ color:'#444', lineHeight:1.7, fontSize:'14px' }}>{job.description}</p>
          </section>

          {job.requirements && (
            <section style={{ marginBottom:'24px' }}>
              <h2 style={{ fontWeight:700, fontSize:'16px', color:'#1a1a1a', marginBottom:'10px' }}>Requirements</h2>
              <p style={{ color:'#444', lineHeight:1.7, fontSize:'14px' }}>{job.requirements}</p>
            </section>
          )}

          <div style={{ borderTop:'1px solid #e8e8e8', paddingTop:'20px' }}>
            {user?.role === 'seeker' && (
              applied ? (
                <div style={{ background:'#e8f5e9', border:'1px solid #c8e6c9', borderRadius:'6px', padding:'14px 16px', color:'#2e7d32', fontSize:'14px' }}>
                  ✅ Application submitted successfully!
                </div>
              ) : showForm ? (
                <form onSubmit={handleApply} style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                  <textarea value={cover} onChange={e => setCover(e.target.value)} rows={5} style={inp}
                    onFocus={e=>e.target.style.borderColor=BLUE} onBlur={e=>e.target.style.borderColor='#ddd'}
                    placeholder="Cover letter (optional) — tell the employer why you're a great fit..." />
                  {error && <p style={{ color:'#c62828', fontSize:'13px' }}>{error}</p>}
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'10px' }}>
                    <button type="submit" disabled={applying}
                      style={{ background:BLUE, color:'#fff', fontWeight:600, fontSize:'14px', padding:'10px 24px', borderRadius:'20px', border:'none', opacity:applying?0.6:1, cursor:applying?'not-allowed':'pointer' }}>
                      {applying ? 'Submitting…' : 'Submit Application'}
                    </button>
                    <button type="button" onClick={() => setShowForm(false)}
                      style={{ color:'#555', fontSize:'14px', padding:'10px 24px', borderRadius:'20px', border:'1px solid #ccc', background:'#fff', cursor:'pointer' }}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button onClick={() => setShowForm(true)}
                  style={{ background:BLUE, color:'#fff', fontWeight:700, fontSize:'14px', padding:'11px 32px', borderRadius:'20px', border:'none', cursor:'pointer' }}>
                  Apply for this Position
                </button>
              )
            )}

            {!user && (
              <Link to="/login"
                style={{ display:'inline-block', background:BLUE, color:'#fff', fontWeight:700, fontSize:'14px', padding:'11px 32px', borderRadius:'20px' }}>
                Sign In to Apply
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
