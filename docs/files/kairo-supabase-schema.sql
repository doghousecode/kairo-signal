-- ============================================
-- KAIRO v0.5 — Supabase Schema
-- ============================================
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

create extension if not exists "uuid-ossp";

-- ─── USERS ───
create table public.users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  name text not null,
  role text,
  industry text,
  company text,
  timezone text default 'Europe/London',
  created_at timestamptz default now()
);

-- ─── USER INTERESTS ───
create table public.user_interests (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  category text not null,
  priority int default 0,
  depth text default 'briefing',
  expertise text default 'sharp',
  subcategories jsonb default '{}',
  trusted_sources text[] default '{}',
  blocked_sources text[] default '{}',
  locale text default 'UK',
  created_at timestamptz default now(),
  unique(user_id, category)
);

-- ─── USER SCHEDULE ───
create table public.user_schedule (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  pulse_type text not null,
  enabled boolean default true,
  delivery_time time not null,
  audio_enabled boolean default false,
  created_at timestamptz default now(),
  unique(user_id, pulse_type)
);

-- ─── BRIEFINGS ───
create table public.briefings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  date date not null default current_date,
  pulse_type text not null,
  content_html text,
  content_text text,
  content_json jsonb,
  sources_json jsonb,
  audio_url text,
  status text default 'pending',
  generated_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz default now(),
  unique(user_id, date, pulse_type)
);

-- ─── STORY MEMORY ───
create table public.story_memory (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade,
  story_hash text not null,
  headline text not null,
  source text,
  url text,
  first_seen_at timestamptz default now(),
  last_seen_at timestamptz default now(),
  last_pulse text,
  evolution_count int default 0,
  created_at timestamptz default now(),
  unique(user_id, story_hash)
);

-- ─── INDEXES ───
create index idx_interests_user on public.user_interests(user_id);
create index idx_schedule_user on public.user_schedule(user_id);
create index idx_briefings_user_date on public.briefings(user_id, date);
create index idx_story_memory_user_hash on public.story_memory(user_id, story_hash);
create index idx_story_memory_user_seen on public.story_memory(user_id, last_seen_at);

-- ─── SEED YOUR PROFILE ───
insert into public.users (id, email, name, role, industry, company, timezone)
values (
  '00000000-0000-0000-0000-000000000001',
  'YOUR_EMAIL_HERE',
  'Steve',
  'Senior Director, Marketing & Creative Ops',
  'Tech / Media',
  'Apple',
  'Europe/London'
);

insert into public.user_interests (user_id, category, priority, depth, expertise, subcategories, trusted_sources, blocked_sources, locale) values
('00000000-0000-0000-0000-000000000001', 'news', 0, 'briefing', 'explain', '{"uk_news": 0, "world": 0}', '{"BBC News","Reuters","The Guardian","AP","Financial Times"}', '{"Daily Mail","InfoWars"}', 'UK'),
('00000000-0000-0000-0000-000000000001', 'ai_tech', 2, 'deep_dive', 'sharp', '{"llms": 1, "apple_tech": 1, "startups": 0}', '{"The Verge","Ars Technica","TechCrunch","MIT Technology Review","Wired"}', '{}', 'US'),
('00000000-0000-0000-0000-000000000001', 'football', 0, 'headlines', 'expert', '{"arsenal": 1, "prem": 0, "ucl": 0}', '{"The Athletic","BBC Sport","The Guardian","Sky Sports"}', '{"The Sun","Daily Star","90min","Caught Offside"}', 'UK'),
('00000000-0000-0000-0000-000000000001', 'music', 1, 'briefing', 'sharp', '{"hiphop": 0, "electronic": 0, "newreleases": 1}', '{"Pitchfork","NME","Rolling Stone"}', '{}', 'UK'),
('00000000-0000-0000-0000-000000000001', 'politics', 0, 'briefing', 'explain', '{"uk_pol": 0, "us_pol": 0}', '{"BBC News","Financial Times","The Economist"}', '{"Daily Mail","InfoWars","Breitbart"}', 'UK'),
('00000000-0000-0000-0000-000000000001', 'automotive', 0, 'headlines', 'sharp', '{"ev": 0, "f1": 1}', '{"Top Gear","Autocar","Evo"}', '{}', 'UK'),
('00000000-0000-0000-0000-000000000001', 'fashion', 0, 'headlines', 'sharp', '{"streetwear": 0, "sneakers": 1}', '{"Highsnobiety","GQ","Dazed"}', '{}', 'UK'),
('00000000-0000-0000-0000-000000000001', 'culture', 0, 'briefing', 'sharp', '{"film": 0, "tv": 0, "gaming": 0}', '{}', '{}', 'UK');

insert into public.user_schedule (user_id, pulse_type, enabled, delivery_time, audio_enabled) values
('00000000-0000-0000-0000-000000000001', 'morning', true, '06:30', true),
('00000000-0000-0000-0000-000000000001', 'midday', true, '12:30', false),
('00000000-0000-0000-0000-000000000001', 'evening', false, '18:00', false);

alter table public.users enable row level security;
alter table public.user_interests enable row level security;
alter table public.user_schedule enable row level security;
alter table public.briefings enable row level security;
alter table public.story_memory enable row level security;
