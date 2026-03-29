import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

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
