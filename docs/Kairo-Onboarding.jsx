import { useState, useRef, useEffect, useCallback } from "react";
import {
  Globe, Cpu, Trophy, Music, Landmark, Car, Shirt, Dumbbell, Film, TrendingUp,
  Shield, Flame, Star, Zap, Crown, Waves, Radio, Mic, Palette, Megaphone,
  Briefcase, BarChart3, Coins, Building2, Newspaper, Scale, Vote, Gavel,
  Gauge, Wrench, CircuitBoard, Sparkles, Camera, Tv, BookOpen, Theater
} from "lucide-react";

const SUBTOPICS = {
  football: [
    { id: "arsenal", label: "Arsenal", Icon: Shield },
    { id: "prem", label: "Premier League", Icon: Crown },
    { id: "ucl", label: "Champions League", Icon: Star },
    { id: "transfers", label: "Transfers", Icon: Zap },
    { id: "laliga", label: "La Liga", Icon: Flame },
    { id: "womens", label: "Women's", Icon: Waves },
  ],
  music: [
    { id: "hiphop", label: "Hip-Hop", Icon: Mic },
    { id: "electronic", label: "Electronic", Icon: Radio },
    { id: "rock", label: "Rock", Icon: Flame },
    { id: "newreleases", label: "New Releases", Icon: Sparkles },
    { id: "livemusic", label: "Live / Gigs", Icon: Megaphone },
    { id: "rnb", label: "R&B / Soul", Icon: Waves },
  ],
  ai_tech: [
    { id: "llms", label: "LLMs", Icon: Cpu },
    { id: "startups", label: "Startups", Icon: Zap },
    { id: "apple_tech", label: "Apple", Icon: Sparkles },
    { id: "devtools", label: "Dev Tools", Icon: CircuitBoard },
    { id: "research", label: "Research", Icon: BookOpen },
    { id: "hardware", label: "Hardware", Icon: Gauge },
  ],
  politics: [
    { id: "uk_pol", label: "UK Politics", Icon: Landmark },
    { id: "us_pol", label: "US Politics", Icon: Vote },
    { id: "geopolitics", label: "Geopolitics", Icon: Globe },
    { id: "policy", label: "Policy", Icon: Scale },
    { id: "legal", label: "Legal", Icon: Gavel },
    { id: "elections", label: "Elections", Icon: Megaphone },
  ],
  automotive: [
    { id: "ev", label: "EVs", Icon: Zap },
    { id: "f1", label: "F1", Icon: Flame },
    { id: "classic", label: "Classic Cars", Icon: Star },
    { id: "reviews", label: "Reviews", Icon: Gauge },
    { id: "mods", label: "Mods & Tuning", Icon: Wrench },
    { id: "supercars", label: "Supercars", Icon: Crown },
  ],
  fashion: [
    { id: "streetwear", label: "Streetwear", Icon: Shirt },
    { id: "luxury", label: "Luxury", Icon: Crown },
    { id: "sneakers", label: "Sneakers", Icon: Flame },
    { id: "design", label: "Design", Icon: Palette },
    { id: "photography", label: "Photography", Icon: Camera },
    { id: "runway", label: "Runway", Icon: Star },
  ],
  news: [
    { id: "uk_news", label: "UK News", Icon: Newspaper },
    { id: "world", label: "World", Icon: Globe },
    { id: "business_news", label: "Business", Icon: Briefcase },
    { id: "science", label: "Science", Icon: Sparkles },
    { id: "environment", label: "Environment", Icon: Waves },
    { id: "health", label: "Health", Icon: Shield },
  ],
  sports: [
    { id: "nfl", label: "NFL", Icon: Shield },
    { id: "tennis", label: "Tennis", Icon: Star },
    { id: "golf", label: "Golf", Icon: Crown },
    { id: "cricket", label: "Cricket", Icon: Flame },
    { id: "rugby", label: "Rugby", Icon: Zap },
    { id: "olympics", label: "Olympics", Icon: Trophy },
  ],
  culture: [
    { id: "film", label: "Film", Icon: Film },
    { id: "tv", label: "TV", Icon: Tv },
    { id: "books", label: "Books", Icon: BookOpen },
    { id: "theatre", label: "Theatre", Icon: Theater },
    { id: "art", label: "Art", Icon: Palette },
    { id: "gaming", label: "Gaming", Icon: Zap },
  ],
  business: [
    { id: "markets", label: "Markets", Icon: BarChart3 },
    { id: "crypto", label: "Crypto", Icon: Coins },
    { id: "realestate", label: "Property", Icon: Building2 },
    { id: "leadership", label: "Leadership", Icon: Crown },
    { id: "startups_biz", label: "Startups", Icon: Zap },
    { id: "economy", label: "Economy", Icon: TrendingUp },
  ],
};

const TOPICS = [
  { id: "news", label: "News", Icon: Globe, color: "#4F8EF7" },
  { id: "ai_tech", label: "AI & Tech", Icon: Cpu, color: "#A78BFA" },
  { id: "football", label: "Football", Icon: Trophy, color: "#34D399" },
  { id: "music", label: "Music", Icon: Music, color: "#F472B6" },
  { id: "politics", label: "Politics", Icon: Landmark, color: "#FBBF24" },
  { id: "automotive", label: "Cars", Icon: Car, color: "#F87171" },
  { id: "fashion", label: "Fashion", Icon: Shirt, color: "#22D3EE" },
  { id: "sports", label: "Sports", Icon: Dumbbell, color: "#FB923C" },
  { id: "culture", label: "Culture", Icon: Film, color: "#C084FC" },
  { id: "business", label: "Business", Icon: TrendingUp, color: "#2DD4BF" },
];

