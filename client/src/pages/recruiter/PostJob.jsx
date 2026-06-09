import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const CATEGORIES = ['Technology','Finance','Human Resources','Marketing','Engineering','Healthcare','Education','Sales'];
const TYPES      = ['full-time','part-time','contract','remote','internship'];

export default function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title:'', company:'', location:'', type:'full-time', category:'Technology',
    description:'', requirements:'', salaryMin:'', salaryMax:'', deadline:''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError]   = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      await api.post('/jobs', {
        ...form,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
      });
      navigate('/recruiter/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <button onClick={() => navigate('/recruiter/dashboard')}
        className="text-sm text-[#c9a84c] hover:underline mb-6 block" style={{ fontFamily:'system-ui' }}>
        ← Back to Dashboard
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div style={{ background:'linear-gradient(135deg,#0a2342,#0d3060)' }} className="px-6 py-5">
          <h1 style={{ fontFamily:"'Georgia',serif", color:'white', fontSize:'1.5rem', fontWeight:700 }}>
            Post a New Job
          </h1>
          <p className="text-gray-300 text-sm mt-1" style={{ fontFamily:'system-ui' }}>Fill in the details to publish your vacancy</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily:'system-ui' }}>Job Title *</label>
            <input required value={form.title} onChange={e => set('title', e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0a2342]"
              style={{ fontFamily:'system-ui' }} placeholder="e.g. Senior React Developer" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily:'system-ui' }}>Company *</label>
              <input required value={form.company} onChange={e => set('company', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0a2342]"
                style={{ fontFamily:'system-ui' }} placeholder="Company name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily:'system-ui' }}>Location</label>
              <input value={form.location} onChange={e => set('location', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0a2342]"
                style={{ fontFamily:'system-ui' }} placeholder="e.g. Karachi / Remote" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily:'system-ui' }}>Job Type</label>
              <select value={form.type} onChange={e => set('type', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0a2342]"
                style={{ fontFamily:'system-ui' }}>
                {TYPES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily:'system-ui' }}>Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0a2342]"
                style={{ fontFamily:'system-ui' }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily:'system-ui' }}>Job Description *</label>
            <textarea required value={form.description} onChange={e => set('description', e.target.value)} rows={5}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0a2342] resize-none"
              style={{ fontFamily:'system-ui' }} placeholder="Describe the role, responsibilities, and team…" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily:'system-ui' }}>Requirements</label>
            <textarea value={form.requirements} onChange={e => set('requirements', e.target.value)} rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0a2342] resize-none"
              style={{ fontFamily:'system-ui' }} placeholder="Skills, experience, qualifications required…" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily:'system-ui' }}>Min Salary (PKR)</label>
              <input type="number" value={form.salaryMin} onChange={e => set('salaryMin', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0a2342]"
                style={{ fontFamily:'system-ui' }} placeholder="80000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily:'system-ui' }}>Max Salary (PKR)</label>
              <input type="number" value={form.salaryMax} onChange={e => set('salaryMax', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0a2342]"
                style={{ fontFamily:'system-ui' }} placeholder="150000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily:'system-ui' }}>Deadline</label>
              <input type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0a2342]"
                style={{ fontFamily:'system-ui' }} />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm" style={{ fontFamily:'system-ui' }}>{error}</p>}

          <button type="submit" disabled={saving}
            style={{ background:'#0a2342', fontFamily:'system-ui', fontWeight:600 }}
            className="w-full py-3 rounded-xl text-white text-sm hover:bg-[#0d3060] disabled:opacity-50 transition">
            {saving ? 'Publishing…' : 'Publish Job'}
          </button>
        </form>
      </div>
    </div>
  );
}
