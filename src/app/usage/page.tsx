import { createClient } from "@supabase/supabase-js";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const revalidate = 0;

// claude-opus-4-5 pricing (per million tokens)
const PRICE_IN_PER_M = 15.0;
const PRICE_OUT_PER_M = 75.0;

function calcCost(tokensIn: number, tokensOut: number): number {
  return (tokensIn / 1_000_000) * PRICE_IN_PER_M + (tokensOut / 1_000_000) * PRICE_OUT_PER_M;
}

export default async function UsagePage() {
  const { data: briefings } = await supabase
    .from("briefings")
    .select("id, created_at, tokens_in, tokens_out")
    .order("created_at", { ascending: false });

  const rows = briefings ?? [];

  const totalIn = rows.reduce((s, b) => s + (b.tokens_in ?? 0), 0);
  const totalOut = rows.reduce((s, b) => s + (b.tokens_out ?? 0), 0);
  const totalCost = calcCost(totalIn, totalOut);

  // Group by month
  const byMonth: Record<string, { in: number; out: number; count: number }> = {};
  for (const b of rows) {
    const key = new Date(b.created_at).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
    if (!byMonth[key]) byMonth[key] = { in: 0, out: 0, count: 0 };
    byMonth[key].in += b.tokens_in ?? 0;
    byMonth[key].out += b.tokens_out ?? 0;
    byMonth[key].count += 1;
  }

  return (
    <main style={{ maxWidth: 680, margin: "0 auto", padding: "48px 24px", fontFamily: "system-ui" }}>
      <Link href="/" style={{ color: "#999", fontSize: 13, textDecoration: "none" }}>
        ← back
      </Link>

      <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em", margin: "24px 0 4px" }}>
        <span style={{ color: "#1A2B4A" }}>K</span>
        <span style={{ color: "#4A7AFF" }}>AI</span>
        <span style={{ color: "#1A2B4A" }}>RO</span>
        <span style={{ color: "#999", fontSize: 16, fontWeight: 400, marginLeft: 10 }}>Usage</span>
      </h1>
      <p style={{ color: "#999", fontSize: 14, marginBottom: 40 }}>API spend across all Signal briefings.</p>

      <style>{`
        .usage-card { background: #fafafa; border: 1px solid #f0f0f0; border-radius: 12px; padding: 20px 24px; }
        .usage-label { font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 4px; }
        .usage-value { font-size: 28px; font-weight: 800; color: #111; letter-spacing: -0.02em; }
        .usage-sub { font-size: 13px; color: #bbb; margin-top: 2px; }
        .month-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid #f0f0f0; }
        .month-row:last-child { border-bottom: none; }
        .briefing-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #f8f8f8; font-size: 13px; }
        .briefing-row:last-child { border-bottom: none; }
        @media (prefers-color-scheme: dark) {
          .usage-card { background: #111; border-color: #222; }
          .usage-label { color: #555; }
          .usage-value { color: #f0f0f0; }
          .usage-sub { color: #444; }
          .month-row { border-bottom-color: #1a1a1a; }
          .briefing-row { border-bottom-color: #111; }
        }
      `}</style>

      {/* Summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 40 }}>
        <div className="usage-card">
          <div className="usage-label">Total spend</div>
          <div className="usage-value">${totalCost.toFixed(2)}</div>
          <div className="usage-sub">{rows.length} briefings</div>
        </div>
        <div className="usage-card">
          <div className="usage-label">Input tokens</div>
          <div className="usage-value">{(totalIn / 1000).toFixed(0)}k</div>
          <div className="usage-sub">${((totalIn / 1_000_000) * PRICE_IN_PER_M).toFixed(2)}</div>
        </div>
        <div className="usage-card">
          <div className="usage-label">Output tokens</div>
          <div className="usage-value">{(totalOut / 1000).toFixed(0)}k</div>
          <div className="usage-sub">${((totalOut / 1_000_000) * PRICE_OUT_PER_M).toFixed(2)}</div>
        </div>
      </div>

      {/* Monthly breakdown */}
      {Object.keys(byMonth).length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 12px", color: "#111" }}>By month</h2>
          <div className="usage-card" style={{ padding: "4px 24px" }}>
            {Object.entries(byMonth).map(([month, data]) => (
              <div key={month} className="month-row">
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "#111" }}>{month}</div>
                  <div style={{ fontSize: 12, color: "#bbb" }}>{data.count} briefing{data.count !== 1 ? "s" : ""} · {((data.in + data.out) / 1000).toFixed(0)}k tokens</div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 16, color: "#3A6EE8" }}>
                  ${calcCost(data.in, data.out).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Per-briefing breakdown */}
      {rows.some(b => b.tokens_in) && (
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 12px", color: "#111" }}>Per briefing</h2>
          <div className="usage-card" style={{ padding: "4px 24px" }}>
            {rows.filter(b => b.tokens_in).map((b) => {
              const date = new Date(b.created_at);
              const dateStr = date.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
              const cost = calcCost(b.tokens_in ?? 0, b.tokens_out ?? 0);
              return (
                <div key={b.id} className="briefing-row">
                  <div style={{ color: "#555" }}>{dateStr}</div>
                  <div style={{ color: "#bbb" }}>{((b.tokens_in ?? 0) / 1000).toFixed(0)}k in · {((b.tokens_out ?? 0) / 1000).toFixed(0)}k out</div>
                  <div style={{ fontWeight: 600, color: "#111" }}>${cost.toFixed(3)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {rows.every(b => !b.tokens_in) && (
        <p style={{ color: "#bbb", fontSize: 14 }}>
          Token data will appear after the next briefing is generated.
          Previous briefings were saved before usage tracking was added.
        </p>
      )}
    </main>
  );
}