const DEPTH_LABELS = ["Headlines", "Briefing", "Deep Dive"];
const DEPTH_DESC = ["Just the key points", "Solid coverage", "Don't hold back"];
const LEVEL_LABELS = ["Explain it to me", "Keep it sharp", "I live this"];
const LEVEL_DESC = ["Context-heavy, defines terms", "Working knowledge assumed", "Insider-level, no hand-holding"];
const PHASES = ["discover", "calibrate", "rhythm", "ready"];

const BASE_R = 40;
const SEL_ADD = [5, 13, 22];
const EXPANDED_R = 54;
const SUB_R = 26;
const SUB_ORBIT = 82;
const DAMPING = 0.88;
const MAX_VEL = 18;
const MAX_FORCE = 2.2;
const WALL_BOUNCE = 0.55;
const COLLISION_RESTITUTION = 0.6;
const DRIFT_SPEED = 0.0008;
const DRIFT_AMP = 5;
const LONG_PRESS_MS = 500;

function getR(sel, pri, expanded) { if (expanded) return EXPANDED_R; return sel ? BASE_R + (SEL_ADD[pri] || 0) : BASE_R; }
function clampV(v) { return Math.max(-MAX_VEL, Math.min(MAX_VEL, v)); }

function KairoLogo({ size = "md" }) {
  const s = { sm: "text-xl", md: "text-2xl", lg: "text-5xl" }[size];
  return <span className={`font-bold tracking-tight ${s}`} style={{ fontFamily: "'Outfit', sans-serif" }}><span className="text-white/90">K</span><span className="text-blue-400">AI</span><span className="text-white/90">RO</span></span>;
}

function initPositions(count, w, h) {
  const out = [];
  const maxR = BASE_R + 25;
  const spacing = maxR * 2.4;
  const cols = Math.ceil(Math.sqrt(count));
  const rows = Math.ceil(count / cols);
  const cx = w / 2, cy = h / 2;
  const startX = cx - ((cols - 1) * spacing) / 2;
  const startY = cy - ((rows - 1) * spacing) / 2;
  for (let i = 0; i < count; i++) {
    const col = i % cols, row = Math.floor(i / cols);
    out.push({
      x: Math.max(maxR, Math.min(w - maxR, startX + col * spacing + Math.sin(i * 3.7) * spacing * 0.12)),
      y: Math.max(maxR, Math.min(h - maxR, startY + row * spacing + Math.cos(i * 2.3) * spacing * 0.12)),
      vx: 0, vy: 0,
      dpx: Math.random() * Math.PI * 2, dpy: Math.random() * Math.PI * 2,
      dax: DRIFT_AMP * (0.7 + Math.random() * 0.6), day: DRIFT_AMP * (0.7 + Math.random() * 0.6),
      dsx: DRIFT_SPEED * (0.6 + Math.random() * 0.8), dsy: DRIFT_SPEED * (0.5 + Math.random() * 0.9),
    });
  }
  return out;
}

