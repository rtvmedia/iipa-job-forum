import { Link } from 'react-router-dom';

const TYPE_COLORS = {
  'full-time':  { bg:'#e8f1fb', color:'#0a66c2' },
  'part-time':  { bg:'#e8f5e9', color:'#057642' },
  'contract':   { bg:'#fff3e0', color:'#b45309' },
  'remote':     { bg:'#f3e8ff', color:'#6b21a8' },
  'internship': { bg:'#fce7f3', color:'#9d174d' },
};

export default function JobCard({ job }) {
  const salary = job.salaryMin
    ? `₹ ${(job.salaryMin/1000).toFixed(0)}k – ${(job.salaryMax/1000).toFixed(0)}k`
    : 'Salary not disclosed';
  const tc = TYPE_COLORS[job.type] || { bg:'#f5f5f5', color:'#444' };

  return (
    <div style={{ background:'#fff', borderRadius:'8px', border:'1px solid #e0e0e0', padding:'16px', transition:'box-shadow 0.15s' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow='0 2px 10px rgba(0,0,0,0.1)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow='none'}>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'8px', marginBottom:'8px' }}>
        <div style={{ flex:1, minWidth:0 }}>
          <Link to={`/jobs/${job.id}`} style={{ fontWeight:600, color:'#0a66c2', fontSize:'15px', display:'block' }}
            onMouseEnter={e=>e.target.style.color='#004182'} onMouseLeave={e=>e.target.style.color='#0a66c2'}>
            {job.title}
          </Link>
          <p style={{ color:'#555', fontSize:'13px', marginTop:'2px' }}>{job.company}</p>
        </div>
        <span style={{ background:tc.bg, color:tc.color, fontSize:'11px', fontWeight:600, padding:'3px 10px', borderRadius:'12px', whiteSpace:'nowrap', textTransform:'capitalize' }}>
          {job.type}
        </span>
      </div>

      <div style={{ display:'flex', flexWrap:'wrap', gap:'12px', fontSize:'13px', color:'#666', marginBottom:'10px' }}>
        <span>📍 {job.location || 'India'}</span>
        <span>💼 {job.category || 'General'}</span>
        <span style={{ color:'#057642', fontWeight:500 }}>💰 {salary}</span>
      </div>

      {job.deadline && (
        <p style={{ fontSize:'12px', color:'#999', marginBottom:'10px' }}>
          Deadline: {new Date(job.deadline).toLocaleDateString('en-IN')}
        </p>
      )}

      <Link to={`/jobs/${job.id}`}
        style={{ display:'inline-block', fontSize:'13px', fontWeight:600, color:'#0a66c2', border:'1px solid #0a66c2', padding:'5px 14px', borderRadius:'16px', transition:'all 0.15s' }}
        onMouseEnter={e=>{ e.currentTarget.style.background='#0a66c2'; e.currentTarget.style.color='#fff'; }}
        onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#0a66c2'; }}>
        View Details
      </Link>
    </div>
  );
}
