'use client';

import { useState, useEffect, useRef } from "react";
import { ARCHIVE, DISCIPLINES, CONNECTION_TYPES } from "./data/archive";
const CONN_TYPES = Object.fromEntries(Object.entries(CONNECTION_TYPES).map(([k, v]) => [k, { ...v, icon: v.symbol }]));
const PALETTE = { Product: "#8B4513", Furniture: "#2F5233", Graphic: "#4A6741", Lighting: "#5B7065", Architecture: "#6B7B6F", Typography: "#7A8B7A", Textile: "#9B6B4A", Transport: "#5A7B8B", Ceramic: "#8B7355", Glass: "#6B8B7B", Metalwork: "#7B6B8B" };

// Network visualiser colours (designed for dark canvas background)
const DISC_COLORS = { Product:"#C4A882", Furniture:"#7BA68C", Graphic:"#8BA4B8", Lighting:"#C4B878", Architecture:"#A0887A", Typography:"#90A890", Textile:"#C49878", Transport:"#78A0B0", Ceramic:"#B0A080", Glass:"#80B0A0", Metalwork:"#A090B0" };
const TYPE_COLORS = { argument:"#C47050", lineage:"#6BA080", material:"#80A870", sameProblem:"#7090A0", zeitgeist:"#908878", method:"#8A9A8A" };

// Build graph data dynamically from ARCHIVE
const GRAPH_DATA = (() => {
  const idSet = new Set(ARCHIVE.map(e => e.id));
  const connCounts = new Map();
  ARCHIVE.forEach(e => {
    const outgoing = e.connections ? e.connections.length : 0;
    connCounts.set(e.id, (connCounts.get(e.id) || 0) + outgoing);
    if (e.connections) e.connections.forEach(c => {
      if (idSet.has(c.id)) connCounts.set(c.id, (connCounts.get(c.id) || 0) + 1);
    });
  });
  const n = ARCHIVE.map(e => [e.id, e.title, e.discipline, connCounts.get(e.id) || 0, e.year, e.designer]);
  const edges = [];
  ARCHIVE.forEach(e => {
    if (e.connections) e.connections.forEach(c => {
      if (idSet.has(c.id)) edges.push([e.id, c.id, c.type]);
    });
  });
  return { n, e: edges };
})();

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

const TYPE_LABELS = { argument: 'Argument', lineage: 'Lineage', material: 'Material', sameProblem: 'Same Problem', zeitgeist: 'Zeitgeist', method: 'Method' };

