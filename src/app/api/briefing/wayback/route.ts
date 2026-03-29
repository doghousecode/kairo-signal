import Anthropic from "@anthropic-ai/sdk";
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export const maxDuration = 120;

const client = new Anthropic();

function getSteveContext(year: number): string {
  const age = year - 1980;
  if (year < 1998) return `Steve is ${age} years old, still at school in the UK, deep into skateboarding and music.`;
  if (year < 2001) return `Steve is ${age}, finished school, getting into work and London life.`;
  if (year < 2007) return `Steve is ${age}, working in London, Arsenal obsessive, pre-Apple career.`;
  if (year < 2010) return `Steve is ${age}, just joined Apple's London Online Store — early days, buzzing about it.`;
  if (year < 2022) return `Steve is ${age}, living in California working at Apple (iTunes/Music/Services in Cupertino). Married to Melissa. ${year >= 2008 ? `Son Rocco born 2011, Arlo born 2013.` : ``}`;
  return `Steve is ${age}, back in London (Sevenoaks) after 13 years in California. Working at Apple Online Store again.`;
}

function getEraFlavour(year: number): string {
  if (year <= 1997) return "The internet is barely a thing. Britpop is dying. Diana just died. Write with mid-90s UK energy.";
  if (year <= 2000) return "Y2K paranoia is real. Napster just launched. The dot-com bubble is inflating wildly.";
  if (year <= 2003) return "Post-9/11 world. Iraq War brewing or underway. iPod just launched. Reality TV taking over.";
  if (year <= 2006) return "MySpace era. YouTube just launched. iPhone doesn't exist yet. Steve Jobs at peak reality distortion.";
  if (year <= 2009) return "iPhone just changed everything. Financial crisis. Obama era beginning. Twitter is new.";
  if (year <= 2012) return "Smartphone wars in full swing. Instagram just launched. Streaming music is early. Austerity UK.";
  if (year <= 2015) return "Spotify dominating. Uber everywhere. Social media peak. Cameron's UK.";
  if (year <= 2018) return "Brexit chaos. Trump year 1-2. Streaming wars beginning. Peak streetwear hype.";
  if (year <= 2020) return "COVID hit in early 2020. Pre-pandemic: peak globalisation. Post: everything changed.";
  if (year <= 2022) return "Post-COVID recovery. Cost of living crisis. Ukraine war. AI starting to emerge publicly.";
  return "AI everywhere. Post-pandemic new normal. Streaming fatigue. Cost of living crisis.";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const yearParam = searchParams.get("year");

  const year = yearParam
    ? parseInt(yearParam)
    : 1995 + Math.floor(Math.random() * 31); // 1995–2025

  const now = new Date();
  const dayMonth = now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  const historicalDate = `${dayMonth} ${year}`;
  const steveContext = getSteveContext(year);
  const eraFlavour = getEraFlavour(year);

  const prompt = `You are generating a HISTORICAL morning briefing — a fun "what if" for Steve looking back at this exact date in a past year.

Date: ${historicalDate}
${steveContext}
Era notes: ${eraFlavour}

Write Steve's morning briefing as if it's genuinely ${historicalDate}. Use real events, real news, real cultural moments from that time. Be accurate to what was actually happening. Write in the same casual, witty tone as his normal briefing but with period-appropriate references and energy.

Cover (adapting to what was relevant in ${year}):
- The big news story of that moment
- Tech/AI landscape of ${year} (what was cutting edge back then)
- Arsenal's season at that point in ${year}
- Music that was current
- Fashion/culture of the era
- A moment of "can you believe this was the world back then?" reflection

End with a cheeky sign-off acknowledging this is a transmission from the past — something like "See you in ${new Date().getFullYear()}, Stevo. It's going to be a ride." Lean into the nostalgia without being cheesy. Keep it sharp.

IMPORTANT: Do not mention events that hadn't happened yet as of ${historicalDate}. Stay true to the knowledge horizon of ${year}.`;

  const message = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";

  return NextResponse.json({ briefing: text, year });
}

export async function POST(request: Request) {
  const { briefing, year } = await request.json();

  const dayMonth = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  const historicalDate = `${dayMonth}, ${year}`;

  const body = briefing
    .replace(/^### (.+)$/gm, `<h2 style="font-family:system-ui,sans-serif;font-size:17px;font-weight:700;color:#c8a96e;margin:28px 0 8px;padding-bottom:8px;border-bottom:1px solid rgba(200,169,110,0.2);">$1</h2>`)
    .replace(/^## (.+)$/gm, `<h2 style="font-family:system-ui,sans-serif;font-size:20px;font-weight:800;color:#c8a96e;margin:32px 0 10px;">$1</h2>`)
    .replace(/^# (.+)$/gm, `<h1 style="font-family:system-ui,sans-serif;font-size:24px;font-weight:800;color:#c8a96e;margin:0 0 16px;">$1</h1>`)
    .replace(/\*\*(.+?)\*\*/g, `<strong style="color:#e8d9b8;">$1</strong>`)
    .replace(/\[(.+?)\]\((.+?)\)/g, `<a href="$2" style="color:#c8a96e;text-decoration:none;">$1</a>`)
    .replace(/^- (.+)$/gm, `<li style="margin-bottom:6px;font-size:15px;line-height:1.75;color:#d4c4a0;">$1</li>`)
    .replace(/(<li.*<\/li>\n?)+/g, `<ul style="padding-left:20px;margin:0 0 14px;">$&</ul>`)
    .replace(/\n\n/g, `</p><p style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.75;color:#d4c4a0;margin:0 0 12px;">`)
    .replace(/^(?!<[hul])(.+)$/gm, `<p style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.75;color:#d4c4a0;margin:0 0 12px;">$1</p>`);

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0f0b06;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0f0b06;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#1a1206;border-radius:16px;overflow:hidden;border:1px solid rgba(200,169,110,0.2);box-shadow:0 0 60px rgba(200,169,110,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#2a1f0a,#1a1206);padding:28px 40px;border-bottom:1px solid rgba(200,169,110,0.15);">
            <div style="font-family:system-ui,sans-serif;font-size:11px;letter-spacing:0.25em;color:rgba(200,169,110,0.5);text-transform:uppercase;margin-bottom:10px;">📼 transmission from the archive</div>
            <div style="font-family:system-ui,sans-serif;font-size:56px;font-weight:900;color:#c8a96e;letter-spacing:-0.03em;line-height:1;">${year}</div>
            <div style="font-family:system-ui,sans-serif;font-size:13px;color:rgba(200,169,110,0.5);margin-top:6px;">${historicalDate}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px 48px;">
            ${body}
          </td>
        </tr>
        <tr>
          <td style="background:rgba(200,169,110,0.04);padding:20px 40px;border-top:1px solid rgba(200,169,110,0.1);">
            <p style="font-family:system-ui,sans-serif;font-size:12px;color:rgba(200,169,110,0.4);margin:0;">
              Kairo Signal · Wayback Machine · <a href="https://kairo-signal.vercel.app" style="color:#c8a96e;text-decoration:none;">kairo-signal.vercel.app</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await resend.emails.send({
    from: "Kairo Signal <signal@meetkairo.ai>",
    to: "stephentinkler@mac.com",
    subject: `📼 Kairo Wayback — ${historicalDate}`,
    html,
    text: briefing,
  });

  return NextResponse.json({ ok: true });
}
