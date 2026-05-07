"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, MapPin, Save, Sparkles } from "lucide-react";
import { EmptyState, PageHeader, PageShell, Panel, PrimaryButton, RiskBadge, StatusIcon } from "@/components/ui";
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
  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setToast("Fetching weather data and preparing AI analysis...");

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
      setSaved(true);
      setToast("AI guidance generated and saved to offline memory.");
    } catch (err) {
      const saved = localStorage.getItem("stormbridge:last-alert");
      if (saved) {
        const parsed = JSON.parse(saved);
        setResult({ weather: parsed.weather, analysis: parsed });
        setError("Live check failed. Showing the last saved alert.");
        setToast("Fallback mode active. Showing latest saved alert.");
      } else {
        setError(err instanceof Error ? err.message : "Live check failed.");
        setToast("Analysis failed. Check location or provider status.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow="Risk analysis"
        title="Analyze a location"
        mobileTitle="Check risk"
        description="Generate weather-aware emergency guidance with offline-ready actions and responder visibility."
        mobileDescription="Enter a location and get emergency guidance."
      />
      {toast && (
        <div className="mb-4 rounded-xl border border-black/5 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-soft dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300">
          {loading ? "Processing: " : "Update: "}
          {toast}
        </div>
      )}
      <section className="mb-4 grid grid-cols-2 gap-2 sm:mb-6 md:grid-cols-6">
        {["Location", "User group", "Weather", "Risk level", "AI guidance", "Save alert"].map((step, index) => (
          <div key={step} className="rounded-xl border border-black/5 bg-white p-3 text-sm dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Step {index + 1}</p>
            <p className="mt-1 font-medium text-slate-950 dark:text-white">{step}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{loading && index >= 2 ? "Processing" : result && index >= 2 ? "Complete" : index < 2 ? "Required" : "Pending"}</p>
          </div>
        ))}
      </section>
      <div className="grid gap-4 lg:grid-cols-[0.78fr_1.22fr] lg:gap-5">
        <Panel>
          <h2 className="text-lg font-semibold text-slate-950 dark:text-white">Signal input</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">What location and audience should the chain evaluate?</p>
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
            <PrimaryButton className="w-full py-3" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              Fetch weather and generate guidance
            </PrimaryButton>
          </form>
          {error && <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 dark:bg-amber-500/10 dark:text-amber-200">{error}</p>}
        </Panel>

        <Panel className="min-h-[300px] sm:min-h-[420px]">
          {!result ? (
            <EmptyState title="No alert yet" text="Enter a location to run the full agent chain and save an offline alert." />
          ) : (
            <div className="grid gap-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-emergency-green">{result.analysis.location}</p>
                  <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-3xl">{result.analysis.main_threat}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <StatusIcon level={result.analysis.risk_level} />
                  <RiskBadge level={result.analysis.risk_level} />
                </div>
              </div>
              <div className="grid gap-3 rounded-2xl border border-black/5 bg-slate-50 p-4 text-sm dark:border-white/10 dark:bg-white/[0.04] sm:grid-cols-2">
                <Metric label="Weather summary" value={`${result.weather.weather_condition}, ${result.weather.temperature ?? "?"} C`} />
                <Metric label="Main threats" value={result.analysis.main_threat} />
                <Metric label="Most vulnerable" value={result.analysis.affected_groups.join(", ") || "Residents"} />
                <Metric label="Responder status" value={saved ? "Saved to queue" : "Ready to save"} />
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
              <div className="grid gap-2">
                <h3 className="font-semibold text-slate-950 dark:text-white">Offline-safe checklist</h3>
                {["Keep phone charged", "Avoid unsafe roads", "Check vulnerable people", "Follow local responder instructions"].map((item) => (
                  <p key={item} className="flex items-center gap-2 rounded-xl border border-black/5 bg-white px-3 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
                    <CheckCircle2 size={15} className="text-emergency-green" />
                    {item}
                  </p>
                ))}
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
              <div className="grid gap-2 border-t border-black/5 pt-4 dark:border-white/10 sm:flex sm:flex-wrap sm:gap-3">
                <PrimaryButton
                  type="button"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    localStorage.setItem("stormbridge:last-alert", JSON.stringify({ ...result.analysis, weather: result.weather, saved_at: new Date().toISOString() }));
                    setSaved(true);
                    setToast("Alert saved locally and ready for offline access.");
                  }}
                >
                  <Save size={16} />
                  Save Alert
                </PrimaryButton>
                <Link href="/dashboard" className="focus-ring inline-flex w-full items-center justify-center rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-soft dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 sm:w-auto">
                  View in Response Dashboard
                </Link>
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
