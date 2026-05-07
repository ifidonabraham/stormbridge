"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { EmptyState, PageHeader, PageShell, Panel, RiskBadge, StatCard } from "@/components/ui";
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
      <PageHeader
        eyebrow="Response"
        title="Responder dashboard"
        description="Monitor weather alerts, community reports, and the records that require operational attention."
        action={
          <button onClick={loadData} className="focus-ring inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold shadow-soft transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/[0.06]">
            <RefreshCw size={16} />
            Refresh
          </button>
        }
      />

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Alerts" value={String(alerts.length)} detail="Generated risk records" />
        <StatCard label="Reports" value={String(reports.length)} detail="Community hazard signals" />
        <StatCard
          label="High priority"
          value={String(
            alerts.filter((item) => item.risk_level === "High" || item.risk_level === "Critical").length +
              reports.filter((item) => item.severity === "High" || item.severity === "Critical").length,
          )}
          detail="Needs review"
        />
        <StatCard label="Data source" value={fallback ? "Fallback" : "Live"} detail="Supabase persistence" />
      </section>

      {fallback && <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">Fallback data shown while live persistence is unavailable.</p>}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <Panel className="overflow-hidden p-0">
          <div className="border-b border-black/5 px-5 py-4 dark:border-white/10">
            <h2 className="font-semibold text-slate-950 dark:text-white">Weather alerts</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Prioritize high-risk generated guidance.</p>
          </div>
            {alerts.length === 0 ? (
              <div className="p-4"><EmptyState title="No alerts" text="Run a location check to generate responder alerts." /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead className="border-b border-black/5 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400">
                    <tr>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3">Threat</th>
                      <th className="px-4 py-3">Risk</th>
                      <th className="px-4 py-3">Confidence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/10">
                    {alerts.map((alert, index) => (
                      <tr key={`${alert.location}-${index}`} className="hover:bg-slate-50 dark:hover:bg-white/[0.04]">
                        <td className="px-4 py-3 font-medium text-slate-950 dark:text-white">{alert.location}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{alert.main_threat}</td>
                        <td className="px-4 py-3"><RiskBadge level={alert.risk_level} /></td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{alert.confidence}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </Panel>
        <Panel className="overflow-hidden p-0">
          <div className="border-b border-black/5 px-5 py-4 dark:border-white/10">
            <h2 className="font-semibold text-slate-950 dark:text-white">Community reports</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Field signals that can raise response urgency.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="border-b border-black/5 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/10">
                {reports.map((report) => (
                  <tr key={report.id ?? `${report.location}-${report.description}`} className="hover:bg-slate-50 dark:hover:bg-white/[0.04]">
                    <td className="px-4 py-3">
                      <p className="font-medium capitalize text-slate-950 dark:text-white">{report.report_type}</p>
                      <p className="mt-1 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">{report.description}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{report.location}</td>
                    <td className="px-4 py-3"><RiskBadge level={report.severity} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </PageShell>
  );
}
