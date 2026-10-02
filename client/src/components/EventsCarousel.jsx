import { useRef } from 'react';

const BLUE = '#0a66c2';

// Public "IIPA Events" carousel. The caller only renders it when there is at least one active event.
export default function EventsCarousel({ events }) {
  const trackRef = useRef(null);
  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.8, 280), behavior: 'smooth' });
  };
  const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric', timeZone:'UTC' });

  return (
    <section id="events" style={{ maxWidth:'1320px', margin:'0 auto', padding:'28px 16px' }}>
      <style>{`
        .ev-track { display:flex; gap:16px; overflow-x:auto; scroll-snap-type:x mandatory; padding:4px 2px 12px; scrollbar-width:thin; -webkit-overflow-scrolling:touch; }
        .ev-card { flex:0 0 min(340px, 84%); scroll-snap-align:start; background:#fff; border:1px solid #dbe8fb; border-radius:14px; overflow:hidden; box-shadow:0 4px 14px rgba(10,102,194,0.08); display:flex; flex-direction:column; transition:transform .18s ease, box-shadow .18s ease; }
        .ev-card:hover { transform:translateY(-4px); box-shadow:0 12px 26px rgba(10,102,194,0.2); }
        .ev-img { width:100%; aspect-ratio:16/9; object-fit:cover; display:block; background:#eaf2fe; }
        .ev-ph { width:100%; aspect-ratio:16/9; background:linear-gradient(135deg,#0a4a8c,#0f5fb5); display:flex; align-items:center; justify-content:center; color:rgba(255,255,255,0.85); font-weight:700; letter-spacing:.08em; font-size:13px; }
        .ev-nav { width:34px; height:34px; border-radius:50%; border:1px solid #c8e0f9; background:#fff; color:${BLUE}; font-size:16px; cursor:pointer; }
        .ev-nav:hover { background:${BLUE}; color:#fff; }
      `}</style>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px' }}>
        <h2 style={{ fontWeight:700, fontSize:'17px', color:'#1a1a1a' }}>IIPA Events</h2>
        {events.length > 1 && (
          <div style={{ display:'flex', gap:'8px' }}>
            <button className="ev-nav" onClick={() => scrollBy(-1)} aria-label="Previous events">‹</button>
            <button className="ev-nav" onClick={() => scrollBy(1)} aria-label="Next events">›</button>
          </div>
        )}
      </div>
      <div className="ev-track" ref={trackRef}>
        {events.map(ev => {
          const img = ev.bannerUrl || ev.imageUrl;
          return (
            <article key={ev.id} className="ev-card">
              {img ? <img className="ev-img" src={img} alt={ev.title} loading="lazy" /> : <div className="ev-ph">IIPA EVENT</div>}
              <div style={{ padding:'14px 16px 16px' }}>
                <p style={{ color:BLUE, fontSize:'12px', fontWeight:700 }}>{fmt(ev.eventDate)}{ev.location ? ` · ${ev.location}` : ''}</p>
                <h3 style={{ fontWeight:700, color:'#1a1a1a', fontSize:'15px', lineHeight:1.4, marginTop:'4px' }}>{ev.title}</h3>
                {ev.description && <p style={{ color:'#555', fontSize:'13px', lineHeight:1.55, marginTop:'6px' }}>{ev.description}</p>}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
