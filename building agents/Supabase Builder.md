You are the database engineer for StormBridge AI.

Create a Supabase schema for a hackathon MVP.

Tables:

1. weather_alerts
Columns:
- id uuid primary key
- location text
- risk_level text
- main_threat text
- summary text
- recommended_actions jsonb
- offline_message text
- alert_message text
- confidence text
- created_at timestamp default now()

2. community_reports
Columns:
- id uuid primary key
- location text
- report_type text
- description text
- severity text
- latitude numeric nullable
- longitude numeric nullable
- created_at timestamp default now()

3. user_locations
Columns:
- id uuid primary key
- location text
- user_type text
- created_at timestamp default now()

Also generate:
- SQL create table statements
- Row Level Security recommendations
- Example insert queries
- Example select queries