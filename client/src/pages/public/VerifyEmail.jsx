import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../api/axios';

const BLUE = '#0a66c2';

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [state, setState] = useState(token ? 'working' : 'error');
  const [message, setMessage] = useState(token ? '' : 'This verification link is invalid.');

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    api.post('/auth/verify-email', { token })
      .then(r => { if (!cancelled) { setState('ok'); setMessage(r.data.message); } })
      .catch(err => { if (!cancelled) { setState('error'); setMessage(err.response?.data?.message || 'We could not verify your email. Please try again.'); } });
    return () => { cancelled = true; };
  }, [token]);

  const icon = state === 'ok' ? '✅' : state === 'error' ? '⚠️' : '⏳';
  return (
    <div style={{ minHeight:'60vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'32px 16px', background:'#f3f2ef' }}>
      <div style={{ width:'100%', maxWidth:'440px', background:'#fff', borderRadius:'8px', boxShadow:'0 0 0 1px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06)', padding:'32px 24px', textAlign:'center' }}>
        <div style={{ fontSize:'2.4rem', marginBottom:'8px' }}>{icon}</div>
        <h1 style={{ fontWeight:700, fontSize:'20px', color:'#1a1a1a', marginBottom:'8px' }}>
          {state === 'ok' ? 'Email verified' : state === 'error' ? 'Verification problem' : 'Verifying your email…'}
        </h1>
        {message && <p style={{ color:'#555', fontSize:'14px', lineHeight:1.6 }}>{message}</p>}
        {state !== 'working' && (
          <Link to="/login" style={{ display:'inline-block', marginTop:'18px', background:BLUE, color:'#fff', fontWeight:700, fontSize:'14px', padding:'11px 28px', borderRadius:'24px' }}>Go to Sign in</Link>
        )}
      </div>
    </div>
  );
}
