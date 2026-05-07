create extension if not exists "pgcrypto";

create table if not exists public.weather_alerts (
  id uuid primary key default gen_random_uuid(),
  location text not null,
  risk_level text not null check (risk_level in ('Low', 'Medium', 'High', 'Critical')),
  main_threat text not null,
  summary text not null,
  recommended_actions jsonb not null default '[]'::jsonb,
  offline_message text not null,
  alert_message text not null,
  confidence text not null check (confidence in ('Low', 'Medium', 'High')),
  created_at timestamptz not null default now()
);

create table if not exists public.community_reports (
  id uuid primary key default gen_random_uuid(),
  location text not null,
  report_type text not null,
  description text not null,
  severity text not null default 'Medium' check (severity in ('Low', 'Medium', 'High', 'Critical')),
  latitude numeric null,
  longitude numeric null,
  created_at timestamptz not null default now()
);

create table if not exists public.user_locations (
  id uuid primary key default gen_random_uuid(),
  location text not null,
  user_type text not null,
  created_at timestamptz not null default now()
);

alter table public.weather_alerts enable row level security;
alter table public.community_reports enable row level security;
alter table public.user_locations enable row level security;

drop policy if exists "Read weather alerts" on public.weather_alerts;
create policy "Read weather alerts"
on public.weather_alerts for select
using (true);

drop policy if exists "Read community reports" on public.community_reports;
create policy "Read community reports"
on public.community_reports for select
using (true);

drop policy if exists "Submit community reports" on public.community_reports;
create policy "Submit community reports"
on public.community_reports for insert
with check (true);

-- Server routes use SUPABASE_SERVICE_ROLE_KEY for weather_alerts and user_locations inserts.
-- Keep direct client inserts disabled for those tables in production.

insert into public.community_reports (location, report_type, description, severity)
values
  ('Manila, Philippines', 'flooding', 'Water is rising near homes along a low road.', 'High'),
  ('Kingston, Jamaica', 'blocked road', 'A main road is blocked after heavy rain and debris.', 'Medium'),
  ('Jakarta, Indonesia', 'power outage', 'Power is out after strong wind near the river district.', 'Medium')
on conflict do nothing;

insert into public.weather_alerts (location, risk_level, main_threat, summary, recommended_actions, offline_message, alert_message, confidence)
values (
  'Manila, Philippines',
  'High',
  'Flooding',
  'Heavy rainfall and community reports point to rising flood risk near low roads.',
  '["Avoid flooded streets", "Move valuables above floor level", "Check on vulnerable neighbours"]'::jsonb,
  'High flood risk. Avoid flooded roads, move important items higher, and keep phones charged.',
  'High flood risk reported. Avoid flooded roads and move to safer ground if water rises.',
  'Medium'
)
on conflict do nothing;

-- Example queries:
-- select * from public.weather_alerts order by created_at desc limit 20;
-- select * from public.community_reports where location ilike '%Manila%' order by created_at desc;
