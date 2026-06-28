import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const BLUE = '#0a66c2';
const inp = { width:'100%', border:'1px solid #ddd', borderRadius:'6px', padding:'10px 12px', fontSize:'14px', outline:'none', boxSizing:'border-box' };

export default function CompanyProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName:'', phone:'', location:'', companyName:'', companyWebsite:'', companyIndustry:'', companyAbout:'' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);

  useEffect(() => {
    api.get('/auth/profile').then(r => {
      const { fullName, phone, location, companyName, companyWebsite, companyIndustry, companyAbout } = r.data;
      setForm({ fullName:fullName||'', phone:phone||'', location:location||'', companyName:companyName||'', companyWebsite:companyWebsite||'', companyIndustry:companyIndustry||'', companyAbout:companyAbout||'' });
    }).catch(() => {});
  }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const focus = e => e.target.style.borderColor = BLUE;
  const blur  = e => e.target.style.borderColor = '#ddd';

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true); setSaved(false);
    try {
      await api.put('/auth/profile', form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally { setSaving(false); }
  };

  return (
    <div style={{ maxWidth:'680px', margin:'0 auto', padding:'24px 16px' }}>
      <button onClick={() => navigate('/recruiter/dashboard')}
        style={{ background:'none', border:'none', color:BLUE, fontSize:'14px', fontWeight:500, cursor:'pointer', marginBottom:'16px', padding:0 }}>
        ← Back to Dashboard
      </button>

      <div style={{ background:'white', borderRadius:'8px', boxShadow:'0 0 0 1px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.06)', overflow:'hidden' }}>
        <div style={{ background:'linear-gradient(135deg, #062b56 0%, #0a4a8c 100%)', padding:'20px 24px' }}>
          <h1 style={{ color:'white', fontWeight:700, fontSize:'18px' }}>Company Profile</h1>
          <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'13px', marginTop:'4px' }}>This information appears on your job postings</p>
        </div>

        <form onSubmit={handleSave} style={{ padding:'24px', display:'flex', flexDirection:'column', gap:'16px' }}>
          <div>
            <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>Company Name</label>
            <input value={form.companyName} onChange={e=>set('companyName',e.target.value)}
              style={inp} onFocus={focus} onBlur={blur} placeholder="Your company name" />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <div>
              <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>Website</label>
              <input value={form.companyWebsite} onChange={e=>set('companyWebsite',e.target.value)}
                style={inp} onFocus={focus} onBlur={blur} placeholder="https://yourcompany.com" />
            </div>
            <div>
              <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>Industry</label>
              <input value={form.companyIndustry} onChange={e=>set('companyIndustry',e.target.value)}
                style={inp} onFocus={focus} onBlur={blur} placeholder="e.g. Technology, Finance" />
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <div>
              <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>Contact Person</label>
              <input value={form.fullName} onChange={e=>set('fullName',e.target.value)}
                style={inp} onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>Phone</label>
              <input value={form.phone} onChange={e=>set('phone',e.target.value)}
                style={inp} onFocus={focus} onBlur={blur} placeholder="+91-..." />
            </div>
          </div>

          <div>
            <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>Headquarters Location</label>
            <input value={form.location} onChange={e=>set('location',e.target.value)}
              style={inp} onFocus={focus} onBlur={blur} placeholder="Mumbai, India" />
          </div>

          <div>
            <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>About the Company</label>
            <textarea rows={5} value={form.companyAbout} onChange={e=>set('companyAbout',e.target.value)}
              style={{ ...inp, resize:'none' }} onFocus={focus} onBlur={blur}
              placeholder="Tell candidates about your company, culture, and mission…" />
          </div>

          {saved && <p style={{ color:'#057642', fontSize:'13px' }}>✅ Company profile saved!</p>}

          <button type="submit" disabled={saving}
            style={{ background:BLUE, color:'white', fontWeight:600, fontSize:'14px', padding:'12px', borderRadius:'20px', border:'none', opacity:saving?0.6:1, cursor:saving?'not-allowed':'pointer' }}>
            {saving ? 'Saving…' : 'Save Company Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}
