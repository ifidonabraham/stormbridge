# StormBridge AI

StormBridge AI is an international hackathon MVP for weather intelligence, disaster preparedness, AI risk analysis, community reports, and offline accessibility.

## Current Project Status

- Supabase is already connected to the existing `contactfeed` project.
- The StormBridge tables are already created in Supabase.
- Open-Meteo works without an API key.
- NVIDIA is configured through server-side environment variables.
- The app keeps working with deterministic fallback agents if any provider fails.

## Runtime Agent Chain

`master orchestrator -> weather intelligence -> disaster response -> community intelligence -> offline accessibility -> notification and escalation -> translation`

The chain lives in `src/lib/agents/chain.ts` and always returns the required JSON shape.

## Environment Variables

The local `.env.local` is already populated for this workspace. For Vercel, add:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NVIDIA_API_KEY=
NVIDIA_RISK_API_KEY=
NVIDIA_EMBEDDING_API_KEY=
NVIDIA_VISION_API_KEY=
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_RISK_MODEL=meta/llama-3.1-70b-instruct
NVIDIA_EMBEDDING_MODEL=nvidia/nv-embedqa-e5-v5
NVIDIA_VISION_MODEL=meta/llama-3.2-90b-vision-instruct
```

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Pages

- `/`: premium product entry page.
- `/check`: location input, user type selector, weather risk result.
- `/report`: community hazard report form.
- `/dashboard`: responder dashboard showing alerts and reports.
- `/offline`: last saved alert and emergency checklist.

## API Routes

- `POST /api/weather`
- `POST /api/analyze-risk`
- `GET /api/reports`
- `POST /api/reports`
- `GET /api/alerts`
- `GET /api/integrations/status`

## AI Output JSON

```json
{
  "location": "",
  "risk_level": "Low | Medium | High | Critical",
  "main_threat": "",
  "summary": "",
  "recommended_actions": [],
  "offline_message": "",
  "alert_message": "",
  "affected_groups": [],
  "confidence": "Low | Medium | High"
}
```

## Deploy To Vercel

1. Push the repo to GitHub.
2. Import it in Vercel.
3. Add the environment variables above.
4. Deploy and test `/check`, `/report`, `/dashboard`, and `/offline`.

## Provider Notes

- Risk guidance uses the NVIDIA risk model key.
- Embeddings and vision keys are separated so future report clustering and image/satellite analysis do not block the core chain.
- Supabase stores alerts, reports, and user location checks.
- localStorage keeps the latest alert available offline.
