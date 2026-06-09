import { useState } from 'react';

export default function Contact() {
  const [form, setForm]     = useState({ name:'', email:'', subject:'', message:'' });
  const [sent, setSent]     = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div>
      <section style={{ background:'linear-gradient(135deg,#0a2342,#0d3060)' }} className="py-16 px-4 text-white text-center">
        <h1 style={{ fontFamily:"'Georgia',serif", fontSize:'2.5rem', fontWeight:700, color:'white' }} className="mb-3">
          Get in Touch
        </h1>
        <p className="text-gray-300 max-w-xl mx-auto" style={{ fontFamily:'system-ui' }}>
          Questions, feedback, or partnership enquiries — we're here to help.
        </p>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12">
        {/* Contact Info */}
        <div>
          <h2 style={{ fontFamily:"'Georgia',serif", color:'#0a2342', fontSize:'1.5rem', fontWeight:700 }} className="mb-6">
            Contact Information
          </h2>
          {[
            { icon:'📧', label:'Email',    value:'info@iipajobforum.com' },
            { icon:'📞', label:'Phone',    value:'+92-21-111-IIPA-JF' },
            { icon:'📍', label:'Address',  value:'IIPA House, Karachi, Pakistan' },
            { icon:'🕐', label:'Hours',    value:'Mon – Fri, 9am – 6pm PKT' },
          ].map(c => (
            <div key={c.label} className="flex items-start gap-4 mb-5">
              <span className="text-2xl">{c.icon}</span>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide" style={{ fontFamily:'system-ui' }}>{c.label}</p>
                <p className="text-gray-800 text-sm mt-0.5" style={{ fontFamily:'system-ui' }}>{c.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {sent ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">✅</div>
              <h3 style={{ fontFamily:"'Georgia',serif", color:'#0a2342', fontSize:'1.3rem', fontWeight:700 }}>Message Sent!</h3>
              <p className="text-gray-500 text-sm mt-2" style={{ fontFamily:'system-ui' }}>
                Thank you for reaching out. We'll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily:'system-ui' }}>Name</label>
                  <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#0a2342]"
                    style={{ fontFamily:'system-ui' }} placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily:'system-ui' }}>Email</label>
                  <input type="email" required value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#0a2342]"
                    style={{ fontFamily:'system-ui' }} placeholder="you@email.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily:'system-ui' }}>Subject</label>
                <input required value={form.subject} onChange={e => setForm(f => ({...f, subject: e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#0a2342]"
                  style={{ fontFamily:'system-ui' }} placeholder="How can we help?" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily:'system-ui' }}>Message</label>
                <textarea required rows={5} value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#0a2342] resize-none"
                  style={{ fontFamily:'system-ui' }} placeholder="Tell us more…" />
              </div>
              <button type="submit"
                style={{ background:'#0a2342', fontFamily:'system-ui', fontWeight:600 }}
                className="w-full py-3 rounded-xl text-white text-sm hover:bg-[#0d3060] transition">
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
