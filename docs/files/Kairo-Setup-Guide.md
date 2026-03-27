# Kairo v0.5 — Setup Guide

## What you're deploying

A Next.js app on Vercel that:
1. Runs a cron job every day at 4am UTC
2. Fetches personalised news via Tavily search
3. Generates a briefing via Claude API
4. Deduplicates against yesterday's stories
5. Sends you a formatted email via Resend

## Prerequisites

You'll need accounts (all have free tiers) at:
- **Vercel** — vercel.com (hosting + cron)
- **Supabase** — supabase.com (database)
- **Anthropic** — console.anthropic.com (Claude API — needs credits, ~2-5p per briefing)
- **Tavily** — tavily.com (search API — 1,000 free searches/month)
- **Resend** — resend.com (email — 100 free emails/day)

## Step-by-step

### 1. Create Supabase project
- Go to supabase.com, create a new project
- Go to SQL Editor > New Query
- Paste the contents of `supabase-schema.sql`
- **Replace `YOUR_EMAIL_HERE`** with your actual email
- Run the query
- Go to Project Settings > API and copy your **Project URL** and **service_role key** (not the anon key)

### 2. Get API keys
- **Anthropic**: console.anthropic.com > API Keys > Create Key
- **Tavily**: tavily.com > Dashboard > API Key
- **Resend**: resend.com > API Keys > Create Key
  - Also: set up a sending domain in Resend (Settings > Domains) or use their test domain for now

### 3. Set up the project locally
```bash
# Clone or copy the kairo-v05 folder
cd kairo-v05
npm install

# Copy env template and fill in your keys
cp .env.example .env.local
# Edit .env.local with your actual keys

# Generate a random CRON_SECRET
echo "CRON_SECRET=$(openssl rand -hex 32)" >> .env.local
```

### 4. Test locally
```bash
npm run dev
# App runs at http://localhost:3000

# Test briefing generation (in another terminal):
curl -X POST http://localhost:3000/api/test-briefing \
  -H "Content-Type: application/json" \
  -d '{"pulse": "morning", "send": true}'
```

This will generate a real briefing and email it to you. Check your inbox!

### 5. Deploy to Vercel
```bash
# Install Vercel CLI if needed
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# Settings > Environment Variables > add all from .env.local

# For the cron to work, add CRON_SECRET to Vercel env vars
# The cron endpoint checks: Authorization: Bearer {CRON_SECRET}
```

### 6. Set up cron

The `vercel.json` file configures a cron at `0 4 * * *` (4am UTC = 5am BST).
Vercel Pro plan is needed for cron jobs. On the free plan, you can use:
- **cron-job.org** (free) — set up a GET request to:
  `https://your-app.vercel.app/api/cron/generate-briefing`
  with header: `Authorization: Bearer YOUR_CRON_SECRET`
  Schedule: daily at 04:00 UTC

## File structure

```
kairo-v05/
  supabase-schema.sql     — Database schema + seed data
  .env.example            — Environment variable template
  vercel.json             — Cron configuration
  package.json            — Dependencies
  src/
    lib/
      supabase.ts         — Database client
      tavily.ts           — News search wrapper
      dedup.ts            — Story deduplication engine
      briefing-engine.ts  — Core: fetches news, builds prompt, calls Claude, renders email
      email.ts            — Resend email sender
    app/
      page.tsx            — Simple homepage
      layout.tsx          — Root layout
      api/
        cron/
          generate-briefing/
            route.ts      — Cron endpoint (runs daily)
        test-briefing/
          route.ts        — Manual test endpoint
```

## Testing & debugging

**Test manually:**
```bash
curl -X POST https://your-app.vercel.app/api/test-briefing \
  -H "Content-Type: application/json" \
  -d '{"pulse": "morning"}'
```
The response includes the full HTML — paste it into a browser to preview.

**Check Supabase:**
- `briefings` table — see generated briefings and their status
- `story_memory` table — see dedup history
- `user_interests` table — tweak your preferences

**Adjust your interests:**
Edit rows in `user_interests` directly in Supabase dashboard.
Change depth, expertise, subcategories, sources — the next briefing picks up the changes.

## Costs

At one briefing per day:
- Claude API: ~2-5p/day (~£1-1.50/month)
- Tavily: ~30-50 searches/day (well within free tier of 1,000/month)
- Resend: 1 email/day (well within free tier)
- Supabase: free tier is plenty
- Vercel: free tier works (use external cron if needed)

**Total: ~£1-2/month** for your personal AI chief of staff.

## Next steps (v0.6+)

- [ ] Audio via ElevenLabs
- [ ] Midday + evening pulses (separate cron times)
- [ ] Web preview page (view briefing in browser)
- [ ] Fancy onboarding UI (the bubble picker we built!)
- [ ] Source preference tuning based on feedback
- [ ] RSS podcast feed for audio
