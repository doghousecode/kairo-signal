import { NextResponse } from "next/server";

export const maxDuration = 120;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const baseUrl = "https://signal.meetkairo.ai";

  const res = await fetch(`${baseUrl}/api/briefing`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ interests: "AI, Arsenal, Apple, fashion, automotive" }),
  });

  const responseText = await res.text();

  if (!res.ok) {
    console.error("Briefing API error:", res.status, responseText.slice(0, 500));
    return NextResponse.json({ error: "Briefing API failed", status: res.status, detail: responseText.slice(0, 200) }, { status: 500 });
  }

  let data;
  try {
    data = JSON.parse(responseText);
  } catch {
    console.error("JSON parse error:", responseText.slice(0, 500));
    return NextResponse.json({ error: "Invalid JSON from briefing API", detail: responseText.slice(0, 200) }, { status: 500 });
  }

  return NextResponse.json({ ok: true, length: data.briefing?.length });
}
