"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Clock3, FileWarning } from "lucide-react";
import { demoAlerts, demoReports } from "@/lib/demo-data";
import { highPriorityCount, reportStatus, timeAgo, workflowSteps } from "@/lib/workflow";
import { EmptyState, PageHeader, PageShell, Panel, RiskBadge, StatCard, StatusBadge } from "@/components/ui";
import type { CommunityReport, RiskAnalysis } from "@/lib/types";

export default function Home() {
  const [alerts, setAlerts] = useState<RiskAnalysis[]>(demoAlerts);
  const [reports, setReports] = useState<CommunityReport[]>(demoReports);

  useEffect(() => {
    async function load() {
      const [alertsResponse, reportsResponse] = await Promise.all([fetch("/api/alerts"), fetch("/api/reports")]);
      const [alertsData, reportsData] = await Promise.all([alertsResponse.json(), reportsResponse.json()]);
      setAlerts(alertsData.alerts?.length ? alertsData.alerts : demoAlerts);
      setReports(reportsData.reports?.length ? reportsData.reports : demoReports);
    }
    load().catch(() => {
      setAlerts(demoAlerts);
      setReports(demoReports);
    });
  }, []);

  const highPriority = useMemo(() => highPriorityCount(alerts, reports), [alerts, reports]);
  const recentLocations = [...new Set(alerts.map((alert) => alert.location))].slice(0, 4);
  const activeAlerts = alerts.filter((alert) => alert.risk_level === "High" || alert.risk_level === "Critical");

  return (
    <PageShell>
      <PageHeader
        eyebrow="Command overview"
        title="Operational weather intelligence"
        description="Detect risk, generate guidance, collect field reports, escalate what matters, and preserve the latest safety plan offline."
        action={
          <Link href="/check" className="focus-ring inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950">
            Run Location Analysis <ArrowRight size={16} />
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Active alerts" value={String(alerts.length)} detail="Saved risk assessments" />
        <StatCard label="Needs attention" value={String(highPriority)} detail="High or critical signals" />
        <StatCard label="Community reports" value={String(reports.length)} detail="Field conditions collected" />
        <StatCard label="Offline readiness" value="Ready" detail="Latest alert can be stored locally" />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
        <Panel className="p-0">
          <div className="border-b border-black/5 px-5 py-4 dark:border-white/10">
            <h2 className="font-semibold text-slate-950 dark:text-white">Active high-priority alerts</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">What requires responder attention right now.</p>
          </div>
          {activeAlerts.length ? (
            <div className="divide-y divide-black/5 dark:divide-white/10">
              {activeAlerts.slice(0, 5).map((alert, index) => (
                <Link key={`${alert.location}-${index}`} href="/dashboard" className="grid gap-3 px-5 py-4 hover:bg-slate-50 dark:hover:bg-white/[0.04] md:grid-cols-[1fr_auto]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-slate-950 dark:text-white">{alert.location}</p>
                      <RiskBadge level={alert.risk_level} />
                    </div>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{alert.main_threat}</p>
                    <p className="mt-2 line-clamp-1 text-sm text-slate-500 dark:text-slate-400">{alert.alert_message}</p>
                  </div>
                  <span className="self-center text-sm font-semibold text-emergency-green">Review</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-5">
              <EmptyState title="No high-priority alerts" text="Run a location analysis to create an alert for the responder queue." />
            </div>
          )}
        </Panel>

        <Panel>
          <h2 className="font-semibold text-slate-950 dark:text-white">Workflow progress</h2>
          <div className="mt-4 space-y-2">
            {workflowSteps.map((step, index) => (
              <div key={step} className="flex items-center gap-3 rounded-xl border border-black/5 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.04]">
                {index < 3 ? <CheckCircle2 size={16} className="text-emergency-green" /> : <Clock3 size={16} className="text-slate-400" />}
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{step}</p>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel className="p-0">
          <div className="border-b border-black/5 px-5 py-4 dark:border-white/10">
            <h2 className="font-semibold text-slate-950 dark:text-white">Recent locations analyzed</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Locations feeding the alert queue.</p>
          </div>
          <div className="divide-y divide-black/5 dark:divide-white/10">
            {recentLocations.length ? (
              recentLocations.map((location) => (
                <Link key={location} href="/check" className="flex items-center justify-between px-5 py-3 text-sm hover:bg-slate-50 dark:hover:bg-white/[0.04]">
                  <span className="font-medium text-slate-950 dark:text-white">{location}</span>
                  <span className="text-slate-500 dark:text-slate-400">Analyze again</span>
                </Link>
              ))
            ) : (
              <div className="p-5"><EmptyState title="No locations yet" text="Start with Run Location Analysis to create the first record." /></div>
            )}
          </div>
        </Panel>

        <Panel className="p-0">
          <div className="border-b border-black/5 px-5 py-4 dark:border-white/10">
            <h2 className="font-semibold text-slate-950 dark:text-white">Recent community reports</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Ground truth that can escalate risk.</p>
          </div>
          <div className="divide-y divide-black/5 dark:divide-white/10">
            {reports.slice(0, 5).map((report) => (
              <Link key={report.id ?? `${report.location}-${report.description}`} href="/report" className="grid grid-cols-[24px_1fr_auto] gap-3 px-5 py-3 hover:bg-slate-50 dark:hover:bg-white/[0.04]">
                <FileWarning size={16} className="mt-1 text-emergency-green" />
                <div>
                  <p className="text-sm font-medium capitalize text-slate-950 dark:text-white">{report.report_type}</p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{report.location} · {timeAgo(report.created_at)}</p>
                </div>
                <StatusBadge status={reportStatus(report)} />
              </Link>
            ))}
          </div>
        </Panel>
      </section>
    </PageShell>
  );
}
