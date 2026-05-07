"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { demoReports } from "@/lib/demo-data";
import { reportStatus, timeAgo } from "@/lib/workflow";
import { PageHeader, PageShell, Panel, PrimaryButton, RiskBadge, StatusBadge } from "@/components/ui";
import type { CommunityReport, RiskLevel } from "@/lib/types";

const reportTypes = ["flooding", "blocked road", "fallen tree", "damaged building", "power outage", "clinic inaccessible", "school affected", "bridge damaged"];
const severities: Array<RiskLevel | "All"> = ["All", "Low", "Medium", "High", "Critical"];

export default function ReportPage() {
  const [reports, setReports] = useState<CommunityReport[]>(demoReports);
  const [status, setStatus] = useState("");
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);
  const [severityFilter, setSeverityFilter] = useState<RiskLevel | "All">("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("");

  useEffect(() => {
    fetch("/api/reports")
      .then((response) => response.json())
      .then((data) => setReports(data.reports?.length ? data.reports : demoReports))
      .catch(() => setReports(demoReports));
  }, []);

  const filteredReports = useMemo(
    () =>
      reports.filter((report) => {
        const severityMatch = severityFilter === "All" || report.severity === severityFilter;
        const typeMatch = typeFilter === "All" || report.report_type === typeFilter;
        const locationMatch = !locationFilter || report.location.toLowerCase().includes(locationFilter.toLowerCase());
        return severityMatch && typeMatch && locationMatch;
      }),
    [reports, severityFilter, typeFilter, locationFilter],
  );

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("");
    setToast("Submitting report to community intelligence queue...");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Report failed");
      const report = { ...data.report, contact: String(payload.contact ?? ""), status: "New" as const };
      setReports((current) => [report, ...current]);
      setStatus("Report submitted. It is now visible in the responder review queue.");
      setToast("Report accepted and queued for responder review.");
      event.currentTarget.reset();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Report failed.");
      setToast("Report submission failed. Review the form and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow="Community reports"
        title="Structured hazard intake"
        mobileTitle="Report hazard"
        description="Collect field conditions, classify severity, and route urgent reports into responder review."
        mobileDescription="Send a field report into the responder queue."
      />
      {toast && <p className="mb-4 rounded-xl border border-black/5 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-soft dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300">{toast}</p>}

      <div className="grid gap-4 xl:grid-cols-[440px_1fr] xl:gap-6">
        <Panel>
          <h2 className="font-semibold text-slate-950 dark:text-white">New hazard report</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Submit reports with enough structure for triage.</p>
          <div className="mt-4 grid gap-2 text-xs sm:grid-cols-3">
            <p className="rounded-xl bg-slate-50 px-3 py-2 text-slate-600 dark:bg-white/[0.04] dark:text-slate-400">New reports enter review</p>
            <p className="rounded-xl bg-slate-50 px-3 py-2 text-slate-600 dark:bg-white/[0.04] dark:text-slate-400">High severity escalates</p>
            <p className="rounded-xl bg-slate-50 px-3 py-2 text-slate-600 dark:bg-white/[0.04] dark:text-slate-400">Responders verify field state</p>
          </div>
          <form onSubmit={submit} className="mt-5 grid gap-4">
            <Input name="location" label="Location" placeholder="City, village, road, facility, or landmark" />
            <label className="grid gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Hazard type
              <select name="report_type" className="focus-ring rounded-xl border border-black/10 bg-white px-3 py-2.5 dark:border-white/10 dark:bg-slate-950">
                {reportTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Severity
              <select name="severity" className="focus-ring rounded-xl border border-black/10 bg-white px-3 py-2.5 dark:border-white/10 dark:bg-slate-950">
                {["Low", "Medium", "High", "Critical"].map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Description
              <textarea name="description" rows={4} className="focus-ring rounded-xl border border-black/10 bg-white px-3 py-2.5 dark:border-white/10 dark:bg-slate-950" placeholder="What happened, who is affected, and what access is blocked?" />
            </label>
            <Input name="contact" label="Contact optional" placeholder="Phone, radio call sign, or email" required={false} />
            <PrimaryButton disabled={loading} className="w-full py-3">
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
              Submit report
            </PrimaryButton>
          </form>
          {status && <p className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 dark:bg-white/[0.04] dark:text-slate-300">{status}</p>}
        </Panel>

        <Panel className="overflow-hidden p-0">
          <div className="border-b border-black/5 px-5 py-4 dark:border-white/10">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-semibold text-slate-950 dark:text-white">Recent reports</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Filter by severity, hazard type, and location.</p>
              </div>
              <div className="grid gap-2 sm:flex sm:flex-wrap">
                <select value={severityFilter} onChange={(event) => setSeverityFilter(event.target.value as RiskLevel | "All")} className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950">
                  {severities.map((severity) => <option key={severity}>{severity}</option>)}
                </select>
                <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950">
                  {["All", ...reportTypes].map((type) => <option key={type}>{type}</option>)}
                </select>
                <input value={locationFilter} onChange={(event) => setLocationFilter(event.target.value)} className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-950" placeholder="Filter location" />
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-black/5 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">Hazard</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 dark:divide-white/10">
                {filteredReports.map((report) => (
                  <tr key={report.id ?? `${report.location}-${report.description}`} className="hover:bg-slate-50 dark:hover:bg-white/[0.04]">
                    <td className="px-4 py-3">
                      <p className="font-medium capitalize text-slate-950 dark:text-white">{report.report_type}</p>
                      <p className="mt-1 line-clamp-1 text-xs text-slate-500 dark:text-slate-400">{report.description}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{report.location}</td>
                    <td className="px-4 py-3"><RiskBadge level={report.severity} /></td>
                    <td className="px-4 py-3"><StatusBadge status={reportStatus(report)} /></td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{timeAgo(report.created_at)}</td>
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

function Input({ name, label, placeholder, required = true }: { name: string; label: string; placeholder: string; required?: boolean }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
      {label}
      <input required={required} name={name} className="focus-ring rounded-xl border border-black/10 bg-white px-3 py-2.5 dark:border-white/10 dark:bg-slate-950" placeholder={placeholder} />
    </label>
  );
}
