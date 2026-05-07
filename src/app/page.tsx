import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
        description="Detect risk, generate guidance, collect field reports, escalate what matters, and preserve the latest safety plan offline."
        action={
          <Link href="/check" className="focus-ring inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-soft dark:bg-white dark:text-slate-950">
            Run Location Analysis <ArrowRight size={16} />
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-4">
        <TrendCard label="Active alerts" value={String(demoAlerts.length)} detail="Saved risk assessments" delta="+12%" />
        <TrendCard label="Needs attention" value={String(highPriority)} detail="High or critical signals" delta="+4%" />
        <TrendCard label="Community reports" value={String(demoReports.length)} detail="Field conditions collected" delta="+9%" />
        <TrendCard label="Offline readiness" value="Ready" detail="Latest alert can be stored locally" delta="Live" />
      </section>

      <OverviewLiveSections />
    </PageShell>
  );
}
