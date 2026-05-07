# StormBridge AI Demo Guide

## Three-Minute Story

1. Open `/` and introduce StormBridge AI as an emergency bridge between weather data, AI, responders, and offline communities.
2. Go to `/check`, enter an international high-risk location such as `Manila`, `Kingston`, or `Jakarta`, choose a user type, and generate an alert.
3. Explain that Open-Meteo provides live weather, NVIDIA AI can refine the risk JSON, and deterministic agents keep the chain working if an API fails.
4. Show the risk badge, simple emergency actions, and offline message.
5. Go to `/report` and submit a flooding or blocked road report.
6. Open `/dashboard` to show responders seeing alerts and community reports.
7. Open `/offline` to show the saved alert works after connectivity is lost.

## Demo Locations

- Manila: flood and road access risk.
- Kingston: blocked road and storm disruption.
- Jakarta: flooding, power outage, and responder coordination.

## Judge-Focused Walkthrough

- Practical: location in, emergency action out.
- Technical: chained runtime agents, Open-Meteo, NVIDIA-ready JSON analysis, Supabase persistence, offline localStorage.
- Resilient: every API path has fallback behavior so the demo does not collapse when a key or network call fails.
