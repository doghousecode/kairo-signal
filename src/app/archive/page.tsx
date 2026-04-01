import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const revalidate = 0;

export default async function ArchivePage() {
  const { data: briefings, error } = await supabase
    .from("briefings")
    .select("id, created_at, content")
    .order("created_at", { ascending: false });

  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px", fontFamily: "system-ui" }}>
      <Link href="/" style={{ color: "#999", fontSize: 13, textDecoration: "none" }}>
        ← back
      </Link>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Jost:ital,wght@1,800&display=swap');`}</style>
      <h1 style={{ fontSize: 36, fontWeight: 800, fontStyle: "oblique", fontFamily: "'Jost', system-ui", letterSpacing: "-0.01em", lineHeight: 1, margin: "24px 0 4px" }}>
        <span style={{ color: "#2a3a6a" }}>k</span>
        <span style={{ color: "#5b80e8" }}>ai</span>
        <span style={{ color: "#2a3a6a" }}>ro</span>
        <span style={{ color: "#5b80e8" }}> archive</span>
      </h1>
      <p style={{ color: "#999", fontSize: 14, marginBottom: 40, colorScheme: "light dark" }}>Every briefing, in order.</p>

      {error && (
        <p style={{ color: "#e55", fontSize: 14 }}>Error loading briefings.</p>
      )}

      {!briefings?.length && !error && (
        <p style={{ color: "#999", fontSize: 14 }}>No briefings yet.</p>
      )}

      <style>{`
        .archive-item { padding: 18px 20px; border-radius: 10px; border: 1px solid #f0f0f0; transition: background 0.15s; }
        .archive-item:hover { background: #fafafa; }
        .archive-date { font-weight: 700; font-size: 15px; color: #111; }
        .archive-time { font-size: 12px; color: #bbb; }
        .archive-preview { margin: 0; font-size: 13px; color: #888; line-height: 1.5; }
        @media (prefers-color-scheme: dark) {
          .archive-item { border-color: #222; }
          .archive-item:hover { background: #111; }
          .archive-date { color: #f0f0f0; }
          .archive-time { color: #555; }
          .archive-preview { color: #666; }
        }
      `}</style>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {briefings?.map((b) => {
          const date = new Date(b.created_at);
          const dateStr = date.toLocaleDateString("en-GB", {
            weekday: "long", day: "numeric", month: "long", year: "numeric",
          });
          const timeStr = date.toLocaleTimeString("en-GB", {
            hour: "2-digit", minute: "2-digit",
          });
          const preview = b.content
            ?.replace(/#{1,3}\s/g, "")
            .replace(/\*\*/g, "")
            .slice(0, 120)
            .trim();

          return (
            <Link key={b.id} href={`/archive/${b.id}`} style={{ textDecoration: "none" }}>
              <div className="archive-item">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                  <span className="archive-date">{dateStr}</span>
                  <span className="archive-time">{timeStr}</span>
                </div>
                <p className="archive-preview">{preview}…</p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