function usePhysics(topics, selected, cSize, expandedId) {
  const bodies = useRef([]);
  const anim = useRef(null);
  const drag = useRef({ idx: -1, mx: 0, my: 0, pmx: 0, pmy: 0 });
  const [pos, setPos] = useState([]);
  const init = useRef(false);

  useEffect(() => {
    if (cSize.w < 100 || cSize.h < 100) return;
    if (init.current && bodies.current.length === topics.length) return;
    bodies.current = initPositions(topics.length, cSize.w, cSize.h);
    init.current = true;
    setPos(bodies.current.map(b => ({ x: b.x, y: b.y })));
  }, [topics.length, cSize.w, cSize.h]);

  const gr = useCallback((i) => {
    const t = topics[i];
    const s = selected[t?.id];
    const isExpanded = expandedId === t?.id;
    return getR(s !== undefined, s ?? -1, isExpanded);
  }, [selected, topics, expandedId]);

  useEffect(() => {
    if (!init.current) return;
    const step = (ts) => {
      const B = bodies.current, d = drag.current, w = cSize.w, h = cSize.h, n = B.length;
      for (let i = 0; i < n; i++) {
        const b = B[i], ri = gr(i);
        if (d.idx === i) {
          b.vx = (d.mx - b.x) * 0.4; b.vy = (d.my - b.y) * 0.4;
          b.x += b.vx; b.y += b.vy;
        } else {
          let fx = 0, fy = 0;
          for (let j = 0; j < n; j++) {
            if (i === j) continue;
            const rj = gr(j), dx = b.x - B[j].x, dy = b.y - B[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy), minD = ri + rj + 12;
            if (dist < minD && dist > 0.5) {
              const overlap = minD - dist, nx = dx / dist, ny = dy / dist;
              // Momentum transfer (billiard style)
              const dvx = b.vx - B[j].vx, dvy = b.vy - B[j].vy;
              const dvDotN = dvx * nx + dvy * ny;
              if (dvDotN < 0) {
                const impulse = dvDotN * COLLISION_RESTITUTION;
                if (d.idx !== i) { b.vx -= impulse * nx; b.vy -= impulse * ny; }
                if (d.idx !== j) { B[j].vx += impulse * nx; B[j].vy += impulse * ny; }
              }
              // Separation
              const sep = overlap * 0.3;
              if (d.idx !== i) { b.x += nx * sep * 0.5; b.y += ny * sep * 0.5; }
              if (d.idx !== j) { B[j].x -= nx * sep * 0.5; B[j].y -= ny * sep * 0.5; }
              // Soft push
              const pushF = Math.min(MAX_FORCE, overlap * 0.08);
              fx += nx * pushF; fy += ny * pushF;
            }
          }
          // Wall bounce with restitution
          const m = ri + 6;
          if (b.x < m) { b.x = m; b.vx = Math.abs(b.vx) * WALL_BOUNCE; }
          if (b.x > w - m) { b.x = w - m; b.vx = -Math.abs(b.vx) * WALL_BOUNCE; }
          if (b.y < m) { b.y = m; b.vy = Math.abs(b.vy) * WALL_BOUNCE; }
          if (b.y > h - m) { b.y = h - m; b.vy = -Math.abs(b.vy) * WALL_BOUNCE; }
          // Center gravity
          const dcx = w / 2 - b.x, dcy = h / 2 - b.y;
          if (Math.sqrt(dcx * dcx + dcy * dcy) > Math.min(w, h) * 0.4) { fx += dcx * 0.0001; fy += dcy * 0.0001; }
          // Drift
          fx += Math.sin(ts * b.dsx + b.dpx) * b.dax * 0.003;
          fy += Math.cos(ts * b.dsy + b.dpy) * b.day * 0.003;
          b.vx = clampV((b.vx + fx) * DAMPING); b.vy = clampV((b.vy + fy) * DAMPING);
          b.x += b.vx; b.y += b.vy;
          b.x = Math.max(m, Math.min(w - m, b.x)); b.y = Math.max(m, Math.min(h - m, b.y));
        }
      }
      setPos(B.map(b => ({ x: b.x, y: b.y })));
      anim.current = requestAnimationFrame(step);
    };
    anim.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(anim.current);
  }, [cSize, gr]);

  const startDrag = (i, cx, cy, rect) => { drag.current = { idx: i, mx: cx - rect.left, my: cy - rect.top, pmx: cx - rect.left, pmy: cy - rect.top }; };
  const moveDrag = (cx, cy, rect) => { if (drag.current.idx < 0) return; drag.current.pmx = drag.current.mx; drag.current.pmy = drag.current.my; drag.current.mx = cx - rect.left; drag.current.my = cy - rect.top; };
  const endDrag = () => { if (drag.current.idx >= 0) { const b = bodies.current[drag.current.idx]; if (b) { b.vx = clampV((drag.current.mx - drag.current.pmx) * 3.5); b.vy = clampV((drag.current.my - drag.current.pmy) * 3.5); } } drag.current.idx = -1; };
  const nudge = (idx) => { const B = bodies.current, b = B[idx]; if (!b) return; for (let j = 0; j < B.length; j++) { if (j === idx) continue; const dx = B[j].x - b.x, dy = B[j].y - b.y, dist = Math.sqrt(dx * dx + dy * dy) || 1; B[j].vx = clampV(B[j].vx + (dx / dist) * 3); B[j].vy = clampV(B[j].vy + (dy / dist) * 3); } };
  return { pos, startDrag, moveDrag, endDrag, nudge };
}

