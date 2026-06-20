import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

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
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applications/my').then(r => setApplications(r.data)).catch(()=>{}).finally(() => setLoading(false));
  }, []);

  const counts = {
    total:       applications.length,
    shortlisted: applications.filter(a => a.status==='shortlisted').length,
    interview:   applications.filter(a => a.status==='interview').length,
    hired:       applications.filter(a => a.status==='hired').length,
  };

  return (
    <div style={{ maxWidth:'1000px', margin:'0 auto', padding:'24px 16px' }}>
      {/* Header */}
      <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'space-between', alignItems:'flex-start', gap:'14px', marginBottom:'20px' }}>
        <div>
          <h1 style={{ fontWeight:700, color:'#1a1a1a', fontSize:'22px' }}>
            Welcome back, {user?.fullName?.split(' ')[0]}!
          </h1>
          <p style={{ color:'#666', fontSize:'13px', marginTop:'3px' }}>Track your job applications and career progress</p>
        </div>
        <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
          <Link to="/jobs"
            style={{ background:BLUE, color:'#fff', fontWeight:600, fontSize:'13px', padding:'8px 18px', borderRadius:'16px' }}>
            🔍 Find Jobs
          </Link>
          <Link to="/seeker/profile"
            style={{ color:BLUE, fontSize:'13px', fontWeight:600, padding:'8px 18px', border:`1px solid ${BLUE}`, borderRadius:'16px', background:'#fff' }}>
            Edit Profile
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'10px', marginBottom:'20px' }} className="stat-grid">
        <style>{`@media(min-width:600px){ .stat-grid{ grid-template-columns:repeat(4,1fr) !important; } }`}</style>
        {[
          { label:'Total Applied',  value:counts.total,       bg:'#f0f7ff', color:BLUE },
          { label:'Shortlisted',    value:counts.shortlisted, bg:'#fffbeb', color:'#b45309' },
          { label:'Interview',      value:counts.interview,   bg:'#faf5ff', color:'#6b21a8' },
          { label:'Hired',          value:counts.hired,       bg:'#f0fdf4', color:'#057642' },
        ].map(s => (
          <div key={s.label} style={{ background:s.bg, borderRadius:'8px', border:`1px solid ${s.bg}`, padding:'16px', textAlign:'center' }}>
            <div style={{ color:s.color, fontWeight:700, fontSize:'1.7rem' }}>{s.value}</div>
            <div style={{ color:s.color, fontSize:'12px', marginTop:'2px', fontWeight:500 }}>{s.label}</div>
          </div>
        ))}
      </div>

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
    </div>
  );
}
