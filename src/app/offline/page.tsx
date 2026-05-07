"use client";

import { useEffect, useState } from "react";
import { CheckSquare, WifiOff } from "lucide-react";
import { EmptyState, PageHeader, PageShell, Panel, RiskBadge } from "@/components/ui";
import type { RiskAnalysis, WeatherSnapshot } from "@/lib/types";

type SavedAlert = RiskAnalysis & { weather?: WeatherSnapshot; saved_at?: string };

const checklist = [
  "Keep phone charged and save emergency numbers.",
  "Move medicine, documents, and food above floor level.",
  "Avoid bridges, drains, and flooded roads.",
  "Check on children, elderly people, and people with disabilities.",
  "Follow official local responder instructions.",
];

export default function OfflinePage() {
  const [saved, setSaved] = useState<SavedAlert | null>(null);

  useEffect(() => {
    const item = localStorage.getItem("stormbridge:last-alert");
    if (item) setSaved(JSON.parse(item));
  }, []);

  return (
    <PageShell>
      <PageHeader eyebrow="Continuity" title="Offline guidance" description="Keep the latest alert and baseline emergency checklist available when connectivity is unreliable." />
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
    </PageShell>
  );
}
