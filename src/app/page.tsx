"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [briefing, setBriefing] = useState("");
  const [loading, setLoading] = useState(false);

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
      <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em" }}>
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
