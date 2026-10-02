import { Link } from 'react-router-dom';

const BLUE = '#0a66c2';

// Shared layout for Privacy Policy / Terms. `sections` = [{ title, body: [string | { list: string[] }] }]
export default function LegalPage({ title, updated, intro, sections, contactEmail }) {
  return (
    <div>
      <section style={{ background:'linear-gradient(135deg, #062b56 0%, #0a4a8c 100%)', padding:'40px 16px', textAlign:'center' }}>
        <h1 style={{ fontWeight:700, fontSize:'clamp(1.5rem,3vw,2rem)', color:'white', marginBottom:'6px' }}>{title}</h1>
        <p style={{ color:'rgba(255,255,255,0.75)', fontSize:'13px' }}>Last updated: {updated}</p>
      </section>

      <article style={{ maxWidth:'820px', margin:'0 auto', padding:'32px 16px 48px', color:'#333', fontSize:'14.5px', lineHeight:1.75 }}>
        {intro && <p style={{ marginBottom:'22px' }}>{intro}</p>}
        {sections.map((sec, i) => (
          <section key={sec.title} style={{ marginBottom:'22px' }}>
            <h2 style={{ fontWeight:700, fontSize:'17px', color:'#1a1a1a', marginBottom:'8px' }}>{i + 1}. {sec.title}</h2>
            {sec.body.map((b, j) => typeof b === 'string'
              ? <p key={j} style={{ marginBottom:'8px' }}>{b}</p>
              : <ul key={j} style={{ paddingLeft:'22px', marginBottom:'8px', listStyle:'disc' }}>{b.list.map(li => <li key={li} style={{ marginBottom:'4px' }}>{li}</li>)}</ul>
            )}
          </section>
        ))}
        {contactEmail && (
          <p style={{ marginTop:'28px', paddingTop:'18px', borderTop:'1px solid #e0e0e0' }}>
            Questions about this page? Email us at <a href={`mailto:${contactEmail}`} style={{ color:BLUE, fontWeight:600 }}>{contactEmail}</a>.
          </p>
        )}
        <p style={{ marginTop:'14px', fontSize:'13px' }}>
          <Link to="/privacy" style={{ color:BLUE }}>Privacy Policy</Link> · <Link to="/terms" style={{ color:BLUE }}>Terms &amp; Conditions</Link>
        </p>
      </article>
    </div>
  );
}
