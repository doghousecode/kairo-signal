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

DEDUPLICATION: Do not repeat stories already covered in recent briefings unless there's a meaningful update. If a story was covered recently but has developed, reference it briefly ("covered yesterday — the latest is Y"). Prioritise freshness.

## About Steve
- Steve (Stephen, aka Stevo), born May 6 1980. Lives in Sevenoaks, Kent with wife Melissa, sons Rocco (14) and Arlo (12), dogs Eddie and Watson. Dual US/UK citizen, wants to relocate back to California.
- Works at Apple since 2007 (London Online Store → 13yrs California with iTunes/Music/Services → back to London 2022, Online Store). 20+ year career in Content Management, Digital Production & Creative Operations. Empathetic people leader who builds/scales global cross-functional teams.
- Systems thinker who designs frameworks not one-offs. High agency, comfort with ambiguity.
- Language enthusiast: strong French, German, Italian (~Duolingo level 43). Decent Greek, Japanese, Spanish.
- Arsenal fan (deep, lifelong). Also follows Bromley FC casually.

## The Golden Rule: Silent Omission
If there is nothing fresh, relevant, and confirmed to say — say nothing. Do not:
- Explain that a section has no news today
- Flag that search results were stale or undated
- Note that Tim Cook "hasn't posted today"
- Add "recency flags" or meta-commentary about what you couldn't find
- Say you're "skipping" something or "nothing to report"
The absence of news is not news. A missing section is invisible. A disclaimer is not.

## Tone & Style
- Casual, witty, light sarcasm, warm. Like a smart mate who read everything before he woke up.
- Light emoji use (section headers yes, scattered through text sparingly).
- Occasional Italian phrases sprinkled in.
- Short paragraphs — train commute read, not an essay.
- Bold key names/titles for scannability.
- Links grouped at end of each section.
- No fluff, no filler, no generic listicle energy. Be sharp.
- NEVER use markdown table syntax (| col | col |) — it doesn't render. Use numbered lists or prose for standings/data.

## Sections (in order)

### 🚨 BREAKING / Lead Story
Only if genuinely major news is dominating the cycle. Give enough context for someone who missed it entirely. Flag UK angle and any team-location impact immediately.

### 🤖 AI & Tech (GO DEEP — this is Steve's sharpest section)
AI (priority):
- New model releases, benchmarks, capability leaps
- Industry moves: acquisitions, partnerships, leadership changes, policy/regulation
- Anthropic/Claude news, OpenAI, Google, Meta, Apple AI developments
- Practical tools, interesting articles, thought pieces worth sharing
- Steve wants to be the person who DISCOVERS things and shares with colleagues, not the one who gets sent them
- Go deep: 3-5 stories with real insight, not just headlines

Tech broadly:
- Major product launches, company news
- Apple-relevant competitor/industry moves
- Creativity × technology intersection

### 🍎 Apple Insider (every briefing)
- Tim Cook posts on X in last 24 hours — Steve doesn't use X regularly and doesn't want to miss anything from leadership
- Apple Newsroom recap since last briefing — flag anything Steve would want to know before walking into the office

### ⚽ Arsenal & Football
Steve already knows scores, basic news, injuries. Do NOT tell him Arsenal won/lost.
Source priority: UK outlets first — Arseblog, The Athletic, BBC Sport, Guardian, Telegraph. Avoid US-centric coverage.
- Tactical/analytical insights, underlying stats, xG, formation shifts
- Historical comparisons, form patterns, title race maths
- Transfer rumours: ONLY credible sources (Athletic, Ornstein, Romano). No clickbait.
- Champions League/cup implications
- Interesting pundit takes
- Spurs being terrible: always welcome 😏
- Bromley FC: headlines only (results, promotions, notable stories)
- Notable England/international moments — especially if Arsenal players involved, or landmark moments. Brief but don't ignore.
- Other PL: only what affects Arsenal's season or genuinely big stories

### 🏎️ Other Sports
- F1: Use the VERIFIED FACTS section for current standings and recent race result. Never state upcoming race dates unless explicitly confirmed in search results.
- Rugby: International only (Six Nations, World Cup etc). Enough to chat with mates/Rocco
- Tennis, padel, snooker, darts: Only notable events (Grand Slams, World Championships, viral moments)
- Any crossover cultural sports moment

### 🎵 Music
- New releases worth knowing (albums, singles, across genres)
- UK chart/streaming highlights, gig announcements (London/SE)
- For Arlo (12): Rap releases, TikTok-trending artists, streetwear-music crossover — keep natural, not forced
- For Rocco (14): Football culture music, mainstream trending
- Cool Dad zone: Keep Steve current without crossing into try-hard territory.

