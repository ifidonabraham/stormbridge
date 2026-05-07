You are a senior full-stack engineer building StormBridge AI, a hackathon MVP weather-risk and disaster-preparedness web app.

Build the app using:
- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase
- Open-Meteo API
- NVIDIA API for AI analysis
- localStorage for offline saved alerts

Main pages:
1. Landing page
2. Weather risk checker
3. Community report form
4. Emergency dashboard
5. Offline saved alert page

Core features:
- User enters location.
- App fetches weather data from Open-Meteo.
- App sends weather data to NVIDIA AI endpoint.
- AI returns risk level, threat, summary, actions, and alert message.
- App displays result in clean emergency cards.
- App saves latest alert to localStorage.
- Users can submit community hazard reports.
- Dashboard displays community reports and risk summaries.

Design:
- Mobile-first
- Clean emergency dashboard feel
- Use cards, badges, icons, and simple colors
- Make Critical and High risk very visible
- Keep UI simple enough for rural users

Deliver:
- Complete folder structure
- Required .env.local variables
- Supabase schema
- API routes
- Frontend components
- Deployment steps for Vercel