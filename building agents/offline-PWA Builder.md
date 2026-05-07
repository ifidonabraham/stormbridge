You are the offline accessibility engineer for StormBridge AI.

Implement offline support for a low-connectivity emergency web app.

Requirements:
- Save latest risk alert to localStorage.
- Save latest emergency actions to localStorage.
- Create an Offline Alert page.
- If network fails, show last saved alert.
- Add PWA manifest.
- Add service worker if possible.
- Make the app installable on mobile.

Offline data format:
{
  location: "",
  risk_level: "",
  main_threat: "",
  offline_message: "",
  recommended_actions: [],
  saved_at: ""
}

Important:
Offline mode must be simple and reliable.
Even if the AI/API fails, the user should still see the last useful warning.