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
    e.preventDefault(); setLoading(true); setError('');
    try {
      const user = await login(form.email, form.password);
      navigate(user.role==='recruiter' ? '/recruiter/dashboard' : '/seeker/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px 16px', background:'#f3f2ef' }}>
      <div style={{ width:'100%', maxWidth:'400px' }}>
        <div style={{ textAlign:'center', marginBottom:'24px' }}>
          <Link to="/" style={{ display:'inline-flex', alignItems:'center', gap:'6px' }}>
            <span style={{ color:'#FF9933', fontWeight:700, fontSize:'22px' }}>IIPA</span>
            <span style={{ color:'#1a237e', fontWeight:600, fontSize:'18px' }}>Job Forum</span>
          </Link>
          <div style={{ display:'flex', justifyContent:'center', gap:'8px', margin:'10px 0 4px' }}>
            <div style={{ width:'20px', height:'2px', background:'#FF9933', borderRadius:'2px' }} />
            <div style={{ width:'20px', height:'2px', background:'#ccc', borderRadius:'2px' }} />
            <div style={{ width:'20px', height:'2px', background:'#138808', borderRadius:'2px' }} />
          </div>
          <h1 style={{ fontWeight:700, color:'#1a237e', fontSize:'22px', marginTop:'12px' }}>Welcome Back</h1>
          <p style={{ color:'#666', fontSize:'14px', marginTop:'4px' }}>Sign in to continue to your account</p>
        </div>

        <div style={{ background:'white', borderRadius:'8px', boxShadow:'0 0 0 1px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06)', padding:'28px 24px' }}>
          <div style={{ background:'#fff8f0', border:'1px solid #ffe0b2', borderRadius:'6px', padding:'10px 14px', marginBottom:'20px', fontSize:'13px', color:'#bf360c' }}>
            <strong>Demo accounts:</strong><br />
            Seeker: seeker@iipa.org / password123<br />
            Recruiter: recruiter@iipa.org / password123
          </div>

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
            <div>
              <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'6px' }}>Email</label>
              <input type="email" required value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))}
                style={{ width:'100%', border:'1px solid #ddd', borderRadius:'6px', padding:'10px 12px', fontSize:'14px', outline:'none', boxSizing:'border-box' }}
                onFocus={e=>e.target.style.borderColor='#1a237e'} onBlur={e=>e.target.style.borderColor='#ddd'}
                placeholder="you@example.com" />
            </div>
            <div>
              <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'6px' }}>Password</label>
              <input type="password" required value={form.password} onChange={e => setForm(f=>({...f,password:e.target.value}))}
                style={{ width:'100%', border:'1px solid #ddd', borderRadius:'6px', padding:'10px 12px', fontSize:'14px', outline:'none', boxSizing:'border-box' }}
                onFocus={e=>e.target.style.borderColor='#1a237e'} onBlur={e=>e.target.style.borderColor='#ddd'}
                placeholder="••••••••" />
            </div>
            {error && <p style={{ color:'#c62828', fontSize:'13px' }}>{error}</p>}
            <button type="submit" disabled={loading}
              style={{ background:'#1a237e', color:'white', fontWeight:600, fontSize:'14px', padding:'11px', borderRadius:'6px', border:'none', opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign:'center', fontSize:'13px', color:'#666', marginTop:'20px' }}>
            No account yet?{' '}
            <Link to="/register" style={{ color:'#FF9933', fontWeight:600 }}>Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
