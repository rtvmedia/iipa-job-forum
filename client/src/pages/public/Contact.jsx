import { useState } from 'react';

const inp = { width:'100%', border:'1px solid #ddd', borderRadius:'6px', padding:'10px 12px', fontSize:'14px', outline:'none', boxSizing:'border-box' };

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' });
  const [sent, setSent] = useState(false);

  return (
    <div>
      <section style={{ background:'#1a237e', padding:'48px 16px', textAlign:'center' }}>
        <h1 style={{ fontWeight:700, fontSize:'clamp(1.6rem,3vw,2.2rem)', color:'white', marginBottom:'8px' }}>Get in Touch</h1>
        <p style={{ color:'rgba(255,255,255,0.75)', maxWidth:'480px', margin:'0 auto', fontSize:'14px', lineHeight:1.6 }}>
          Questions, feedback, or partnership enquiries — we're here to help.
        </p>
      </section>

      <div style={{ maxWidth:'900px', margin:'0 auto', padding:'40px 16px', display:'grid', gap:'32px' }} className="contact-grid">
        <style>{`.contact-grid { grid-template-columns:1fr; } @media(min-width:768px){ .contact-grid{ grid-template-columns:1fr 1fr; } }`}</style>
        <div>
          <h2 style={{ fontWeight:700, fontSize:'17px', color:'#1a237e', marginBottom:'20px' }}>Contact Information</h2>
          {[
            { icon:'📧', label:'Email',   value:'info@iipajobforum.com' },
            { icon:'📞', label:'Phone',   value:'+91-22-111-IIPA-JF' },
            { icon:'📍', label:'Address', value:'IIPA House, Mumbai, India' },
            { icon:'🕐', label:'Hours',   value:'Mon – Fri, 9am – 6pm IST' },
          ].map(c => (
            <div key={c.label} style={{ display:'flex', alignItems:'flex-start', gap:'14px', marginBottom:'18px' }}>
              <span style={{ fontSize:'1.3rem', lineHeight:1 }}>{c.icon}</span>
              <div>
                <p style={{ fontSize:'11px', fontWeight:600, color:'#999', textTransform:'uppercase', letterSpacing:'0.05em' }}>{c.label}</p>
                <p style={{ color:'#1a1a1a', fontSize:'14px', marginTop:'2px' }}>{c.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background:'white', borderRadius:'8px', boxShadow:'0 0 0 1px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06)', padding:'24px' }}>
          {sent ? (
            <div style={{ textAlign:'center', padding:'40px 0' }}>
              <div style={{ fontSize:'2.5rem', marginBottom:'12px' }}>✅</div>
              <h3 style={{ fontWeight:700, color:'#1a237e', fontSize:'18px' }}>Message Sent!</h3>
              <p style={{ color:'#666', fontSize:'14px', marginTop:'6px' }}>We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); setSent(true); }} style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
                <div>
                  <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>Name</label>
                  <input required value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
                    style={inp} onFocus={e=>e.target.style.borderColor='#1a237e'} onBlur={e=>e.target.style.borderColor='#ddd'} placeholder="Your name" />
                </div>
                <div>
                  <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>Email</label>
                  <input type="email" required value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}
                    style={inp} onFocus={e=>e.target.style.borderColor='#1a237e'} onBlur={e=>e.target.style.borderColor='#ddd'} placeholder="you@email.com" />
                </div>
              </div>
              <div>
                <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>Subject</label>
                <input required value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))}
                  style={inp} onFocus={e=>e.target.style.borderColor='#1a237e'} onBlur={e=>e.target.style.borderColor='#ddd'} placeholder="How can we help?" />
              </div>
              <div>
                <label style={{ display:'block', fontSize:'13px', fontWeight:500, color:'#333', marginBottom:'5px' }}>Message</label>
                <textarea required rows={5} value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))}
                  style={{ ...inp, resize:'none' }} onFocus={e=>e.target.style.borderColor='#1a237e'} onBlur={e=>e.target.style.borderColor='#ddd'} placeholder="Tell us more…" />
              </div>
              <button type="submit"
                style={{ background:'#1a237e', color:'white', fontWeight:600, fontSize:'14px', padding:'11px', borderRadius:'6px', border:'none', cursor:'pointer' }}>
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
