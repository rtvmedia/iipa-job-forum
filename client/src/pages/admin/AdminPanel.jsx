import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const INDIGO = '#4338ca';
const GOLD   = '#d97706';
const GREEN  = '#16a34a';
const RED    = '#dc2626';

const TABS = [
  { key:'overview',     label:'Dashboard',    icon:'📊' },
  { key:'users',        label:'Users',        icon:'👥' },
  { key:'approvals',    label:'Approvals',    icon:'✅' },
  { key:'coordinators', label:'Coordinators', icon:'🧭' },
  { key:'reports',      label:'Reports',      icon:'📈' },
  { key:'albums',       label:'Albums',       icon:'🖼️' },
  { key:'branding',     label:'Logo & Branding', icon:'🎨' },
];

const MOCK_USERS = [
  { name:'Amit Sharma', email:'amit@example.com', role:'seeker',     nationality:'Indian',  status:'approved' },
  { name:'Sara Khan',   email:'sara@example.com', role:'recruiter',  nationality:'Indian',  status:'approved' },
  { name:'John Park',   email:'john@example.com', role:'seeker',     nationality:'Korean',  status:'pending' },
  { name:'Lena Fischer',email:'lena@example.com', role:'recruiter',  nationality:'German',  status:'pending' },
];

const MOCK_APPROVALS = [
  { type:'Job Posting',   title:'Senior React Developer', submittedBy:'Coordinator: Riya Mehta', date:'21 Jun 2026' },
  { type:'New User',      title:'John Park (Seeker, Korean)', submittedBy:'Self-registration', date:'20 Jun 2026' },
  { type:'Job Posting',   title:'HR Business Partner',    submittedBy:'Coordinator: Arjun Nair', date:'19 Jun 2026' },
];

const MOCK_COORDINATORS = [
  { name:'Riya Mehta',  email:'riya@iipajobs.co.in',  submissions:14, approved:11 },
  { name:'Arjun Nair',  email:'arjun@iipajobs.co.in', submissions:9,  approved:7  },
];

const MOCK_REPORTS = [
  { label:'Total Jobs Posted',     value:248 },
  { label:'Total Applications',    value:1840 },
  { label:'Active Recruiters',     value:96 },
  { label:'Active Job Seekers',    value:3120 },
  { label:'Pending Approvals',     value:7 },
  { label:'Placement Success Rate',value:'71%' },
];

function StatCard({ label, value, color }) {
  return (
    <div style={{
      background:`linear-gradient(160deg, #ffffff 0%, ${color}0d 100%)`,
      border:`1px solid ${color}33`, borderRadius:'14px', padding:'18px',
      boxShadow:`0 6px 18px ${color}1f`, transition:'transform .18s,box-shadow .18s',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow=`0 14px 30px ${color}33`; }}
      onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow=`0 6px 18px ${color}1f`; }}>
      <div style={{ color, fontWeight:800, fontSize:'1.7rem' }}>{value}</div>
      <div style={{ color:'#555', fontSize:'12.5px', marginTop:'4px', fontWeight:500 }}>{label}</div>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    approved: { bg:'#e8f5e9', color:GREEN },
    pending:  { bg:'#fff8e1', color:GOLD },
    rejected: { bg:'#fce8e8', color:RED },
  };
  const s = map[status] || map.pending;
  return <span style={{ background:s.bg, color:s.color, fontSize:'11.5px', fontWeight:700, padding:'3px 12px', borderRadius:'12px', textTransform:'capitalize' }}>{status}</span>;
}

