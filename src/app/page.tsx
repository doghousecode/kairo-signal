"use client";
import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";

const navItems = [
  { href: "/archive", icon: "🗂️", label: "Archive", description: "Every briefing, in order" },
  { href: "/tune", icon: "🎛️", label: "Tune", description: "Customise your briefing through conversation" },
  { href: "/usage", icon: "📊", label: "Usage", description: "Track your API spend" },
  { href: "/onboarding", icon: "✦", label: "Onboarding", description: "Set up your signal from scratch" },
];

export default function Home() {
  const [briefing, setBriefing] = useState("");
  const [loading, setLoading] = useState(false);
  const [wayback, setWayback] = useState<{ briefing: string; year: number } | null>(null);
  const [waybackLoading, setWaybackLoading] = useState(false);
  const [waybackSending, setWaybackSending] = useState(false);
  const [waybackSent, setWaybackSent] = useState(false);

  const logoClickCount = useRef(0);
  const logoClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoClick = () => {
    logoClickCount.current += 1;
    if (logoClickTimer.current) clearTimeout(logoClickTimer.current);
    logoClickTimer.current = setTimeout(() => { logoClickCount.current = 0; }, 500);
    if (logoClickCount.current >= 3) {
      logoClickCount.current = 0;
      triggerWayback();
    }
  };

  const triggerWayback = async () => {
    setWaybackLoading(true);
    setWayback(null);
    const res = await fetch("/api/briefing/wayback");
    const data = await res.json();
    setWayback(data);
    setWaybackLoading(false);
  };

  const emailWayback = async () => {
    if (!wayback) return;
    setWaybackSending(true);
    await fetch("/api/briefing/wayback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ briefing: wayback.briefing, year: wayback.year }),
    });
    setWaybackSending(false);
    setWaybackSent(true);
    setTimeout(() => setWaybackSent(false), 3000);
  };

  const generateBriefing = async () => {
    setLoading(true);
    setBriefing("");
    const res = await fetch("/api/briefing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ interests: "AI, Arsenal, Apple, fashion, automotive" }),
    });
    const data = await res.json();
    setBriefing(data.briefing || "");
    setLoading(false);
  };

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "48px 20px 80px", fontFamily: "system-ui" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jost:ital,wght@1,800&display=swap');
        :root { color-scheme: light dark; }
        body { background: #0a0a0a; }

        .card {
          display: flex; align-items: center; gap: 16px;
          padding: 16px 20px; border-radius: 14px;
          border: 1px solid #1e1e1e; background: #111;
          text-decoration: none; color: inherit;
          transition: background 0.15s, border-color 0.15s;
          cursor: pointer;
        }
        .card:hover { background: #161616; border-color: #2a2a2a; }

        .card-icon {
          width: 44px; height: 44px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; background: #1a1a1a; flex-shrink: 0;
        }
        .card-label { font-size: 16px; font-weight: 700; color: #f0f0f0; }
        .card-desc { font-size: 13px; color: #555; margin-top: 2px; }
        .card-arrow { margin-left: auto; color: #333; font-size: 13px; flex-shrink: 0; }

        .generate-card {
          background: linear-gradient(135deg, #0f1f3d 0%, #0d1929 100%);
          border-color: #1e3a6e;
        }
        .generate-card:hover { background: linear-gradient(135deg, #132547 0%, #101e30 100%); border-color: #2a4f94; }
        .generate-card .card-icon { background: #1a3060; }
        .generate-card .card-label { color: #fff; }
        .generate-card .card-desc { color: #4A7AFF; }
        .generate-card .card-arrow { color: #2a4f94; }

        .loading-card .card-desc { color: #4A7AFF; animation: pulse 1.5s ease-in-out infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

        .briefing { color: #e8e8e8; }
        .briefing h1, .briefing h2, .briefing h3 {
          font-size: 17px; font-weight: 700; margin: 28px 0 8px;
          color: #f0f0f0; border-bottom: 1px solid #1e1e1e; padding-bottom: 6px;
        }
        .briefing h1 { font-size: 20px; }
        .briefing p { margin: 0 0 12px; color: #ccc; }
        .briefing ul, .briefing ol { padding-left: 20px; margin: 0 0 12px; }
        .briefing li { margin-bottom: 6px; font-size: 15px; line-height: 1.75; color: #ccc; }
        .briefing strong { font-weight: 700; color: #f0f0f0; }
        .briefing a { color: #4A7AFF; text-decoration: none; }
        .briefing a:hover { text-decoration: underline; }
        .briefing hr { border: none; border-top: 1px solid #1e1e1e; margin: 32px 0; }
        .briefing p:empty { display: none; }
        .briefing blockquote {
          border-left: 3px solid #4A7AFF; margin: 0 0 12px;
          padding: 4px 0 4px 16px; color: #888;
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1
          onClick={handleLogoClick}
          style={{ fontSize: 36, fontWeight: 800, fontStyle: "oblique", fontFamily: "'Jost', system-ui", letterSpacing: "-0.01em", cursor: "default", userSelect: "none", margin: "0 0 4px", lineHeight: 1 }}
        >
          <span style={{ color: "#2a3a6a" }}>k</span>
          <span style={{ color: "#5b80e8" }}>ai</span>
          <span style={{ color: "#2a3a6a" }}>ro</span>
          <span style={{ color: "#5b80e8" }}> signal</span>
        </h1>
        <p style={{ color: "#444", margin: 0, fontSize: 14 }}>Your morning briefing.</p>
      </div>

      {/* Generate card */}
      <div style={{ marginBottom: 8 }}>
        <button
          onClick={generateBriefing}
          disabled={loading}
          className={`card generate-card${loading ? " loading-card" : ""}`}
          style={{ width: "100%", border: "1px solid", textAlign: "left" }}
        >
          <div className="card-icon">
            {loading ? "⏳" : "☀️"}
          </div>
          <div style={{ flex: 1 }}>
            <div className="card-label">Generate Briefing</div>
            <div className="card-desc">
              {loading ? "Searching the news, writing your briefing…" : "Tap to generate today's briefing"}
            </div>
          </div>
          {!loading && <div className="card-arrow">▸</div>}
        </button>
      </div>

      {/* Nav cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 40 }}>
        {navItems.map((item) => (
          <a key={item.href} href={item.href} className="card">
            <div className="card-icon">{item.icon}</div>
            <div style={{ flex: 1 }}>
              <div className="card-label">{item.label}</div>
              <div className="card-desc">{item.description}</div>
            </div>
            <div className="card-arrow">▸</div>
          </a>
        ))}
      </div>

      {/* Briefing output */}
      {briefing && (
        <div style={{ marginTop: 8, lineHeight: 1.75, fontSize: 15 }}>
          <div style={{ borderTop: "1px solid #1e1e1e", paddingTop: 32, marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: "#333", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Today's briefing
            </span>
          </div>
          <div className="briefing">
            <ReactMarkdown>{briefing}</ReactMarkdown>
          </div>
        </div>
      )}

      {/* Wayback loading overlay */}
      {waybackLoading && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(10,8,4,0.92)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, flexDirection: "column", gap: 16,
        }}>
          <div style={{ fontSize: 48 }}>⏳</div>
          <div style={{ color: "#c8a96e", fontFamily: "system-ui", fontSize: 16, letterSpacing: "0.1em" }}>
            REWINDING THE TAPE...
          </div>
        </div>
      )}

      {/* Wayback overlay */}
      {wayback && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(10,8,4,0.95)",
          overflowY: "auto", zIndex: 1000, padding: "40px 24px",
        }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{
              background: "linear-gradient(135deg, #1a1206, #2a1f0a)",
              border: "1px solid #c8a96e40", borderRadius: 16, overflow: "hidden",
              boxShadow: "0 0 60px rgba(200,169,110,0.15)",
            }}>
              <div style={{ background: "linear-gradient(135deg, #2a1f0a, #1a1206)", padding: "28px 36px", borderBottom: "1px solid #c8a96e30" }}>
                <div style={{ fontSize: 11, letterSpacing: "0.25em", color: "#c8a96e80", marginBottom: 8, textTransform: "uppercase" }}>
                  📼 transmission from the archive
                </div>
                <div style={{ fontSize: 56, fontWeight: 900, color: "#c8a96e", letterSpacing: "-0.03em", lineHeight: 1 }}>
                  {wayback.year}
                </div>
                <div style={{ fontSize: 13, color: "#c8a96e60", marginTop: 6 }}>
                  {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })} — but back then
                </div>
              </div>
              <div style={{ padding: "32px 36px 40px", color: "#e8d9b8", lineHeight: 1.75, fontSize: 15 }}>
                <style>{`
                  .wayback h1, .wayback h2, .wayback h3 { font-size: 17px; font-weight: 700; margin: 28px 0 8px; color: #c8a96e; border-bottom: 1px solid #c8a96e20; padding-bottom: 6px; }
                  .wayback h1 { font-size: 20px; }
                  .wayback p { margin: 0 0 12px; color: #d4c4a0; }
                  .wayback ul, .wayback ol { padding-left: 20px; margin: 0 0 12px; }
                  .wayback li { margin-bottom: 6px; font-size: 15px; line-height: 1.75; color: #d4c4a0; }
                  .wayback strong { color: #e8d9b8; font-weight: 700; }
                  .wayback a { color: #c8a96e; text-decoration: none; }
                  .wayback hr { border: none; border-top: 1px solid #c8a96e20; margin: 24px 0; }
                `}</style>
                <div className="wayback"><ReactMarkdown>{wayback.briefing}</ReactMarkdown></div>
              </div>
            </div>
            <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
              <button onClick={emailWayback} disabled={waybackSending || waybackSent} style={{ flex: 1, background: waybackSent ? "rgba(200,169,110,0.15)" : "transparent", border: "1px solid #c8a96e60", color: "#c8a96e", padding: "12px 28px", borderRadius: 8, fontSize: 14, cursor: waybackSending ? "not-allowed" : "pointer", opacity: waybackSending ? 0.6 : 1, transition: "all 0.3s" }}>
                {waybackSent ? "✓ sent to your inbox" : waybackSending ? "sending..." : "📬 email me this"}
              </button>
              <button onClick={() => { setWayback(null); setWaybackSent(false); }} style={{ flex: 1, background: "transparent", border: "1px solid #c8a96e20", color: "rgba(200,169,110,0.5)", padding: "12px 28px", borderRadius: 8, fontSize: 14, cursor: "pointer" }}>
                ← back to today
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
