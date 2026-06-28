import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const BLUE = '#0a66c2';

const JOB_TYPES = ['full-time','part-time','contract','remote','internship'];

export default function RecruiterDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    api.get('/jobs/my').then(r => setJobs(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const totalApplicants = jobs.reduce((s, j) => s + (j.applications?.length || 0), 0);
  const visibleJobs = typeFilter ? jobs.filter(j => j.type === typeFilter) : jobs;

  return (
    <div style={{ maxWidth:'1000px', margin:'0 auto', padding:'24px 16px' }}>
      {/* Header */}
      <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'space-between', alignItems:'flex-start', gap:'14px', marginBottom:'20px' }}>
        <div>
          <h1 style={{ fontWeight:700, color:'#1a1a1a', fontSize:'22px' }}>
            Welcome back, {user?.fullName?.split(' ')[0]}!
          </h1>
          <p style={{ color:'#666', fontSize:'13px', marginTop:'3px' }}>Manage your job postings and applicant pipeline</p>
        </div>
        <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
          <Link to="/recruiter/company-profile"
            style={{ color:BLUE, fontWeight:600, fontSize:'13px', padding:'8px 18px', borderRadius:'16px', border:`1px solid ${BLUE}`, whiteSpace:'nowrap' }}>
            Company Profile
          </Link>
          <Link to="/recruiter/post-job"
            style={{ background:BLUE, color:'white', fontWeight:600, fontSize:'13px', padding:'8px 18px', borderRadius:'16px', whiteSpace:'nowrap' }}>
            + Post New Job
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'10px', marginBottom:'20px' }}>
        {[
          { label:'Active Jobs',      value: jobs.filter(j => j.isActive).length, bg:'#f0f7ff', color:BLUE },
          { label:'Total Applicants', value: totalApplicants,                      bg:'#fffbeb', color:'#b45309' },
          { label:'Jobs Posted',      value: jobs.length,                          bg:'#f0fdf4', color:'#057642' },
        ].map(s => (
          <div key={s.label} style={{ background:s.bg, borderRadius:'8px', border:`1px solid ${s.bg}`, padding:'16px', textAlign:'center' }}>
            <div style={{ color:s.color, fontWeight:700, fontSize:'1.7rem' }}>{s.value}</div>
            <div style={{ color:s.color, fontSize:'12px', marginTop:'2px', fontWeight:500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Jobs list */}
      <div style={{ background:'white', borderRadius:'8px', border:'1px solid #e0e0e0' }}>
        <div style={{ padding:'16px 20px', borderBottom:'1px solid #e8e8e8', display:'flex', flexWrap:'wrap', justifyContent:'space-between', alignItems:'center', gap:'10px' }}>
          <h2 style={{ fontWeight:700, color:'#1a1a1a', fontSize:'16px' }}>My Job Postings</h2>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            style={{ border:'1px solid #ddd', borderRadius:'8px', padding:'6px 10px', fontSize:'12.5px', color:'#444', outline:'none' }}>
            <option value="">All Job Types</option>
            {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:'48px', color:'#999' }}>Loading...</div>
        ) : visibleJobs.length === 0 ? (
          <div style={{ textAlign:'center', padding:'48px 16px' }}>
            <div style={{ fontSize:'2.5rem', marginBottom:'10px' }}>📋</div>
            <p style={{ color:'#666', fontSize:'14px', marginBottom:'16px' }}>{jobs.length === 0 ? 'No job postings yet.' : 'No jobs match this filter.'}</p>
            {jobs.length === 0 && (
              <Link to="/recruiter/post-job"
                style={{ background:BLUE, color:'white', fontWeight:600, fontSize:'13px', padding:'9px 22px', borderRadius:'16px' }}>
                Post Your First Job
              </Link>
            )}
          </div>
        ) : (
          <div>
            {visibleJobs.map((job, i) => (
              <div key={job.id} style={{ padding:'14px 20px', display:'flex', alignItems:'center', gap:'12px', borderBottom: i < visibleJobs.length-1 ? '1px solid #f0f0f0' : 'none' }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontWeight:600, color:BLUE, fontSize:'14px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {job.title}
                  </p>
                  <p style={{ color:'#666', fontSize:'13px', marginTop:'2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {job.location} · {job.type} · {job.applications?.length || 0} applicant(s)
                  </p>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'8px', flexShrink:0 }}>
                  <span style={{ fontSize:'12px', padding:'3px 10px', borderRadius:'12px', fontWeight:500,
                    background: job.isActive ? '#e8f5e9' : '#f5f5f5',
                    color:      job.isActive ? '#057642' : '#888' }}>
                    {job.isActive ? 'Active' : 'Closed'}
                  </span>
                  <Link to={`/recruiter/applicants/${job.id}`}
                    style={{ fontSize:'12px', color:BLUE, border:`1px solid ${BLUE}`, padding:'5px 12px', borderRadius:'12px', whiteSpace:'nowrap', fontWeight:500 }}>
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
