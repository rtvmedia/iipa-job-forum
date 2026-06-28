import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

export default function SeekerProfile() {
  const { user } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]     = useState({ fullName:'', phone:'', location:'', headline:'', bio:'' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [error, setError]   = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [uploadingResume, setUploadingResume] = useState(false);

  useEffect(() => {
    api.get('/auth/profile').then(r => {
      const { fullName, phone, location, headline, bio, resumeUrl } = r.data;
      setForm({ fullName: fullName||'', phone: phone||'', location: location||'', headline: headline||'', bio: bio||'' });
      setResumeUrl(resumeUrl || '');
    }).catch(() => {});
  }, []);

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

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true); setError(''); setSaved(false);
    try {
      await api.put('/auth/profile', form);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <button onClick={() => navigate('/seeker/dashboard')}
        className="text-sm text-[#c9a84c] hover:underline mb-6 block" style={{ fontFamily:'system-ui' }}>
        ← Back to Dashboard
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div style={{ background:'linear-gradient(135deg,#0a2342,#0d3060)' }} className="p-6 text-white">
          <div className="flex items-center gap-4">
            <div style={{ background:'#c9a84c' }} className="w-14 h-14 rounded-full flex items-center justify-center text-[#0a2342] font-bold text-xl">
              {(form.fullName || user?.fullName || 'U')[0].toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontFamily:"'Georgia',serif", fontSize:'1.4rem', fontWeight:700, color:'white' }}>
                {form.fullName || user?.fullName}
              </h1>
              <p className="text-gray-300 text-sm" style={{ fontFamily:'system-ui' }}>{user?.email}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily:'system-ui' }}>Full Name</label>
              <input value={form.fullName} onChange={e => set('fullName', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0a2342]"
                style={{ fontFamily:'system-ui' }} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily:'system-ui' }}>Phone</label>
              <input value={form.phone} onChange={e => set('phone', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0a2342]"
                style={{ fontFamily:'system-ui' }} placeholder="+92-..." />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily:'system-ui' }}>City / Location</label>
            <input value={form.location} onChange={e => set('location', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0a2342]"
              style={{ fontFamily:'system-ui' }} placeholder="Karachi, Lahore…" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily:'system-ui' }}>Professional Headline</label>
            <input value={form.headline} onChange={e => set('headline', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0a2342]"
              style={{ fontFamily:'system-ui' }} placeholder="e.g. Full Stack Developer | 3 Years Experience" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily:'system-ui' }}>Bio / Summary</label>
            <textarea value={form.bio} onChange={e => set('bio', e.target.value)} rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0a2342] resize-none"
              style={{ fontFamily:'system-ui' }} placeholder="Brief description of your experience, skills, and goals…" />
          </div>

          {error && <p className="text-red-500 text-sm" style={{ fontFamily:'system-ui' }}>{error}</p>}
          {saved  && <p className="text-green-600 text-sm" style={{ fontFamily:'system-ui' }}>✅ Profile saved successfully!</p>}

          <button type="submit" disabled={saving}
            style={{ background:'#0a2342', fontFamily:'system-ui', fontWeight:600 }}
            className="px-6 py-2.5 rounded-xl text-white text-sm hover:bg-[#0d3060] disabled:opacity-50 transition">
            {saving ? 'Saving…' : 'Save Profile'}
          </button>
        </form>

        <div className="p-6 border-t border-gray-100">
          <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily:'system-ui' }}>Resume / CV</label>
          {resumeUrl ? (
            <div className="flex items-center gap-3 flex-wrap">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily:'system-ui' }}
                className="text-sm font-semibold text-[#0a2342] border border-[#0a2342] px-4 py-2 rounded-xl hover:bg-[#0a2342] hover:text-white transition">
                📄 View Resume
              </a>
              <label className="text-sm text-gray-600 cursor-pointer underline" style={{ fontFamily:'system-ui' }}>
                {uploadingResume ? 'Uploading…' : 'Replace file'}
                <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => handleResumeUpload(e.target.files[0])} />
              </label>
            </div>
          ) : (
            <label style={{ fontFamily:'system-ui' }}
              className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#0a2342] px-5 py-2.5 rounded-xl cursor-pointer hover:bg-[#0d3060] transition">
              {uploadingResume ? 'Uploading…' : '⬆ Upload CV'}
              <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={e => handleResumeUpload(e.target.files[0])} />
            </label>
          )}
          <p className="text-xs text-gray-400 mt-2" style={{ fontFamily:'system-ui' }}>PDF or Word document, up to 8MB.</p>
        </div>
      </div>
    </div>
  );
}
