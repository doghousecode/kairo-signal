import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { notFound } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const revalidate = 0;

export default async function BriefingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: briefing } = await supabase
    .from("briefings")
    .select("id, created_at, content")
    .eq("id", id)
    .single();

  if (!briefing) notFound();

  const date = new Date(briefing.created_at);
  const dateStr = date.toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px", fontFamily: "system-ui" }}>
      <Link href="/archive" style={{ color: "#999", fontSize: 13, textDecoration: "none" }}>
        ← archive
      </Link>

      <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", margin: "24px 0 4px", color: "#111" }}>
        {dateStr}
      </h1>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Jost:ital,wght@1,800&display=swap');`}</style>
      <p style={{ marginBottom: 40 }}>
        <Link href="/" style={{ textDecoration: "none", fontFamily: "'Jost', system-ui", fontWeight: 800, fontStyle: "oblique", fontSize: 18, letterSpacing: "-0.01em" }}>
          <span style={{ color: "#2a3a6a" }}>k</span>
          <span style={{ color: "#5b80e8" }}>ai</span>
          <span style={{ color: "#2a3a6a" }}>ro</span>
          <span style={{ color: "#5b80e8" }}> signal</span>
        </Link>
      </p>

      <div style={{ lineHeight: 1.75, fontSize: 15 }}>
        <style>{`
          .briefing { color: #1a1a1a; }
          .briefing h1, .briefing h2, .briefing h3 {
            font-size: 17px; font-weight: 700; margin: 28px 0 8px;
            color: #111; border-bottom: 1px solid #e8e8e8; padding-bottom: 6px;
          }
          .briefing h1 { font-size: 20px; }
          .briefing p { margin: 0 0 12px; }
          .briefing ul, .briefing ol { padding-left: 20px; margin: 0 0 12px; }
          .briefing li { margin-bottom: 6px; font-size: 15px; line-height: 1.75; }
          .briefing strong { font-weight: 700; color: #111; }
          .briefing a { color: #3A6EE8; text-decoration: none; }
          .briefing a:hover { text-decoration: underline; }
          .briefing hr { border: none; border-top: 1px solid #e8e8e8; margin: 24px 0; }
          @media (prefers-color-scheme: dark) {
            .briefing { color: #e8e8e8; }
            .briefing h1, .briefing h2, .briefing h3 { color: #f0f0f0; border-bottom-color: #333; }
            .briefing strong { color: #fff; }
            .briefing hr { border-top-color: #333; }
          }
        `}</style>
        <div className="briefing">
          <ReactMarkdown>{briefing.content}</ReactMarkdown>
        </div>
      </div>
    </main>
  );
}
