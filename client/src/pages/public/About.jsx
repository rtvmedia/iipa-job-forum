import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div>
      <section style={{ background:'linear-gradient(135deg,#0a2342,#0d3060)' }} className="py-20 px-4 text-white text-center">
        <h1 style={{ fontFamily:"'Georgia',serif", fontSize:'2.5rem', fontWeight:700, color:'white' }} className="mb-4">
          About IIPA Job Forum
        </h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg" style={{ fontFamily:'system-ui' }}>
          Pakistan's trusted career platform connecting ambitious professionals with forward-thinking employers.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 style={{ fontFamily:"'Georgia',serif", color:'#0a2342', fontSize:'1.8rem', fontWeight:700 }} className="mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4" style={{ fontFamily:'system-ui' }}>
            IIPA Job Forum was founded with a single purpose: to remove the friction from hiring and job searching in Pakistan. We believe every professional deserves access to quality opportunities, and every employer deserves to find the right talent efficiently.
          </p>
          <p className="text-gray-600 leading-relaxed" style={{ fontFamily:'system-ui' }}>
            Our platform provides two distinct, purpose-built workspaces — one for job seekers to discover, apply, and grow, and another for recruiters to post roles, screen candidates, and manage their hiring pipeline.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { icon:'🎯', title:'Purpose-Built',  desc:'Separate, focused experiences for seekers and recruiters' },
            { icon:'🤖', title:'AI-Assisted',    desc:'Smart matching and career guidance powered by AI' },
            { icon:'🔒', title:'Trusted',         desc:'Verified employers and professional-grade security' },
            { icon:'🚀', title:'Scalable',        desc:'Built for Pakistan\'s growing professional workforce' },
          ].map(f => (
            <div key={f.title} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="text-2xl mb-2">{f.icon}</div>
              <h3 className="font-semibold text-[#0a2342] text-sm mb-1" style={{ fontFamily:'system-ui' }}>{f.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed" style={{ fontFamily:'system-ui' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background:'#f8fafc' }} className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 style={{ fontFamily:"'Georgia',serif", color:'#0a2342', fontSize:'1.8rem', fontWeight:700 }} className="mb-10">
            Platform by the Numbers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value:'2,400+', label:'Active Vacancies' },
              { value:'850+',   label:'Partner Companies' },
              { value:'18,000+', label:'Registered Professionals' },
              { value:'94%',    label:'Placement Rate' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div style={{ color:'#c9a84c', fontFamily:'system-ui', fontSize:'1.8rem', fontWeight:700 }}>{s.value}</div>
                <div className="text-gray-500 text-sm mt-1" style={{ fontFamily:'system-ui' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 text-center" style={{ background:'linear-gradient(135deg,#0a2342,#0d3060)' }}>
        <h2 style={{ fontFamily:"'Georgia',serif", fontSize:'2rem', fontWeight:700, color:'white' }} className="mb-3">
          Join the IIPA Community
        </h2>
        <p className="text-gray-300 mb-8" style={{ fontFamily:'system-ui' }}>Start your journey today — it's free.</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link to="/register"
            style={{ background:'#c9a84c', fontFamily:'system-ui', fontWeight:600 }}
            className="px-8 py-3 rounded-xl text-[#0a2342] hover:bg-yellow-400 transition">
            Create Account
          </Link>
          <Link to="/jobs"
            style={{ fontFamily:'system-ui' }}
            className="px-8 py-3 rounded-xl border border-white/30 text-white hover:bg-white/10 transition">
            Browse Jobs
          </Link>
        </div>
      </section>
    </div>
  );
}
