import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const BLUE = '#0a66c2';
const inp = { width:'100%', border:'1px solid #ddd', borderRadius:'6px', padding:'9px 12px', fontSize:'13.5px', outline:'none', boxSizing:'border-box' };
const label = { display:'block', fontSize:'12.5px', fontWeight:500, color:'#333', marginBottom:'5px' };
const card = { background:'#fff', borderRadius:'8px', border:'1px solid #e0e0e0', marginBottom:'16px' };
const cardHead = { padding:'14px 20px', borderBottom:'1px solid #eee', display:'flex', justifyContent:'space-between', alignItems:'center' };
const cardBody = { padding:'18px 20px' };
const btnPrimary = { background:BLUE, color:'#fff', fontWeight:600, fontSize:'13px', padding:'8px 16px', borderRadius:'16px', border:'none', cursor:'pointer' };
const btnGhost = { background:'#fff', color:BLUE, fontWeight:600, fontSize:'12px', padding:'6px 14px', borderRadius:'14px', border:`1px solid ${BLUE}`, cursor:'pointer' };
const btnDanger = { background:'#fff', color:'#c62828', fontWeight:600, fontSize:'12px', padding:'5px 12px', borderRadius:'12px', border:'1px solid #c62828', cursor:'pointer' };
const focus = e => e.target.style.borderColor = BLUE;
const blur  = e => e.target.style.borderColor = '#ddd';

