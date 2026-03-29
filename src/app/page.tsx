"use client";
import { useState, useRef } from "react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [briefing, setBriefing] = useState("");
  const [loading, setLoading] = useState(false);
  const [wayback, setWayback] = useState<{ briefing: string; year: number } | null>(null);
  const [waybackLoading, setWaybackLoading] = useState(false);
  const [waybackSending, setWaybackSending] = useState(false);
  const [waybackSent, setWaybackSent] = useState(false);

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

  const generateBriefing = async () => {
    setLoading(true);
    const res = await fetch("/api/briefing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        interests: "AI, Arsenal, Apple, fashion, automotive",
      }),
    });
    const data = await res.json();
    setBriefing(data.briefing);
    setLoading(false);
  };

  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px", fontFamily: "system-ui" }}>
      <h1
        onClick={handleLogoClick}
        style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em", cursor: "default", userSelect: "none" }}
      >
        <span style={{ color: "#1A2B4A" }}>K</span>
        <span style={{ color: "#4A7AFF" }}>AI</span>
        <span style={{ color: "#1A2B4A" }}>RO</span>
      </h1>
      <p style={{ color: "#666", marginBottom: 32 }}>Your morning briefing.</p>
      <button
        onClick={generateBriefing}
        disabled={loading}
        style={{
          background: "#3A6EE8", color: "white", border: "none",
          padding: "12px 28px", borderRadius: 8, fontSize: 15,
          fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? "Generating..." : "Generate Briefing"}
      </button>

      {briefing && (
        <div style={{
          marginTop: 40,
          lineHeight: 1.75,
          fontSize: 15,
          color: "#1a1a1a",
        }}>
          <style>{`
            .briefing h1, .briefing h2, .briefing h3 {
              font-size: 17px;
              font-weight: 700;
              margin: 28px 0 8px;
              color: #111;
              border-bottom: 1px solid #f0f0f0;
              padding-bottom: 6px;
            }
            .briefing h1 { font-size: 20px; }
            .briefing p { margin: 0 0 12px; }
            .briefing ul, .briefing ol {
              padding-left: 20px;
              margin: 0 0 12px;
            }
            .briefing li { margin-bottom: 6px; font-size: 15px; line-height: 1.75; }
            .briefing strong { font-weight: 700; color: #111; }
            .briefing a {
              color: #3A6EE8;
              text-decoration: none;
            }
            .briefing a:hover { text-decoration: underline; }
            .briefing hr {
              border: none;
              border-top: 2px solid #f0f0f0;
              margin: 32px 0;
            }
            .briefing p:empty { display: none; }
            .briefing blockquote {
              border-left: 3px solid #3A6EE8;
              margin: 0 0 12px;
              padding: 4px 0 4px 16px;
              color: #555;
            }
          `}</style>
          <div className="briefing">
            <ReactMarkdown>{briefing}</ReactMarkdown>
          </div>
        </div>
      )}

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

      {wayback && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(10,8,4,0.95)",
          overflowY: "auto", zIndex: 1000, padding: "40px 24px",
        }}>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <div style={{
              background: "linear-gradient(135deg, #1a1206, #2a1f0a)",
              border: "1px solid #c8a96e40",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 0 60px rgba(200,169,110,0.15)",
            }}>
              <div style={{
                background: "linear-gradient(135deg, #2a1f0a, #1a1206)",
                padding: "28px 36px",
                borderBottom: "1px solid #c8a96e30",
              }}>
                <div style={{
                  fontSize: 11, letterSpacing: "0.25em", color: "#c8a96e80",
                  fontFamily: "system-ui", marginBottom: 8, textTransform: "uppercase",
                }}>
                  📼 transmission from the archive
                </div>
                <div style={{
                  fontSize: 56, fontWeight: 900, color: "#c8a96e",
                  fontFamily: "system-ui", letterSpacing: "-0.03em", lineHeight: 1,
                }}>
                  {wayback.year}
                </div>
                <div style={{ fontSize: 13, color: "#c8a96e60", marginTop: 6, fontFamily: "system-ui" }}>
                  {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })} — but back then
                </div>
              </div>
              <div style={{
                padding: "32px 36px 40px",
                color: "#e8d9b8",
                lineHeight: 1.75,
                fontSize: 15,
                fontFamily: "system-ui",
              }}>
                <style>{`
                  .wayback h1, .wayback h2, .wayback h3 {
                    font-size: 17px; font-weight: 700; margin: 28px 0 8px;
                    color: #c8a96e; border-bottom: 1px solid #c8a96e20; padding-bottom: 6px;
                  }
                  .wayback h1 { font-size: 20px; }
                  .wayback p { margin: 0 0 12px; color: #d4c4a0; }
                  .wayback ul, .wayback ol { padding-left: 20px; margin: 0 0 12px; }
                  .wayback li { margin-bottom: 6px; font-size: 15px; line-height: 1.75; color: #d4c4a0; }
                  .wayback strong { color: #e8d9b8; font-weight: 700; }
                  .wayback a { color: #c8a96e; text-decoration: none; }
                  .wayback hr { border: none; border-top: 1px solid #c8a96e20; margin: 24px 0; }
                `}</style>
                <div className="wayback">
                  <ReactMarkdown>{wayback.briefing}</ReactMarkdown>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
              <button
                onClick={emailWayback}
                disabled={waybackSending || waybackSent}
                style={{
                  flex: 1, background: waybackSent ? "rgba(200,169,110,0.15)" : "transparent",
                  border: "1px solid #c8a96e60", color: "#c8a96e",
                  padding: "12px 28px", borderRadius: 8, fontSize: 14,
                  cursor: waybackSending ? "not-allowed" : "pointer",
                  fontFamily: "system-ui", opacity: waybackSending ? 0.6 : 1,
                  transition: "all 0.3s",
                }}
              >
                {waybackSent ? "✓ sent to your inbox" : waybackSending ? "sending..." : "📬 email me this"}
              </button>
              <button
                onClick={() => { setWayback(null); setWaybackSent(false); }}
                style={{
                  flex: 1, background: "transparent", border: "1px solid #c8a96e20",
                  color: "rgba(200,169,110,0.5)", padding: "12px 28px", borderRadius: 8,
                  fontSize: 14, cursor: "pointer", fontFamily: "system-ui",
                }}
              >
                ← back to today
              </button>
            </div>
          </div>
        </div>
      )}

      <a href="/onboarding" style={{
        display: "inline-block",
        padding: "14px 36px",
        background: "linear-gradient(135deg, #4F8EF7 0%, #6366F1 100%)",
        color: "#fff",
        borderRadius: 16,
        fontWeight: 600,
        textDecoration: "none",
        fontSize: 14,
        marginTop: 32,
        boxShadow: "0 4px 24px rgba(79,142,247,0.3)",
      }}>
        Start Onboarding
      </a>
    </main>
  );
}
