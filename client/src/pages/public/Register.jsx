import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const inp = { width:'100%', border:'1px solid #ddd', borderRadius:'6px', padding:'10px 12px', fontSize:'14px', outline:'none', boxSizing:'border-box' };

export default function Register() {
  const { register } = useAuth();
  const navigate      = useNavigate();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ fullName:'', email:'', password:'', role:searchParams.get('role')||'seeker', phone:'', location:'' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true); setError('');
    try {
      const user = await register(form);
      navigate(user.role==='recruiter' ? '/recruiter/dashboard' : '/seeker/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally { setLoading(false); }
  };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'24px 16px', background:'#f3f2ef' }}>
      <div style={{ width:'100%', maxWidth:'480px' }}>
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
          <h1 style={{ fontWeight:700, color:'#1a237e', fontSize:'22px', marginTop:'12px' }}>Create Your Account</h1>
        </div>

        <div style={{ background:'white', borderRadius:'8px', boxShadow:'0 0 0 1px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06)', padding:'28px 24px' }}>
          {/* Role toggle */}
          <div style={{ display:'flex', gap:'8px', background:'#f3f2ef', padding:'4px', borderRadius:'8px', marginBottom:'20px' }}>
            {['seeker','recruiter'].map(r => (
              <button key={r} type="button" onClick={() => set('role', r)}
                style={{ flex:1, padding:'8px', borderRadius:'6px', border:'none', fontSize:'13px', fontWeight:600, cursor:'pointer', transition:'all 0.15s',
                  background: form.role===r ? '#1a237e' : 'transparent',
                  color: form.role===r ? 'white' : '#555' }}>
                {r==='seeker' ? '🔍 Job Seeker' : '🏢 Employer / Recruiter'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
              <div>
                <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>Full Name *</label>
                <input type="text" required value={form.fullName} onChange={e=>set('fullName',e.target.value)}
                  style={inp} onFocus={e=>e.target.style.borderColor='#1a237e'} onBlur={e=>e.target.style.borderColor='#ddd'}
                  placeholder="Your full name" />
              </div>
              <div>
                <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>Email *</label>
                <input type="email" required value={form.email} onChange={e=>set('email',e.target.value)}
                  style={inp} onFocus={e=>e.target.style.borderColor='#1a237e'} onBlur={e=>e.target.style.borderColor='#ddd'}
                  placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>Password *</label>
              <input type="password" required minLength={6} value={form.password} onChange={e=>set('password',e.target.value)}
                style={inp} onFocus={e=>e.target.style.borderColor='#1a237e'} onBlur={e=>e.target.style.borderColor='#ddd'}
                placeholder="Minimum 6 characters" />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
              <div>
                <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>Phone</label>
                <input type="tel" value={form.phone} onChange={e=>set('phone',e.target.value)}
                  style={inp} onFocus={e=>e.target.style.borderColor='#1a237e'} onBlur={e=>e.target.style.borderColor='#ddd'}
                  placeholder="+91-..." />
              </div>
              <div>
                <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>City</label>
                <input type="text" value={form.location} onChange={e=>set('location',e.target.value)}
                  style={inp} onFocus={e=>e.target.style.borderColor='#1a237e'} onBlur={e=>e.target.style.borderColor='#ddd'}
                  placeholder="Mumbai, Delhi…" />
              </div>
            </div>
            {error && <p style={{ color:'#c62828', fontSize:'13px' }}>{error}</p>}
            <button type="submit" disabled={loading}
              style={{ background:'#1a237e', color:'white', fontWeight:600, fontSize:'14px', padding:'11px', borderRadius:'6px', border:'none', opacity:loading?0.6:1, cursor:loading?'not-allowed':'pointer', marginTop:'4px' }}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign:'center', fontSize:'13px', color:'#666', marginTop:'20px' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color:'#FF9933', fontWeight:600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
