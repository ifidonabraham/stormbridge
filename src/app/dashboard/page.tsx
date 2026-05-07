import dynamic from "next/dynamic";
import { RefreshCw } from "lucide-react";
import { demoAlerts, demoReports } from "@/lib/demo-data";
import { notificationQueue, responderUnits } from "@/lib/operations";
import { GridSkeleton } from "@/components/skeletons";
import { PageHeader, PageShell, StatCard } from "@/components/ui";

const DashboardCommandSections = dynamic(() => import("@/components/dashboard-command-sections"), {
  loading: () => <GridSkeleton />,
});

export default function DashboardPage() {
  const highPriority =
    demoAlerts.filter((item) => item.risk_level === "High" || item.risk_level === "Critical").length +
    demoReports.filter((item) => item.severity === "High" || item.severity === "Critical").length;

  return (
    <PageShell>
      <PageHeader
        eyebrow="Response"
        title="Responder command"
        mobileTitle="Command"
        description="Monitor weather alerts, community reports, and the records that require operational attention."
        mobileDescription="Review alerts, reports, and responder status."
        action={
          <button disabled className="focus-ring inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-slate-500 shadow-soft dark:border-white/10 dark:bg-white/[0.06]">
            <RefreshCw size={16} />
            Live refresh active
          </button>
        }
      />

      <section className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <StatCard label="Alerts" value={String(demoAlerts.length)} detail="Generated risk records" />
        <StatCard label="Reports" value={String(demoReports.length)} detail="Community hazard signals" />
        <StatCard label="High priority" value={String(highPriority)} detail="Needs review" />
        <StatCard label="Data source" value="Live" detail="Supabase persistence" />
      </section>

      <section className="mt-3 grid grid-cols-2 gap-3 sm:mt-4 sm:gap-4 md:grid-cols-4">
        <StatCard label="Units available" value={String(responderUnits.filter((unit) => unit.status === "Available").length)} detail="Can accept assignment" />
        <StatCard label="Investigating" value={String(responderUnits.filter((unit) => unit.status === "Investigating").length)} detail="Field verification active" />
        <StatCard label="Notifications" value={String(notificationQueue.length)} detail="Queued and delivered messages" />
        <StatCard label="SLA watch" value="8m" detail="Average response time" />
      </section>

      <DashboardCommandSections />
    </PageShell>
  );
}
