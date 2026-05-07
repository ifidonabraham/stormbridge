"use client";

import { useEffect, useState } from "react";
import { CheckSquare, RefreshCw, Trash2, WifiOff } from "lucide-react";
import { EmptyState, PageHeader, PageShell, Panel, RiskBadge, SecondaryButton, StatCard } from "@/components/ui";
import type { RiskAnalysis, WeatherSnapshot } from "@/lib/types";

type SavedAlert = RiskAnalysis & { weather?: WeatherSnapshot; saved_at?: string };

const checklist = [
  "Keep phone charged and save emergency numbers.",
  "Move medicine, documents, and food above floor level.",
  "Avoid bridges, drains, and flooded roads.",
  "Check on children, elderly people, and people with disabilities.",
  "Follow official local responder instructions.",
];

const phaseGuidance = {
  Before: ["Charge phones and power banks", "Move documents and medicine to a safe place", "Share the latest alert with household members"],
  During: ["Avoid flooded roads and unstable structures", "Stay near trusted information sources", "Keep children and vulnerable people close"],
  After: ["Check injuries and blocked access routes", "Report hazards to responders", "Do not return until the area is safe"],
};

export default function OfflinePage() {
  const [saved, setSaved] = useState<SavedAlert | null>(null);

  useEffect(() => {
    const item = localStorage.getItem("stormbridge:last-alert");
    if (item) setSaved(JSON.parse(item));
  }, []);

  function clearSaved() {
    localStorage.removeItem("stormbridge:last-alert");
    setSaved(null);
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow="Offline guidance"
        title="Continuity plan"
        description="Keep the latest alert and baseline emergency checklist available when connectivity is unreliable."
        action={
          <div className="flex flex-wrap gap-2">
            <SecondaryButton type="button" onClick={() => window.location.reload()}><RefreshCw size={15} />Update view</SecondaryButton>
            <SecondaryButton type="button" onClick={clearSaved} disabled={!saved}><Trash2 size={15} />Clear saved guidance</SecondaryButton>
          </div>
        }
      />
      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <StatCard label="Storage status" value={saved ? "Available" : "Empty"} detail="Browser localStorage" />
        <StatCard label="Latest alert" value={saved?.risk_level ?? "None"} detail={saved?.location ?? "Run analysis first"} />
        <StatCard label="Offline checklist" value={`${checklist.length} items`} detail="Before, during, after guidance" />
      </section>
      <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <Panel>
          <div className="mb-4 flex items-center gap-2">
            <WifiOff className="text-emergency-green" />
            <h2 className="font-semibold text-slate-950 dark:text-white">Saved alert</h2>
          </div>
          {!saved ? (
            <EmptyState title="No saved alert" text="Run a check once while online. StormBridge will keep the latest alert here." />
          ) : (
            <div className="grid gap-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-950 dark:text-white">{saved.location}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{saved.main_threat}</p>
                </div>
                <RiskBadge level={saved.risk_level} />
              </div>
              <p className="rounded-2xl bg-slate-950 p-4 leading-7 text-white dark:bg-white dark:text-slate-950">{saved.offline_message}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Saved: {saved.saved_at ? new Date(saved.saved_at).toLocaleString() : "recently"}</p>
            </div>
          )}
        </Panel>
        <Panel>
          <div className="mb-4 flex items-center gap-2">
            <CheckSquare className="text-emergency-green" />
            <h2 className="font-semibold text-slate-950 dark:text-white">Emergency checklist</h2>
          </div>
          <div className="grid gap-2">
            {checklist.map((item) => (
              <p key={item} className="rounded-xl border border-black/5 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
                {item}
              </p>
            ))}
          </div>
        </Panel>
      </div>
      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {Object.entries(phaseGuidance).map(([phase, items]) => (
          <Panel key={phase}>
            <h2 className="font-semibold text-slate-950 dark:text-white">{phase}</h2>
            <div className="mt-3 space-y-2">
              {items.map((item) => (
                <p key={item} className="rounded-xl border border-black/5 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">{item}</p>
              ))}
            </div>
          </Panel>
        ))}
      </section>
    </PageShell>
  );
}
