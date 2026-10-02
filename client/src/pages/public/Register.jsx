import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isValidLinkedIn, LINKEDIN_ERROR, REFERRAL_SOURCES, SOURCES_WITH_REFERRER } from '../../utils/referral';

const BLUE = '#0a66c2';
const inp = { width:'100%', border:'1px solid #ddd', borderRadius:'6px', padding:'10px 12px', fontSize:'14px', outline:'none', boxSizing:'border-box' };

export default function Register() {
  const { register } = useAuth();
  const navigate      = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') === 'recruiter' ? 'recruiter' : 'seeker';
  const [form, setForm] = useState({ fullName:'', email:'', password:'', role, phone:'', location:'', linkedinProfile:'', referralSource:'', iipaReferredBy:'', iipaMemberId:'' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault(); setError('');
    if (role === 'seeker') {
      if (!isValidLinkedIn(form.linkedinProfile)) return setError(LINKEDIN_ERROR);
      if (!form.referralSource) return setError('Please tell us how you heard about IIPA Jobs.');
    }
    setLoading(true);
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
            <span style={{ color:'#1a237e', fontWeight:600, fontSize:'18px' }}>Jobs</span>
          </Link>
          <h1 style={{ fontWeight:700, color:'#1a1a1a', fontSize:'22px', marginTop:'16px' }}>Make the most of your professional life</h1>
        </div>

        <div style={{ background:'#fff', borderRadius:'8px', boxShadow:'0 0 0 1px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06)', padding:'24px' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', background: role==='recruiter' ? '#fff7ea' : '#f0f7ff', border: `1px solid ${role==='recruiter' ? '#fbe1bf' : '#c8e0f9'}`, padding:'10px', borderRadius:'6px', marginBottom:'18px', fontSize:'13px', fontWeight:600, color: role==='recruiter' ? '#b45309' : BLUE }}>
            {role==='recruiter' ? '🏢 Registering as an Employer' : '🔍 Registering as a Job Seeker'}
          </div>

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
              <div>
                <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>Full Name *</label>
                <input type="text" required value={form.fullName} onChange={e=>set('fullName',e.target.value)}
                  style={inp} onFocus={e=>e.target.style.borderColor=BLUE} onBlur={e=>e.target.style.borderColor='#ddd'} placeholder="Your full name" />
              </div>
              <div>
                <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>Email *</label>
                <input type="email" required value={form.email} onChange={e=>set('email',e.target.value)}
                  style={inp} onFocus={e=>e.target.style.borderColor=BLUE} onBlur={e=>e.target.style.borderColor='#ddd'} placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>Password *</label>
              <input type="password" required minLength={6} value={form.password} onChange={e=>set('password',e.target.value)}
                style={inp} onFocus={e=>e.target.style.borderColor=BLUE} onBlur={e=>e.target.style.borderColor='#ddd'} placeholder="6+ characters" />
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
              <div>
                <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>Phone</label>
                <input type="tel" value={form.phone} onChange={e=>set('phone',e.target.value)}
                  style={inp} onFocus={e=>e.target.style.borderColor=BLUE} onBlur={e=>e.target.style.borderColor='#ddd'} placeholder="+91-..." />
              </div>
              <div>
                <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>City</label>
                <input type="text" value={form.location} onChange={e=>set('location',e.target.value)}
                  style={inp} onFocus={e=>e.target.style.borderColor=BLUE} onBlur={e=>e.target.style.borderColor='#ddd'} placeholder="Mumbai, Delhi…" />
              </div>
            </div>
            {role === 'seeker' && (
              <>
                <div>
                  <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>LinkedIn Profile URL *</label>
                  <input type="text" inputMode="url" value={form.linkedinProfile} onChange={e=>set('linkedinProfile',e.target.value)}
                    style={inp} onFocus={e=>e.target.style.borderColor=BLUE} onBlur={e=>e.target.style.borderColor='#ddd'} placeholder="https://www.linkedin.com/in/username" />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>How did you hear about IIPA Jobs? *</label>
                  <select value={form.referralSource} onChange={e=>setForm(f=>({ ...f, referralSource:e.target.value, iipaReferredBy: SOURCES_WITH_REFERRER.includes(e.target.value) ? f.iipaReferredBy : '', iipaMemberId: e.target.value === 'IIPA Member' ? f.iipaMemberId : '' }))}
                    style={{ ...inp, background:'#fff' }}>
                    <option value="">Select an option</option>
                    {REFERRAL_SOURCES.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <style>{'@media(max-width:480px){ .ref-grid{ grid-template-columns:1fr !important; } }'}</style>
                {SOURCES_WITH_REFERRER.includes(form.referralSource) && (
                  <div style={{ display:'grid', gridTemplateColumns: form.referralSource === 'IIPA Member' ? '1fr 1fr' : '1fr', gap:'10px' }} className="ref-grid">
                    <div>
                      <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>Referred By</label>
                      <input type="text" maxLength={150} value={form.iipaReferredBy} onChange={e=>set('iipaReferredBy',e.target.value)}
                        style={inp} onFocus={e=>e.target.style.borderColor=BLUE} onBlur={e=>e.target.style.borderColor='#ddd'} placeholder="Name of the person who referred you" />
                    </div>
                    {form.referralSource === 'IIPA Member' && (
                      <div>
                        <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>IIPA Member ID <span style={{ color:'#999', fontWeight:400 }}>(optional)</span></label>
                        <input type="text" maxLength={60} value={form.iipaMemberId} onChange={e=>set('iipaMemberId',e.target.value)}
                          style={inp} onFocus={e=>e.target.style.borderColor=BLUE} onBlur={e=>e.target.style.borderColor='#ddd'} />
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
            {error && <p style={{ color:'#c62828', fontSize:'13px' }}>{error}</p>}
            <button type="submit" disabled={loading}
              style={{ background:BLUE, color:'#fff', fontWeight:700, fontSize:'15px', padding:'12px', borderRadius:'24px', border:'none', opacity:loading?0.65:1, cursor:loading?'not-allowed':'pointer', marginTop:'4px' }}>
              {loading ? 'Creating account…' : 'Agree & Join'}
            </button>
          </form>

          <div style={{ textAlign:'center', marginTop:'16px', paddingTop:'16px', borderTop:'1px solid #e0e0e0' }}>
            <span style={{ fontSize:'13px', color:'#666' }}>Already on IIPA Job Forum? </span>
            <Link to="/login" style={{ color:BLUE, fontWeight:600, fontSize:'13px' }}>Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