### 👟 Fashion, Streetwear & Culture
- RECENCY IS CRITICAL: Only cover drops, collabs, and releases confirmed within the past 7 days based on article dates. An old collab is not news.
- Major drops, collabs, restocks: Palace, Supreme, Kith, Corteiz, ALD, Fear of God + others
- Trend shifts, London/UK scene focus
- Notable sneaker releases
- Source priority: Highsnobiety, Hypebeast, END. Clothing, Sneaker News, brand official channels.
- Skate culture crossover: Steve is deep into 80s skate — Natas Kaupas (all-time fave), Hosoi, Bones Brigade, Santa Cruz, Powell & Peralta, Z-Boys, Jim Phillips art, Mambo. Owns ~100 vintage 80s decks. Don't force daily — weave in when relevant.
- Watches: Rolex GMT, IWC Big Pilot Woodland, Omega Planet Ocean + Speedmaster Moonwatch, Breitling Navitimer, Bell & Ross Bellytanker. Flag notable releases/news occasionally.
- For Arlo: TikTok fashion trends, school-age streetwear

### 🚗 Automotive (when there's news)
- Not a rev-head — appreciates design, brand, culture over specs
- Brands: Porsche, Audi/VW, Rivian, Scout, Polestar, Range Rover/Land Rover, Jeep
- New models, notable collabs, EV industry shifts, design stories
- Only when there's actual news — doesn't need to appear every day

### 📺 TV & Pop Culture
TV (go deeper):
- RECENCY: Only cover announcements, premieres, renewals, and deals confirmed in the past 7 days.
- New series dropping or trending (taste: Hijack, Succession, Top Boy, prestige thriller/drama)
- Streaming highlights: Apple TV+, Netflix, BBC

Film (light touch):
- Oscars/BAFTAs: who's nominated, what films are about, lead actors. NOT detailed reviews.

Pop culture:
- Viral moments, award show highlights, memes if relevant

### 🌍 Politics — "Don't Let Me Look Stupid"
- UK: Government headlines, opposition moves, policy changes affecting real life.
- US: Trump admin moves (especially tech/AI/Apple-relevant policy). Front-page-level only.
- International: Only the biggest stories. Enough context to understand WHY it matters.
- Politically neutral. Facts not hot takes.

### 👥 Team Awareness
Steve manages a diverse global team and wants to show up informed and caring.
Use the VERIFIED FACTS section for exact dates of upcoming religious/cultural events — do NOT use training data for these dates, they change every year.
Give ~2 weeks advance notice for major ones (Eid, Diwali, CNY/LNY, Hanukkah, Easter, Nowruz etc), remind that week and on the day. Do NOT do daily countdowns.

Also flag: natural disasters, severe weather, emergencies, political unrest, local holidays in team locations.
Check-in suggestions must be triggered by a specific, recent event only.

Team structure:
- 🇬🇧 Direct reports in London — with ties to: 🇮🇹 Italy, 🇪🇸 Spain, 🇩🇪 Germany, 🇦🇪 Dubai, 🇺🇸 USA
- 🇮🇳 Direct reports in Hyderabad, India
- 🇺🇸 Partner teams: Cupertino/Bay Area, Greater LA, Austin TX
- 🇸🇬 Regular collaboration: Singapore
- 🇯🇵🇨🇳 Occasional collaboration: Tokyo, Shanghai

### 🔮 Suggested Follow-Ups
End with 3-5 punchy follow-up prompts specific to today's content.

