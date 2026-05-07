import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, BarChart3, CloudSun, FileWarning } from "lucide-react";
import { demoAlerts, demoReports } from "@/lib/demo-data";
import { highPriorityCount } from "@/lib/workflow";
import { GridSkeleton } from "@/components/skeletons";
import { PageHeader, PageShell, TrendCard } from "@/components/ui";

const OverviewLiveSections = dynamic(() => import("@/components/overview-live-sections"), {
  loading: () => <GridSkeleton />,
});

export default function Home() {
  const highPriority = highPriorityCount(demoAlerts, demoReports);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Command overview"
        title="Operational weather intelligence"
        mobileTitle="Check weather risk fast"
        description="Detect risk, generate guidance, collect field reports, escalate what matters, and preserve the latest safety plan offline."
        mobileDescription="One-tap weather risk checks, hazard reports, and offline guidance."
        action={
          <>
            <Link href="/check" className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-soft dark:bg-white dark:text-slate-950 sm:py-2.5">
              Check Risk <ArrowRight size={16} />
            </Link>
            <Link href="/report" className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-soft dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 sm:hidden">
              Report Hazard
            </Link>
            <Link href="/dashboard" className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-soft dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200 sm:hidden">
              View Dashboard
            </Link>
          </>
        }
      />

      <section className="mb-4 grid grid-cols-3 gap-2 sm:hidden">
        <Link href="/check" className="rounded-2xl border border-black/5 bg-white p-3 text-center text-xs font-semibold text-slate-700 shadow-soft dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200">
          <CloudSun className="mx-auto mb-1 text-emergency-green" size={18} />
          Check
        </Link>
        <Link href="/report" className="rounded-2xl border border-black/5 bg-white p-3 text-center text-xs font-semibold text-slate-700 shadow-soft dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200">
          <FileWarning className="mx-auto mb-1 text-emergency-green" size={18} />
          Report
        </Link>
        <Link href="/dashboard" className="rounded-2xl border border-black/5 bg-white p-3 text-center text-xs font-semibold text-slate-700 shadow-soft dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200">
          <BarChart3 className="mx-auto mb-1 text-emergency-green" size={18} />
          Command
        </Link>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <TrendCard label="Active alerts" value={String(demoAlerts.length)} detail="Saved risk assessments" delta="+12%" />
        <TrendCard label="Needs attention" value={String(highPriority)} detail="High or critical signals" delta="+4%" />
        <TrendCard label="Community reports" value={String(demoReports.length)} detail="Field conditions collected" delta="+9%" />
        <TrendCard label="Offline readiness" value="Ready" detail="Latest alert can be stored locally" delta="Live" />
      </section>

      <OverviewLiveSections />
    </PageShell>
  );
}
