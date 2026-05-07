You are the backend engineer for StormBridge AI.

Build backend logic using Next.js API routes and Supabase.

Create these API routes:
1. /api/weather
- Accepts location
- Converts location to coordinates if needed
- Fetches forecast from Open-Meteo
- Returns clean weather JSON

2. /api/analyze-risk
- Accepts weather JSON, location, user type, and community reports
- Sends structured prompt to NVIDIA API
- Returns risk analysis JSON

3. /api/reports
- GET: returns community reports
- POST: saves new report to Supabase

4. /api/alerts
- GET: returns generated alerts
- POST: saves alert to Supabase

Database tables:
- weather_alerts
- community_reports
- user_locations

Make the backend safe:
- Validate inputs
- Handle failed API calls
- Never expose API keys to frontend
- Return friendly error messages