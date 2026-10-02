import { useState, useEffect, useRef } from 'react';
import api from '../../api/axios';
import { resizeImage } from '../../utils/resizeImage';
import { exportToExcel } from '../../utils/exportCsv';

const INDIGO = '#4338ca', GOLD = '#d97706', GREEN = '#16a34a', RED = '#dc2626';
const inp = { width:'100%', border:'1px solid #ddd', borderRadius:'8px', padding:'9px 12px', fontSize:'13.5px', outline:'none', boxSizing:'border-box', marginBottom:'10px' };
const btnPrimary = { background:INDIGO, color:'#fff', fontWeight:600, fontSize:'13px', padding:'9px 20px', borderRadius:'16px', border:'none', cursor:'pointer' };
const miniBtn = (c) => ({ background:'#fff', color:c, fontSize:'12px', fontWeight:600, padding:'5px 12px', borderRadius:'12px', border:`1px solid ${c}`, cursor:'pointer' });
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

function ImageField({ label, hint, existingUrl, file, removed, onPick, onRemove }) {
  const ref = useRef(null);
  const [preview, setPreview] = useState(null);
  useEffect(() => {
    if (!file) { setPreview(null); return; }
    const u = URL.createObjectURL(file);
    setPreview(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);
  const shown = preview || (removed ? null : existingUrl);
  return (
    <div style={{ marginBottom:'12px' }}>
      <label style={{ fontSize:'12.5px', color:'#555', fontWeight:600 }}>{label} <span style={{ color:'#999', fontWeight:400 }}>{hint}</span></label>
      <div style={{ marginTop:'6px', border: shown ? '1px solid #e6e6f2' : '2px dashed #d6d6ee', borderRadius:'10px', minHeight:'90px', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', background:'#fafaff' }}>
        {shown ? <img src={shown} alt={label} style={{ maxWidth:'100%', maxHeight:'160px', objectFit:'contain' }} /> : <span style={{ color:'#999', fontSize:'12.5px' }}>No image</span>}
      </div>
      <div style={{ display:'flex', gap:'8px', marginTop:'8px' }}>
        <button type="button" onClick={() => ref.current.click()} style={miniBtn(INDIGO)}>{shown ? 'Replace' : 'Upload'}</button>
        {shown && <button type="button" onClick={onRemove} style={miniBtn(RED)}>Delete image</button>}
        <input ref={ref} type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" style={{ display:'none' }}
          onChange={(e) => { const f = e.target.files[0]; e.target.value = ''; if (f) onPick(f); }} />
      </div>
    </div>
  );
}

function EventModal({ event, onClose, onSaved }) {
  const isEdit = !!event.id;
  const [f, setF] = useState({
    title: event.title || '', description: event.description || '',
    eventDate: event.eventDate ? String(event.eventDate).slice(0, 10) : '',
    location: event.location || '', isActive: event.isActive !== false,
  });
  const [image, setImage] = useState(null);   const [imageRemoved, setImageRemoved] = useState(false);
  const [banner, setBanner] = useState(null); const [bannerRemoved, setBannerRemoved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const pick = async (file, setter, setRemoved, opts) => {
    setError('');
    if (!ALLOWED.includes(file.type)) { setError('Only JPG, JPEG, PNG or WebP images are supported.'); return; }
    setter(await resizeImage(file, opts)); setRemoved(false);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!f.title.trim()) return setError('Event title is required.');
    if (!f.eventDate) return setError('Event date is required.');
    setBusy(true); setError('');
    try {
      const fd = new FormData();
      fd.append('title', f.title); fd.append('description', f.description); fd.append('eventDate', f.eventDate);
      fd.append('location', f.location); fd.append('isActive', String(f.isActive));
      if (image) fd.append('image', image); else if (imageRemoved) fd.append('removeImage', 'true');
      if (banner) fd.append('banner', banner); else if (bannerRemoved) fd.append('removeBanner', 'true');
      if (isEdit) await api.put(`/admin/events/${event.id}`, fd); else await api.post('/admin/events', fd);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save the event.');
    } finally { setBusy(false); }
  };

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.45)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:'16px' }} onClick={onClose}>
      <div style={{ background:'#fff', borderRadius:'14px', padding:'22px', width:'min(560px, 100%)', maxHeight:'92vh', overflowY:'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px' }}>
          <h3 style={{ fontWeight:700, fontSize:'16px', color:'#1a1a1a' }}>{isEdit ? 'Edit Event' : 'Add Event'}</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:'20px', cursor:'pointer', color:'#888' }}>×</button>
        </div>
        <form onSubmit={submit}>
          <label style={{ fontSize:'12.5px', color:'#555' }}>Event Title *</label>
          <input style={inp} value={f.title} onChange={e => setF({ ...f, title: e.target.value })} maxLength={200} placeholder="e.g. IIPA Professional Networking Event" />
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
            <div><label style={{ fontSize:'12.5px', color:'#555' }}>Event Date *</label>
              <input style={inp} type="date" value={f.eventDate} onChange={e => setF({ ...f, eventDate: e.target.value })} /></div>
            <div><label style={{ fontSize:'12.5px', color:'#555' }}>Location (optional)</label>
              <input style={inp} value={f.location} onChange={e => setF({ ...f, location: e.target.value })} maxLength={150} /></div>
          </div>
          <label style={{ fontSize:'12.5px', color:'#555' }}>Short Description</label>
          <textarea style={{ ...inp, resize:'none' }} rows={3} maxLength={600} value={f.description} onChange={e => setF({ ...f, description: e.target.value })} />
          <ImageField label="Event Image" hint="(card photo · JPG, PNG, WebP)" existingUrl={event.imageUrl} file={image} removed={imageRemoved}
            onPick={(file) => pick(file, setImage, setImageRemoved, { maxWidth:1200, maxHeight:1200 })}
            onRemove={() => { setImage(null); setImageRemoved(true); }} />
          <ImageField label="Event Banner" hint="(wide, shown in the carousel · JPG, PNG, WebP)" existingUrl={event.bannerUrl} file={banner} removed={bannerRemoved}
            onPick={(file) => pick(file, setBanner, setBannerRemoved, { maxWidth:1920, maxHeight:900 })}
            onRemove={() => { setBanner(null); setBannerRemoved(true); }} />
          <label style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', marginBottom:'14px' }}>
            <input type="checkbox" checked={f.isActive} onChange={e => setF({ ...f, isActive: e.target.checked })} /> Active (visible on the public website)
          </label>
          {error && <p style={{ color:RED, fontSize:'13px', marginBottom:'10px' }}>{error}</p>}
          <button type="submit" disabled={busy} style={{ ...btnPrimary, width:'100%', opacity: busy ? 0.6 : 1 }}>{busy ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Event'}</button>
        </form>
      </div>
    </div>
  );
}

