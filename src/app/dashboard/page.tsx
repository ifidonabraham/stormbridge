"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { EmptyState, PageShell, Panel, RiskBadge } from "@/components/ui";
import type { CommunityReport, RiskAnalysis } from "@/lib/types";

export default function DashboardPage() {
  const [alerts, setAlerts] = useState<RiskAnalysis[]>([]);
  const [reports, setReports] = useState<CommunityReport[]>([]);
  const [fallback, setFallback] = useState(false);

  async function loadData() {
    const [alertsResponse, reportsResponse] = await Promise.all([fetch("/api/alerts"), fetch("/api/reports")]);
    const [alertsData, reportsData] = await Promise.all([alertsResponse.json(), reportsResponse.json()]);
    setAlerts(alertsData.alerts ?? []);
    setReports(reportsData.reports ?? []);
    setFallback(Boolean(alertsData.fallback_used || reportsData.fallback_used));
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <PageShell>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-emergency-green">Operations</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">Responder dashboard</h1>
          {fallback && <p className="mt-2 text-sm font-semibold text-emergency-amber">Fallback data shown while live persistence is unavailable.</p>}
        </div>
        <button onClick={loadData} className="focus-ring inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 font-semibold shadow-soft transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/[0.06]">
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <Panel>
          <h2 className="font-semibold text-slate-950 dark:text-white">Weather alerts</h2>
          <div className="mt-4 grid gap-3">
            {alerts.length === 0 ? (
              <EmptyState title="No alerts" text="Run a location check to generate responder alerts." />
            ) : (
              alerts.map((alert, index) => (
                <article key={`${alert.location}-${index}`} className="rounded-2xl border border-black/5 bg-white/70 p-4 shadow-soft dark:border-white/10 dark:bg-white/[0.04]">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-950 dark:text-white">{alert.location}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{alert.main_threat}</p>
                    </div>
                    <RiskBadge level={alert.risk_level} />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{alert.alert_message}</p>
                </article>
              ))
            )}
          </div>
        </Panel>
        <Panel>
          <h2 className="font-semibold text-slate-950 dark:text-white">Community reports</h2>
          <div className="mt-4 grid gap-3">
            {reports.map((report) => (
              <article key={report.id ?? `${report.location}-${report.description}`} className="rounded-2xl border border-black/5 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/[0.04]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold capitalize text-slate-950 dark:text-white">{report.report_type}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{report.location}</p>
                  </div>
                  <RiskBadge level={report.severity} />
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{report.description}</p>
              </article>
            ))}
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}
