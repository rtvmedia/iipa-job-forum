import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useSavedJobs } from '../../context/SavedJobsContext';

const BLUE = '#0a66c2';

const STATUS_STYLES = {
  applied:     { bg:'#e8f1fb', color:'#0a66c2' },
  shortlisted: { bg:'#fff8e1', color:'#b45309' },
  interview:   { bg:'#f3e8ff', color:'#6b21a8' },
  hired:       { bg:'#e8f5e9', color:'#057642' },
  rejected:    { bg:'#fce8e8', color:'#b91c1c' },
};

export default function SeekerDashboard() {
  const { user } = useAuth();
  const savedCtx = useSavedJobs();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    api.get('/auth/profile').then(r => setProfile(r.data)).catch(() => {});
    api.get('/applications/my').then(r => setApplications(r.data)).catch(()=>{}).finally(() => setLoading(false));
    api.get('/jobs').then(r => setMatches(r.data)).catch(() => {});
  }, []);

  const handleAvatarUpload = async (file) => {
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const form = new FormData();
      form.append('avatar', file);
      const { data } = await api.post('/seeker/avatar', form);
      setProfile(p => ({ ...p, avatarUrl: data.avatarUrl }));
    } finally { setUploadingAvatar(false); }
  };

  const counts = {
    total:       applications.length,
    shortlisted: applications.filter(a => a.status==='shortlisted').length,
    interview:   applications.filter(a => a.status==='interview').length,
    hired:       applications.filter(a => a.status==='hired').length,
  };

  // Top Job Matches: prefer jobs matching desired title / skills, fallback to most recent
  const skillWords = (profile?.skills || '').toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
  const desired = (profile?.desiredJobTitle || profile?.currentJobTitle || '').toLowerCase();
  const scored = matches.map(j => {
    const haystack = `${j.title} ${j.category}`.toLowerCase();
    let score = 0;
    if (desired && haystack.includes(desired)) score += 2;
    skillWords.forEach(s => { if (s && haystack.includes(s)) score += 1; });
    return { job: j, score };
  }).sort((a, b) => b.score - a.score);
  const topMatches = (scored.some(s => s.score > 0) ? scored.filter(s => s.score > 0) : scored).slice(0, 4).map(s => s.job);

  const initials = (profile?.fullName || user?.fullName || 'U').split(' ').map(p => p[0]).join('').slice(0,2).toUpperCase();

  return (
    <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'24px 16px' }}>
      <style>{`
        .dash-layout { display:grid; grid-template-columns:1fr; gap:20px; }
        @media(min-width:860px){ .dash-layout{ grid-template-columns:280px 1fr; align-items:start; } }
        .activity-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; }
        @media(min-width:600px){ .activity-grid{ grid-template-columns:repeat(4,1fr); } }
        .matches-grid { display:grid; grid-template-columns:1fr; gap:10px; }
        @media(min-width:640px){ .matches-grid{ grid-template-columns:repeat(2,1fr); } }
      `}</style>

      <div className="dash-layout">
        {/* LEFT: Profile sidebar */}
        <div style={{ background:'#fff', borderRadius:'8px', border:'1px solid #e0e0e0', padding:'20px', position:'sticky', top:'96px' }}>
          <div style={{ textAlign:'center', marginBottom:'14px' }}>
            <label style={{ position:'relative', display:'inline-block', cursor:'pointer' }} title="Click to upload a photo">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt="Avatar" style={{ width:'88px', height:'88px', borderRadius:'50%', objectFit:'cover', border:`3px solid ${BLUE}` }} />
              ) : (
                <div style={{ width:'88px', height:'88px', borderRadius:'50%', background:BLUE, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'28px', margin:'0 auto', border:`3px solid ${BLUE}` }}>
                  {initials}
                </div>
              )}
              <span style={{ position:'absolute', bottom:0, right:0, background:'#fff', borderRadius:'50%', width:'26px', height:'26px', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 1px 4px rgba(0,0,0,0.3)', fontSize:'13px' }}>
                {uploadingAvatar ? '⏳' : '📷'}
              </span>
              <input type="file" accept="image/*" style={{ display:'none' }} onChange={e => handleAvatarUpload(e.target.files[0])} />
            </label>

            <h1 style={{ fontWeight:700, color:'#1a1a1a', fontSize:'17px', marginTop:'12px' }}>{profile?.fullName || user?.fullName}</h1>
            <p style={{ color:'#666', fontSize:'13px', marginTop:'2px' }}>{profile?.headline || 'Add a professional title'}</p>

            <Link to="/seeker/profile" style={{ display:'inline-block', marginTop:'12px', background:BLUE, color:'#fff', fontWeight:600, fontSize:'13px', padding:'8px 20px', borderRadius:'16px' }}>
              Edit My CV
            </Link>
          </div>

          <div style={{ borderTop:'1px solid #eee', paddingTop:'12px', display:'flex', flexDirection:'column', gap:'8px', fontSize:'13px' }}>
            <div><span style={{ color:'#999' }}>📱 </span><span style={{ color:'#333' }}>{profile?.phone || 'Not set'}</span></div>
            <div><span style={{ color:'#999' }}>✉️ </span><span style={{ color:'#333' }}>{user?.email}</span></div>
          </div>

          <div style={{ borderTop:'1px solid #eee', marginTop:'12px', paddingTop:'12px', display:'flex', flexDirection:'column', gap:'8px', fontSize:'13px' }}>
            <div>
              <p style={{ color:'#999', fontSize:'11px', textTransform:'uppercase', letterSpacing:'0.04em' }}>Current Job Title</p>
              <p style={{ color:'#333', fontWeight:500 }}>{profile?.currentJobTitle || 'Not set'}</p>
            </div>
            <div>
              <p style={{ color:'#999', fontSize:'11px', textTransform:'uppercase', letterSpacing:'0.04em' }}>Preferred Job Title</p>
              <p style={{ color:'#333', fontWeight:500 }}>{profile?.desiredJobTitle || 'Not set'}</p>
            </div>
          </div>
        </div>

        {/* RIGHT: Main content */}
        <div>
          <h2 style={{ fontWeight:700, color:'#1a1a1a', fontSize:'16px', marginBottom:'10px' }}>Your Activity</h2>
          <div className="activity-grid" style={{ marginBottom:'24px' }}>
            {[
              { label:'Jobs Applied',          value:counts.total, bg:'#f0f7ff', color:BLUE },
              { label:'Saved Jobs',            value:savedCtx?.savedJobs?.length || 0, bg:'#fff7ea', color:'#b45309' },
              { label:'Profile Views',         value:profile?.profileViews || 0, bg:'#f0fdf4', color:'#057642' },
              { label:'Interview Invitations', value:counts.interview, bg:'#faf5ff', color:'#6b21a8' },
            ].map(s => (
              <div key={s.label} style={{ background:s.bg, borderRadius:'8px', border:`1px solid ${s.bg}`, padding:'16px', textAlign:'center' }}>
                <div style={{ color:s.color, fontWeight:700, fontSize:'1.6rem' }}>{s.value}</div>
                <div style={{ color:s.color, fontSize:'11.5px', marginTop:'2px', fontWeight:500 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'10px' }}>
            <h2 style={{ fontWeight:700, color:'#1a1a1a', fontSize:'16px' }}>Top Job Matches</h2>
            <Link to="/jobs" style={{ color:BLUE, fontSize:'13px', fontWeight:600 }}>View All →</Link>
          </div>
          {topMatches.length === 0 ? (
            <div style={{ background:'#fff', borderRadius:'8px', border:'1px solid #e0e0e0', textAlign:'center', padding:'32px 16px', marginBottom:'24px' }}>
              <p style={{ color:'#666', fontSize:'14px' }}>No jobs posted yet — check back soon.</p>
            </div>
          ) : (
            <div className="matches-grid" style={{ marginBottom:'24px' }}>
              {topMatches.map(job => (
                <div key={job.id} style={{ background:'#fff', borderRadius:'8px', border:'1px solid #e0e0e0', padding:'14px' }}>
                  <Link to={`/jobs/${job.id}`} style={{ fontWeight:600, color:BLUE, fontSize:'14px', display:'block' }}>{job.title}</Link>
                  <p style={{ color:'#555', fontSize:'12.5px', marginTop:'2px' }}>{job.company} · {job.location}</p>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'10px' }}>
                    <span style={{ background:'#f0f7ff', color:BLUE, fontSize:'11px', fontWeight:600, padding:'3px 10px', borderRadius:'12px', textTransform:'capitalize' }}>{job.type}</span>
                    <Link to={`/jobs/${job.id}`} style={{ fontSize:'12px', fontWeight:600, color:BLUE, border:`1px solid ${BLUE}`, padding:'4px 12px', borderRadius:'14px' }}>Apply / View</Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Applications */}
          <div style={{ background:'#fff', borderRadius:'8px', border:'1px solid #e0e0e0' }}>
            <div style={{ padding:'16px 20px', borderBottom:'1px solid #e8e8e8' }}>
              <h2 style={{ fontWeight:700, color:'#1a1a1a', fontSize:'16px' }}>My Applications</h2>
            </div>
            {loading ? (
              <div style={{ textAlign:'center', padding:'48px', color:'#999' }}>Loading...</div>
            ) : applications.length === 0 ? (
              <div style={{ textAlign:'center', padding:'48px 16px' }}>
                <div style={{ fontSize:'2.5rem', marginBottom:'10px' }}>📭</div>
                <p style={{ color:'#666', fontSize:'14px', marginBottom:'16px' }}>You haven't applied to any jobs yet.</p>
                <Link to="/jobs" style={{ background:BLUE, color:'#fff', fontWeight:600, fontSize:'13px', padding:'9px 22px', borderRadius:'16px' }}>Browse Jobs</Link>
              </div>
            ) : (
              <div>
                {applications.map((app, i) => {
                  const st = STATUS_STYLES[app.status] || { bg:'#f5f5f5', color:'#444' };
                  return (
                    <div key={app.id} style={{ padding:'14px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'12px', borderBottom: i < applications.length-1 ? '1px solid #f0f0f0' : 'none' }}>
                      <div style={{ flex:1, minWidth:0 }}>
                        <Link to={`/jobs/${app.jobId}`} style={{ fontWeight:600, color:BLUE, fontSize:'14px', display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {app.job?.title}
                        </Link>
                        <p style={{ color:'#555', fontSize:'13px', marginTop:'2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {app.job?.company} · {app.job?.location}
                        </p>
                        <p style={{ color:'#999', fontSize:'12px', marginTop:'2px' }}>
                          Applied {new Date(app.createdAt).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                      <span style={{ background:st.bg, color:st.color, fontSize:'12px', fontWeight:600, padding:'4px 12px', borderRadius:'12px', textTransform:'capitalize', whiteSpace:'nowrap', flexShrink:0 }}>
                        {app.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Saved Jobs */}
          <div style={{ background:'#fff', borderRadius:'8px', border:'1px solid #e0e0e0', marginTop:'20px' }}>
            <div style={{ padding:'16px 20px', borderBottom:'1px solid #e8e8e8' }}>
              <h2 style={{ fontWeight:700, color:'#1a1a1a', fontSize:'16px' }}>Saved Jobs</h2>
            </div>
            {!savedCtx?.savedJobs?.length ? (
              <div style={{ textAlign:'center', padding:'32px 16px' }}>
                <p style={{ color:'#666', fontSize:'14px' }}>You haven't saved any jobs yet.</p>
              </div>
            ) : (
              <div>
                {savedCtx.savedJobs.map((job, i) => (
                  <div key={job.id} style={{ padding:'14px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'12px', borderBottom: i < savedCtx.savedJobs.length-1 ? '1px solid #f0f0f0' : 'none' }}>
                    <div style={{ flex:1, minWidth:0 }}>
                      <Link to={`/jobs/${job.id}`} style={{ fontWeight:600, color:BLUE, fontSize:'14px', display:'block', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {job.title}
                      </Link>
                      <p style={{ color:'#555', fontSize:'13px', marginTop:'2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                        {job.company} · {job.location}
                      </p>
                    </div>
                    <button onClick={() => savedCtx.toggleSave(job.id)} style={{ background:'#fff', color:'#d97706', border:'1px solid #d97706', fontSize:'12px', fontWeight:600, padding:'5px 12px', borderRadius:'12px', cursor:'pointer', flexShrink:0 }}>
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
