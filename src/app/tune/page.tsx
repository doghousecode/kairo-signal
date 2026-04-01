"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type Message = { role: "user" | "assistant"; text: string };

export default function TunePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCustom, setIsCustom] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [promptText, setPromptText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/tune")
      .then((r) => r.json())
      .then((d) => {
        setIsCustom(d.isCustom);
        setUpdatedAt(d.updatedAt);
        setPromptText(d.prompt);
      });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);
    setLoading(true);
    const res = await fetch("/api/tune", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.ok) {
      setMessages((m) => [...m, { role: "assistant", text: data.summary }]);
      setIsCustom(true);
      setUpdatedAt(new Date().toISOString());
      // Refresh the prompt text
      fetch("/api/tune").then((r) => r.json()).then((d) => setPromptText(d.prompt));
    } else {
      setMessages((m) => [...m, { role: "assistant", text: "Something went wrong — try again." }]);
    }
  };

  const reset = async () => {
    if (!confirm("Reset to the default briefing prompt? All your customisations will be lost.")) return;
    setResetting(true);
    await fetch("/api/tune", { method: "DELETE" });
    setIsCustom(false);
    setUpdatedAt(null);
    setMessages([]);
    fetch("/api/tune").then((r) => r.json()).then((d) => setPromptText(d.prompt));
    setResetting(false);
  };

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px", fontFamily: "system-ui" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jost:ital,wght@1,800&display=swap');
        :root { color-scheme: light dark; }
        @media (prefers-color-scheme: dark) { body { background: #0a0a0a; } }
        .msg-user { background: #3A6EE8; color: #fff; border-radius: 16px 16px 4px 16px; padding: 12px 16px; max-width: 85%; align-self: flex-end; font-size: 14px; line-height: 1.5; }
        .msg-assistant { background: #f4f4f4; color: #111; border-radius: 16px 16px 16px 4px; padding: 12px 16px; max-width: 85%; align-self: flex-start; font-size: 14px; line-height: 1.5; }
        .prompt-box { background: #f9f9f9; border: 1px solid #e8e8e8; border-radius: 10px; padding: 16px; font-size: 12px; line-height: 1.6; color: #555; white-space: pre-wrap; max-height: 400px; overflow-y: auto; font-family: monospace; }
        @media (prefers-color-scheme: dark) {
          .msg-assistant { background: #1a1a1a; color: #e8e8e8; }
          .prompt-box { background: #111; border-color: #222; color: #888; }
        }
      `}</style>

      <Link href="/" style={{ color: "#999", fontSize: 13, textDecoration: "none" }}>← back</Link>

      <h1 style={{ fontSize: 36, fontWeight: 800, fontStyle: "oblique", fontFamily: "'Jost', system-ui", letterSpacing: "-0.01em", lineHeight: 1, margin: "24px 0 4px" }}>
        <span style={{ color: "#2a3a6a" }}>k</span>
        <span style={{ color: "#5b80e8" }}>ai</span>
        <span style={{ color: "#2a3a6a" }}>ro</span>
        <span style={{ color: "#5b80e8" }}> tune</span>
      </h1>
      <p style={{ color: "#999", fontSize: 14, marginBottom: 8 }}>
        Tell me what to change about your briefing. Changes take effect on the next generation.
      </p>

      {/* Status bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32, flexWrap: "wrap" }}>
        <span style={{
          fontSize: 12, padding: "3px 10px", borderRadius: 20,
          background: isCustom ? "#e8f0ff" : "#f4f4f4",
          color: isCustom ? "#3A6EE8" : "#999",
          fontWeight: 600,
        }}>
          {isCustom ? "Custom prompt active" : "Default prompt"}
        </span>
        {updatedAt && (
          <span style={{ fontSize: 12, color: "#bbb" }}>last updated {timeAgo(updatedAt)}</span>
        )}
        {isCustom && (
          <button
            onClick={reset}
            disabled={resetting}
            style={{ fontSize: 12, color: "#e55", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            {resetting ? "Resetting..." : "Reset to default"}
          </button>
        )}
      </div>

      {/* Suggestions */}
      {messages.length === 0 && (
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 13, color: "#999", marginBottom: 12 }}>Try saying:</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              "Remove the rugby section",
              "Make the Arsenal section shorter and more tactical",
              "Add a crypto section after AI & Tech",
              "Change the tone to be slightly more professional",
              "I've stopped following F1 — remove that section",
              "Add more depth to the music section, I want full album reviews",
            ].map((s) => (
              <button
                key={s}
                onClick={() => setInput(s)}
                style={{
                  textAlign: "left", background: "none", border: "1px solid #e8e8e8",
                  borderRadius: 8, padding: "8px 14px", fontSize: 13, color: "#555",
                  cursor: "pointer",
                }}
              >
                "{s}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat messages */}
      {messages.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          {messages.map((m, i) => (
            <div key={i} className={m.role === "user" ? "msg-user" : "msg-assistant"}>
              {m.role === "assistant" && <div style={{ fontSize: 11, fontWeight: 700, marginBottom: 4, opacity: 0.5 }}>✓ SAVED</div>}
              {m.text}
            </div>
          ))}
          {loading && (
            <div className="msg-assistant" style={{ opacity: 0.5 }}>Updating your briefing prompt…</div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Input */}
      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Tell me what to change..."
          disabled={loading}
          style={{
            flex: 1, padding: "12px 16px", borderRadius: 10, border: "1px solid #e8e8e8",
            fontSize: 14, fontFamily: "system-ui", outline: "none",
            background: "transparent", color: "inherit",
          }}
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          style={{
            padding: "12px 20px", background: "#3A6EE8", color: "#fff", border: "none",
            borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
            opacity: loading || !input.trim() ? 0.5 : 1,
          }}
        >
          Send
        </button>
      </div>

      {/* Prompt inspector */}
      <div style={{ marginTop: 40 }}>
        <button
          onClick={() => setShowPrompt(!showPrompt)}
          style={{ fontSize: 13, color: "#bbb", background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          {showPrompt ? "▲ Hide" : "▼ Inspect"} current prompt
        </button>
        {showPrompt && (
          <div className="prompt-box" style={{ marginTop: 12 }}>
            {promptText}
          </div>
        )}
      </div>
    </main>
  );
}
