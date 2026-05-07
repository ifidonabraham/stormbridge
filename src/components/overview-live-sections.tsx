"use client";

import Link from "next/link";
import { memo, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, FileWarning, RadioTower } from "lucide-react";
import { EmptyState, InlinePill, Panel, RiskBadge, StatCard, StatusBadge } from "@/components/ui";
import { activityFeed, notificationQueue, responderUnits, statusTone, trendMetrics } from "@/lib/operations";
import { demoAlerts, demoReports } from "@/lib/demo-data";
import { reportStatus, timeAgo, workflowSteps } from "@/lib/workflow";
import type { CommunityReport, RiskAnalysis } from "@/lib/types";

const AlertRow = memo(function AlertRow({ alert, index }: { alert: RiskAnalysis; index: number }) {
  return (
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
  );
});

const ReportRow = memo(function ReportRow({ report }: { report: CommunityReport }) {
  return (
    <Link href="/report" className="grid grid-cols-[24px_1fr_auto] gap-3 px-5 py-3 hover:bg-slate-50 dark:hover:bg-white/[0.04]">
      <FileWarning size={16} className="mt-1 text-emergency-green" />
      <div>
        <p className="text-sm font-medium capitalize text-slate-950 dark:text-white">{report.report_type}</p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{report.location} · {timeAgo(report.created_at)}</p>
      </div>
      <StatusBadge status={reportStatus(report)} />
    </Link>
  );
});

export default function OverviewLiveSections() {
  const [alerts, setAlerts] = useState<RiskAnalysis[]>(demoAlerts);
  const [reports, setReports] = useState<CommunityReport[]>(demoReports);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [alertsResponse, reportsResponse] = await Promise.all([fetch("/api/alerts"), fetch("/api/reports")]);
      const [alertsData, reportsData] = await Promise.all([alertsResponse.json(), reportsResponse.json()]);
      if (!cancelled) {
        setAlerts(alertsData.alerts?.length ? alertsData.alerts : demoAlerts);
        setReports(reportsData.reports?.length ? reportsData.reports : demoReports);
      }
    }
    load().catch(() => {
      if (!cancelled) {
        setAlerts(demoAlerts);
        setReports(demoReports);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const activeAlerts = useMemo(() => alerts.filter((alert) => alert.risk_level === "High" || alert.risk_level === "Critical").slice(0, 5), [alerts]);
  const recentLocations = useMemo(() => [...new Set(alerts.map((alert) => alert.location))].slice(0, 4), [alerts]);

  return (
    <>
      <section className="mt-6 grid gap-4 md:grid-cols-4">
        {trendMetrics.map((metric) => (
          <StatCard key={metric.label} label={metric.label} value={metric.value} detail={`${metric.delta} in current operating window`} />
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_380px]">
        <Panel className="p-0">
          <div className="border-b border-black/5 px-5 py-4 dark:border-white/10">
            <h2 className="font-semibold text-slate-950 dark:text-white">Active high-priority alerts</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">What requires responder attention right now.</p>
          </div>
          {activeAlerts.length ? <div className="divide-y divide-black/5 dark:divide-white/10">{activeAlerts.map((alert, index) => <AlertRow key={`${alert.location}-${index}`} alert={alert} index={index} />)}</div> : <div className="p-5"><EmptyState title="No high-priority alerts" text="Run a location analysis to create an alert for the responder queue." /></div>}
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
            {recentLocations.map((location) => (
              <Link key={location} href="/check" className="flex items-center justify-between px-5 py-3 text-sm hover:bg-slate-50 dark:hover:bg-white/[0.04]">
                <span className="font-medium text-slate-950 dark:text-white">{location}</span>
                <span className="text-slate-500 dark:text-slate-400">Analyze again</span>
              </Link>
            ))}
          </div>
        </Panel>

        <Panel className="p-0">
          <div className="border-b border-black/5 px-5 py-4 dark:border-white/10">
            <h2 className="font-semibold text-slate-950 dark:text-white">Recent community reports</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Ground truth that can escalate risk.</p>
          </div>
          <div className="divide-y divide-black/5 dark:divide-white/10">{reports.slice(0, 5).map((report) => <ReportRow key={report.id ?? `${report.location}-${report.description}`} report={report} />)}</div>
        </Panel>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr_380px]">
        <Panel className="p-0">
          <div className="border-b border-black/5 px-5 py-4 dark:border-white/10"><h2 className="font-semibold text-slate-950 dark:text-white">Live activity</h2></div>
          <div className="divide-y divide-black/5 dark:divide-white/10">
            {activityFeed.map((item) => (
              <div key={item.id} className="px-5 py-3">
                <div className="flex items-center justify-between gap-3"><p className="text-sm font-medium text-slate-950 dark:text-white">{item.actor}</p><RiskBadge level={item.severity} /></div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{item.action}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">{item.target} · {item.time}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="p-0">
          <div className="border-b border-black/5 px-5 py-4 dark:border-white/10"><h2 className="font-semibold text-slate-950 dark:text-white">Responder status</h2></div>
          <div className="divide-y divide-black/5 dark:divide-white/10">
            {responderUnits.map((unit) => (
              <div key={unit.id} className="px-5 py-3">
                <div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold text-slate-950 dark:text-white">{unit.name}</p><InlinePill className={statusTone(unit.status)}>{unit.status}</InlinePill></div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{unit.role}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">{unit.location} · {unit.lastSeen}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <div className="flex items-center gap-2"><RadioTower size={17} className="text-emergency-green" /><h2 className="font-semibold text-slate-950 dark:text-white">Notification queue</h2></div>
          <div className="mt-4 space-y-3">
            {notificationQueue.map((item) => (
              <div key={item.id} className="rounded-xl border border-black/5 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.04]">
                <div className="flex items-center justify-between gap-2"><p className="text-sm font-semibold text-slate-950 dark:text-white">{item.channel}</p><InlinePill className={statusTone(item.status)}>{item.status}</InlinePill></div>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{item.target}</p>
                <p className="mt-1 text-xs text-slate-500">{item.time}</p>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </>
  );
}
