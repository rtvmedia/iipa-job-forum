import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { exportToExcel } from '../../utils/exportCsv';

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

function ExportButton({ onClick }) {
  return (
    <button onClick={onClick}
      style={{ background:'#fff', color:GREEN, border:`1px solid ${GREEN}`, fontWeight:600, fontSize:'12.5px', padding:'7px 16px', borderRadius:'14px', cursor:'pointer' }}>
      ⬇ Export to Excel
    </button>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'16px' }} onClick={onClose}>
      <div style={{ background:'#fff', borderRadius:'14px', padding:'22px', width:'min(480px, 100%)', maxHeight:'90vh', overflowY:'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' }}>
          <h3 style={{ fontWeight:700, fontSize:'16px', color:'#1a1a1a' }}>{title}</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:'20px', cursor:'pointer', color:'#888' }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

const inp = { width:'100%', border:'1px solid #ddd', borderRadius:'8px', padding:'9px 12px', fontSize:'13.5px', outline:'none', boxSizing:'border-box', marginBottom:'10px' };
const btnPrimary = { background:INDIGO, color:'#fff', fontWeight:600, fontSize:'13px', padding:'9px 20px', borderRadius:'16px', border:'none', cursor:'pointer' };

export default function AdminPanel() {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');

  const [users, setUsers]               = useState([]);
  const [approvals, setApprovals]       = useState({ users:[], jobs:[] });
  const [coordinators, setCoordinators] = useState([]);
  const [reports, setReports]           = useState(null);
  const [albums, setAlbums]             = useState([]);
  const [events, setEvents]             = useState([]);
  const [settings, setSettings]         = useState({});
  const [loading, setLoading]           = useState(false);

  const [editUser, setEditUser]           = useState(null);
  const [editApprovalUser, setEditApprovalUser] = useState(null);
  const [editApprovalJob, setEditApprovalJob]   = useState(null);
  const [assignOpen, setAssignOpen]       = useState(false);
  const [albumModal, setAlbumModal]       = useState(null); // {} for create, album obj for edit
  const [manageAlbum, setManageAlbum]     = useState(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [u, a, c, r, al, ev, s] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/approvals'),
        api.get('/admin/coordinators'),
        api.get('/admin/reports'),
        api.get('/admin/albums'),
        api.get('/events'),
        api.get('/settings'),
      ]);
      setUsers(u.data); setApprovals(a.data); setCoordinators(c.data);
      setReports(r.data); setAlbums(al.data); setEvents(ev.data); setSettings(s.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  // ---------- Users ----------
  const saveUser = async (e) => {
    e.preventDefault();
    const { id, fullName, email, role, isActive } = editUser;
    await api.put(`/admin/users/${id}`, { fullName, email, role, isActive });
    setEditUser(null);
    loadAll();
  };
  const removeUser = async (id) => {
    if (!confirm('Delete this user permanently?')) return;
    await api.delete(`/admin/users/${id}`);
    loadAll();
  };
  const assignRole = async (id, role) => {
    await api.put(`/admin/users/${id}/role`, { role });
    loadAll();
  };

  // ---------- Approvals ----------
  const decideUser = async (id, action) => { await api.put(`/admin/approvals/users/${id}`, { action }); loadAll(); };
  const decideJob  = async (id, action) => { await api.put(`/admin/approvals/jobs/${id}`, { action }); loadAll(); };
  const removeApprovalUser = async (id) => { if (!confirm('Delete this request?')) return; await api.delete(`/admin/approvals/users/${id}`); loadAll(); };
  const removeApprovalJob  = async (id) => { if (!confirm('Delete this request?')) return; await api.delete(`/admin/approvals/jobs/${id}`); loadAll(); };
  const saveApprovalUser = async (e) => {
    e.preventDefault();
    const { id, fullName, email, nationality } = editApprovalUser;
    await api.put(`/admin/approvals/users/${id}/edit`, { fullName, email, nationality });
    setEditApprovalUser(null); loadAll();
  };
  const saveApprovalJob = async (e) => {
    e.preventDefault();
    const { id, title, company, location, description } = editApprovalJob;
    await api.put(`/admin/approvals/jobs/${id}/edit`, { title, company, location, description });
    setEditApprovalJob(null); loadAll();
  };

  // ---------- Albums ----------
  const saveAlbum = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    if (albumModal.id) await api.put(`/admin/albums/${albumModal.id}`, form);
    else await api.post('/admin/albums', form);
    setAlbumModal(null); loadAll();
  };
  const removeAlbum = async (id) => { if (!confirm('Delete this album and all its photos?')) return; await api.delete(`/admin/albums/${id}`); loadAll(); };
  const addImage = async (e) => {
    e.preventDefault();
    const file = e.target.image.files[0];
    if (!file) return;
    const form = new FormData(); form.append('image', file);
    await api.post(`/admin/albums/${manageAlbum.id}/images`, form);
    e.target.reset();
    const fresh = await api.get('/admin/albums');
    setAlbums(fresh.data);
    setManageAlbum(fresh.data.find(a => a.id === manageAlbum.id));
  };
  const removeImage = async (imageId) => {
    await api.delete(`/admin/albums/${manageAlbum.id}/images/${imageId}`);
    const fresh = await api.get('/admin/albums');
    setAlbums(fresh.data);
    setManageAlbum(fresh.data.find(a => a.id === manageAlbum.id));
  };

  // ---------- Branding ----------
  const uploadLogo = async (field, file) => {
    if (!file) return;
    const form = new FormData();
    form.append(field, file);
    const { data } = await api.put('/admin/settings', form);
    setSettings(data);
  };

  if (loading && !reports) {
    return <div style={{ textAlign:'center', padding:'80px', color:'#999' }}>Loading admin panel...</div>;
  }

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

          {tab === 'overview' && reports && (
            <>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' }}>
                <h2 style={{ fontWeight:700, fontSize:'17px', color:'#1a1a1a' }}>Platform Overview</h2>
                <ExportButton onClick={() => exportToExcel('platform-overview', [reports.summary])} />
              </div>
              <div className="admin-grid">
                <StatCard label="Total Jobs Posted" value={reports.summary.totalJobs} color={INDIGO} />
                <StatCard label="Total Applications" value={reports.summary.totalApplications} color={GOLD} />
                <StatCard label="Active Recruiters" value={reports.summary.activeRecruiters} color={GREEN} />
                <StatCard label="Active Job Seekers" value={reports.summary.activeSeekers} color={RED} />
                <StatCard label="Coordinators" value={coordinators.length} color={INDIGO} />
                <StatCard label="Pending Approvals" value={reports.summary.pendingApprovals} color={GOLD} />
              </div>

              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', margin:'24px 0 14px' }}>
                <h2 style={{ fontWeight:700, fontSize:'17px', color:'#1a1a1a' }}>Recent Approval Requests</h2>
                <ExportButton onClick={() => exportToExcel('pending-approvals', [
                  ...approvals.users.map(u => ({ Type:'New User', Title:u.fullName, Detail:u.email, Date:u.createdAt })),
                  ...approvals.jobs.map(j => ({ Type:'Job Posting', Title:j.title, Detail:j.company, Date:j.createdAt })),
                ])} />
              </div>
              <div className="admin-card" style={{ overflow:'hidden' }}>
                {[...approvals.users.map(u => ({ kind:'user', ...u })), ...approvals.jobs.map(j => ({ kind:'job', ...j }))].length === 0 ? (
                  <p style={{ padding:'18px', color:'#888', fontSize:'13px' }}>No pending approvals.</p>
                ) : [...approvals.users.map(u => ({ kind:'user', ...u })), ...approvals.jobs.map(j => ({ kind:'job', ...j }))].slice(0,5).map((item, i) => (
                  <div key={`${item.kind}-${item.id}`} className="admin-table-row" style={{ display:'flex', justifyContent:'space-between', gap:'12px', padding:'14px 18px', borderBottom:'1px solid #f0f0f5' }}>
                    <div>
                      <span style={{ fontSize:'11px', fontWeight:700, color:INDIGO, background:'#eef0fd', padding:'2px 8px', borderRadius:'10px' }}>{item.kind === 'user' ? 'New User' : 'Job Posting'}</span>
                      <p style={{ fontWeight:600, color:'#1a1a1a', fontSize:'14px', marginTop:'6px' }}>{item.kind === 'user' ? item.fullName : item.title}</p>
                    </div>
                    <div style={{ display:'flex', gap:'8px', alignSelf:'center', flexShrink:0 }}>
                      <button onClick={() => item.kind === 'user' ? decideUser(item.id,'approve') : decideJob(item.id,'approve')} style={{ background:GREEN, color:'#fff', fontWeight:600, fontSize:'12.5px', padding:'6px 14px', borderRadius:'14px', border:'none', cursor:'pointer' }}>Approve</button>
                      <button onClick={() => item.kind === 'user' ? decideUser(item.id,'reject') : decideJob(item.id,'reject')} style={{ background:'#fff', color:RED, border:`1px solid ${RED}`, fontWeight:600, fontSize:'12.5px', padding:'6px 14px', borderRadius:'14px', cursor:'pointer' }}>Reject</button>
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
                <ExportButton onClick={() => exportToExcel('users', users.map(u => ({ Name:u.fullName, Email:u.email, Role:u.role, Nationality:u.nationality, Status:u.approvalStatus, Active:u.isActive })))} />
              </div>
              <div className="admin-card" style={{ overflow:'hidden' }}>
                {users.map((u, i) => (
                  <div key={u.id} className="admin-table-row" style={{ display:'flex', flexWrap:'wrap', justifyContent:'space-between', alignItems:'center', gap:'10px', padding:'14px 18px', borderBottom: i < users.length-1 ? '1px solid #f0f0f5' : 'none' }}>
                    <div>
                      <p style={{ fontWeight:600, color:'#1a1a1a', fontSize:'14px' }}>{u.fullName}</p>
                      <p style={{ color:'#777', fontSize:'12.5px' }}>{u.email} · {u.nationality} · <span style={{ textTransform:'capitalize' }}>{u.role}</span></p>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap' }}>
                      <StatusPill status={u.approvalStatus} />
                      {u.role !== 'coordinator' && <button onClick={() => assignRole(u.id,'coordinator')} style={{ background:INDIGO, color:'#fff', fontSize:'12px', fontWeight:600, padding:'5px 12px', borderRadius:'12px', border:'none', cursor:'pointer' }}>Make Coordinator</button>}
                      {u.role !== 'admin' && u.id !== user.id && <button onClick={() => assignRole(u.id,'admin')} style={{ background:'#fff', color:'#444', fontSize:'12px', fontWeight:600, padding:'5px 12px', borderRadius:'12px', border:'1px solid #ccc', cursor:'pointer' }}>Make Admin</button>}
                      <button onClick={() => setEditUser({ ...u })} style={{ background:'#fff', color:GOLD, fontSize:'12px', fontWeight:600, padding:'5px 12px', borderRadius:'12px', border:`1px solid ${GOLD}`, cursor:'pointer' }}>Edit</button>
                      {u.id !== user.id && <button onClick={() => removeUser(u.id)} style={{ background:'#fff', color:RED, fontSize:'12px', fontWeight:600, padding:'5px 12px', borderRadius:'12px', border:`1px solid ${RED}`, cursor:'pointer' }}>Delete</button>}
                    </div>
                  </div>
                ))}
                {users.length === 0 && <p style={{ padding:'18px', color:'#888', fontSize:'13px' }}>No users yet.</p>}
              </div>
            </>
          )}

          {tab === 'approvals' && (
            <>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' }}>
                <h2 style={{ fontWeight:700, fontSize:'17px', color:'#1a1a1a' }}>Pending Approvals</h2>
                <ExportButton onClick={() => exportToExcel('approvals', [
                  ...approvals.users.map(u => ({ Type:'New User', Name:u.fullName, Email:u.email, Nationality:u.nationality })),
                  ...approvals.jobs.map(j => ({ Type:'Job Posting', Title:j.title, Company:j.company, SubmittedBy:j.coordinator?.fullName })),
                ])} />
              </div>
              <p style={{ color:'#666', fontSize:'13px', marginBottom:'14px' }}>Non-Indian user registrations and coordinator-submitted jobs land here before going live.</p>
              <div className="admin-card" style={{ overflow:'hidden' }}>
                {approvals.users.length === 0 && approvals.jobs.length === 0 && (
                  <p style={{ padding:'18px', color:'#888', fontSize:'13px' }}>Nothing pending right now.</p>
                )}
                {approvals.users.map((u, i) => (
                  <div key={`u-${u.id}`} className="admin-table-row" style={{ display:'flex', justifyContent:'space-between', gap:'12px', padding:'14px 18px', borderBottom:'1px solid #f0f0f5' }}>
                    <div>
                      <span style={{ fontSize:'11px', fontWeight:700, color:INDIGO, background:'#eef0fd', padding:'2px 8px', borderRadius:'10px' }}>New User</span>
                      <p style={{ fontWeight:600, color:'#1a1a1a', fontSize:'14px', marginTop:'6px' }}>{u.fullName} ({u.nationality})</p>
                      <p style={{ color:'#777', fontSize:'12.5px', marginTop:'2px' }}>{u.email}</p>
                    </div>
                    <div style={{ display:'flex', gap:'8px', alignSelf:'center', flexShrink:0, flexWrap:'wrap' }}>
                      <button onClick={() => decideUser(u.id,'approve')} style={{ background:GREEN, color:'#fff', fontWeight:600, fontSize:'12.5px', padding:'6px 14px', borderRadius:'14px', border:'none', cursor:'pointer' }}>Approve</button>
                      <button onClick={() => decideUser(u.id,'reject')} style={{ background:'#fff', color:RED, border:`1px solid ${RED}`, fontWeight:600, fontSize:'12.5px', padding:'6px 14px', borderRadius:'14px', cursor:'pointer' }}>Reject</button>
                      <button onClick={() => setEditApprovalUser({ ...u })} style={{ background:'#fff', color:GOLD, border:`1px solid ${GOLD}`, fontWeight:600, fontSize:'12.5px', padding:'6px 14px', borderRadius:'14px', cursor:'pointer' }}>Edit</button>
                      <button onClick={() => removeApprovalUser(u.id)} style={{ background:'#fff', color:'#888', border:'1px solid #ccc', fontWeight:600, fontSize:'12.5px', padding:'6px 14px', borderRadius:'14px', cursor:'pointer' }}>Delete</button>
                    </div>
                  </div>
                ))}
                {approvals.jobs.map((j, i) => (
                  <div key={`j-${j.id}`} className="admin-table-row" style={{ display:'flex', justifyContent:'space-between', gap:'12px', padding:'14px 18px', borderBottom: i < approvals.jobs.length-1 ? '1px solid #f0f0f5' : 'none' }}>
                    <div>
                      <span style={{ fontSize:'11px', fontWeight:700, color:GOLD, background:'#fff7ea', padding:'2px 8px', borderRadius:'10px' }}>Job Posting</span>
                      <p style={{ fontWeight:600, color:'#1a1a1a', fontSize:'14px', marginTop:'6px' }}>{j.title}</p>
                      <p style={{ color:'#777', fontSize:'12.5px', marginTop:'2px' }}>{j.company} · Submitted by {j.coordinator?.fullName || 'Coordinator'}</p>
                    </div>
                    <div style={{ display:'flex', gap:'8px', alignSelf:'center', flexShrink:0, flexWrap:'wrap' }}>
                      <button onClick={() => decideJob(j.id,'approve')} style={{ background:GREEN, color:'#fff', fontWeight:600, fontSize:'12.5px', padding:'6px 14px', borderRadius:'14px', border:'none', cursor:'pointer' }}>Approve</button>
                      <button onClick={() => decideJob(j.id,'reject')} style={{ background:'#fff', color:RED, border:`1px solid ${RED}`, fontWeight:600, fontSize:'12.5px', padding:'6px 14px', borderRadius:'14px', cursor:'pointer' }}>Reject</button>
                      <button onClick={() => setEditApprovalJob({ ...j })} style={{ background:'#fff', color:GOLD, border:`1px solid ${GOLD}`, fontWeight:600, fontSize:'12.5px', padding:'6px 14px', borderRadius:'14px', cursor:'pointer' }}>Edit</button>
                      <button onClick={() => removeApprovalJob(j.id)} style={{ background:'#fff', color:'#888', border:'1px solid #ccc', fontWeight:600, fontSize:'12.5px', padding:'6px 14px', borderRadius:'14px', cursor:'pointer' }}>Delete</button>
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
                <div style={{ display:'flex', gap:'8px' }}>
                  <ExportButton onClick={() => exportToExcel('coordinators', coordinators.map(c => ({ Name:c.fullName, Email:c.email, Submitted:c.submissions, Approved:c.approved })))} />
                  <button onClick={() => setAssignOpen(true)} style={btnPrimary}>+ Assign Coordinator</button>
                </div>
              </div>
              <div className="admin-grid">
                {coordinators.map((c) => (
                  <div key={c.id} className="admin-card" style={{ padding:'18px', gridColumn:'span 2' }}>
                    <p style={{ fontWeight:700, color:'#1a1a1a', fontSize:'14px' }}>{c.fullName}</p>
                    <p style={{ color:'#777', fontSize:'12.5px', marginTop:'2px' }}>{c.email}</p>
                    <div style={{ display:'flex', gap:'18px', marginTop:'12px' }}>
                      <div><span style={{ color:INDIGO, fontWeight:700, fontSize:'1.2rem' }}>{c.submissions}</span><div style={{ fontSize:'11.5px', color:'#777' }}>Submitted</div></div>
                      <div><span style={{ color:GREEN, fontWeight:700, fontSize:'1.2rem' }}>{c.approved}</span><div style={{ fontSize:'11.5px', color:'#777' }}>Approved</div></div>
                    </div>
                  </div>
                ))}
                {coordinators.length === 0 && <p style={{ color:'#888', fontSize:'13px' }}>No coordinators assigned yet.</p>}
              </div>

              {assignOpen && (
                <Modal title="Assign Coordinator" onClose={() => setAssignOpen(false)}>
                  <p style={{ fontSize:'13px', color:'#666', marginBottom:'10px' }}>Pick an existing user to promote to coordinator.</p>
                  <div style={{ maxHeight:'320px', overflowY:'auto' }}>
                    {users.filter(u => u.role !== 'coordinator' && u.role !== 'admin').map(u => (
                      <div key={u.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid #f0f0f5' }}>
                        <div>
                          <p style={{ fontWeight:600, fontSize:'13.5px', color:'#1a1a1a' }}>{u.fullName}</p>
                          <p style={{ fontSize:'12px', color:'#888' }}>{u.email}</p>
                        </div>
                        <button onClick={async () => { await assignRole(u.id, 'coordinator'); setAssignOpen(false); }} style={{ ...btnPrimary, padding:'6px 14px', fontSize:'12px' }}>Assign</button>
                      </div>
                    ))}
                    {users.filter(u => u.role !== 'coordinator' && u.role !== 'admin').length === 0 && (
                      <p style={{ color:'#888', fontSize:'13px' }}>No eligible users to assign.</p>
                    )}
                  </div>
                </Modal>
              )}
            </>
          )}

          {tab === 'reports' && reports && (
            <>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' }}>
                <h2 style={{ fontWeight:700, fontSize:'17px', color:'#1a1a1a' }}>Reports</h2>
                <ExportButton onClick={() => exportToExcel('full-report-summary', [reports.summary])} />
              </div>
              <div className="admin-grid">
                <StatCard label="Total Jobs Posted" value={reports.summary.totalJobs} color={INDIGO} />
                <StatCard label="Total Applications" value={reports.summary.totalApplications} color={GOLD} />
                <StatCard label="Active Recruiters" value={reports.summary.activeRecruiters} color={GREEN} />
                <StatCard label="Active Job Seekers" value={reports.summary.activeSeekers} color={RED} />
                <StatCard label="Pending Approvals" value={reports.summary.pendingApprovals} color={INDIGO} />
                <StatCard label="Coordinators" value={coordinators.length} color={GOLD} />
              </div>

              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', margin:'22px 0 10px' }}>
                <h3 style={{ fontWeight:700, fontSize:'15px', color:'#1a1a1a' }}>Jobs by Category</h3>
                <ExportButton onClick={() => exportToExcel('jobs-by-category', reports.jobsByCategory.map(r => ({ Category:r.category || 'Uncategorized', Jobs:r.count })))} />
              </div>
              <div className="admin-card" style={{ overflow:'hidden' }}>
                {reports.jobsByCategory.length === 0 ? <p style={{ padding:'16px', color:'#888', fontSize:'13px' }}>No data yet.</p> : reports.jobsByCategory.map((r, i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'10px 18px', borderBottom: i < reports.jobsByCategory.length-1 ? '1px solid #f0f0f5' : 'none', fontSize:'13.5px' }}>
                    <span style={{ color:'#333' }}>{r.category || 'Uncategorized'}</span>
                    <strong style={{ color:INDIGO }}>{r.count}</strong>
                  </div>
                ))}
              </div>

              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', margin:'22px 0 10px' }}>
                <h3 style={{ fontWeight:700, fontSize:'15px', color:'#1a1a1a' }}>Applications Over Time</h3>
                <ExportButton onClick={() => exportToExcel('applications-over-time', reports.applicationsOverTime.map(r => ({ Month:r.month, Applications:r.count })))} />
              </div>
              <div className="admin-card" style={{ overflow:'hidden' }}>
                {reports.applicationsOverTime.length === 0 ? <p style={{ padding:'16px', color:'#888', fontSize:'13px' }}>No data yet.</p> : reports.applicationsOverTime.map((r, i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'10px 18px', borderBottom: i < reports.applicationsOverTime.length-1 ? '1px solid #f0f0f5' : 'none', fontSize:'13.5px' }}>
                    <span style={{ color:'#333' }}>{r.month}</span>
                    <strong style={{ color:GOLD }}>{r.count}</strong>
                  </div>
                ))}
              </div>

              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', margin:'22px 0 10px' }}>
                <h3 style={{ fontWeight:700, fontSize:'15px', color:'#1a1a1a' }}>Recruiter Performance</h3>
                <ExportButton onClick={() => exportToExcel('recruiter-performance', reports.recruiterPerformance.map(r => ({ Recruiter:r.recruiter, Email:r.email, JobsPosted:r.jobsPosted, Applicants:r.applicants })))} />
              </div>
              <div className="admin-card" style={{ overflow:'hidden' }}>
                {reports.recruiterPerformance.length === 0 ? <p style={{ padding:'16px', color:'#888', fontSize:'13px' }}>No recruiters yet.</p> : reports.recruiterPerformance.map((r, i) => (
                  <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'10px 18px', borderBottom: i < reports.recruiterPerformance.length-1 ? '1px solid #f0f0f5' : 'none', fontSize:'13.5px' }}>
                    <span style={{ color:'#333' }}>{r.recruiter}</span>
                    <span style={{ color:'#666' }}>{r.jobsPosted} jobs · {r.applicants} applicants</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'albums' && (
            <>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' }}>
                <h2 style={{ fontWeight:700, fontSize:'17px', color:'#1a1a1a' }}>Event Albums</h2>
                <div style={{ display:'flex', gap:'8px' }}>
                  <ExportButton onClick={() => exportToExcel('albums', albums.map(a => ({ Title:a.title, Event:a.event?.title || '', Images:a.images?.length || 0 })))} />
                  <button onClick={() => setAlbumModal({})} style={btnPrimary}>+ Create Album</button>
                </div>
              </div>
              <div className="admin-grid">
                {albums.map((a, i) => (
                  <div key={a.id} className="admin-card" style={{ overflow:'hidden', gridColumn:'span 2' }}>
                    <div style={{ height:'100px', background: a.coverImageUrl ? `url(${a.coverImageUrl}) center/cover` : `linear-gradient(135deg, ${[INDIGO,GOLD,GREEN][i%3]}, #1a1a1a22)` }} />
                    <div style={{ padding:'14px' }}>
                      <p style={{ fontWeight:600, color:'#1a1a1a', fontSize:'14px' }}>{a.title}</p>
                      <p style={{ color:'#888', fontSize:'12px', marginTop:'2px' }}>{a.event?.title || 'Not linked to an event'} · {a.images?.length || 0} photos</p>
                      <div style={{ display:'flex', gap:'8px', marginTop:'10px', flexWrap:'wrap' }}>
                        <button onClick={() => setManageAlbum(a)} style={{ fontSize:'12px', color:GREEN, border:`1px solid ${GREEN}`, background:'#fff', padding:'5px 12px', borderRadius:'12px', cursor:'pointer' }}>Manage Photos</button>
                        <button onClick={() => setAlbumModal(a)} style={{ fontSize:'12px', color:INDIGO, border:`1px solid ${INDIGO}`, background:'#fff', padding:'5px 12px', borderRadius:'12px', cursor:'pointer' }}>Edit</button>
                        <button onClick={() => removeAlbum(a.id)} style={{ fontSize:'12px', color:RED, border:`1px solid ${RED}`, background:'#fff', padding:'5px 12px', borderRadius:'12px', cursor:'pointer' }}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
                {albums.length === 0 && <p style={{ color:'#888', fontSize:'13px' }}>No albums yet — create one for an upcoming or past event.</p>}
              </div>

              {albumModal && (
                <Modal title={albumModal.id ? 'Edit Album' : 'Create Album'} onClose={() => setAlbumModal(null)}>
                  <form onSubmit={saveAlbum}>
                    <label style={{ fontSize:'12.5px', color:'#555' }}>Album / Event Title</label>
                    <input name="title" defaultValue={albumModal.title} required style={inp} placeholder="e.g. IIPA Annual Meet 2026" />
                    <label style={{ fontSize:'12.5px', color:'#555' }}>Link to Event (optional)</label>
                    <select name="eventId" defaultValue={albumModal.eventId || ''} style={inp}>
                      <option value="">— No linked event —</option>
                      {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
                    </select>
                    <label style={{ fontSize:'12.5px', color:'#555' }}>Cover Image (optional)</label>
                    <input name="cover" type="file" accept="image/*" style={inp} />
                    <button type="submit" style={{ ...btnPrimary, width:'100%' }}>{albumModal.id ? 'Save Changes' : 'Create Album'}</button>
                  </form>
                </Modal>
              )}

              {manageAlbum && (
                <Modal title={`Photos — ${manageAlbum.title}`} onClose={() => setManageAlbum(null)}>
                  <form onSubmit={addImage} style={{ display:'flex', gap:'8px', marginBottom:'14px' }}>
                    <input name="image" type="file" accept="image/*" required style={{ flex:1, fontSize:'12.5px' }} />
                    <button type="submit" style={{ ...btnPrimary, padding:'8px 14px', fontSize:'12.5px' }}>Upload</button>
                  </form>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px' }}>
                    {(manageAlbum.images || []).map(img => (
                      <div key={img.id} style={{ position:'relative' }}>
                        <img src={img.imageUrl} alt="" style={{ width:'100%', height:'70px', objectFit:'cover', borderRadius:'8px' }} />
                        <button onClick={() => removeImage(img.id)} style={{ position:'absolute', top:'2px', right:'2px', background:'rgba(220,38,38,0.9)', color:'#fff', border:'none', borderRadius:'50%', width:'20px', height:'20px', fontSize:'12px', cursor:'pointer', lineHeight:1 }}>×</button>
                      </div>
                    ))}
                    {(!manageAlbum.images || manageAlbum.images.length === 0) && <p style={{ color:'#888', fontSize:'12.5px', gridColumn:'1/-1' }}>No photos uploaded yet.</p>}
                  </div>
                </Modal>
              )}
            </>
          )}

          {tab === 'branding' && (
            <>
              <h2 style={{ fontWeight:700, fontSize:'17px', color:'#1a1a1a', marginBottom:'14px' }}>Logo & Branding</h2>
              <div className="admin-grid">
                <div className="admin-card" style={{ padding:'20px', gridColumn:'span 3' }}>
                  <p style={{ fontWeight:600, color:'#1a1a1a', fontSize:'14px', marginBottom:'10px' }}>Header Logo</p>
                  <div style={{ width:'100%', height:'90px', border: settings.headerLogoUrl ? 'none' : '2px dashed #d6d6ee', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', color:'#999', fontSize:'13px', marginBottom:'10px', overflow:'hidden' }}>
                    {settings.headerLogoUrl ? <img src={settings.headerLogoUrl} alt="Header logo" style={{ maxHeight:'90px', maxWidth:'100%' }} /> : 'No logo uploaded — defaults to "IIPA JOBS" text'}
                  </div>
                  <label style={{ ...btnPrimary, display:'inline-block', cursor:'pointer' }}>
                    Upload Header Logo
                    <input type="file" accept="image/*" style={{ display:'none' }} onChange={e => uploadLogo('headerLogo', e.target.files[0])} />
                  </label>
                </div>
                <div className="admin-card" style={{ padding:'20px', gridColumn:'span 3' }}>
                  <p style={{ fontWeight:600, color:'#1a1a1a', fontSize:'14px', marginBottom:'10px' }}>Footer Logo</p>
                  <div style={{ width:'100%', height:'90px', border: settings.footerLogoUrl ? 'none' : '2px dashed #d6d6ee', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', color:'#999', fontSize:'13px', marginBottom:'10px', overflow:'hidden' }}>
                    {settings.footerLogoUrl ? <img src={settings.footerLogoUrl} alt="Footer logo" style={{ maxHeight:'90px', maxWidth:'100%' }} /> : 'No logo uploaded — defaults to "IIPA JOBS" text'}
                  </div>
                  <label style={{ ...btnPrimary, display:'inline-block', cursor:'pointer' }}>
                    Upload Footer Logo
                    <input type="file" accept="image/*" style={{ display:'none' }} onChange={e => uploadLogo('footerLogo', e.target.files[0])} />
                  </label>
                </div>
              </div>
              <p style={{ color:'#888', fontSize:'12.5px', marginTop:'14px' }}>Only Admin users can change branding. Changes apply immediately on the header and footer across the site.</p>
            </>
          )}
        </main>
      </div>

      {editUser && (
        <Modal title="Edit User" onClose={() => setEditUser(null)}>
          <form onSubmit={saveUser}>
            <label style={{ fontSize:'12.5px', color:'#555' }}>Full Name</label>
            <input style={inp} value={editUser.fullName} onChange={e => setEditUser({ ...editUser, fullName:e.target.value })} required />
            <label style={{ fontSize:'12.5px', color:'#555' }}>Email</label>
            <input style={inp} type="email" value={editUser.email} onChange={e => setEditUser({ ...editUser, email:e.target.value })} required />
            <label style={{ fontSize:'12.5px', color:'#555' }}>Role</label>
            <select style={inp} value={editUser.role} onChange={e => setEditUser({ ...editUser, role:e.target.value })}>
              {['seeker','recruiter','coordinator','admin'].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <label style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', marginBottom:'14px' }}>
              <input type="checkbox" checked={!!editUser.isActive} onChange={e => setEditUser({ ...editUser, isActive:e.target.checked })} /> Active
            </label>
            <button type="submit" style={{ ...btnPrimary, width:'100%' }}>Save Changes</button>
          </form>
        </Modal>
      )}

      {editApprovalUser && (
        <Modal title="Edit Pending User" onClose={() => setEditApprovalUser(null)}>
          <form onSubmit={saveApprovalUser}>
            <label style={{ fontSize:'12.5px', color:'#555' }}>Full Name</label>
            <input style={inp} value={editApprovalUser.fullName} onChange={e => setEditApprovalUser({ ...editApprovalUser, fullName:e.target.value })} required />
            <label style={{ fontSize:'12.5px', color:'#555' }}>Email</label>
            <input style={inp} type="email" value={editApprovalUser.email} onChange={e => setEditApprovalUser({ ...editApprovalUser, email:e.target.value })} required />
            <label style={{ fontSize:'12.5px', color:'#555' }}>Nationality</label>
            <input style={inp} value={editApprovalUser.nationality || ''} onChange={e => setEditApprovalUser({ ...editApprovalUser, nationality:e.target.value })} />
            <button type="submit" style={{ ...btnPrimary, width:'100%' }}>Save Changes</button>
          </form>
        </Modal>
      )}

      {editApprovalJob && (
        <Modal title="Edit Pending Job" onClose={() => setEditApprovalJob(null)}>
          <form onSubmit={saveApprovalJob}>
            <label style={{ fontSize:'12.5px', color:'#555' }}>Job Title</label>
            <input style={inp} value={editApprovalJob.title} onChange={e => setEditApprovalJob({ ...editApprovalJob, title:e.target.value })} required />
            <label style={{ fontSize:'12.5px', color:'#555' }}>Company</label>
            <input style={inp} value={editApprovalJob.company} onChange={e => setEditApprovalJob({ ...editApprovalJob, company:e.target.value })} required />
            <label style={{ fontSize:'12.5px', color:'#555' }}>Location</label>
            <input style={inp} value={editApprovalJob.location || ''} onChange={e => setEditApprovalJob({ ...editApprovalJob, location:e.target.value })} />
            <label style={{ fontSize:'12.5px', color:'#555' }}>Description</label>
            <textarea style={{ ...inp, resize:'none' }} rows={4} value={editApprovalJob.description || ''} onChange={e => setEditApprovalJob({ ...editApprovalJob, description:e.target.value })} />
            <button type="submit" style={{ ...btnPrimary, width:'100%' }}>Save Changes</button>
          </form>
        </Modal>
      )}
    </div>
  );
}
