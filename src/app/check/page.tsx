"use client";

import { useState } from "react";
import { Loader2, MapPin, Sparkles } from "lucide-react";
import { EmptyState, PageShell, Panel, RiskBadge, StatusIcon } from "@/components/ui";
import type { RiskAnalysis, UserType, WeatherSnapshot } from "@/lib/types";

const userTypes: Array<{ value: UserType; label: string }> = [
  { value: "citizen", label: "Citizen" },
  { value: "farmer", label: "Farmer" },
  { value: "school", label: "School" },
  { value: "transporter", label: "Transporter" },
  { value: "health_worker", label: "Health worker" },
  { value: "responder", label: "Responder" },
];

type ApiResult = {
  weather: WeatherSnapshot;
  analysis: RiskAnalysis;
};

export default function CheckPage() {
  const [location, setLocation] = useState("");
  const [userType, setUserType] = useState<UserType>("citizen");
  const [result, setResult] = useState<ApiResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/analyze-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location, userType }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Risk check failed");
      setResult(data);
      localStorage.setItem("stormbridge:last-alert", JSON.stringify({ ...data.analysis, weather: data.weather, saved_at: new Date().toISOString() }));
    } catch (err) {
      const saved = localStorage.getItem("stormbridge:last-alert");
      if (saved) {
        const parsed = JSON.parse(saved);
        setResult({ weather: parsed.weather, analysis: parsed });
        setError("Live check failed. Showing the last saved alert.");
      } else {
        setError(err instanceof Error ? err.message : "Live check failed.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-sm font-semibold text-emergency-green">Risk analysis</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl">Analyze a location</h1>
        <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-400">Generate weather-aware emergency guidance with offline-ready actions and responder visibility.</p>
      </div>
      <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
        <Panel>
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Signal input</h2>
          <form onSubmit={submit} className="mt-5 grid gap-4">
            <label className="grid gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Location
              <span className="flex items-center gap-2 rounded-2xl border border-black/10 bg-white px-4 py-3 shadow-soft dark:border-white/10 dark:bg-white/[0.04]">
                <MapPin size={18} className="text-emergency-green" />
                <input className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-slate-400" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Enter any city, town, village, or landmark" />
              </span>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              User type
              <select className="focus-ring rounded-2xl border border-black/10 bg-white px-4 py-3 shadow-soft dark:border-white/10 dark:bg-slate-950" value={userType} onChange={(event) => setUserType(event.target.value as UserType)}>
                {userTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </label>
            <button className="focus-ring inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white shadow-soft transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-slate-950" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              Generate alert
            </button>
          </form>
          {error && <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 dark:bg-amber-500/10 dark:text-amber-200">{error}</p>}
        </Panel>

        <Panel>
          {!result ? (
            <EmptyState title="No alert yet" text="Enter a location to run the full agent chain and save an offline alert." />
          ) : (
            <div className="grid gap-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-emergency-green">{result.analysis.location}</p>
                  <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">{result.analysis.main_threat}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <StatusIcon level={result.analysis.risk_level} />
                  <RiskBadge level={result.analysis.risk_level} />
                </div>
              </div>
              <p className="leading-7 text-slate-600 dark:text-slate-300">{result.analysis.summary}</p>
              <div className="grid gap-2">
                <h3 className="font-semibold text-slate-950 dark:text-white">Recommended actions</h3>
                {result.analysis.recommended_actions.map((action) => (
                  <p key={action} className="rounded-2xl border border-black/5 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
                    {action}
                  </p>
                ))}
              </div>
              <div className="rounded-2xl bg-slate-950 p-5 text-white shadow-soft dark:bg-white dark:text-slate-950">
                <p className="text-sm font-semibold opacity-60">Offline message</p>
                <p className="mt-1 leading-7">{result.analysis.offline_message}</p>
              </div>
              {result.analysis.meta && (
                <div className="rounded-2xl border border-black/5 bg-slate-50 p-4 text-sm dark:border-white/10 dark:bg-white/[0.04]">
                  <p className="font-semibold text-slate-950 dark:text-white">Guidance source: {result.analysis.meta.ai_available ? "AI-enhanced analysis" : "Safety fallback analysis"}</p>
                  {!result.analysis.meta.ai_available && <p className="mt-1 text-slate-600 dark:text-slate-400">Live guidance is still available while advanced AI analysis is unavailable.</p>}
                </div>
              )}
              <div className="grid gap-2 text-sm text-slate-500 dark:text-slate-400 sm:grid-cols-4">
                <Metric label="Rain" value={`${result.weather.rainfall ?? "?"} mm`} />
                <Metric label="Wind" value={`${result.weather.wind_speed ?? "?"} km/h`} />
                <Metric label="Temp" value={`${result.weather.temperature ?? "?"} C`} />
                <Metric label="Confidence" value={result.analysis.confidence} />
              </div>
            </div>
          )}
        </Panel>
      </div>
    </PageShell>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white/70 p-4 shadow-soft dark:border-white/10 dark:bg-white/[0.04]">
      <p className="font-semibold text-slate-950 dark:text-white">{value}</p>
      <p>{label}</p>
    </div>
  );
}