function RepeatableSection({ title, items, fields, onAdd, onUpdate, onDelete, renderSummary }) {
  const empty = Object.fromEntries(fields.map(f => [f.name, f.type === 'checkbox' ? false : '']));
  const [form, setForm]   = useState(empty);
  const [editing, setEditing] = useState(null); // id being edited, or 'new'

  const startNew = () => { setForm(empty); setEditing('new'); };
  const startEdit = (item) => { setForm({ ...empty, ...item }); setEditing(item.id); };
  const cancel = () => { setEditing(null); setForm(empty); };

  const submit = async (e) => {
    e.preventDefault();
    if (editing === 'new') await onAdd(form);
    else await onUpdate(editing, form);
    cancel();
  };

  return (
    <div style={card}>
      <div style={cardHead}>
        <h2 style={{ fontWeight:700, fontSize:'15px', color:'#1a1a1a' }}>{title}</h2>
        {editing === null && <button onClick={startNew} style={btnGhost}>+ Add</button>}
      </div>
      <div style={cardBody}>
        {items.length === 0 && editing === null && <p style={{ color:'#999', fontSize:'13px' }}>None added yet.</p>}

        {items.filter(i => i.id !== editing).map(item => (
          <div key={item.id} style={{ display:'flex', justifyContent:'space-between', gap:'10px', padding:'10px 0', borderBottom:'1px solid #f3f3f3' }}>
            <div style={{ fontSize:'13px', color:'#333', lineHeight:1.5 }}>{renderSummary(item)}</div>
            <div style={{ display:'flex', gap:'6px', flexShrink:0 }}>
              <button onClick={() => startEdit(item)} style={btnGhost}>Edit</button>
              <button onClick={() => onDelete(item.id)} style={btnDanger}>Delete</button>
            </div>
          </div>
        ))}

        {editing !== null && (
          <form onSubmit={submit} style={{ marginTop: items.length ? '12px' : 0, display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
            {fields.map(f => (
              <div key={f.name} style={f.full ? { gridColumn:'1/-1' } : undefined}>
                <label style={label}>{f.label}</label>
                {f.type === 'checkbox' ? (
                  <label style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:'13px' }}>
                    <input type="checkbox" checked={!!form[f.name]} onChange={e => setForm(s => ({ ...s, [f.name]:e.target.checked }))} /> {f.label}
                  </label>
                ) : f.type === 'textarea' ? (
                  <textarea rows={3} style={{ ...inp, resize:'none' }} value={form[f.name] || ''} onFocus={focus} onBlur={blur}
                    onChange={e => setForm(s => ({ ...s, [f.name]:e.target.value }))} />
                ) : (
                  <input type={f.type || 'text'} style={inp} value={form[f.name] || ''} onFocus={focus} onBlur={blur}
                    onChange={e => setForm(s => ({ ...s, [f.name]:e.target.value }))} />
                )}
              </div>
            ))}
            <div style={{ gridColumn:'1/-1', display:'flex', gap:'8px', marginTop:'6px' }}>
              <button type="submit" style={btnPrimary}>{editing === 'new' ? 'Add' : 'Save'}</button>
              <button type="button" onClick={cancel} style={{ ...btnGhost, color:'#666', borderColor:'#ccc' }}>Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function SeekerProfile() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm] = useState({
    fullName:'', phone:'', location:'', headline:'', bio:'',
    currentJobTitle:'', yearsOfExperience:'', willingToRelocate:false, visaStatus:'', nationality:'',
    skills:'', websiteUrl:'', linkedinProfile:'', githubProfile:'', portfolioUrl:'',
    desiredJobTitle:'', preferredLocations:'', salaryExpectation:'', noticePeriod:'', workMode:'',
  });
  const [languages, setLanguages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [error, setError]   = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [uploadingResume, setUploadingResume] = useState(false);

  const [workExp, setWorkExp] = useState([]);
  const [education, setEducation] = useState([]);
  const [certs, setCerts] = useState([]);

  const loadAll = () => {
    api.get('/auth/profile').then(r => {
      const d = r.data;
      setForm({
        fullName:d.fullName||'', phone:d.phone||'', location:d.location||'', headline:d.headline||'', bio:d.bio||'',
        currentJobTitle:d.currentJobTitle||'', yearsOfExperience:d.yearsOfExperience||'', willingToRelocate:!!d.willingToRelocate,
        visaStatus:d.visaStatus||'', nationality:d.nationality||'',
        skills:d.skills||'', websiteUrl:d.websiteUrl||'', linkedinProfile:d.linkedinProfile||'', githubProfile:d.githubProfile||'', portfolioUrl:d.portfolioUrl||'',
        desiredJobTitle:d.desiredJobTitle||'', preferredLocations:d.preferredLocations||'', salaryExpectation:d.salaryExpectation||'', noticePeriod:d.noticePeriod||'', workMode:d.workMode||'',
      });
      setResumeUrl(d.resumeUrl || '');
      try { setLanguages(d.languages ? JSON.parse(d.languages) : []); } catch { setLanguages([]); }
    }).catch(() => {});
    api.get('/seeker/work-experience').then(r => setWorkExp(r.data)).catch(() => {});
    api.get('/seeker/education').then(r => setEducation(r.data)).catch(() => {});
    api.get('/seeker/certifications').then(r => setCerts(r.data)).catch(() => {});
  };

  useEffect(() => { loadAll(); }, []);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true); setError(''); setSaved(false);
    try {
      await api.put('/auth/profile', { ...form, languages: JSON.stringify(languages) });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (file) => {
    if (!file) return;
    setUploadingResume(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const { data } = await api.post('/auth/resume', formData);
      setResumeUrl(data.resumeUrl);
    } finally { setUploadingResume(false); }
  };

  // Languages (simple inline repeatable, no backend table — stored as JSON on User)
  const addLanguage = () => setLanguages(l => [...l, { language:'', reading:'Basic', writing:'Basic', speaking:'Basic', proficiency:'Conversational' }]);
  const updateLanguage = (i, k, v) => setLanguages(l => l.map((row, idx) => idx === i ? { ...row, [k]: v } : row));
  const removeLanguage = (i) => setLanguages(l => l.filter((_, idx) => idx !== i));

  // Profile strength
  const strengthFields = [form.headline, form.currentJobTitle, form.location, form.skills, resumeUrl, form.bio, workExp.length, education.length];
  const strength = Math.round((strengthFields.filter(Boolean).length / strengthFields.length) * 100);

  return (
    <div style={{ maxWidth:'860px', margin:'0 auto', padding:'24px 16px' }}>
      <button onClick={() => navigate('/seeker/dashboard')}
        style={{ background:'none', border:'none', color:BLUE, fontSize:'13px', fontWeight:500, cursor:'pointer', marginBottom:'16px', padding:0 }}>
        ← Back to Dashboard
      </button>

      <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'space-between', alignItems:'center', gap:'12px', marginBottom:'18px' }}>
        <div>
          <h1 style={{ fontWeight:700, fontSize:'20px', color:'#1a1a1a' }}>My Profile</h1>
          <p style={{ color:'#666', fontSize:'13px', marginTop:'2px' }}>{user?.email}</p>
        </div>
        <div style={{ background:'#f0f7ff', border:'1px solid #c8e0f9', borderRadius:'8px', padding:'10px 16px', textAlign:'center', minWidth:'120px' }}>
          <div style={{ color:BLUE, fontWeight:800, fontSize:'1.3rem' }}>{strength}%</div>
          <div style={{ color:'#555', fontSize:'11px' }}>Profile Strength</div>
        </div>
      </div>

      {/* Personal Information */}
      <form onSubmit={handleSave}>
        <div style={card}>
          <div style={cardHead}><h2 style={{ fontWeight:700, fontSize:'15px', color:'#1a1a1a' }}>Personal Information</h2></div>
          <div style={{ ...cardBody, display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <div><label style={label}>Full Name</label><input style={inp} value={form.fullName} onChange={e=>set('fullName',e.target.value)} onFocus={focus} onBlur={blur} /></div>
            <div><label style={label}>Phone</label><input style={inp} value={form.phone} onChange={e=>set('phone',e.target.value)} onFocus={focus} onBlur={blur} placeholder="+91-..." /></div>
            <div><label style={label}>Headline</label><input style={inp} value={form.headline} onChange={e=>set('headline',e.target.value)} onFocus={focus} onBlur={blur} placeholder="e.g. Full Stack Developer | 3 Years Experience" /></div>
            <div><label style={label}>Current Job Title</label><input style={inp} value={form.currentJobTitle} onChange={e=>set('currentJobTitle',e.target.value)} onFocus={focus} onBlur={blur} /></div>
            <div><label style={label}>Years of Experience</label><input style={inp} value={form.yearsOfExperience} onChange={e=>set('yearsOfExperience',e.target.value)} onFocus={focus} onBlur={blur} placeholder="e.g. 5" /></div>
            <div><label style={label}>Nationality</label><input style={inp} value={form.nationality} onChange={e=>set('nationality',e.target.value)} onFocus={focus} onBlur={blur} /></div>
            <div><label style={label}>Current Location</label><input style={inp} value={form.location} onChange={e=>set('location',e.target.value)} onFocus={focus} onBlur={blur} placeholder="Mumbai, India" /></div>
            <div><label style={label}>Visa Status</label><input style={inp} value={form.visaStatus} onChange={e=>set('visaStatus',e.target.value)} onFocus={focus} onBlur={blur} placeholder="e.g. Not required / Work Visa" /></div>
            <label style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', gridColumn:'1/-1' }}>
              <input type="checkbox" checked={form.willingToRelocate} onChange={e=>set('willingToRelocate',e.target.checked)} /> Willing to Relocate
            </label>
            <div style={{ gridColumn:'1/-1' }}>
              <label style={label}>Bio / Summary</label>
              <textarea value={form.bio} onChange={e => set('bio', e.target.value)} rows={4} style={{ ...inp, resize:'none' }}
                onFocus={focus} onBlur={blur} placeholder="Brief description of your experience, skills, and goals…" />
            </div>
          </div>
        </div>

        {/* Career Preferences */}
        <div style={card}>
          <div style={cardHead}><h2 style={{ fontWeight:700, fontSize:'15px', color:'#1a1a1a' }}>Career Preferences</h2></div>
          <div style={{ ...cardBody, display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <div><label style={label}>Desired Job Title</label><input style={inp} value={form.desiredJobTitle} onChange={e=>set('desiredJobTitle',e.target.value)} onFocus={focus} onBlur={blur} /></div>
            <div><label style={label}>Preferred Locations</label><input style={inp} value={form.preferredLocations} onChange={e=>set('preferredLocations',e.target.value)} onFocus={focus} onBlur={blur} placeholder="Dubai, Riyadh, Remote" /></div>
            <div><label style={label}>Salary Expectation</label><input style={inp} value={form.salaryExpectation} onChange={e=>set('salaryExpectation',e.target.value)} onFocus={focus} onBlur={blur} /></div>
            <div><label style={label}>Notice Period</label><input style={inp} value={form.noticePeriod} onChange={e=>set('noticePeriod',e.target.value)} onFocus={focus} onBlur={blur} placeholder="e.g. 30 days" /></div>
            <div>
              <label style={label}>Work Mode</label>
              <select style={inp} value={form.workMode} onChange={e=>set('workMode',e.target.value)}>
                <option value="">Select</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Onsite">Onsite</option>
              </select>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div style={card}>
          <div style={cardHead}><h2 style={{ fontWeight:700, fontSize:'15px', color:'#1a1a1a' }}>Skills</h2></div>
          <div style={cardBody}>
            <input style={inp} value={form.skills} onChange={e=>set('skills',e.target.value)} onFocus={focus} onBlur={blur} placeholder="Comma-separated, e.g. Project Management, Python, Excel, SAP" />
            <p style={{ color:'#888', fontSize:'11.5px', marginTop:'6px' }}>Separate skills with commas.</p>
          </div>
        </div>

        {/* Portfolio */}
        <div style={card}>
          <div style={cardHead}><h2 style={{ fontWeight:700, fontSize:'15px', color:'#1a1a1a' }}>Portfolio & Links</h2></div>
          <div style={{ ...cardBody, display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
            <div><label style={label}>Website</label><input style={inp} value={form.websiteUrl} onChange={e=>set('websiteUrl',e.target.value)} onFocus={focus} onBlur={blur} /></div>
            <div><label style={label}>LinkedIn</label><input style={inp} value={form.linkedinProfile} onChange={e=>set('linkedinProfile',e.target.value)} onFocus={focus} onBlur={blur} /></div>
            <div><label style={label}>GitHub</label><input style={inp} value={form.githubProfile} onChange={e=>set('githubProfile',e.target.value)} onFocus={focus} onBlur={blur} /></div>
            <div><label style={label}>Portfolio URL</label><input style={inp} value={form.portfolioUrl} onChange={e=>set('portfolioUrl',e.target.value)} onFocus={focus} onBlur={blur} /></div>
          </div>
        </div>

        {error && <p style={{ color:'#c62828', fontSize:'13px', marginBottom:'10px' }}>{error}</p>}
        {saved  && <p style={{ color:'#057642', fontSize:'13px', marginBottom:'10px' }}>✅ Profile saved successfully!</p>}
        <button type="submit" disabled={saving} style={{ ...btnPrimary, padding:'10px 28px', opacity:saving?0.6:1, marginBottom:'20px' }}>
          {saving ? 'Saving…' : 'Save Profile'}
        </button>
      </form>

      {/* Work Experience */}
      <RepeatableSection
        title="Work Experience"
        items={workExp}
        onAdd={async (data) => { const { data: row } = await api.post('/seeker/work-experience', data); setWorkExp(w => [...w, row]); }}
        onUpdate={async (id, data) => { const { data: row } = await api.put(`/seeker/work-experience/${id}`, data); setWorkExp(w => w.map(x => x.id === id ? row : x)); }}
        onDelete={async (id) => { await api.delete(`/seeker/work-experience/${id}`); setWorkExp(w => w.filter(x => x.id !== id)); }}
        renderSummary={(w) => (
          <>
            <strong>{w.jobTitle}</strong> at {w.company} {w.location ? `· ${w.location}` : ''}<br />
            <span style={{ color:'#777' }}>{w.startDate || ''} {w.currentlyWorking ? '— Present' : w.endDate ? `— ${w.endDate}` : ''}</span>
          </>
        )}
        fields={[
          { name:'jobTitle', label:'Job Title' },
          { name:'company', label:'Company' },
          { name:'employmentType', label:'Employment Type' },
          { name:'location', label:'Location' },
          { name:'startDate', label:'Start Date', type:'date' },
          { name:'endDate', label:'End Date', type:'date' },
          { name:'currentlyWorking', label:'Currently Working Here', type:'checkbox' },
          { name:'responsibilities', label:'Responsibilities', type:'textarea', full:true },
          { name:'achievements', label:'Achievements', type:'textarea', full:true },
        ]}
      />

      {/* Education */}
      <RepeatableSection
        title="Education"
        items={education}
        onAdd={async (data) => { const { data: row } = await api.post('/seeker/education', data); setEducation(w => [...w, row]); }}
        onUpdate={async (id, data) => { const { data: row } = await api.put(`/seeker/education/${id}`, data); setEducation(w => w.map(x => x.id === id ? row : x)); }}
        onDelete={async (id) => { await api.delete(`/seeker/education/${id}`); setEducation(w => w.filter(x => x.id !== id)); }}
        renderSummary={(e) => (
          <>
            <strong>{e.degree}</strong>{e.major ? `, ${e.major}` : ''}<br />
            <span style={{ color:'#777' }}>{e.institution} {e.graduationYear ? `· ${e.graduationYear}` : ''}</span>
          </>
        )}
        fields={[
          { name:'degree', label:'Degree' },
          { name:'major', label:'Major' },
          { name:'institution', label:'Institution', full:true },
          { name:'country', label:'Country' },
          { name:'graduationYear', label:'Graduation Year' },
          { name:'gpa', label:'GPA (optional)' },
        ]}
      />

      {/* Certifications */}
      <RepeatableSection
        title="Certifications"
        items={certs}
        onAdd={async (data) => { const { data: row } = await api.post('/seeker/certifications', data); setCerts(w => [...w, row]); }}
        onUpdate={async (id, data) => { const { data: row } = await api.put(`/seeker/certifications/${id}`, data); setCerts(w => w.map(x => x.id === id ? row : x)); }}
        onDelete={async (id) => { await api.delete(`/seeker/certifications/${id}`); setCerts(w => w.filter(x => x.id !== id)); }}
        renderSummary={(c) => (
          <>
            <strong>{c.certificateName}</strong><br />
            <span style={{ color:'#777' }}>{c.issuingOrganization} {c.issueDate ? `· Issued ${c.issueDate}` : ''}</span>
          </>
        )}
        fields={[
          { name:'certificateName', label:'Certificate Name', full:true },
          { name:'issuingOrganization', label:'Issuing Organization' },
          { name:'issueDate', label:'Issue Date', type:'date' },
          { name:'expiryDate', label:'Expiry Date', type:'date' },
          { name:'credentialId', label:'Credential ID' },
          { name:'credentialUrl', label:'Credential URL' },
        ]}
      />

      {/* Languages */}
      <div style={card}>
        <div style={cardHead}>
          <h2 style={{ fontWeight:700, fontSize:'15px', color:'#1a1a1a' }}>Languages</h2>
          <button onClick={addLanguage} style={btnGhost}>+ Add</button>
        </div>
        <div style={cardBody}>
          {languages.length === 0 && <p style={{ color:'#999', fontSize:'13px' }}>None added yet.</p>}
          {languages.map((row, i) => (
            <div key={i} style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr 1fr 1fr 1fr auto', gap:'8px', alignItems:'end', marginBottom:'10px' }}>
              <input style={inp} placeholder="Language" value={row.language} onChange={e => updateLanguage(i, 'language', e.target.value)} />
              {['reading','writing','speaking'].map(k => (
                <select key={k} style={inp} value={row[k]} onChange={e => updateLanguage(i, k, e.target.value)}>
                  {['Basic','Intermediate','Fluent','Native'].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ))}
              <select style={inp} value={row.proficiency} onChange={e => updateLanguage(i, 'proficiency', e.target.value)}>
                {['Conversational','Professional','Native/Bilingual'].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <button type="button" onClick={() => removeLanguage(i)} style={btnDanger}>Remove</button>
            </div>
          ))}
          {languages.length > 0 && <button onClick={handleSave} style={{ ...btnGhost, marginTop:'4px' }}>Save Languages</button>}
        </div>
      </div>

      {/* Resume */}
      <div style={card}>
        <div style={cardHead}><h2 style={{ fontWeight:700, fontSize:'15px', color:'#1a1a1a' }}>Resume / CV</h2></div>
        <div style={cardBody}>
          {resumeUrl ? (
            <div style={{ display:'flex', alignItems:'center', gap:'12px', flexWrap:'wrap' }}>
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer" style={btnGhost}>📄 View Resume</a>
              <label style={{ fontSize:'13px', color:'#666', cursor:'pointer', textDecoration:'underline' }}>
                {uploadingResume ? 'Uploading…' : 'Replace file'}
                <input type="file" accept=".pdf,.doc,.docx" style={{ display:'none' }} onChange={e => handleResumeUpload(e.target.files[0])} />
              </label>
            </div>
          ) : (
            <label style={{ ...btnPrimary, display:'inline-block', cursor:'pointer' }}>
              {uploadingResume ? 'Uploading…' : '⬆ Upload CV'}
              <input type="file" accept=".pdf,.doc,.docx" style={{ display:'none' }} onChange={e => handleResumeUpload(e.target.files[0])} />
            </label>
          )}
          <p style={{ color:'#888', fontSize:'11.5px', marginTop:'8px' }}>PDF or Word document, up to 8MB.</p>
        </div>
      </div>
    </div>
  );
}