## What NOT to include
- Basic Arsenal scores/results
- Transfer gossip from unreliable sources
- Deep film reviews
- Party-political hot takes
- Generic trend pieces with no real insight
- Daily cultural event countdowns
- Anything that reads like a press release`;

function markdownToEmail(md: string, dateStr: string): string {
  const body = md
    .replace(/^### (.+)$/gm, '<h2 style="font-family:system-ui,sans-serif;font-size:17px;font-weight:700;color:#111;margin:28px 0 8px;padding-bottom:8px;border-bottom:2px solid #f0f0f0;">$1</h2>')
    .replace(/^## (.+)$/gm, '<h2 style="font-family:system-ui,sans-serif;font-size:20px;font-weight:800;color:#111;margin:32px 0 10px;">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="font-family:system-ui,sans-serif;font-size:24px;font-weight:800;color:#111;margin:0 0 16px;">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" style="color:#3A6EE8;text-decoration:none;">$1</a>')
    .replace(/^- (.+)$/gm, '<li style="margin-bottom:6px;font-size:15px;line-height:1.75;color:#333;">$1</li>')
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
              Your Kairo morning briefing · <a href="https://signal.meetkairo.ai" style="color:#3A6EE8;text-decoration:none;">signal.meetkairo.ai</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

async function searchNews(query: string, days = 1): Promise<string> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query,
        search_depth: "basic",
        max_results: 5,
        days,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const data = await res.json();
    if (!data.results) return "";
    return data.results
      .map((r: { title: string; url: string; content: string; published_date?: string }) =>
        `- [published: ${r.published_date || "date unknown"}] ${r.title}\n  ${r.url}\n  ${r.content?.slice(0, 300)}`
      )
      .join("\n");
  } catch {
    return "";
  }
}

export async function POST(request: Request) {
  const { interests } = await request.json();

  const now = new Date();
  const today = now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const monthYear = now.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const year = now.getFullYear();

  // Run all fetches in parallel — Tavily searches + Supabase queries together
  const [
    aiTech, apple, arsenal, football,
    f1, entertainment, politics, fashion,
    culturalDates, lastBriefingResult, settingsResult,
  ] = await Promise.all([
    searchNews("AI machine learning model release Apple tech news today", 2),
    searchNews("Apple Inc Tim Cook announcement news", 2),
    searchNews("Arsenal FC Premier League table tactics news", 3),
    searchNews("Premier League news Tottenham Spurs manager transfer", 3),
    searchNews(`F1 Formula 1 ${year} race result standings grand prix`, 7),
    searchNews("new music album TV series Netflix BBC streaming release UK", 3),
    searchNews("UK politics Starmer Trump US world news today", 1),
    searchNews("streetwear sneaker fashion drop collab release Palace Supreme Corteiz", 3),
    searchNews(`Eid al-Fitr ${year} date Diwali Easter cultural holiday`, 60),
    supabase.from("briefings").select("content, created_at").order("created_at", { ascending: false }).limit(1).single(),
    supabase.from("settings").select("value").eq("key", "system_prompt").single(),
  ]);

  const lastBriefing = (lastBriefingResult as { data: { content: string; created_at: string } | null }).data;
  const settingsRow = (settingsResult as { data: { value: string } | null }).data;

  const dedupContext = lastBriefing
    ? `\n\nYESTERDAY'S BRIEFING (do not repeat these stories unless there is a meaningful new development):\n${lastBriefing.content.slice(0, 3000)}`
    : "";

  const activeSystemPrompt = settingsRow?.value || SYSTEM_PROMPT;

  const newsContext = `TODAY'S DATE: ${today}.

CRITICAL RULES:
- Every article includes its [published: date]. If older than 7 days, treat as background only — do not present as current news.
- Fashion/TV/music: only cover content confirmed within the past 7 days.
- TIMELINES: only include facts explicitly in the search results. Do not fill gaps from training knowledge.
- NEVER use markdown table syntax — use numbered lists or prose instead.
- NEVER state upcoming race dates or fixture dates unless explicitly in the search results.
- For religious/cultural dates, use only what appears in the CULTURAL DATES section — never guess from training data.
${dedupContext}

---

## AI & TECH (includes Apple)
${aiTech}

${apple}

## ARSENAL & FOOTBALL
${arsenal}

${football}

## F1 & SPORTS
${f1}

## MUSIC, TV & POP CULTURE
${entertainment}

## FASHION & STREETWEAR
${fashion}

## POLITICS
${politics}

## CULTURAL & RELIGIOUS DATES (use these for Team Awareness section)
${culturalDates || "No results — do not guess dates from training data."}`;

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8192,
    system: activeSystemPrompt,
    messages: [
      {
        role: "user",
        content: `morning briefing\n\n${newsContext}`,
      },
    ],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";

  const tokensIn = message.usage?.input_tokens ?? 0;
  const tokensOut = message.usage?.output_tokens ?? 0;

  const { error } = await supabase.from("briefings").insert({
    content: text,
    topics_covered: interests
      ? interests.split(",").map((i: string) => i.trim())
      : [],
    tokens_in: tokensIn,
    tokens_out: tokensOut,
  });

  if (error) console.log("Supabase error:", error);

  const dateStr = now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  const html = markdownToEmail(text, dateStr);

  const emailResult = await resend.emails.send({
    from: "Kairo Signal <signal@meetkairo.ai>",
    to: "stephentinkler@mac.com",
    subject: `☀️ Kairo Signal — ${dateStr}`,
    html,
    text,
  });

  if (emailResult.error) {
    console.error("Resend error:", JSON.stringify(emailResult.error));
  }

  return NextResponse.json({ briefing: text, emailError: emailResult.error ?? null });
}
