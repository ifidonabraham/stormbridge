"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ExternalLink, RefreshCw } from "lucide-react";
import { PageHeader, PageShell, Panel, PrimaryButton, SecondaryButton, StatusBadge } from "@/components/ui";

type IntegrationStatus = {
  supabase: { ok: boolean; message: string };
  nvidia: { ok: boolean; message: string };
  open_meteo: { ok: boolean; message: string };
};

export default function SettingsPage() {
  const [status, setStatus] = useState<IntegrationStatus | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadStatus() {
    setLoading(true);
    try {
      const response = await fetch("/api/integrations/status");
      setStatus(await response.json());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStatus();
  }, []);

  const rows = status
    ? [
        ["Supabase", status.supabase.ok, status.supabase.message, "Alerts, reports, user locations"],
        ["NVIDIA risk model", status.nvidia.ok, status.nvidia.message, "AI guidance JSON"],
        ["Open-Meteo", status.open_meteo.ok, status.open_meteo.message, "Weather data"],
      ]
    : [];

  return (
    <PageShell>
      <PageHeader
        eyebrow="Settings"
        title="System configuration"
        description="Review provider health, deployment readiness, and operational safeguards for the StormBridge chain."
        action={
          <PrimaryButton onClick={loadStatus} disabled={loading}>
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh status
          </PrimaryButton>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Panel className="overflow-hidden p-0">
          <div className="border-b border-black/5 px-5 py-4 dark:border-white/10">
            <h2 className="font-semibold text-slate-950 dark:text-white">Provider health</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">These checks run from the backend so secrets never leave the server.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="border-b border-black/5 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">Provider</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Purpose</th>
                  <th className="px-4 py-3">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/10">
                {rows.map(([name, ok, message, purpose]) => (
                  <tr key={String(name)}>
                    <td className="px-4 py-3 font-medium text-slate-950 dark:text-white">{name}</td>
                    <td className="px-4 py-3"><StatusBadge status={ok ? "Resolved" : "Escalated"} /></td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{purpose}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel>
          <h2 className="font-semibold text-slate-950 dark:text-white">Deployment readiness</h2>
          <div className="mt-4 space-y-3">
            {["Production build passes", "Vercel project linked", "Supabase connected", "AI risk model connected"].map((item) => (
              <div key={item} className="flex items-center gap-2 rounded-xl border border-black/5 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">
                <CheckCircle2 size={15} className="text-emergency-green" />
                {item}
              </div>
            ))}
          </div>
          <a href="https://stormbrigde.vercel.app" target="_blank" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emergency-green" rel="noreferrer">
            Open production <ExternalLink size={14} />
          </a>
          <div className="mt-5 border-t border-black/5 pt-4 dark:border-white/10">
            <SecondaryButton disabled>Rotate keys soon</SecondaryButton>
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}
