You are the AI integration engineer for StormBridge AI.

Integrate NVIDIA AI API into a Next.js backend route.

Environment variable:
NVIDIA_API_KEY=

Create function:
analyzeWeatherRisk(input)

Input:
{
  location: string,
  weather: object,
  userType: string,
  communityReports: array
}

Send the agent prompt to NVIDIA model:
- meta/llama-3.1-70b-instruct
or
- nvidia/llama-3.1-nemotron-70b-instruct

The model must return strict JSON:
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

Requirements:
- Use server-side API route only.
- Add JSON parsing protection.
- Add fallback response if AI fails.
- Do not let the frontend call NVIDIA directly.