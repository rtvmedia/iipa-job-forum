import { Link } from 'react-router-dom';

const TYPE_COLORS = {
  'full-time':  { bg:'#e8f5e9', color:'#2e7d32' },
  'part-time':  { bg:'#e3f2fd', color:'#1565c0' },
  'contract':   { bg:'#fff3e0', color:'#e65100' },
  'remote':     { bg:'#f3e5f5', color:'#6a1b9a' },
  'internship': { bg:'#fce4ec', color:'#880e4f' },
};

export default function JobCard({ job }) {
  const salary = job.salaryMin
    ? `₹ ${(job.salaryMin/1000).toFixed(0)}k – ${(job.salaryMax/1000).toFixed(0)}k`
    : 'Salary not disclosed';
  const tc = TYPE_COLORS[job.type] || { bg:'#f5f5f5', color:'#555' };

  return (
    <div style={{ background:'white', borderRadius:'8px', boxShadow:'0 0 0 1px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)', padding:'16px', transition:'box-shadow 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow='0 0 0 1px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.08)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow='0 0 0 1px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)'}>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'8px', marginBottom:'8px' }}>
        <div style={{ flex:1, minWidth:0 }}>
          <Link to={`/jobs/${job.id}`} style={{ fontWeight:600, color:'#1a237e', fontSize:'15px', display:'block' }}
            onMouseEnter={e=>e.target.style.color='#FF9933'} onMouseLeave={e=>e.target.style.color='#1a237e'}>
            {job.title}
          </Link>
          <p style={{ color:'#666', fontSize:'13px', marginTop:'2px' }}>{job.company}</p>
        </div>
        <span style={{ background:tc.bg, color:tc.color, fontSize:'11px', fontWeight:600, padding:'3px 10px', borderRadius:'12px', whiteSpace:'nowrap', textTransform:'capitalize' }}>
          {job.type}
        </span>
      </div>

      <div style={{ display:'flex', flexWrap:'wrap', gap:'12px', fontSize:'13px', color:'#666', marginBottom:'10px' }}>
        <span>📍 {job.location || 'India'}</span>
        <span>💼 {job.category || 'General'}</span>
        <span style={{ color:'#138808', fontWeight:500 }}>💰 {salary}</span>
      </div>

      {job.deadline && (
        <p style={{ fontSize:'12px', color:'#999', marginBottom:'10px' }}>
          Deadline: {new Date(job.deadline).toLocaleDateString('en-IN')}
        </p>
      )}

      <Link to={`/jobs/${job.id}`}
        style={{ display:'inline-block', fontSize:'13px', fontWeight:600, color:'#1a237e', border:'1px solid #1a237e', padding:'5px 14px', borderRadius:'16px', transition:'all 0.15s' }}
        onMouseEnter={e=>{ e.currentTarget.style.background='#1a237e'; e.currentTarget.style.color='white'; }}
        onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.color='#1a237e'; }}>
        View Details
      </Link>
    </div>
  );
}
