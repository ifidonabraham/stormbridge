import { Panel } from "@/components/ui";

export function SectionSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <Panel className="p-0">
      <div className="border-b border-black/5 px-5 py-4 dark:border-white/10">
        <div className="h-4 w-40 rounded bg-slate-200 dark:bg-white/10" />
        <div className="mt-2 h-3 w-64 rounded bg-slate-100 dark:bg-white/5" />
      </div>
      <div className="space-y-3 p-5">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="rounded-xl border border-black/5 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.04]">
            <div className="h-3 w-2/3 rounded bg-slate-200 dark:bg-white/10" />
            <div className="mt-2 h-3 w-1/2 rounded bg-slate-100 dark:bg-white/5" />
          </div>
        ))}
      </div>
    </Panel>
  );
}

export function GridSkeleton() {
  return (
    <section className="mt-6 grid gap-6 xl:grid-cols-2">
      <SectionSkeleton />
      <SectionSkeleton />
    </section>
  );
}
