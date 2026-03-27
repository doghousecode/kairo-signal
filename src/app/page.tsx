"use client";
import { useState } from "react";

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
        <div style={{ marginTop: 40, whiteSpace: "pre-wrap", lineHeight: 1.7, fontSize: 15 }}>
          {briefing}
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
  marginTop: 16,
  boxShadow: "0 4px 24px rgba(79,142,247,0.3)",
}}>
  Start Onboarding
</a>
    </main>
  );
}