function GlassOrb({ topic, isSelected, priority, pos, onPointerDown, onClick, isDragging, isExpanded, children }) {
  const r = getR(isSelected, priority, isExpanded);
  const sz = r * 2;
  const IC = topic.Icon;
  const iconSize = Math.round(r * (isExpanded ? 0.4 : 0.55));
  const labelSize = Math.max(11, Math.round(r * (isExpanded ? 0.2 : 0.28)));

  return (
    <div className="absolute select-none touch-none" style={{ left: pos.x - r, top: pos.y - r, width: sz, height: sz, zIndex: isDragging ? 100 : isExpanded ? 50 : isSelected ? 10 : 1, transition: isDragging ? "none" : "width 0.5s cubic-bezier(0.34,1.56,0.64,1), height 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>
      {/* Sub-topic orbs rendered around the parent */}
      {children}
      <div onPointerDown={onPointerDown} onClick={onClick}
        className="w-full h-full rounded-full flex flex-col items-center justify-center relative overflow-hidden"
        style={{
          cursor: isDragging ? "grabbing" : "grab",
          background: isSelected
            ? `radial-gradient(circle at 35% 35%, ${topic.color}55, ${topic.color}30 60%, ${topic.color}18 100%)`
            : "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.08), rgba(255,255,255,0.02) 60%, rgba(255,255,255,0.01) 100%)",
          boxShadow: isSelected
            ? `inset 0 0 ${r * 0.6}px ${topic.color}20, 0 0 ${r * 0.8}px ${topic.color}18, 0 0 ${r * 1.5}px ${topic.color}08, 0 4px 20px rgba(0,0,0,0.15)`
            : "inset 0 0 15px rgba(255,255,255,0.04), 0 4px 20px rgba(0,0,0,0.06)",
          border: isSelected ? `1.5px solid ${topic.color}60` : "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
          transition: isDragging ? "background 0.3s, box-shadow 0.3s, border 0.3s" : "all 0.5s cubic-bezier(0.34,1.56,0.64,1)",
        }}>
        <div className="absolute pointer-events-none" style={{ top: "6%", left: "12%", width: "45%", height: "35%", background: isSelected ? "linear-gradient(170deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.08) 50%, transparent 100%)" : "linear-gradient(170deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.03) 50%, transparent 100%)", borderRadius: "50%", filter: "blur(2px)", transition: "all 0.4s ease" }} />
        <div className="absolute pointer-events-none" style={{ top: "14%", left: "22%", width: "12%", height: "8%", background: isSelected ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)", borderRadius: "50%", filter: "blur(2px)", transition: "all 0.4s ease" }} />
        <div className="absolute pointer-events-none" style={{ bottom: "3%", left: "15%", width: "70%", height: "25%", background: isSelected ? `linear-gradient(90deg, ${topic.color}30, rgba(255,180,255,0.15), rgba(180,255,255,0.15), ${topic.color}20)` : "linear-gradient(90deg, rgba(255,255,255,0.03), rgba(200,180,255,0.05), rgba(180,255,230,0.05), rgba(255,255,255,0.03))", borderRadius: "50%", filter: "blur(4px)", transition: "all 0.4s ease" }} />
        <div className="absolute inset-0 rounded-full pointer-events-none" style={{ background: isSelected ? `radial-gradient(circle, transparent 55%, ${topic.color}12 75%, ${topic.color}06 90%, transparent 100%)` : "radial-gradient(circle, transparent 60%, rgba(255,255,255,0.04) 80%, transparent 100%)", transition: "all 0.4s ease" }} />
        <IC size={iconSize} strokeWidth={isSelected ? 2.2 : 1.5} style={{ color: isSelected ? "#fff" : "rgba(255,255,255,0.45)", filter: isSelected ? `drop-shadow(0 1px 3px ${topic.color}80)` : "none", transition: "all 0.4s ease" }} />
        <span className="mt-1 font-bold tracking-tight" style={{ fontSize: labelSize, color: isSelected ? "#fff" : "rgba(255,255,255,0.35)", fontFamily: "'Outfit', sans-serif", textShadow: isSelected ? `0 1px 4px ${topic.color}60` : "none", transition: "all 0.3s ease" }}>{topic.label}</span>
        {isSelected && priority >= 0 && !isExpanded && (
          <div className="flex gap-1 mt-0.5">{[...Array(priority + 1)].map((_, i) => <div key={i} className="rounded-full" style={{ width: 4, height: 4, background: "rgba(255,255,255,0.7)" }} />)}</div>
        )}
        {isExpanded && <span className="text-white/30 mt-0.5" style={{ fontSize: 8, fontFamily: "'Outfit', sans-serif" }}>tap to close</span>}
      </div>
    </div>
  );
}

function SubOrb({ sub, parentColor, angle, isSelected, onClick, visible }) {
  const IC = sub.Icon;
  const x = Math.cos(angle) * SUB_ORBIT;
  const y = Math.sin(angle) * SUB_ORBIT;
  return (
    <div onClick={e => { e.stopPropagation(); onClick(); }}
      className="absolute rounded-full flex flex-col items-center justify-center cursor-pointer"
      style={{
        width: SUB_R * 2, height: SUB_R * 2,
        left: `calc(50% + ${x}px - ${SUB_R}px)`, top: `calc(50% + ${y}px - ${SUB_R}px)`,
        background: isSelected
          ? `radial-gradient(circle at 35% 35%, ${parentColor}88, ${parentColor}55)`
          : "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.1), rgba(255,255,255,0.03))",
        border: isSelected ? `1.5px solid ${parentColor}80` : "1px solid rgba(255,255,255,0.15)",
        boxShadow: isSelected ? `0 0 12px ${parentColor}25, 0 2px 8px rgba(0,0,0,0.15)` : "0 2px 8px rgba(0,0,0,0.08)",
        backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.3)",
        transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        transitionDelay: visible ? `${Math.random() * 0.15}s` : "0s",
        zIndex: 60,
      }}>
      <div className="absolute pointer-events-none rounded-full" style={{ top: "8%", left: "15%", width: "40%", height: "28%", background: "linear-gradient(170deg, rgba(255,255,255,0.3) 0%, transparent 100%)", filter: "blur(1.5px)" }} />
      <IC size={14} strokeWidth={isSelected ? 2.2 : 1.5} style={{ color: isSelected ? "#fff" : "rgba(255,255,255,0.5)", transition: "all 0.3s ease" }} />
      <span className="font-semibold" style={{ fontSize: 8, color: isSelected ? "#fff" : "rgba(255,255,255,0.4)", fontFamily: "'Outfit', sans-serif", marginTop: 1, transition: "all 0.3s ease" }}>{sub.label}</span>
    </div>
  );
}

function CalibrationCard({ topic, depth, level, onDepthChange, onLevelChange, isActive, onClick }) {
  const IC = topic.Icon;
  return (
    <div onClick={onClick} className="rounded-2xl border cursor-pointer transition-all duration-500" style={{ background: isActive ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)", borderColor: isActive ? `${topic.color}50` : "rgba(255,255,255,0.05)", borderLeftWidth: 4, borderLeftColor: isActive ? topic.color : "transparent", padding: isActive ? "24px" : "16px 24px", boxShadow: isActive ? `0 8px 40px ${topic.color}12` : "none" }}>
      <div className="flex items-center gap-3"><IC size={24} style={{ color: topic.color }} /><span className="text-lg font-semibold text-white/90" style={{ fontFamily: "'Outfit', sans-serif" }}>{topic.label}</span>{!isActive && <span className="ml-auto text-xs text-white/25">{DEPTH_LABELS[depth]} / {LEVEL_LABELS[level]}</span>}</div>
      {isActive && (
        <div className="mt-5 space-y-5" style={{ animation: "kFadeIn 0.4s ease forwards" }}>
          <div><label className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3 block" style={{ fontFamily: "'Outfit', sans-serif" }}>How much coverage?</label><div className="flex gap-2">{DEPTH_LABELS.map((d, i) => (<button key={d} onClick={e => { e.stopPropagation(); onDepthChange(i); }} className="flex-1 py-3 px-2 rounded-xl text-center transition-all duration-300" style={{ background: depth === i ? topic.color : "rgba(255,255,255,0.04)", border: `1.5px solid ${depth === i ? topic.color : "rgba(255,255,255,0.08)"}`, color: depth === i ? "#fff" : "rgba(255,255,255,0.4)", boxShadow: depth === i ? `0 4px 20px ${topic.color}40` : "none" }}><div className="text-sm font-semibold" style={{ fontFamily: "'Outfit', sans-serif" }}>{d}</div><div className="text-xs mt-0.5 opacity-60">{DEPTH_DESC[i]}</div></button>))}</div></div>
          <div><label className="text-xs font-bold text-white/30 uppercase tracking-widest mb-3 block" style={{ fontFamily: "'Outfit', sans-serif" }}>How should we write it?</label><div className="flex gap-2">{LEVEL_LABELS.map((l, i) => (<button key={l} onClick={e => { e.stopPropagation(); onLevelChange(i); }} className="flex-1 py-3 px-2 rounded-xl text-center transition-all duration-300" style={{ background: level === i ? "rgba(255,255,255,0.93)" : "rgba(255,255,255,0.04)", border: `1.5px solid ${level === i ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.08)"}`, color: level === i ? "#111" : "rgba(255,255,255,0.4)", boxShadow: level === i ? "0 4px 20px rgba(255,255,255,0.12)" : "none" }}><div className="text-xs font-semibold" style={{ fontFamily: "'Outfit', sans-serif" }}>{l}</div><div className="text-xs mt-0.5 opacity-50">{LEVEL_DESC[i]}</div></button>))}</div></div>
        </div>
      )}
    </div>
  );
}

function PulseCard({ icon, label, desc, enabled, time, audio, onChange }) {
  return (
    <div className="rounded-2xl border p-6 transition-all duration-500" style={{ background: enabled ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.01)", borderColor: enabled ? "rgba(79,142,247,0.3)" : "rgba(255,255,255,0.05)", opacity: enabled ? 1 : 0.45 }}>
      <div className="flex items-center justify-between"><div className="flex items-center gap-4"><span className="text-3xl">{icon}</span><div><h4 className="font-bold text-white text-lg" style={{ fontFamily: "'Outfit', sans-serif" }}>{label}</h4><p className="text-sm text-white/30">{desc}</p></div></div>
        <button onClick={() => onChange({ enabled: !enabled, time, audio })} className="w-14 h-8 rounded-full transition-all duration-400 relative" style={{ background: enabled ? "#4F8EF7" : "rgba(255,255,255,0.1)" }}><div className={`w-6 h-6 rounded-full bg-white shadow-lg absolute top-1 transition-all duration-400 ${enabled ? "left-7" : "left-1"}`} /></button></div>
      {enabled && (<div className="mt-5 flex items-center gap-6 pl-14" style={{ animation: "kFadeIn 0.3s ease forwards" }}><div className="flex items-center gap-2"><label className="text-sm text-white/30 font-medium">Time</label><input type="time" value={time} onChange={e => onChange({ enabled, time: e.target.value, audio })} className="rounded-xl px-4 py-2 text-sm text-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500/30" style={{ background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(255,255,255,0.08)", fontFamily: "'Space Mono', monospace" }} /></div><div className="flex items-center gap-2"><label className="text-sm text-white/30 font-medium">Audio</label><button onClick={() => onChange({ enabled, time, audio: !audio })} className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300" style={{ background: audio ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.05)", color: audio ? "#111" : "rgba(255,255,255,0.3)", border: `1.5px solid ${audio ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.08)"}` }}>{audio ? "\uD83C\uDFA7 On" : "\uD83D\uDD07 Off"}</button></div></div>)}
    </div>
  );
}

export default function KairoOnboarding() {
  const [phase, setPhase] = useState(0);
  const [selected, setSelected] = useState({});
  const [subSelected, setSubSelected] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [cal, setCal] = useState({});
  const [activeCal, setActiveCal] = useState(null);
  const [sched, setSched] = useState({ morning: { enabled: true, time: "06:30", audio: true }, midday: { enabled: false, time: "12:30", audio: false }, evening: { enabled: false, time: "18:00", audio: false } });
  const [entering, setEntering] = useState(true);
  const [dragIdx, setDragIdx] = useState(-1);
  const cRef = useRef(null);
  const [cSize, setCSize] = useState({ w: 800, h: 500 });
  const startPosRef = useRef({ x: 0, y: 0 });
  const wasDragRef = useRef(false);
  const longPressTimer = useRef(null);
  const longPressTriggered = useRef(false);

  const { pos, startDrag, moveDrag, endDrag, nudge } = usePhysics(TOPICS, selected, cSize, expandedId);

  useEffect(() => { setEntering(true); const t = setTimeout(() => setEntering(false), 700); return () => clearTimeout(t); }, [phase]);
  useEffect(() => { const el = cRef.current; if (!el) return; const obs = new ResizeObserver(e => { for (const en of e) setCSize({ w: en.contentRect.width, h: en.contentRect.height }); }); obs.observe(el); return () => obs.disconnect(); }, []);

  const handlePD = (i, e) => {
    e.preventDefault();
    startPosRef.current = { x: e.clientX, y: e.clientY };
    wasDragRef.current = false;
    longPressTriggered.current = false;
    const rect = cRef.current?.getBoundingClientRect(); if (!rect) return;
    startDrag(i, e.clientX, e.clientY, rect); setDragIdx(i);

    // Long press detection
    const topicId = TOPICS[i].id;
    if (selected[topicId] !== undefined && SUBTOPICS[topicId]) {
      longPressTimer.current = setTimeout(() => {
        if (!wasDragRef.current) {
          longPressTriggered.current = true;
          setExpandedId(prev => prev === topicId ? null : topicId);
        }
      }, LONG_PRESS_MS);
    }

    const onMove = ev => {
      ev.preventDefault();
      const cx = ev.touches ? ev.touches[0].clientX : ev.clientX;
      const cy = ev.touches ? ev.touches[0].clientY : ev.clientY;
      if (Math.abs(cx - startPosRef.current.x) > 5 || Math.abs(cy - startPosRef.current.y) > 5) {
        wasDragRef.current = true;
        if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; }
      }
      moveDrag(cx, cy, rect);
    };
    const onUp = () => {
      if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; }
      endDrag(); setDragIdx(-1);
      window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove); window.addEventListener("pointerup", onUp);
  };

  const handleClick = i => {
    if (wasDragRef.current || longPressTriggered.current) return;
    const id = TOPICS[i].id;
    if (expandedId === id) { setExpandedId(null); return; }
    if (expandedId) { setExpandedId(null); return; }
    setSelected(p => { const n = { ...p }; if (n[id] !== undefined) { if (n[id] < 2) { n[id]++; nudge(i); } else { delete n[id]; setSubSelected(ss => { const ns = { ...ss }; delete ns[id]; return ns; }); } } else { n[id] = 0; nudge(i); } return n; });
  };

  const toggleSub = (topicId, subId) => {
    setSubSelected(prev => {
      const topicSubs = new Set(prev[topicId] || []);
      if (topicSubs.has(subId)) topicSubs.delete(subId); else topicSubs.add(subId);
      return { ...prev, [topicId]: [...topicSubs] };
    });
  };

  const selTopics = TOPICS.filter(t => selected[t.id] !== undefined);
  const canProceed = phase === 0 ? selTopics.length >= 2 : true;
  const enPulses = Object.values(sched).filter(v => v.enabled).length;
  const totalSubs = Object.values(subSelected).reduce((n, arr) => n + arr.length, 0);

  useEffect(() => { if (phase === 1 && selTopics.length > 0 && !activeCal) setActiveCal(selTopics[0].id); }, [phase, selTopics.length, activeCal]);

  return (
    <div className="min-h-screen text-white overflow-hidden relative" style={{ fontFamily: "'DM Sans', sans-serif", background: "linear-gradient(145deg, #080b14 0%, #0b0f1a 40%, #080c18 100%)" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700&family=Outfit:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes kFadeIn { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes kPhaseIn { from { opacity: 0; transform: translateY(30px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes kGlow { 0%,100% { opacity: 0.12 } 50% { opacity: 0.25 } }
        @keyframes kDrift { 0%,100% { transform: translate(0,0) } 33% { transform: translate(12px,-8px) } 66% { transform: translate(-8px,6px) } }
        .k-phase-in { animation: kPhaseIn 0.7s cubic-bezier(0.16,1,0.3,1) forwards }
        .k-s1 { animation: kPhaseIn 0.7s cubic-bezier(0.16,1,0.3,1) forwards; animation-delay: 0.1s; opacity: 0 }
        .k-s2 { animation: kPhaseIn 0.7s cubic-bezier(0.16,1,0.3,1) forwards; animation-delay: 0.2s; opacity: 0 }
        .k-s3 { animation: kPhaseIn 0.7s cubic-bezier(0.16,1,0.3,1) forwards; animation-delay: 0.35s; opacity: 0 }
        .k-s4 { animation: kPhaseIn 0.7s cubic-bezier(0.16,1,0.3,1) forwards; animation-delay: 0.5s; opacity: 0 }
        .k-s5 { animation: kPhaseIn 0.7s cubic-bezier(0.16,1,0.3,1) forwards; animation-delay: 0.65s; opacity: 0 }
        .k-s6 { animation: kPhaseIn 0.7s cubic-bezier(0.16,1,0.3,1) forwards; animation-delay: 0.8s; opacity: 0 }
      `}</style>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full" style={{ top: "5%", left: "-10%", background: "radial-gradient(circle, rgba(79,142,247,0.1) 0%, transparent 60%)", animation: "kGlow 6s ease infinite, kDrift 22s ease infinite", filter: "blur(100px)" }} />
        <div className="absolute w-[500px] h-[500px] rounded-full" style={{ bottom: "0%", right: "-10%", background: "radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 60%)", animation: "kGlow 7s ease infinite 2s, kDrift 28s ease infinite 5s", filter: "blur(100px)" }} />
      </div>

      <div className="relative z-20 flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #4F8EF7 0%, #6366F1 100%)", boxShadow: "0 2px 12px rgba(79,142,247,0.3)" }}>
            <span className="text-white font-bold text-sm" style={{ fontFamily: "'Space Mono', monospace" }}>K</span>
          </div>
          <KairoLogo size="sm" />
        </div>
        <div className="flex items-center gap-2.5">{PHASES.map((p, i) => (<div key={p} className="flex items-center gap-2.5"><div className="transition-all duration-500 rounded-full" style={{ width: i === phase ? 10 : i < phase ? 8 : 6, height: i === phase ? 10 : i < phase ? 8 : 6, background: i < phase ? "#4F8EF7" : i === phase ? "#fff" : "rgba(255,255,255,0.12)", boxShadow: i === phase ? "0 0 10px rgba(255,255,255,0.3)" : "none" }} />{i < PHASES.length - 1 && <div className="w-6 h-px transition-all duration-500" style={{ background: i < phase ? "#4F8EF7" : "rgba(255,255,255,0.06)" }} />}</div>))}</div>
      </div>

      <div className="relative z-10 px-4 flex flex-col" style={{ height: "calc(100vh - 56px)" }}>
        {phase === 0 && (
          <div className={`flex-1 flex flex-col ${entering ? "k-phase-in" : ""}`}>
            <div className="text-center mt-1 mb-0">
              <h1 className="text-4xl font-bold tracking-tight mb-1.5" style={{ fontFamily: "'Outfit', sans-serif" }}>What's your <span className="text-blue-400">world</span>?</h1>
              <p className="text-white/30 text-base">Tap to select. Tap again to boost. Long-press to explore sub-topics. Drag to play.</p>
            </div>
            <div ref={cRef} className="flex-1 relative w-full overflow-hidden mt-2" style={{ touchAction: "none" }}
              onClick={() => { if (expandedId) setExpandedId(null); }}>
              {pos.length > 0 && TOPICS.map((t, i) => {
                const isSel = selected[t.id] !== undefined;
                const isExp = expandedId === t.id;
                const subs = SUBTOPICS[t.id] || [];
                const topicSubs = subSelected[t.id] || [];
                return (
                  <GlassOrb key={t.id} topic={t} isSelected={isSel} priority={selected[t.id] ?? -1}
                    pos={pos[i] || { x: 0, y: 0 }} isDragging={dragIdx === i} isExpanded={isExp}
                    onPointerDown={e => handlePD(i, e)} onClick={() => handleClick(i)}>
                    {isSel && subs.map((sub, si) => {
                      const angle = (si / subs.length) * Math.PI * 2 - Math.PI / 2;
                      return (
                        <SubOrb key={sub.id} sub={sub} parentColor={t.color} angle={angle}
                          isSelected={topicSubs.includes(sub.id)} visible={isExp}
                          onClick={() => toggleSub(t.id, sub.id)} />
                      );
                    })}
                  </GlassOrb>
                );
              })}
            </div>
            {selTopics.length > 0 && (
              <div className="text-center pb-2" style={{ animation: "kFadeIn 0.4s ease forwards" }}>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {selTopics.map(t => { const IC = t.Icon; const subs = subSelected[t.id] || []; return (
                    <span key={t.id} className="px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5" style={{ background: `${t.color}12`, color: t.color, border: `1px solid ${t.color}25`, fontFamily: "'Outfit', sans-serif" }}>
                      <IC size={12} />{t.label}
                      {subs.length > 0 && <span className="opacity-60">+{subs.length}</span>}
                      <span className="opacity-40">{["\u25CB", "\u25D1", "\u25CF"][selected[t.id] ?? 0]}</span>
                    </span>
                  ); })}
                </div>
              </div>
            )}
          </div>
        )}

        {phase === 1 && (
          <div className={`flex-1 overflow-auto pb-8 ${entering ? "k-phase-in" : ""}`}>
            <div className="text-center mt-2 mb-8"><h1 className="text-4xl font-bold tracking-tight mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>Calibrate your <span className="text-violet-400">signal</span></h1><p className="text-white/30 text-base">Set the depth and tone for each topic.</p></div>
            <div className="max-w-xl mx-auto space-y-3">{selTopics.map(t => { const c = cal[t.id] || { depth: 1, level: 1 }; return (<CalibrationCard key={t.id} topic={t} depth={c.depth} level={c.level} isActive={activeCal === t.id} onClick={() => setActiveCal(t.id)} onDepthChange={d => setCal(p => ({ ...p, [t.id]: { ...c, depth: d } }))} onLevelChange={l => setCal(p => ({ ...p, [t.id]: { ...c, level: l } }))} />); })}</div>
          </div>
        )}

        {phase === 2 && (
          <div className={`flex-1 overflow-auto pb-8 ${entering ? "k-phase-in" : ""}`}>
            <div className="text-center mt-2 mb-8"><h1 className="text-4xl font-bold tracking-tight mb-2" style={{ fontFamily: "'Outfit', sans-serif" }}>Set your <span className="text-cyan-400">rhythm</span></h1><p className="text-white/30 text-base">When should your briefings land?</p></div>
            <div className="max-w-xl mx-auto space-y-4">
              <PulseCard icon={"\u2600\uFE0F"} label="Morning" desc="Your full briefing" {...sched.morning} onChange={v => setSched(s => ({ ...s, morning: v }))} />
              <PulseCard icon={"\u2614"} label="Midday" desc="What's new since morning" {...sched.midday} onChange={v => setSched(s => ({ ...s, midday: v }))} />
              <PulseCard icon={"\uD83C\uDF19"} label="Evening" desc="Day wrap-up" {...sched.evening} onChange={v => setSched(s => ({ ...s, evening: v }))} />
            </div>
          </div>
        )}

        {phase === 3 && (
          <div className={`flex-1 flex items-center justify-center ${entering ? "k-phase-in" : ""}`}>
            <div className="text-center max-w-lg">
              <div className="w-24 h-24 mx-auto mb-8 rounded-3xl flex items-center justify-center k-s1" style={{ background: "linear-gradient(135deg, #4F8EF7 0%, #6366F1 100%)", boxShadow: "0 8px 50px rgba(79,142,247,0.4)" }}><span className="text-white text-4xl">{"\u2713"}</span></div>
              <div className="k-s2"><KairoLogo size="lg" /></div>
              <p className="text-white/40 text-lg mt-4 mb-2 k-s3">Your first briefing arrives tomorrow at <span className="text-white font-semibold" style={{ fontFamily: "'Space Mono', monospace" }}>{sched.morning.time || "06:30"}</span></p>
              <p className="text-white/20 text-sm mb-10 k-s4">{selTopics.length} topics{totalSubs > 0 && ` (${totalSubs} sub-topics)`} {"\u00B7"} {enPulses} pulse{enPulses !== 1 ? "s" : ""}{Object.values(sched).some(v => v.audio) && ` ${"\u00B7"} audio enabled`}</p>
              <div className="flex items-center justify-center gap-4 flex-wrap mb-12 k-s5">{selTopics.map(t => { const c = cal[t.id] || { depth: 1, level: 1 }; const IC = t.Icon; return (<div key={t.id} className="flex flex-col items-center gap-2"><div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: `${t.color}15`, border: `1.5px solid ${t.color}30` }}><IC size={28} style={{ color: t.color }} /></div><div className="text-center"><div className="text-xs font-medium text-white/50" style={{ fontFamily: "'Outfit', sans-serif" }}>{t.label}</div><div className="text-xs text-white/20">{DEPTH_LABELS[c.depth]}</div></div></div>); })}</div>
              <button className="px-10 py-4 rounded-2xl font-bold text-lg transition-all k-s6" style={{ background: "linear-gradient(135deg, #4F8EF7 0%, #6366F1 100%)", color: "#fff", boxShadow: "0 8px 40px rgba(79,142,247,0.35)", fontFamily: "'Outfit', sans-serif" }}>Open Kairo {"\u2192"}</button>
              <p className="text-white/15 text-xs mt-6 k-s6">The right intelligence, at the right moment.</p>
            </div>
          </div>
        )}

        {phase < 3 && (
          <div className="flex items-center justify-between py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            <button onClick={() => phase > 0 && setPhase(phase - 1)} className={`text-sm font-medium transition-all ${phase > 0 ? "text-white/30 hover:text-white/60 cursor-pointer" : "text-transparent cursor-default"}`} style={{ fontFamily: "'Outfit', sans-serif" }}>{"\u2190"} Back</button>
            <div className="flex items-center gap-4">
              {phase === 0 && <span className="text-sm text-white/15" style={{ fontFamily: "'Outfit', sans-serif" }}>{selTopics.length < 2 ? `Pick at least ${2 - selTopics.length} more` : `${selTopics.length} selected`}</span>}
              <button onClick={() => canProceed && setPhase(phase + 1)} disabled={!canProceed} className="px-7 py-3 rounded-2xl font-semibold text-sm transition-all duration-300" style={{ fontFamily: "'Outfit', sans-serif", background: canProceed ? "linear-gradient(135deg, #4F8EF7 0%, #6366F1 100%)" : "rgba(255,255,255,0.04)", color: canProceed ? "#fff" : "rgba(255,255,255,0.15)", boxShadow: canProceed ? "0 4px 24px rgba(79,142,247,0.3)" : "none", cursor: canProceed ? "pointer" : "not-allowed" }}>Continue {"\u2192"}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
