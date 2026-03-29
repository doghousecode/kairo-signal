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
      <p style={{ color: "#999", fontSize: 13, marginBottom: 40 }}>
        <Link href="/" style={{ color: "#999", textDecoration: "none" }}>
          <span style={{ color: "#1A2B4A" }}>K</span>
          <span style={{ color: "#4A7AFF" }}>AI</span>
          <span style={{ color: "#1A2B4A" }}>RO</span>
        </Link>
        {" "}Signal
      </p>

      <div style={{ lineHeight: 1.75, fontSize: 15, color: "#1a1a1a" }}>
        <style>{`
          .briefing h1, .briefing h2, .briefing h3 {
            font-size: 17px; font-weight: 700; margin: 28px 0 8px;
            color: #111; border-bottom: 1px solid #f0f0f0; padding-bottom: 6px;
          }
          .briefing h1 { font-size: 20px; }
          .briefing p { margin: 0 0 12px; }
          .briefing ul, .briefing ol { padding-left: 20px; margin: 0 0 12px; }
          .briefing li { margin-bottom: 6px; font-size: 15px; line-height: 1.75; }
          .briefing strong { font-weight: 700; color: #111; }
          .briefing a { color: #3A6EE8; text-decoration: none; }
          .briefing a:hover { text-decoration: underline; }
          .briefing hr { border: none; border-top: 1px solid #f0f0f0; margin: 24px 0; }
        `}</style>
        <div className="briefing">
          <ReactMarkdown>{briefing.content}</ReactMarkdown>
        </div>
      </div>
    </main>
  );
}