export default function AdminPanel() {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');

  return (
    <div style={{ background:'#f4f4fb', minHeight:'calc(100vh - 52px)' }}>
      <style>{`
        .admin-shell { display:grid; grid-template-columns:220px 1fr; gap:0; max-width:1300px; margin:0 auto; }
        @media(max-width:860px){ .admin-shell{ grid-template-columns:1fr; } .admin-sidebar{ position:static !important; } }
        .admin-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:14px; }
        @media(min-width:640px){ .admin-grid{ grid-template-columns:repeat(3,1fr); } }
        @media(min-width:960px){ .admin-grid{ grid-template-columns:repeat(6,1fr); } }
        .admin-card { background:#fff; border-radius:14px; border:1px solid #e6e6f2; box-shadow:0 4px 16px rgba(67,56,202,0.08); }
        .admin-table-row:hover { background:#f8f8ff; }
        .admin-nav-btn { transition: all .15s; }
        .admin-nav-btn:hover { background:rgba(67,56,202,0.08) !important; }
      `}</style>

      <div style={{ background:`linear-gradient(135deg, ${INDIGO} 0%, #6d28d9 100%)`, padding:'22px 20px' }}>
        <div style={{ maxWidth:'1300px', margin:'0 auto' }}>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:'12px', fontWeight:600, letterSpacing:'0.06em', textTransform:'uppercase' }}>Admin Control Center</p>
          <h1 style={{ color:'#fff', fontWeight:800, fontSize:'22px', marginTop:'4px' }}>Welcome back, {user?.fullName?.split(' ')[0] || 'Admin'}</h1>
        </div>
      </div>

      <div className="admin-shell">
        <aside className="admin-sidebar" style={{ padding:'18px 12px', position:'sticky', top:'52px', alignSelf:'start' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} className="admin-nav-btn"
              style={{
                display:'flex', alignItems:'center', gap:'10px', width:'100%', textAlign:'left',
                padding:'10px 14px', borderRadius:'10px', border:'none', cursor:'pointer', marginBottom:'4px',
                background: tab===t.key ? `linear-gradient(135deg, ${INDIGO}, #6d28d9)` : 'transparent',
                color: tab===t.key ? '#fff' : '#333', fontWeight:600, fontSize:'13.5px',
              }}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </aside>

        <main style={{ padding:'20px 18px 40px' }}>
          {tab === 'overview' && (
            <>
              <h2 style={{ fontWeight:700, fontSize:'17px', color:'#1a1a1a', marginBottom:'14px' }}>Platform Overview</h2>
              <div className="admin-grid">
                <StatCard label="Total Jobs Posted" value={248} color={INDIGO} />
                <StatCard label="Active Recruiters" value={96} color={GOLD} />
                <StatCard label="Active Job Seekers" value={3120} color={GREEN} />
                <StatCard label="Pending Approvals" value={7} color={RED} />
                <StatCard label="Coordinators" value={2} color={INDIGO} />
                <StatCard label="Albums Published" value={12} color={GOLD} />
              </div>

              <h2 style={{ fontWeight:700, fontSize:'17px', color:'#1a1a1a', margin:'24px 0 14px' }}>Recent Approval Requests</h2>
              <div className="admin-card" style={{ overflow:'hidden' }}>
                {MOCK_APPROVALS.map((a, i) => (
                  <div key={i} className="admin-table-row" style={{ display:'flex', justifyContent:'space-between', gap:'12px', padding:'14px 18px', borderBottom: i < MOCK_APPROVALS.length-1 ? '1px solid #f0f0f5' : 'none' }}>
                    <div>
                      <span style={{ fontSize:'11px', fontWeight:700, color:INDIGO, background:'#eef0fd', padding:'2px 8px', borderRadius:'10px' }}>{a.type}</span>
                      <p style={{ fontWeight:600, color:'#1a1a1a', fontSize:'14px', marginTop:'6px' }}>{a.title}</p>
                      <p style={{ color:'#777', fontSize:'12.5px', marginTop:'2px' }}>{a.submittedBy} · {a.date}</p>
                    </div>
                    <div style={{ display:'flex', gap:'8px', alignSelf:'center', flexShrink:0 }}>
                      <button style={{ background:GREEN, color:'#fff', fontWeight:600, fontSize:'12.5px', padding:'6px 14px', borderRadius:'14px', border:'none', cursor:'pointer' }}>Approve</button>
                      <button style={{ background:'#fff', color:RED, border:`1px solid ${RED}`, fontWeight:600, fontSize:'12.5px', padding:'6px 14px', borderRadius:'14px', cursor:'pointer' }}>Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'users' && (
            <>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' }}>
                <h2 style={{ fontWeight:700, fontSize:'17px', color:'#1a1a1a' }}>User Management</h2>
                <p style={{ fontSize:'12.5px', color:'#777' }}>Non-Indian users require approval before activation</p>
              </div>
              <div className="admin-card" style={{ overflow:'hidden' }}>
                {MOCK_USERS.map((u, i) => (
                  <div key={i} className="admin-table-row" style={{ display:'flex', flexWrap:'wrap', justifyContent:'space-between', alignItems:'center', gap:'10px', padding:'14px 18px', borderBottom: i < MOCK_USERS.length-1 ? '1px solid #f0f0f5' : 'none' }}>
                    <div>
                      <p style={{ fontWeight:600, color:'#1a1a1a', fontSize:'14px' }}>{u.name}</p>
                      <p style={{ color:'#777', fontSize:'12.5px' }}>{u.email} · {u.nationality} · <span style={{ textTransform:'capitalize' }}>{u.role}</span></p>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                      <StatusPill status={u.status} />
                      <button style={{ background:INDIGO, color:'#fff', fontSize:'12px', fontWeight:600, padding:'5px 12px', borderRadius:'12px', border:'none', cursor:'pointer' }}>Make Coordinator</button>
                      <button style={{ background:'#fff', color:'#444', fontSize:'12px', fontWeight:600, padding:'5px 12px', borderRadius:'12px', border:'1px solid #ccc', cursor:'pointer' }}>Make Admin</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'approvals' && (
            <>
              <h2 style={{ fontWeight:700, fontSize:'17px', color:'#1a1a1a', marginBottom:'14px' }}>Pending Approvals</h2>
              <p style={{ color:'#666', fontSize:'13px', marginBottom:'14px' }}>Non-Indian user registrations and coordinator-submitted jobs land here before going live.</p>
              <div className="admin-card" style={{ overflow:'hidden' }}>
                {MOCK_APPROVALS.map((a, i) => (
                  <div key={i} className="admin-table-row" style={{ display:'flex', justifyContent:'space-between', gap:'12px', padding:'14px 18px', borderBottom: i < MOCK_APPROVALS.length-1 ? '1px solid #f0f0f5' : 'none' }}>
                    <div>
                      <span style={{ fontSize:'11px', fontWeight:700, color:INDIGO, background:'#eef0fd', padding:'2px 8px', borderRadius:'10px' }}>{a.type}</span>
                      <p style={{ fontWeight:600, color:'#1a1a1a', fontSize:'14px', marginTop:'6px' }}>{a.title}</p>
                      <p style={{ color:'#777', fontSize:'12.5px', marginTop:'2px' }}>{a.submittedBy} · {a.date}</p>
                    </div>
                    <div style={{ display:'flex', gap:'8px', alignSelf:'center', flexShrink:0 }}>
                      <button style={{ background:GREEN, color:'#fff', fontWeight:600, fontSize:'12.5px', padding:'6px 14px', borderRadius:'14px', border:'none', cursor:'pointer' }}>Approve</button>
                      <button style={{ background:'#fff', color:RED, border:`1px solid ${RED}`, fontWeight:600, fontSize:'12.5px', padding:'6px 14px', borderRadius:'14px', cursor:'pointer' }}>Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'coordinators' && (
            <>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' }}>
                <h2 style={{ fontWeight:700, fontSize:'17px', color:'#1a1a1a' }}>Coordinators</h2>
                <button style={{ background:INDIGO, color:'#fff', fontWeight:600, fontSize:'13px', padding:'8px 18px', borderRadius:'16px', border:'none', cursor:'pointer' }}>+ Assign Coordinator</button>
              </div>
              <div className="admin-grid">
                {MOCK_COORDINATORS.map((c, i) => (
                  <div key={i} className="admin-card" style={{ padding:'18px', gridColumn:'span 2' }}>
                    <p style={{ fontWeight:700, color:'#1a1a1a', fontSize:'14px' }}>{c.name}</p>
                    <p style={{ color:'#777', fontSize:'12.5px', marginTop:'2px' }}>{c.email}</p>
                    <div style={{ display:'flex', gap:'18px', marginTop:'12px' }}>
                      <div><span style={{ color:INDIGO, fontWeight:700, fontSize:'1.2rem' }}>{c.submissions}</span><div style={{ fontSize:'11.5px', color:'#777' }}>Submitted</div></div>
                      <div><span style={{ color:GREEN, fontWeight:700, fontSize:'1.2rem' }}>{c.approved}</span><div style={{ fontSize:'11.5px', color:'#777' }}>Approved</div></div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'reports' && (
            <>
              <h2 style={{ fontWeight:700, fontSize:'17px', color:'#1a1a1a', marginBottom:'14px' }}>Reports</h2>
              <div className="admin-grid">
                {MOCK_REPORTS.map((r, i) => (
                  <StatCard key={r.label} label={r.label} value={r.value} color={[INDIGO,GOLD,GREEN,RED,INDIGO,GOLD][i % 6]} />
                ))}
              </div>
              <p style={{ color:'#888', fontSize:'12.5px', marginTop:'18px' }}>Detailed exportable reports (jobs by category, applications over time, recruiter performance) — coming next phase.</p>
            </>
          )}

          {tab === 'albums' && (
            <>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' }}>
                <h2 style={{ fontWeight:700, fontSize:'17px', color:'#1a1a1a' }}>Event Albums</h2>
                <button style={{ background:INDIGO, color:'#fff', fontWeight:600, fontSize:'13px', padding:'8px 18px', borderRadius:'16px', border:'none', cursor:'pointer' }}>+ Create Album</button>
              </div>
              <div className="admin-grid">
                {['IIPA Annual Meet 2026','Career Fair – Mumbai','Upskilling Workshop'].map((title, i) => (
                  <div key={title} className="admin-card" style={{ overflow:'hidden', gridColumn:'span 2' }}>
                    <div style={{ height:'100px', background:`linear-gradient(135deg, ${[INDIGO,GOLD,GREEN][i]}, #1a1a1a22)` }} />
                    <div style={{ padding:'14px' }}>
                      <p style={{ fontWeight:600, color:'#1a1a1a', fontSize:'14px' }}>{title}</p>
                      <div style={{ display:'flex', gap:'8px', marginTop:'10px' }}>
                        <button style={{ fontSize:'12px', color:INDIGO, border:`1px solid ${INDIGO}`, background:'#fff', padding:'5px 12px', borderRadius:'12px', cursor:'pointer' }}>Edit</button>
                        <button style={{ fontSize:'12px', color:RED, border:`1px solid ${RED}`, background:'#fff', padding:'5px 12px', borderRadius:'12px', cursor:'pointer' }}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'branding' && (
            <>
              <h2 style={{ fontWeight:700, fontSize:'17px', color:'#1a1a1a', marginBottom:'14px' }}>Logo & Branding</h2>
              <div className="admin-grid">
                <div className="admin-card" style={{ padding:'20px', gridColumn:'span 3' }}>
                  <p style={{ fontWeight:600, color:'#1a1a1a', fontSize:'14px', marginBottom:'10px' }}>Header Logo</p>
                  <div style={{ width:'100%', height:'90px', border:'2px dashed #d6d6ee', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', color:'#999', fontSize:'13px', marginBottom:'10px' }}>
                    No logo uploaded — defaults to "IIPA JOBS" text
                  </div>
                  <button style={{ background:INDIGO, color:'#fff', fontWeight:600, fontSize:'13px', padding:'8px 18px', borderRadius:'16px', border:'none', cursor:'pointer' }}>Upload Header Logo</button>
                </div>
                <div className="admin-card" style={{ padding:'20px', gridColumn:'span 3' }}>
                  <p style={{ fontWeight:600, color:'#1a1a1a', fontSize:'14px', marginBottom:'10px' }}>Footer Logo</p>
                  <div style={{ width:'100%', height:'90px', border:'2px dashed #d6d6ee', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', color:'#999', fontSize:'13px', marginBottom:'10px' }}>
                    No logo uploaded — defaults to "IIPA JOBS" text
                  </div>
                  <button style={{ background:INDIGO, color:'#fff', fontWeight:600, fontSize:'13px', padding:'8px 18px', borderRadius:'16px', border:'none', cursor:'pointer' }}>Upload Footer Logo</button>
                </div>
              </div>
              <p style={{ color:'#888', fontSize:'12.5px', marginTop:'14px' }}>Only Admin users can change branding. Upload wiring (file storage + live header/footer rendering) is the next implementation step.</p>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
