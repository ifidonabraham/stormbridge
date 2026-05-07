"use client";

import { useEffect, useState } from "react";
import { MapPinned, RefreshCw } from "lucide-react";
import { demoAlerts, demoReports } from "@/lib/demo-data";
import { notificationQueue, responderUnits, statusTone } from "@/lib/operations";
import { recommendedResponse, reportStatus, timeAgo } from "@/lib/workflow";
import { EmptyState, InlinePill, PageHeader, PageShell, Panel, PrimaryButton, RiskBadge, SecondaryButton, StatCard } from "@/components/ui";
import type { CommunityReport, RiskAnalysis } from "@/lib/types";

export default function DashboardPage() {
  const [alerts, setAlerts] = useState<RiskAnalysis[]>(demoAlerts);
  const [reports, setReports] = useState<CommunityReport[]>(demoReports);
  const [fallback, setFallback] = useState(false);

  async function loadData() {
    const [alertsResponse, reportsResponse] = await Promise.all([fetch("/api/alerts"), fetch("/api/reports")]);
    const [alertsData, reportsData] = await Promise.all([alertsResponse.json(), reportsResponse.json()]);
    setAlerts(alertsData.alerts?.length ? alertsData.alerts : demoAlerts);
    setReports(reportsData.reports?.length ? reportsData.reports : demoReports);
    setFallback(Boolean(alertsData.fallback_used || reportsData.fallback_used));
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Response"
        title="Responder command"
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

      <section className="mt-4 grid gap-4 md:grid-cols-4">
        <StatCard label="Units available" value={String(responderUnits.filter((unit) => unit.status === "Available").length)} detail="Can accept assignment" />
        <StatCard label="Investigating" value={String(responderUnits.filter((unit) => unit.status === "Investigating").length)} detail="Field verification active" />
        <StatCard label="Notifications" value={String(notificationQueue.length)} detail="Queued and delivered messages" />
        <StatCard label="SLA watch" value="8m" detail="Average response time" />
      </section>

      {fallback && <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-200">Fallback data shown while live persistence is unavailable.</p>}

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <Panel className="overflow-hidden p-0">
          <div className="border-b border-black/5 px-5 py-4 dark:border-white/10">
            <h2 className="font-semibold text-slate-950 dark:text-white">Alert queue</h2>
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
                      <th className="px-4 py-3">Updated</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/10">
                    {alerts.map((alert, index) => (
                      <tr key={`${alert.location}-${index}`} className="hover:bg-slate-50 dark:hover:bg-white/[0.04]">
                        <td className="px-4 py-3 font-medium text-slate-950 dark:text-white">{alert.location}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{alert.main_threat}</td>
                        <td className="px-4 py-3"><RiskBadge level={alert.risk_level} /></td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{alert.confidence}</td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400">Live</td>
                        <td className="px-4 py-3 text-right"><SecondaryButton disabled className="px-3 py-1.5">Assign soon</SecondaryButton></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </Panel>
        <Panel className="overflow-hidden p-0">
          <div className="border-b border-black/5 px-5 py-4 dark:border-white/10">
            <h2 className="font-semibold text-slate-950 dark:text-white">High-priority reports</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Field signals that can raise response urgency.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="border-b border-black/5 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/10">
                {reports.filter((report) => report.severity === "High" || report.severity === "Critical").concat(reports.filter((report) => report.severity !== "High" && report.severity !== "Critical")).slice(0, 8).map((report) => (
                  <tr key={report.id ?? `${report.location}-${report.description}`} className="hover:bg-slate-50 dark:hover:bg-white/[0.04]">
                    <td className="px-4 py-3">
                      <p className="font-medium capitalize text-slate-950 dark:text-white">{report.report_type}</p>
                      <p className="mt-1 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">{report.description}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{report.location}</td>
                    <td className="px-4 py-3"><RiskBadge level={report.severity} /></td>
                    <td className="px-4 py-3"><InlinePill className={statusTone(reportStatus(report))}>{reportStatus(report)}</InlinePill></td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{timeAgo(report.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      <section className="mt-6 grid gap-6 xl:grid-cols-[360px_1fr]">
        <Panel>
          <div className="flex items-center gap-2">
            <MapPinned size={18} className="text-emergency-green" />
            <h2 className="font-semibold text-slate-950 dark:text-white">Affected areas</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Map integration placeholder. Current MVP uses a prioritized list until geospatial layers are added.</p>
          <div className="mt-4 space-y-2">
            {[...new Set([...alerts.map((alert) => alert.location), ...reports.map((report) => report.location)])].slice(0, 6).map((location) => (
              <div key={location} className="rounded-xl border border-black/5 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300">{location}</div>
            ))}
          </div>
        </Panel>

        <Panel>
          <h2 className="font-semibold text-slate-950 dark:text-white">Response status</h2>
          <div className="mt-4 grid gap-3 lg:grid-cols-4">
            {(["New", "Investigating", "Escalated", "Resolved"] as const).map((column) => (
              <div key={column} className="rounded-2xl border border-black/5 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.04]">
                <p className="mb-3 text-sm font-semibold text-slate-950 dark:text-white">{column}</p>
                <div className="space-y-3">
                  {buildResponseCards(alerts, reports, column).map((item) => (
                    <div key={item.id} className="rounded-xl border border-black/5 bg-white p-3 text-sm shadow-soft dark:border-white/10 dark:bg-slate-950/60">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-slate-950 dark:text-white">{item.location}</p>
                        <RiskBadge level={item.severity} />
                      </div>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.source} · {item.time}</p>
                      <p className="mt-2 text-slate-600 dark:text-slate-300">{item.response}</p>
                      <div className="mt-3 flex gap-2">
                        <PrimaryButton disabled className="px-3 py-1.5">Update soon</PrimaryButton>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel className="p-0">
          <div className="border-b border-black/5 px-5 py-4 dark:border-white/10">
            <h2 className="font-semibold text-slate-950 dark:text-white">Responder units</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Availability and current field posture.</p>
          </div>
          <div className="divide-y divide-black/5 dark:divide-white/10">
            {responderUnits.map((unit) => (
              <div key={unit.id} className="grid gap-3 px-5 py-3 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="text-sm font-semibold text-slate-950 dark:text-white">{unit.name}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{unit.role} · {unit.location} · {unit.lastSeen}</p>
                </div>
                <InlinePill className={statusTone(unit.status)}>{unit.status}</InlinePill>
              </div>
            ))}
          </div>
        </Panel>
        <Panel className="p-0">
          <div className="border-b border-black/5 px-5 py-4 dark:border-white/10">
            <h2 className="font-semibold text-slate-950 dark:text-white">Notification delivery</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Escalation channels and message state.</p>
          </div>
          <div className="divide-y divide-black/5 dark:divide-white/10">
            {notificationQueue.map((item) => (
              <div key={item.id} className="grid gap-3 px-5 py-3 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="text-sm font-semibold text-slate-950 dark:text-white">{item.channel}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.target} · {item.time}</p>
                </div>
                <InlinePill className={statusTone(item.status)}>{item.status}</InlinePill>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </PageShell>
  );
}

function buildResponseCards(alerts: RiskAnalysis[], reports: CommunityReport[], column: "New" | "Investigating" | "Escalated" | "Resolved") {
  const alertCards = alerts.map((alert, index) => ({
    id: `alert-${index}-${alert.location}`,
    location: alert.location,
    severity: alert.risk_level,
    source: "AI alert",
    time: "Live",
    status: alert.risk_level === "High" || alert.risk_level === "Critical" ? "Escalated" : "Investigating",
    response: recommendedResponse(alert.main_threat, alert.risk_level),
  }));
  const reportCards = reports.map((report) => ({
    id: report.id ?? `report-${report.location}-${report.description}`,
    location: report.location,
    severity: report.severity,
    source: "Community report",
    time: timeAgo(report.created_at),
    status: reportStatus(report) === "Reviewing" ? "Investigating" : reportStatus(report),
    response: recommendedResponse(report.report_type, report.severity),
  }));

  return [...alertCards, ...reportCards].filter((item) => item.status === column).slice(0, 3);
}
