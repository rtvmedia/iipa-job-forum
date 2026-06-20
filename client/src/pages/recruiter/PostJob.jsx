import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const CATEGORIES = ['Technology','Finance','Human Resources','Marketing','Engineering','Healthcare','Education','Sales'];
const TYPES      = ['full-time','part-time','contract','remote','internship'];
const inp = { width:'100%', border:'1px solid #ddd', borderRadius:'6px', padding:'10px 12px', fontSize:'14px', outline:'none', boxSizing:'border-box' };

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title:'', company:'', location:'', type:'full-time', category:'Technology', description:'', requirements:'', salaryMin:'', salaryMax:'', deadline:'' });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async e => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      await api.post('/jobs', { ...form, salaryMin: form.salaryMin ? Number(form.salaryMin) : null, salaryMax: form.salaryMax ? Number(form.salaryMax) : null });
      navigate('/recruiter/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally { setSaving(false); }
  };

  return (
    <div style={{ maxWidth:'680px', margin:'0 auto', padding:'24px 16px' }}>
      <button onClick={() => navigate('/recruiter/dashboard')}
        style={{ background:'none', border:'none', color:'#FF9933', fontSize:'14px', fontWeight:500, cursor:'pointer', marginBottom:'16px', padding:0 }}>
        ← Back to Dashboard
      </button>

      <div style={{ background:'white', borderRadius:'8px', boxShadow:'0 0 0 1px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.06)', overflow:'hidden' }}>
        <div style={{ background:'#1a237e', padding:'20px 24px' }}>
          <h1 style={{ color:'white', fontWeight:700, fontSize:'18px' }}>Post a New Job</h1>
          <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'13px', marginTop:'4px' }}>Fill in the details to publish your vacancy</p>
        </div>

        <form onSubmit={handleSubmit} style={{ padding:'24px', display:'flex', flexDirection:'column', gap:'16px' }}>
          <div>
            <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>Job Title *</label>
            <input required value={form.title} onChange={e=>set('title',e.target.value)}
              style={inp} onFocus={e=>e.target.style.borderColor='#1a237e'} onBlur={e=>e.target.style.borderColor='#ddd'}
              placeholder="e.g. Senior React Developer" />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <div>
              <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>Company *</label>
              <input required value={form.company} onChange={e=>set('company',e.target.value)}
                style={inp} onFocus={e=>e.target.style.borderColor='#1a237e'} onBlur={e=>e.target.style.borderColor='#ddd'} placeholder="Company name" />
            </div>
            <div>
              <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>Location</label>
              <input value={form.location} onChange={e=>set('location',e.target.value)}
                style={inp} onFocus={e=>e.target.style.borderColor='#1a237e'} onBlur={e=>e.target.style.borderColor='#ddd'} placeholder="Mumbai / Remote" />
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <div>
              <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>Job Type</label>
              <select value={form.type} onChange={e=>set('type',e.target.value)} style={inp}>
                {TYPES.map(t => <option key={t} value={t} style={{ textTransform:'capitalize' }}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>Category</label>
              <select value={form.category} onChange={e=>set('category',e.target.value)} style={inp}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>Job Description *</label>
            <textarea required value={form.description} onChange={e=>set('description',e.target.value)} rows={5}
              style={{ ...inp, resize:'none' }} onFocus={e=>e.target.style.borderColor='#1a237e'} onBlur={e=>e.target.style.borderColor='#ddd'}
              placeholder="Describe the role, responsibilities, and team…" />
          </div>

          <div>
            <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>Requirements</label>
            <textarea value={form.requirements} onChange={e=>set('requirements',e.target.value)} rows={3}
              style={{ ...inp, resize:'none' }} onFocus={e=>e.target.style.borderColor='#1a237e'} onBlur={e=>e.target.style.borderColor='#ddd'}
              placeholder="Skills, experience, qualifications required…" />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'12px' }}>
            <div>
              <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>Min Salary (₹)</label>
              <input type="number" value={form.salaryMin} onChange={e=>set('salaryMin',e.target.value)}
                style={inp} onFocus={e=>e.target.style.borderColor='#1a237e'} onBlur={e=>e.target.style.borderColor='#ddd'} placeholder="80000" />
            </div>
            <div>
              <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>Max Salary (₹)</label>
              <input type="number" value={form.salaryMax} onChange={e=>set('salaryMax',e.target.value)}
                style={inp} onFocus={e=>e.target.style.borderColor='#1a237e'} onBlur={e=>e.target.style.borderColor='#ddd'} placeholder="150000" />
            </div>
            <div>
              <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>Deadline</label>
              <input type="date" value={form.deadline} onChange={e=>set('deadline',e.target.value)}
                style={inp} onFocus={e=>e.target.style.borderColor='#1a237e'} onBlur={e=>e.target.style.borderColor='#ddd'} />
            </div>
          </div>

          {error && <p style={{ color:'#c62828', fontSize:'13px' }}>{error}</p>}

          <button type="submit" disabled={saving}
            style={{ background:'#1a237e', color:'white', fontWeight:600, fontSize:'14px', padding:'12px', borderRadius:'6px', border:'none', opacity:saving?0.6:1, cursor:saving?'not-allowed':'pointer' }}>
            {saving ? 'Publishing…' : 'Publish Job'}
          </button>
        </form>
      </div>
    </div>
  );
}
