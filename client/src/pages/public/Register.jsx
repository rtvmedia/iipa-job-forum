import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    fullName:'', email:'', password:'', role: searchParams.get('role') || 'seeker', phone:'', location:''
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const user = await register(form);
      navigate(user.role === 'recruiter' ? '/recruiter/dashboard' : '/seeker/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="text-[#FF9933] font-bold text-2xl">IIPA</span>
            <span className="text-[#1a237e] font-semibold text-xl">Job Forum</span>
          </Link>
          <div className="flex justify-center gap-2 mt-3 mb-1">
            <div className="w-6 h-0.5 rounded-full bg-[#FF9933]" />
            <div className="w-6 h-0.5 rounded-full bg-gray-300" />
            <div className="w-6 h-0.5 rounded-full bg-[#138808]" />
          </div>
          <h1 style={{ fontFamily:"'Georgia',serif", color:'#1a237e', fontSize:'1.8rem', fontWeight:700 }} className="mt-3">
            Create Your Account
          </h1>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Role toggle */}
          <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-6">
            {['seeker','recruiter'].map(r => (
              <button key={r} type="button"
                onClick={() => set('role', r)}
                style={{ fontFamily:'system-ui', fontWeight:600 }}
                className={`flex-1 py-2 rounded-lg text-sm transition ${form.role===r ? 'bg-[#1a237e] text-white shadow' : 'text-gray-600 hover:text-gray-900'}`}>
                {r === 'seeker' ? '🔍 Job Seeker' : '🏢 Employer / Recruiter'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily:'system-ui' }}>Full Name *</label>
                <input type="text" required value={form.fullName} onChange={e => set('fullName', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1a237e]"
                  style={{ fontFamily:'system-ui' }} placeholder="Your full name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily:'system-ui' }}>Email *</label>
                <input type="email" required value={form.email} onChange={e => set('email', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1a237e]"
                  style={{ fontFamily:'system-ui' }} placeholder="you@example.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily:'system-ui' }}>Password *</label>
              <input type="password" required minLength={6} value={form.password} onChange={e => set('password', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1a237e]"
                style={{ fontFamily:'system-ui' }} placeholder="Minimum 6 characters" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily:'system-ui' }}>Phone</label>
                <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1a237e]"
                  style={{ fontFamily:'system-ui' }} placeholder="+91-..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily:'system-ui' }}>City</label>
                <input type="text" value={form.location} onChange={e => set('location', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1a237e]"
                  style={{ fontFamily:'system-ui' }} placeholder="Mumbai, Delhi…" />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm" style={{ fontFamily:'system-ui' }}>{error}</p>}

            <button type="submit" disabled={loading}
              style={{ background:'#1a237e', fontFamily:'system-ui', fontWeight:600 }}
              className="w-full py-3 rounded-xl text-white text-sm hover:bg-[#283593] disabled:opacity-50 transition">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5" style={{ fontFamily:'system-ui' }}>
            Already have an account?{' '}
            <Link to="/login" className="text-[#FF9933] font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