function NetworkCanvas({ onOpenItem }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const drawRef = useRef(null);
  const stateRef = useRef({
    nodes: [], edges: [], adj: new Map(), nodeMap: new Map(),
    tx: 0, ty: 0, scale: 1, dragging: false, dragX: 0, dragY: 0,
    hovered: null, selected: null, simSteps: 0,
    activeTypes: null
  });
  const [panelNode, setPanelNode] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);

  const toggleFilter = (type) => {
    const next = activeFilter === type ? null : type;
    setActiveFilter(next);
    stateRef.current.activeTypes = next;
    if (drawRef.current) drawRef.current();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.parentElement.clientWidth;
    const H = canvas.parentElement.clientHeight;
    canvas.width = W; canvas.height = H;

    const S = stateRef.current;
    S.nodes = GRAPH_DATA.n.map(n => ({
      id: n[0], t: n[1], disc: n[2], nc: n[3], y: n[4], designer: n[5] || '',
      x: W/2 + (Math.random()-0.5)*W*0.7,
      y: H/2 + (Math.random()-0.5)*H*0.7,
      vx: 0, vy: 0
    }));
    S.nodeMap = new Map(S.nodes.map(n => [n.id, n]));
    S.edges = GRAPH_DATA.e.filter(e => S.nodeMap.has(e[0]) && S.nodeMap.has(e[1])).map(e => ({
      source: S.nodeMap.get(e[0]), target: S.nodeMap.get(e[1]), type: e[2]
    }));
    S.adj = new Map();
    S.edges.forEach(e => {
      const sid = e.source.id, tid = e.target.id;
      if (!S.adj.has(sid)) S.adj.set(sid, []);
      if (!S.adj.has(tid)) S.adj.set(tid, []);
      S.adj.get(sid).push(tid);
      S.adj.get(tid).push(sid);
    });

    function tick() {
      const nodes = S.nodes, edges = S.edges;
      for (const n of nodes) {
        n.vx += (W/2 - n.x) * 0.0003;
        n.vy += (H/2 - n.y) * 0.0003;
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i+1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          let dx = b.x-a.x, dy = b.y-a.y;
          let dist = Math.sqrt(dx*dx+dy*dy) || 1;
          if (dist > 250) continue;
          const f = -12/(dist*dist);
          const fx = dx/dist*f, fy = dy/dist*f;
          a.vx += fx; a.vy += fy; b.vx -= fx; b.vy -= fy;
        }
      }
      for (const e of edges) {
        const dx = e.target.x-e.source.x, dy = e.target.y-e.source.y;
        const dist = Math.sqrt(dx*dx+dy*dy) || 1;
        const f = (dist-55)*0.003;
        const fx = dx/dist*f, fy = dy/dist*f;
        e.source.vx += fx; e.source.vy += fy;
        e.target.vx -= fx; e.target.vy -= fy;
      }
      for (const n of nodes) {
        n.vx *= 0.85; n.vy *= 0.85;
        n.x += n.vx; n.y += n.vy;
      }
    }

    function draw() {
      const W = canvas.width, H = canvas.height;
      const typeFilter = S.activeTypes;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#1E2228'; ctx.fillRect(0, 0, W, H);
      ctx.save();
      ctx.translate(S.tx, S.ty); ctx.scale(S.scale, S.scale);

      const activeId = (S.selected || S.hovered)?.id;
      const nb = activeId ? new Set(S.adj.get(activeId) || []) : null;

      // Build set of nodes that have at least one visible edge
      let visibleNodes = null;
      if (typeFilter) {
        visibleNodes = new Set();
        for (const e of S.edges) {
          if (e.type === typeFilter) { visibleNodes.add(e.source.id); visibleNodes.add(e.target.id); }
        }
      }

      for (const e of S.edges) {
        const sid = e.source.id, tid = e.target.id;
        const matchesFilter = !typeFilter || e.type === typeFilter;
        const isActive = activeId && (sid === activeId || tid === activeId);

        if (!matchesFilter) {
          ctx.globalAlpha = 0.008; ctx.strokeStyle = '#333'; ctx.lineWidth = 0.3;
        } else if (activeId && !isActive) {
          ctx.globalAlpha = 0.02; ctx.strokeStyle = '#444'; ctx.lineWidth = 0.4;
        } else if (isActive && matchesFilter) {
          ctx.globalAlpha = 0.75; ctx.strokeStyle = TYPE_COLORS[e.type] || '#888'; ctx.lineWidth = 1.5;
        } else {
          ctx.globalAlpha = typeFilter ? 0.25 : 0.07; ctx.strokeStyle = TYPE_COLORS[e.type] || '#667'; ctx.lineWidth = typeFilter ? 0.8 : 0.4;
        }
        ctx.beginPath(); ctx.moveTo(e.source.x, e.source.y);
        ctx.lineTo(e.target.x, e.target.y); ctx.stroke();
      }

      for (const n of S.nodes) {
        const r = Math.sqrt(n.nc)*2.5+3;
        const isActive = n.id === activeId;
        const isNb = nb?.has(n.id);
        const dimmed = activeId && !isActive && !isNb;
        const filteredOut = typeFilter && visibleNodes && !visibleNodes.has(n.id);

        if (filteredOut) {
          ctx.globalAlpha = 0.04;
        } else {
          ctx.globalAlpha = dimmed ? 0.06 : isActive ? 1 : isNb ? 0.85 : typeFilter ? 0.7 : 0.5;
        }
        ctx.fillStyle = DISC_COLORS[n.disc] || '#999';
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI*2); ctx.fill();
        if (isActive) {
          ctx.globalAlpha = 0.35; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
          ctx.globalAlpha = 0.12; ctx.beginPath(); ctx.arc(n.x, n.y, r+8, 0, Math.PI*2); ctx.fill();
        }
        if (!filteredOut && ((r > 7 && S.scale > 0.5) || isActive || isNb)) {
          ctx.globalAlpha = dimmed ? 0.04 : isActive ? 1 : isNb ? 0.65 : 0.25;
          ctx.fillStyle = '#E8E4DC';
          ctx.font = (isActive ? 11 : 9) + 'px -apple-system, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(n.t.slice(0, 28), n.x, n.y - r - 4);
        }
      }
      ctx.restore(); ctx.globalAlpha = 1;
    }
    drawRef.current = draw;

    function simulate() {
      if (S.simSteps < 400) {
        for (let i = 0; i < 3; i++) tick();
        S.simSteps++;
        draw();
        animRef.current = requestAnimationFrame(simulate);
      }
    }
    simulate();

    const onWheel = (e) => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 0.92 : 1.08;
      const ns = Math.max(0.15, Math.min(6, S.scale * factor));
      S.tx = e.offsetX - (e.offsetX - S.tx) * ns / S.scale;
      S.ty = e.offsetY - (e.offsetY - S.ty) * ns / S.scale;
      S.scale = ns; draw();
    };
    const onDown = (e) => { S.dragging = true; S.dragX = e.offsetX; S.dragY = e.offsetY; };
    const onMove = (e) => {
      if (S.dragging) {
        S.tx += e.offsetX - S.dragX; S.ty += e.offsetY - S.dragY;
        S.dragX = e.offsetX; S.dragY = e.offsetY; draw();
      } else {
        const mx = (e.offsetX - S.tx)/S.scale, my = (e.offsetY - S.ty)/S.scale;
        let best = null, bestD = 25/S.scale;
        for (const n of S.nodes) {
          const dist = Math.sqrt((n.x-mx)**2 + (n.y-my)**2);
          if (dist < bestD) { best = n; bestD = dist; }
        }
        if (best !== S.hovered) { S.hovered = best; draw(); setPanelNode(S.selected || best); }
        canvas.style.cursor = best ? 'pointer' : 'grab';
      }
    };
    const onUp = () => { S.dragging = false; };
    const onClick = (e) => {
      const mx = (e.offsetX - S.tx)/S.scale, my = (e.offsetY - S.ty)/S.scale;
      let best = null, bestD = 25/S.scale;
      for (const n of S.nodes) {
        const dist = Math.sqrt((n.x-mx)**2 + (n.y-my)**2);
        if (dist < bestD) { best = n; bestD = dist; }
      }
      S.selected = (S.selected?.id === best?.id) ? null : best;
      draw(); setPanelNode(S.selected);
    };

    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('mousedown', onDown);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseup', onUp);
    canvas.addEventListener('click', onClick);

    const onResize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
      draw();
    };
    window.addEventListener('resize', onResize);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('mousedown', onDown);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseup', onUp);
      canvas.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const S = stateRef.current;
  const visibleEdgeCount = activeFilter ? S.edges.filter(e => e.type === activeFilter).length : S.edges.length;
  const neighbors = panelNode ? (S.adj.get(panelNode.id) || []).map(id => S.nodeMap.get(id)).filter(Boolean) : [];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', background: '#1E2228', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />

      <div style={{ position: 'absolute', top: 16, left: 20, pointerEvents: 'none' }}>
        <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#666', marginTop: '36px' }}>
          {S.nodes.length} objects · {visibleEdgeCount} connections{activeFilter ? ` (${TYPE_LABELS[activeFilter]})` : ''}
        </div>
      </div>

      {/* Connection type filter */}
      <div style={{ position: 'absolute', top: 54, left: 20, display: 'flex', gap: '4px', flexWrap: 'wrap', maxWidth: '420px' }}>
        {Object.entries(TYPE_COLORS).map(([type, color]) => (
          <button key={type} onClick={() => toggleFilter(type)} style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase',
            padding: '4px 10px', border: activeFilter === type ? `1px solid ${color}` : '1px solid #3A3E44',
            background: activeFilter === type ? color : 'rgba(30,34,40,0.7)',
            color: activeFilter === type ? '#1E2228' : '#888',
            cursor: 'pointer', backdropFilter: 'blur(4px)', transition: 'all 0.15s',
          }}>{TYPE_LABELS[type]}</button>
        ))}
        {activeFilter && (
          <button onClick={() => toggleFilter(activeFilter)} style={{
            fontFamily: "'DM Sans', sans-serif", fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase',
            padding: '4px 10px', border: '1px solid #555', background: 'rgba(30,34,40,0.7)',
            color: '#AAA', cursor: 'pointer', backdropFilter: 'blur(4px)',
          }}>Clear</button>
        )}
      </div>

      <div style={{ position: 'absolute', bottom: 16, left: 20, pointerEvents: 'none' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', maxWidth: '500px' }}>
          {Object.entries(DISC_COLORS).filter(([k]) => S.nodes.some(n => n.disc === k)).map(([d, c]) => (
            <span key={d} style={{ fontSize: '8px', color: '#666', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: c, opacity: 0.7, display: 'inline-block' }} />{d}
            </span>
          ))}
        </div>
      </div>

      {!panelNode && (
        <div style={{ position: 'absolute', bottom: 16, right: 20, pointerEvents: 'none', fontSize: '10px', color: '#555', textAlign: 'right', lineHeight: 1.8 }}>
          Scroll to zoom · Drag to pan · Hover to explore · Click to select
        </div>
      )}

      {panelNode && (
        <div style={{ position: 'absolute', top: 16, right: 20, width: 260, background: 'rgba(30,34,40,0.92)', border: '1px solid #333', padding: '14px', backdropFilter: 'blur(8px)' }}>
          <div style={{ fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: DISC_COLORS[panelNode.disc], fontWeight: 600, marginBottom: '5px' }}>{panelNode.disc} · {panelNode.y}</div>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '17px', color: '#E8E4DC', lineHeight: 1.2, marginBottom: '4px' }}>{panelNode.t}</div>
          <div style={{ fontSize: '11px', color: '#999', marginBottom: '6px' }}>{panelNode.designer}</div>
          <div style={{ fontSize: '10px', color: '#888', marginBottom: '6px' }}>{panelNode.nc} outgoing · {neighbors.length} total links</div>
          <span onClick={() => { const item = ARCHIVE.find(i => i.id === panelNode.id); if (item && onOpenItem) onOpenItem(item); }}
            style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6BA080', cursor: 'pointer', display: 'block', marginBottom: '10px' }}>View entry →</span>
          <div style={{ fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#666', marginBottom: '5px' }}>Connected to</div>
          <div style={{ maxHeight: 200, overflow: 'auto' }}>
            {neighbors.slice(0, 18).map(n => (
              <div key={n.id} style={{ fontSize: '11px', color: '#AAA', padding: '2px 0', borderBottom: '1px solid #2A2E34', cursor: 'pointer' }}
                onClick={() => { S.selected = n; setPanelNode(n); }}>
                <span style={{ color: DISC_COLORS[n.disc], marginRight: '5px', fontSize: '8px' }}>●</span>{n.t}
              </div>
            ))}
          </div>
        </div>
      )}
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
  const scrollPosRef = useRef(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const entryId = params.get('entry');
    if (entryId) {
      const item = ARCHIVE.find(i => i.id === parseInt(entryId));
      if (item) { setSelectedItem(item); setView('detail'); }
    }
  }, []);

  const filteredArchive = ARCHIVE.filter(item => {
    const d = selectedDiscipline === "All" || item.discipline === selectedDiscipline;
    const q = searchQuery.toLowerCase();
    const s = q === "" || item.title.toLowerCase().includes(q) || item.designer.toLowerCase().includes(q) || item.movement.toLowerCase().includes(q) || item.keywords.some(k => k.toLowerCase().includes(q)) || item.manufacturer.toLowerCase().includes(q);
    return d && s;
  });

  const openItem = (item) => { scrollPosRef.current = window.scrollY; setSelectedItem(item); setView("detail"); setConnFilter("all"); window.scrollTo(0, 0); };

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

  // ── FULL-SCREEN NETWORK MODE ──
  if (view === 'connections') {
    return (
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#1E2228' }}>
        <NetworkCanvas onOpenItem={openItem} />
        <button onClick={() => { setView('featured'); setSelectedItem(null); }} style={{
          position: 'fixed', top: 20, left: 24, zIndex: 20, fontFamily: "'DM Sans', sans-serif",
          fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase',
          padding: '6px 14px', border: '1px solid #555', background: 'rgba(30,34,40,0.8)',
          color: '#AAA', cursor: 'pointer', backdropFilter: 'blur(4px)',
        }}>← Back</button>
        <div style={{ position: 'fixed', top: 22, left: 120, zIndex: 20, display: 'flex', alignItems: 'baseline', gap: '10px', pointerEvents: 'none' }}>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '20px', color: '#E8E4DC', letterSpacing: '-0.02em' }}>Provenance</span>
          <span style={{ fontSize: '8px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#B8763C' }}>Network</span>
        </div>
      </div>
    );
  }

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
                <ImageWithFallback key={featured.id} item={featured} aspectRatio="3/4" />
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
                <button key={d} onClick={() => setSelectedDiscipline(selectedDiscipline === d ? 'All' : d)}
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
                    <ImageWithFallback key={item.id} item={item} aspectRatio="3/2" />
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
            <button onClick={() => { setView('archive'); setTimeout(() => window.scrollTo(0, scrollPosRef.current), 0); }} style={{ fontFamily: 'inherit', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#BBB', cursor: 'pointer', background: 'none', border: 'none', padding: 0, marginBottom: '36px' }}>← Back to Archive</button>
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '56px', alignItems: 'start' }}>
              <div>
                <ImageWithFallback key={s.id} item={s} aspectRatio="4/3" />
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
              Entries are developed from institutional archive metadata (Cooper Hewitt, V&amp;A, MoMA, Design Museum, Vitra, Triennale). Object images are used for educational criticism and review. The archive is designed to grow — each new entry creates new connections across the existing collection.
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

      <footer style={{ borderTop: '1px solid #E4E0D8', padding: '20px 44px', marginTop: '80px', display: 'flex', justifyContent: 'center', fontSize: '10px', color: '#C0BDB6', letterSpacing: '0.04em' }}>
        <span>© Neil Housego 2025 · The Provenance Archive is an independent educational resource</span>
      </footer>
    </div>
  );
}
