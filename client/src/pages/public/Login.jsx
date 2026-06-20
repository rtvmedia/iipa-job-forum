import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]     = useState({ email:'', password:'' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === 'recruiter' ? '/recruiter/dashboard' : '/seeker/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="text-[#FF9933] font-bold text-2xl">IIPA</span>
            <span className="text-[#1a237e] font-semibold text-xl">Job Forum</span>
          </Link>
          {/* tricolor bar */}
          <div className="flex justify-center gap-2 mt-3 mb-1">
            <div className="w-6 h-0.5 rounded-full bg-[#FF9933]" />
            <div className="w-6 h-0.5 rounded-full bg-gray-300" />
            <div className="w-6 h-0.5 rounded-full bg-[#138808]" />
          </div>
          <h1 style={{ fontFamily:"'Georgia',serif", color:'#1a237e', fontSize:'1.8rem', fontWeight:700 }} className="mt-3">
            Welcome Back
          </h1>
          <p className="text-gray-500 text-sm mt-1" style={{ fontFamily:'system-ui' }}>
            Sign in to continue to your account
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-5 text-xs text-orange-800" style={{ fontFamily:'system-ui' }}>
            <strong>Demo accounts:</strong><br />
            Seeker: seeker@iipa.org / password123<br />
            Recruiter: recruiter@iipa.org / password123
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily:'system-ui' }}>Email</label>
              <input
                type="email" required
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1a237e] transition"
                style={{ fontFamily:'system-ui' }}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily:'system-ui' }}>Password</label>
              <input
                type="password" required
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#1a237e] transition"
                style={{ fontFamily:'system-ui' }}
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-red-500 text-sm" style={{ fontFamily:'system-ui' }}>{error}</p>}

            <button type="submit" disabled={loading}
              style={{ background:'#1a237e', fontFamily:'system-ui', fontWeight:600 }}
              className="w-full py-3 rounded-xl text-white text-sm hover:bg-[#283593] disabled:opacity-50 transition">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5" style={{ fontFamily:'system-ui' }}>
            No account yet?{' '}
            <Link to="/register" className="text-[#FF9933] font-semibold hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
