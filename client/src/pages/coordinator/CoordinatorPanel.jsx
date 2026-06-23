import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const TEAL  = '#0d9488';
const GOLD  = '#d97706';

const TABS = [
  { key:'overview', label:'Dashboard',        icon:'📊' },
  { key:'submit',   label:'Submit Enquiry',   icon:'📝' },
  { key:'mine',     label:'My Submissions',   icon:'📋' },
];

const MOCK_SUBMISSIONS = [
  { title:'Senior React Developer', type:'Job Posting', status:'pending',  date:'21 Jun 2026' },
  { title:'HR Business Partner',    type:'Job Posting', status:'approved', date:'18 Jun 2026' },
  { title:'Data Analyst Intern',    type:'Job Posting', status:'rejected', date:'14 Jun 2026' },
];

function StatusPill({ status }) {
  const map = {
    approved: { bg:'#e8f5e9', color:'#16a34a' },
    pending:  { bg:'#fff8e1', color:GOLD },
    rejected: { bg:'#fce8e8', color:'#dc2626' },
  };
  const s = map[status] || map.pending;
  return <span style={{ background:s.bg, color:s.color, fontSize:'11.5px', fontWeight:700, padding:'3px 12px', borderRadius:'12px', textTransform:'capitalize' }}>{status}</span>;
}

export default function CoordinatorPanel() {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');
  const [form, setForm] = useState({ title:'', company:'', location:'', description:'' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ title:'', company:'', location:'', description:'' });
    setTimeout(() => setSubmitted(false), 3500);
  };

  return (
    <div style={{ background:'#f4faf9', minHeight:'calc(100vh - 52px)' }}>
      <style>{`
        .coord-shell { display:grid; grid-template-columns:200px 1fr; max-width:1100px; margin:0 auto; }
        @media(max-width:780px){ .coord-shell{ grid-template-columns:1fr; } .coord-sidebar{ position:static !important; } }
        .coord-nav-btn:hover { background:rgba(13,148,136,0.08) !important; }
        .coord-card { background:#fff; border-radius:14px; border:1px solid #dff0ee; box-shadow:0 4px 16px rgba(13,148,136,0.08); }
        .coord-input { width:100%; border:1px solid #ddd; border-radius:8px; padding:10px 12px; font-size:14px; outline:none; box-sizing:border-box; }
        .coord-input:focus { border-color:${TEAL}; }
      `}</style>

      <div style={{ background:`linear-gradient(135deg, ${TEAL} 0%, #047857 100%)`, padding:'22px 20px' }}>
        <div style={{ maxWidth:'1100px', margin:'0 auto' }}>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:'12px', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase' }}>Coordinator Desk</p>
          <h1 style={{ color:'#fff', fontWeight:800, fontSize:'22px', marginTop:'4px' }}>Welcome, {user?.fullName?.split(' ')[0] || 'Coordinator'}</h1>
        </div>
      </div>

      <div className="coord-shell">
        <aside className="coord-sidebar" style={{ padding:'18px 12px', position:'sticky', top:'52px', alignSelf:'start' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} className="coord-nav-btn"
              style={{
                display:'flex', alignItems:'center', gap:'10px', width:'100%', textAlign:'left',
                padding:'10px 14px', borderRadius:'10px', border:'none', cursor:'pointer', marginBottom:'4px',
                background: tab===t.key ? `linear-gradient(135deg, ${TEAL}, #047857)` : 'transparent',
                color: tab===t.key ? '#fff' : '#333', fontWeight:600, fontSize:'13.5px',
              }}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </aside>

        <main style={{ padding:'20px 18px 40px' }}>
          {tab === 'overview' && (
            <>
              <h2 style={{ fontWeight:700, fontSize:'17px', color:'#1a1a1a', marginBottom:'14px' }}>Your Activity</h2>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'14px' }}>
                <div className="coord-card" style={{ padding:'18px', textAlign:'center' }}>
                  <div style={{ color:TEAL, fontWeight:800, fontSize:'1.7rem' }}>14</div>
                  <div style={{ color:'#555', fontSize:'12.5px', marginTop:'4px' }}>Total Submitted</div>
                </div>
                <div className="coord-card" style={{ padding:'18px', textAlign:'center' }}>
                  <div style={{ color:'#16a34a', fontWeight:800, fontSize:'1.7rem' }}>11</div>
                  <div style={{ color:'#555', fontSize:'12.5px', marginTop:'4px' }}>Approved</div>
                </div>
                <div className="coord-card" style={{ padding:'18px', textAlign:'center' }}>
                  <div style={{ color:GOLD, fontWeight:800, fontSize:'1.7rem' }}>2</div>
                  <div style={{ color:'#555', fontSize:'12.5px', marginTop:'4px' }}>Awaiting Approval</div>
                </div>
              </div>
              <p style={{ color:'#666', fontSize:'13px', marginTop:'18px', lineHeight:1.6 }}>
                As a coordinator you can submit job enquiries on behalf of employers. Every submission is reviewed by an Admin before it goes live on IIPA JOBS.
              </p>
            </>
          )}

          {tab === 'submit' && (
            <>
              <h2 style={{ fontWeight:700, fontSize:'17px', color:'#1a1a1a', marginBottom:'4px' }}>Submit a Job Enquiry</h2>
              <p style={{ color:'#666', fontSize:'13px', marginBottom:'16px' }}>This will be sent to Admin for approval before publishing.</p>
              {submitted && (
                <div style={{ background:'#e8f5e9', color:'#16a34a', padding:'10px 16px', borderRadius:'8px', fontSize:'13px', marginBottom:'14px' }}>
                  ✅ Submitted for admin approval.
                </div>
              )}
              <form onSubmit={handleSubmit} className="coord-card" style={{ padding:'22px', display:'flex', flexDirection:'column', gap:'14px' }}>
                <div>
                  <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>Job Title</label>
                  <input className="coord-input" required value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} placeholder="e.g. Senior React Developer" />
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                  <div>
                    <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>Company</label>
                    <input className="coord-input" required value={form.company} onChange={e=>setForm(f=>({...f,company:e.target.value}))} placeholder="Company name" />
                  </div>
                  <div>
                    <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>Location</label>
                    <input className="coord-input" value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))} placeholder="Mumbai / Remote" />
                  </div>
                </div>
                <div>
                  <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>Description</label>
                  <textarea className="coord-input" rows={4} style={{ resize:'none' }} value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} placeholder="Role details, requirements..." />
                </div>
                <button type="submit" style={{ background:TEAL, color:'#fff', fontWeight:600, fontSize:'14px', padding:'12px', borderRadius:'8px', border:'none', cursor:'pointer' }}>
                  Submit for Approval
                </button>
              </form>
            </>
          )}

          {tab === 'mine' && (
            <>
              <h2 style={{ fontWeight:700, fontSize:'17px', color:'#1a1a1a', marginBottom:'14px' }}>My Submissions</h2>
              <div className="coord-card" style={{ overflow:'hidden' }}>
                {MOCK_SUBMISSIONS.map((s, i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', gap:'12px', padding:'14px 18px', borderBottom: i < MOCK_SUBMISSIONS.length-1 ? '1px solid #eef7f5' : 'none' }}>
                    <div>
                      <p style={{ fontWeight:600, color:'#1a1a1a', fontSize:'14px' }}>{s.title}</p>
                      <p style={{ color:'#777', fontSize:'12.5px', marginTop:'2px' }}>{s.type} · {s.date}</p>
                    </div>
                    <StatusPill status={s.status} />
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
