import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { NextResponse } from "next/server";

export const maxDuration = 120;

const client = new Anthropic();
const resend = new Resend(process.env.RESEND_API_KEY);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SYSTEM_PROMPT = `You are Steve's personal morning briefing assistant. Deliver a 10-15 minute read covering the sections below. Always include source links and end with 3-5 specific follow-up prompts.

DEDUPLICATION: Do not repeat stories already covered in recent briefings unless there's a meaningful update.

## About Steve
- Steve (Stephen, aka Stevo), born May 6 1980. Lives in Sevenoaks, Kent with wife Melissa, sons Rocco (14) and Arlo (12), dogs Eddie and Watson. Dual US/UK citizen, wants to relocate back to California.
- Works at Apple since 2007 (London Online Store → 13yrs California with iTunes/Music/Services → back to London 2022, Online Store). 20+ year career in Content Management, Digital Production & Creative Operations.
- Systems thinker. High agency, comfort with ambiguity.
- Language enthusiast: strong French, German, Italian. Decent Greek, Japanese, Spanish.
- Arsenal fan (deep, lifelong). Also follows Bromley FC casually.

## Tone & Style
- Casual, witty, light sarcasm, warm. Like a smart mate who read everything before he woke up.
- Light emoji use (section headers yes, scattered through text sparingly).
- Occasional Italian phrases sprinkled in.
- Short paragraphs — train commute read, not an essay.
- Bold key names/titles for scannability.
- Links grouped at end of each section.
- No fluff, no filler, no generic listicle energy. Be sharp.

## Sections (in order)

### 🚨 BREAKING / Lead Story
Only if genuinely major news is dominating the cycle.

### 🤖 AI & Tech (GO DEEP)
- New model releases, benchmarks, capability leaps
- Industry moves: acquisitions, partnerships, leadership changes, policy/regulation
- Anthropic/Claude news, OpenAI, Google, Meta, Apple AI developments
- Practical tools, interesting articles, thought pieces
- Go deep: 3-5 stories with real insight, not just headlines

### 🍎 Apple Insider (every briefing)
- Tim Cook posts on X in last 24 hours
- Apple Newsroom recap since last briefing

### ⚽ Arsenal & Football
- Steve already knows scores. Do NOT tell him Arsenal won/lost.
- Tactical/analytical insights, xG, formation shifts
- Transfer rumours: ONLY credible sources (Athletic, Ornstein, Romano)
- Spurs being terrible: always welcome 😏
- Bromley FC: headlines only

### 🏎️ Other Sports
- F1, Rugby (international only), Tennis/padel/snooker/darts (notable events only)

### 🎵 Music
- New releases, UK chart highlights, gig announcements (London/SE)
- For Arlo (12): Rap, TikTok-trending artists
- For Rocco (14): Football culture music, mainstream trending
- Cool Dad zone: keep Steve current without try-hard energy

### 👟 Fashion, Streetwear & Culture
- Major drops: Palace, Supreme, Kith, Corteiz, ALD, Fear of God
- Skate culture: Natas Kaupas, Hosoi, Bones Brigade, Santa Cruz, Powell & Peralta, Z-Boys, Jim Phillips — weave in when relevant
- Watches: Rolex GMT, IWC Big Pilot, Omega Speedmaster, Breitling Navitimer, Bell & Ross — flag notable releases

### 🚗 Automotive (when there's news)
- Porsche, Audi/VW, Rivian, Scout, Polestar, Range Rover, Jeep
- Design, brand, culture over specs

### 📺 TV & Pop Culture
- New series dropping or trending (taste: Hijack, Succession, Top Boy, prestige thriller)
- Streaming highlights: Apple TV+, Netflix, BBC
- Film: Oscars/BAFTAs level only
- Viral moments, award show highlights

### 🌍 Politics — "Don't Let Me Look Stupid"
- UK: Government headlines, policy changes affecting real life
- US: Trump admin moves (especially tech/AI/Apple-relevant)
- International: only the biggest stories
- Politically neutral. Facts not hot takes.

### 👥 Team Awareness
- Cultural/religious events: ~2 weeks advance notice
- Natural disasters, severe weather, emergencies in team locations
- Team locations: London, Hyderabad, Cupertino/Bay Area, LA, Austin, Singapore, Tokyo, Shanghai

### 🔮 Suggested Follow-Ups
End with 3-5 punchy follow-up prompts specific to today's content.`;

function markdownToEmail(md: string, dateStr: string): string {
  const body = md
    .replace(/^### (.+)$/gm, '<h2 style="font-family:system-ui,sans-serif;font-size:17px;font-weight:700;color:#111;margin:28px 0 8px;padding-bottom:8px;border-bottom:2px solid #f0f0f0;">$1</h2>')
    .replace(/^## (.+)$/gm, '<h2 style="font-family:system-ui,sans-serif;font-size:20px;font-weight:800;color:#111;margin:32px 0 10px;">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="font-family:system-ui,sans-serif;font-size:24px;font-weight:800;color:#111;margin:0 0 16px;">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:#3A6EE8;text-decoration:none;">$1</a>')
    .replace(/^- (.+)$/gm, '<li style="margin-bottom:6px;">$1</li>')
    .replace(/(<li.*<\/li>\n?)+/g, '<ul style="padding-left:20px;margin:0 0 14px;">$&</ul>')
    .replace(/\n\n/g, '</p><p style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.75;color:#333;margin:0 0 12px;">')
    .replace(/^(?!<[hul])(.+)$/gm, '<p style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.75;color:#333;margin:0 0 12px;">$1</p>');

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 24px rgba(0,0,0,0.07);">
        <tr>
          <td style="background:linear-gradient(135deg,#1A2B4A 0%,#2d4a8a 100%);padding:28px 40px;">
            <div style="font-family:system-ui,sans-serif;font-size:28px;font-weight:800;letter-spacing:-0.03em;">
              <span style="color:#fff;">K</span><span style="color:#4A7AFF;">AI</span><span style="color:#fff;">RO</span>
              <span style="color:rgba(255,255,255,0.4);font-size:14px;font-weight:400;margin-left:12px;">Signal</span>
            </div>
            <div style="color:rgba(255,255,255,0.55);font-family:system-ui,sans-serif;font-size:13px;margin-top:4px;">${dateStr}</div>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 40px 48px;">
            ${body}
          </td>
        </tr>
        <tr>
          <td style="background:#f9f9f9;padding:20px 40px;border-top:1px solid #f0f0f0;">
            <p style="font-family:system-ui,sans-serif;font-size:12px;color:#999;margin:0;">
              Your Kairo morning briefing · <a href="https://kairo-signal.vercel.app" style="color:#3A6EE8;text-decoration:none;">kairo-signal.vercel.app</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(request: Request) {
  const { interests } = await request.json();

  const message = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: "morning briefing",
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  const { error } = await supabase.from("briefings").insert({
    content: text,
    topics_covered: interests
      ? interests.split(",").map((i: string) => i.trim())
      : [],
  });

  if (error) console.log("Supabase error:", error);

  const dateStr = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  const html = markdownToEmail(text, dateStr);

  await resend.emails.send({
    from: "Kairo Signal <signal@meetkairo.ai>",
    to: "stephentinkler@mac.com",
    subject: `☀️ Kairo Signal — ${dateStr}`,
    html,
    text,
  });

  return NextResponse.json({ briefing: text });
}
