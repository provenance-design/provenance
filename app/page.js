'use client';

import { useState, useEffect } from "react";
import { ARCHIVE, DISCIPLINES, CONNECTION_TYPES } from "./data/archive";
const CONN_TYPES = Object.fromEntries(Object.entries(CONNECTION_TYPES).map(([k, v]) => [k, { ...v, icon: v.symbol }]));
const PALETTE = { Product: "#8B4513", Furniture: "#2F5233", Graphic: "#4A6741", Lighting: "#5B7065", Architecture: "#6B7B6F", Typography: "#7A8B7A", Textile: "#9B6B4A", Transport: "#5A7B8B", Ceramic: "#8B7355", Glass: "#6B8B7B", Metalwork: "#7B6B8B" };

function getConnection(id) { return ARCHIVE.find(item => item.id === id); }

function ImageWithFallback({ item, aspectRatio = "4/3" }) {
  const [imgUrl, setImgUrl] = useState(item.imageUrl || null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(!item.imageUrl);

  useEffect(() => {
    if (item.imageUrl || !item.wikiTitle) { setLoading(false); return; }
    let cancelled = false;
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(item.wikiTitle)}`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        const src = data?.thumbnail?.source?.replace(/\/\d+px-/, '/800px-') || data?.originalimage?.source;
        if (src) setImgUrl(src); else setFailed(true);
        setLoading(false);
      })
      .catch(() => { if (!cancelled) { setFailed(true); setLoading(false); } });
    return () => { cancelled = true; };
  }, [item.wikiTitle, item.imageUrl]);

  const fallbackEl = (
    <div style={{ aspectRatio, background: '#EDEADE', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#B8A080' }}>№ {String(item.id).padStart(3, '0')}</div>
      <div style={{ position: 'absolute', top: '16px', left: '16px', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: PALETTE[item.discipline], fontWeight: 600 }}>{item.discipline}</div>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: aspectRatio === "3/2" ? '26px' : '48px', color: '#D4CFC0', lineHeight: 0.92, letterSpacing: '-0.03em', marginBottom: '8px' }}>{item.title.split(' ').slice(0, 3).join(' ')}</div>
      <div style={{ fontSize: '10px', color: '#B8A080', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{item.designer.split('&')[0].trim()} · {item.year}</div>
    </div>
  );

  if ((!item.wikiTitle && !item.imageUrl) || failed) return fallbackEl;
  if (loading) return fallbackEl;

  return (
    <div style={{ position: 'relative', overflow: 'hidden', aspectRatio, background: '#EDEADE' }}>
      <img src={imgUrl} alt={item.title} onError={() => setFailed(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'contrast(1.02) saturate(0.85)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.45))', padding: '24px 16px 12px', color: '#fff' }}>
        <div style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.85 }}>{item.discipline} · {item.year}</div>
      </div>
    </div>
  );
}

export default function Page() {
  const [view, setView] = useState("featured");
  const [selectedDiscipline, setSelectedDiscipline] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [connFilter, setConnFilter] = useState("all");
  const [featured] = useState(() => ARCHIVE[0]);

  const filteredArchive = ARCHIVE.filter(item => {
    const d = selectedDiscipline === "All" || item.discipline === selectedDiscipline;
    const q = searchQuery.toLowerCase();
    const s = q === "" || item.title.toLowerCase().includes(q) || item.designer.toLowerCase().includes(q) || item.movement.toLowerCase().includes(q) || item.keywords.some(k => k.toLowerCase().includes(q)) || item.manufacturer.toLowerCase().includes(q);
    return d && s;
  });

  const openItem = (item) => { setSelectedItem(item); setView("detail"); setConnFilter("all"); window.scrollTo(0, 0); };

  const filteredConnections = (item) => {
    if (!item) return [];
    return connFilter === "all" ? item.connections : item.connections.filter(c => c.type === connFilter);
  };

  const renderConnections = (item, columns = 3) => {
    const conns = filteredConnections(item);
    const types = [...new Set(item.connections.map(c => c.type))];
    return (
      <div>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '9.5px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#B8A080', fontWeight: 600, marginRight: '8px' }}>Connections</span>
          <button onClick={() => setConnFilter("all")} style={{ fontFamily: 'inherit', fontSize: '10px', padding: '3px 10px', border: connFilter === 'all' ? '1px solid #1C1C1C' : '1px solid #DDD', background: connFilter === 'all' ? '#1C1C1C' : 'transparent', color: connFilter === 'all' ? '#F6F5F0' : '#AAA', cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase' }}>All</button>
          {types.map(t => (
            <button key={t} onClick={() => setConnFilter(t)} style={{ fontFamily: 'inherit', fontSize: '10px', padding: '3px 10px', border: connFilter === t ? `1px solid ${CONN_TYPES[t].color}` : '1px solid #DDD', background: connFilter === t ? CONN_TYPES[t].color : 'transparent', color: connFilter === t ? '#FFF' : '#AAA', cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {CONN_TYPES[t].icon} {CONN_TYPES[t].label}
            </button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '12px' }}>
          {conns.map((conn, idx) => {
            const target = getConnection(conn.id);
            if (!target) return null;
            const ct = CONN_TYPES[conn.type];
            return (
              <div key={idx} onClick={() => openItem(target)} style={{ cursor: 'pointer', padding: '16px', background: '#FDFCF8', border: '1px solid #EBE8E0', transition: 'all 0.25s', borderLeft: `3px solid ${ct.color}` }}
                onMouseEnter={e => { e.currentTarget.style.background = '#FFF'; e.currentTarget.style.borderColor = '#CCC'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#FDFCF8'; e.currentTarget.style.borderColor = '#EBE8E0'; }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: ct.color, fontWeight: 600 }}>{ct.icon} {ct.label}</span>
                  <span style={{ fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: PALETTE[target.discipline] }}>{target.discipline}</span>
                </div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '15px', marginBottom: '3px', lineHeight: 1.25 }}>{target.title}</div>
                <div style={{ fontSize: '11px', color: '#AAA', marginBottom: '10px' }}>{target.designer.split('&')[0].trim()}, {target.year}</div>
                <div style={{ fontSize: '11px', color: '#888', lineHeight: 1.55, fontStyle: 'italic' }}>{conn.reason}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* HEADER */}
      <header style={{ padding: '28px 44px 0', background: '#F6F5F0', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '32px', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1, cursor: 'pointer' }} onClick={() => { setView('featured'); setSelectedItem(null); }}>Provenance</div>
            <div style={{ fontSize: '10.5px', fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B8A080', marginTop: '5px' }}>A curated archive of significant design</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: '#CCC', letterSpacing: '0.06em', lineHeight: 1.6 }}>
              {ARCHIVE.length} entries · 6 connection types<br/>Product · Graphic · Furniture · Architecture · Typography · Lighting
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #DDD', alignItems: 'center' }}>
          {[['featured', 'Today'], ['archive', 'Archive'], ['connections', 'Connection Map'], ['about', 'About']].map(([v, label]) => (
            <button key={v} onClick={() => { setView(v); setSelectedItem(null); }}
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: (view === v || (v === 'archive' && view === 'detail')) ? '#1C1C1C' : '#AAA', background: 'none', border: 'none', padding: '10px 20px 12px', cursor: 'pointer', borderBottom: (view === v || (v === 'archive' && view === 'detail')) ? '2px solid #1C1C1C' : '2px solid transparent', marginBottom: '-1px', transition: 'all 0.2s' }}>
              {label}
            </button>
          ))}
          {view === 'archive' && (
            <input type="text" placeholder="Search designer, movement, keyword…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              style={{ marginLeft: 'auto', fontFamily: 'inherit', fontSize: '12px', padding: '6px 16px', border: '1px solid #DDD', background: '#FFF', outline: 'none', width: '220px', color: '#1C1C1C' }} />
          )}
        </div>
      </header>

      <div style={{ padding: '44px', maxWidth: '1100px', margin: '0 auto' }}>

        {/* FEATURED */}
        {view === 'featured' && (
          <div>
            <div style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#B8A080', marginBottom: '32px', fontWeight: 500 }}>Today&apos;s Entry</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px' }}>
              <div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '110px', color: '#E8E4DC', lineHeight: 0.85, letterSpacing: '-0.04em', marginBottom: '16px' }}>{featured.year}</div>
                <div style={{ display: 'inline-block', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 500, color: PALETTE[featured.discipline], borderBottom: `2px solid ${PALETTE[featured.discipline]}`, marginBottom: '16px', paddingBottom: '2px' }}>{featured.discipline}</div>
                <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '36px', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.015em', marginBottom: '10px' }}>{featured.title}</h1>
                <div style={{ fontSize: '15px', color: '#888', marginBottom: '8px' }}>{featured.designer}</div>
                <div style={{ fontSize: '12px', color: '#BBB', marginBottom: '28px' }}>{featured.manufacturer} · {featured.origin} · {featured.collection}</div>
                <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#444', marginBottom: '28px' }}>{featured.description}</p>
                <div style={{ fontSize: '9.5px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#B8A080', marginBottom: '10px', fontWeight: 600 }}>Why It Matters</div>
                <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#777', fontStyle: 'italic' }}>{featured.significance}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '24px' }}>
                  {featured.keywords.map((kw, i) => <span key={i} style={{ fontSize: '10px', padding: '3px 10px', background: '#EDEADE', color: '#888' }}>{kw}</span>)}
                </div>
              </div>
              <div>
                <ImageWithFallback item={featured} aspectRatio="3/4" />
                <div style={{ marginTop: '36px', paddingTop: '24px', borderTop: '1px solid #E4E0D8' }}>
                  {renderConnections(featured, 2)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ARCHIVE */}
        {view === 'archive' && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
              {DISCIPLINES.map(d => (
                <button key={d} onClick={() => setSelectedDiscipline(d)}
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10.5px', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '6px 14px', border: selectedDiscipline === d ? '1px solid #1C1C1C' : '1px solid #DDD', background: selectedDiscipline === d ? '#1C1C1C' : 'transparent', color: selectedDiscipline === d ? '#F6F5F0' : '#AAA', cursor: 'pointer', transition: 'all 0.2s' }}>
                  {d}
                </button>
              ))}
            </div>
            {filteredArchive.length === 0 ? <div style={{ textAlign: 'center', padding: '80px 0', color: '#CCC' }}>No entries match your search.</div> : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1px', background: '#E4E0D8', border: '1px solid #E4E0D8' }}>
                {filteredArchive.map(item => (
                  <div key={item.id} onClick={() => openItem(item)}
                    style={{ background: '#FDFCF8', cursor: 'pointer', display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FFF'}
                    onMouseLeave={e => e.currentTarget.style.background = '#FDFCF8'}>
                    <ImageWithFallback item={item} aspectRatio="3/2" />
                    <div style={{ padding: '16px 20px 20px' }}>
                      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '18px', lineHeight: 1.2, marginBottom: '4px' }}>{item.title}</div>
                      <div style={{ fontSize: '13px', color: '#999', marginBottom: '8px' }}>{item.designer.split('&')[0].trim()}, {item.year}</div>
                      <div style={{ fontSize: '11px', color: '#BBB', paddingTop: '8px', borderTop: '1px solid #EBE8E0' }}>
                        {item.movement} · {item.connections.length} connections
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* DETAIL */}
        {view === 'detail' && selectedItem && (() => { const s = selectedItem; return (
          <div>
            <button onClick={() => setView('archive')} style={{ fontFamily: 'inherit', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#BBB', cursor: 'pointer', background: 'none', border: 'none', padding: 0, marginBottom: '36px' }}>← Back to Archive</button>
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '56px', alignItems: 'start' }}>
              <div>
                <ImageWithFallback item={s} aspectRatio="4/3" />
                <div style={{ marginTop: '36px', paddingTop: '24px', borderTop: '1px solid #E4E0D8' }}>
                  {renderConnections(s, 2)}
                </div>
              </div>
              <div>
                <div style={{ display: 'inline-block', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 500, color: PALETTE[s.discipline], borderBottom: `2px solid ${PALETTE[s.discipline]}`, marginBottom: '14px', paddingBottom: '2px' }}>{s.discipline} · {s.movement}</div>
                <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '30px', fontWeight: 400, lineHeight: 1.1, marginBottom: '10px' }}>{s.title}</h1>
                <div style={{ fontSize: '15px', color: '#888', marginBottom: '20px' }}>{s.designer}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px', paddingBottom: '24px', borderBottom: '1px solid #E4E0D8' }}>
                  {[['Year', s.year], ['Origin', s.origin], ['Manufacturer', s.manufacturer], ['Collection', s.collection]].map(([l, v]) => (
                    <div key={l}><div style={{ fontSize: '9.5px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#BBB', marginBottom: '3px' }}>{l}</div><div style={{ fontSize: '13px', color: '#555' }}>{v}</div></div>
                  ))}
                </div>
                <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#444', marginBottom: '28px' }}>{s.description}</p>
                <div style={{ fontSize: '9.5px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#B8A080', marginBottom: '10px', fontWeight: 600 }}>Why It Matters</div>
                <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#777', fontStyle: 'italic', marginBottom: '24px' }}>{s.significance}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {s.keywords.map((kw, i) => <span key={i} style={{ fontSize: '10px', padding: '3px 10px', background: '#EDEADE', color: '#888' }}>{kw}</span>)}
                </div>
              </div>
            </div>
          </div>
        ); })()}

        {/* CONNECTION MAP */}
        {view === 'connections' && (
          <div>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '26px', fontWeight: 400, marginBottom: '12px' }}>Connection Map</h2>
              <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.6, maxWidth: '600px' }}>
                Every entry in Provenance connects to others through argued relationships — not just &quot;these look similar&quot; but &quot;these are in dialogue because one answers the other.&quot; Filter by connection type to trace specific threads through the archive.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
              {Object.entries(CONN_TYPES).map(([key, ct]) => (
                <div key={key} style={{ padding: '12px 16px', background: '#FDFCF8', border: '1px solid #EBE8E0', flex: '1', minWidth: '150px' }}>
                  <div style={{ fontSize: '16px', marginBottom: '4px' }}>{ct.icon}</div>
                  <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: ct.color, marginBottom: '4px' }}>{ct.label}</div>
                  <div style={{ fontSize: '11px', color: '#AAA', lineHeight: 1.45 }}>{ct.description}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gap: '2px', background: '#E4E0D8' }}>
              {ARCHIVE.map(item => (
                <div key={item.id} style={{ background: '#FDFCF8', padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '18px', cursor: 'pointer' }} onClick={() => openItem(item)}>{item.title}</span>
                    <span style={{ fontSize: '12px', color: '#BBB' }}>{item.designer.split('&')[0].trim()}, {item.year}</span>
                    <span style={{ fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: PALETTE[item.discipline], fontWeight: 500 }}>{item.discipline}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {item.connections.map((conn, idx) => {
                      const target = getConnection(conn.id);
                      const ct = CONN_TYPES[conn.type];
                      if (!target) return null;
                      return (
                        <span key={idx} onClick={() => openItem(target)} style={{ fontSize: '11px', padding: '3px 10px', background: '#F0EDE8', color: '#666', cursor: 'pointer', borderLeft: `2px solid ${ct.color}`, lineHeight: 1.4 }}>
                          {ct.icon} {target.title}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABOUT */}
        {view === 'about' && (
          <div style={{ maxWidth: '600px' }}>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '30px', fontWeight: 400, lineHeight: 1.2, marginBottom: '28px' }}>Design knowledge, not design inspiration</h1>
            <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#555', marginBottom: '16px' }}>
              Provenance is a curated archive of significant design objects, buildings, typefaces, systems, and graphics. Each entry carries provenance, movement, cultural significance, and — critically — argued connections to related works across disciplines and periods.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#555', marginBottom: '16px' }}>
              It exists to solve a specific problem. Design students research visually but learn contextually. Pinterest gives you images without knowledge. Textbooks give you knowledge without discovery. Museum databases give you metadata without argument. Provenance bridges all three — the serendipity of visual browsing, the rigour of a museum collection, and the lateral thinking of a great design tutor.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#555', marginBottom: '16px' }}>
              The connections are the point. Every link between entries is argued — not &quot;these look similar&quot; but &quot;these are in direct dialogue because one is the answer to the other.&quot; Six connection types let you trace specific threads through design history:
            </p>
            <div style={{ margin: '24px 0', padding: '20px 24px', background: '#FDFCF8', border: '1px solid #EBE8E0' }}>
              {Object.entries(CONN_TYPES).map(([key, ct]) => (
                <div key={key} style={{ display: 'flex', gap: '12px', alignItems: 'baseline', marginBottom: '10px' }}>
                  <span style={{ fontSize: '14px', color: ct.color, minWidth: '20px' }}>{ct.icon}</span>
                  <span style={{ fontSize: '12px', fontWeight: 500, color: ct.color, textTransform: 'uppercase', letterSpacing: '0.06em', minWidth: '120px' }}>{ct.label}</span>
                  <span style={{ fontSize: '13px', color: '#888' }}>{ct.description}</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#555', marginBottom: '16px' }}>
              Entries are generated from institutional archive metadata (Cooper Hewitt, V&amp;A, MoMA, Design Museum, Vitra, Triennale). Images are sourced from Wikimedia Commons under Creative Commons licensing. The archive is designed to grow — each new entry creates new connections across the existing collection.
            </p>
            <div style={{ fontSize: '13px', color: '#AAA', marginTop: '36px', paddingTop: '24px', borderTop: '1px solid #E4E0D8', lineHeight: 1.65 }}>
              Provenance is an open educational resource for design students and educators.
              <div style={{ marginTop: '20px' }}>
                <div style={{ fontSize: '9.5px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#B8A080', marginBottom: '12px', fontWeight: 600 }}>Source Archives</div>
                {["Cooper Hewitt, Smithsonian Design Museum", "Victoria & Albert Museum, London", "Museum of Modern Art (MoMA), New York", "Design Museum, London", "Vitra Design Museum, Weil am Rhein", "Triennale Design Museum, Milan", "Museum für Gestaltung, Zürich"].map((s, i) => (
                  <div key={i} style={{ fontSize: '12.5px', color: '#AAA', lineHeight: 1.9 }}>{s}</div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <footer style={{ borderTop: '1px solid #E4E0D8', padding: '28px 44px', marginTop: '80px', display: 'flex', justifyContent: 'space-between', fontSize: '10.5px', color: '#CCC' }}>
        <span>Provenance © 2025</span>
        <span>Images via Wikimedia Commons · CC BY-SA</span>
      </footer>
    </div>
  );
}
