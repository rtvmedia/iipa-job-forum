import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const BLUE = '#0a66c2';
const inp = { width:'100%', border:'1px solid #ddd', borderRadius:'6px', padding:'10px 12px', fontSize:'14px', outline:'none', boxSizing:'border-box' };

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]       = useState({ email:'', password:'' });
  const [error, setError]     = useState('');
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
          <h1 style={{ fontWeight:700, color:'#1a1a1a', fontSize:'22px', marginTop:'16px' }}>Sign in</h1>
          <p style={{ color:'#666', fontSize:'14px', marginTop:'4px' }}>Stay updated on your professional world</p>
        </div>

        <div style={{ background:'#fff', borderRadius:'8px', boxShadow:'0 0 0 1px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06)', padding:'24px' }}>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            <div>
              <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>Email</label>
              <input type="email" required value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))}
                style={inp} onFocus={e=>e.target.style.borderColor=BLUE} onBlur={e=>e.target.style.borderColor='#ddd'}
                placeholder="you@example.com" />
            </div>
            <div>
              <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>Password</label>
              <input type="password" required value={form.password} onChange={e => setForm(f=>({...f,password:e.target.value}))}
                style={inp} onFocus={e=>e.target.style.borderColor=BLUE} onBlur={e=>e.target.style.borderColor='#ddd'}
                placeholder="••••••••" />
            </div>
            {error && <p style={{ color:'#c62828', fontSize:'13px' }}>{error}</p>}
            <button type="submit" disabled={loading}
              style={{ background:BLUE, color:'#fff', fontWeight:700, fontSize:'15px', padding:'12px', borderRadius:'24px', border:'none', opacity:loading?0.65:1, cursor:loading?'not-allowed':'pointer', marginTop:'4px' }}>
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div style={{ textAlign:'center', marginTop:'18px', paddingTop:'18px', borderTop:'1px solid #e0e0e0' }}>
            <span style={{ fontSize:'13px', color:'#666' }}>New to IIPA Job Forum? </span>
            <Link to="/register" style={{ color:BLUE, fontWeight:600, fontSize:'13px' }}>Join now</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