export default function AdminEvents({ onChanged }) {
  const [events, setEvents] = useState(null);
  const [modal, setModal] = useState(null);
  const [error, setError] = useState('');

  const load = () => api.get('/admin/events').then(r => setEvents(r.data)).catch(() => setError('Could not load events.'));
  useEffect(() => { load(); }, []);
  const changed = () => { load(); onChanged && onChanged(); };

  const toggle = async (ev) => { try { await api.put(`/admin/events/${ev.id}`, { isActive: String(!ev.isActive) }); changed(); } catch { setError('Could not update the event.'); } };
  const remove = async (ev) => { if (!confirm(`Delete "${ev.title}"? This cannot be undone.`)) return; try { await api.delete(`/admin/events/${ev.id}`); changed(); } catch { setError('Could not delete the event.'); } };
  const move = async (i, dir) => {
    const j = i + dir; if (j < 0 || j >= events.length) return;
    const next = [...events]; [next[i], next[j]] = [next[j], next[i]];
    setEvents(next);
    try { await api.put('/admin/events/reorder', { ids: next.map(e => e.id) }); onChanged && onChanged(); } catch { setError('Could not save the new order.'); load(); }
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric', timeZone:'UTC' }) : '';

  return (
    <>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'14px', flexWrap:'wrap', gap:'8px' }}>
        <h2 style={{ fontWeight:700, fontSize:'17px', color:'#1a1a1a' }}>Events & Banners</h2>
        <div style={{ display:'flex', gap:'8px' }}>
          {events?.length > 0 && <button onClick={() => exportToExcel('events', events.map(e => ({ Title:e.title, Date:fmt(e.eventDate), Location:e.location || '', Status:e.isActive ? 'Active' : 'Inactive', Order:e.displayOrder })))}
            style={{ background:'#fff', color:GREEN, border:`1px solid ${GREEN}`, fontWeight:600, fontSize:'12.5px', padding:'7px 16px', borderRadius:'14px', cursor:'pointer' }}>⬇ Export to Excel</button>}
          <button onClick={() => setModal({})} style={btnPrimary}>+ Add Event</button>
        </div>
      </div>
      <p style={{ color:'#666', fontSize:'13px', marginBottom:'14px' }}>Only <strong>Active</strong> events appear on the public website. Use the arrows to set the display order.</p>
      {error && <p style={{ color:RED, fontSize:'13px', marginBottom:'10px' }}>{error}</p>}

      <div style={{ background:'#fff', borderRadius:'14px', border:'1px solid #e6e6f2', boxShadow:'0 4px 16px rgba(67,56,202,0.08)', overflow:'hidden' }}>
        {events === null && <p style={{ padding:'18px', color:'#888', fontSize:'13px' }}>Loading…</p>}
        {events?.length === 0 && <p style={{ padding:'18px', color:'#888', fontSize:'13px' }}>No events yet — click “Add Event” to create the first one.</p>}
        {events?.map((ev, i) => (
          <div key={ev.id} style={{ display:'flex', flexWrap:'wrap', alignItems:'center', gap:'12px', padding:'12px 16px', borderBottom: i < events.length - 1 ? '1px solid #f0f0f5' : 'none' }}>
            <div style={{ width:'84px', height:'56px', borderRadius:'8px', background:'#f0f0f8', overflow:'hidden', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', color:'#aaa', fontSize:'11px' }}>
              {(ev.imageUrl || ev.bannerUrl) ? <img src={ev.imageUrl || ev.bannerUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : 'No image'}
            </div>
            <div style={{ flex:'1 1 200px', minWidth:0 }}>
              <p style={{ fontWeight:600, fontSize:'14px', color:'#1a1a1a' }}>{ev.title}</p>
              <p style={{ color:'#777', fontSize:'12.5px' }}>{fmt(ev.eventDate)}{ev.location ? ` · ${ev.location}` : ''}</p>
            </div>
            <span style={{ background: ev.isActive ? '#e8f5e9' : '#f1f1f1', color: ev.isActive ? GREEN : '#777', fontSize:'11.5px', fontWeight:700, padding:'3px 12px', borderRadius:'12px' }}>{ev.isActive ? 'Active' : 'Inactive'}</span>
            <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
              <button onClick={() => move(i, -1)} disabled={i === 0} title="Move up" style={{ ...miniBtn('#555'), opacity: i === 0 ? 0.4 : 1 }}>↑</button>
              <button onClick={() => move(i, 1)} disabled={i === events.length - 1} title="Move down" style={{ ...miniBtn('#555'), opacity: i === events.length - 1 ? 0.4 : 1 }}>↓</button>
              <button onClick={() => toggle(ev)} style={miniBtn(ev.isActive ? '#777' : GREEN)}>{ev.isActive ? 'Deactivate' : 'Activate'}</button>
              <button onClick={() => setModal(ev)} style={miniBtn(GOLD)}>Edit</button>
              <button onClick={() => remove(ev)} style={miniBtn(RED)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {modal && <EventModal event={modal} onClose={() => setModal(null)} onSaved={() => { setModal(null); changed(); }} />}
    </>
  );
}
