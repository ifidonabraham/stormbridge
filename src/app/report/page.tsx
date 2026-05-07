"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { PageShell, Panel } from "@/components/ui";

const reportTypes = ["flooding", "blocked road", "fallen tree", "damaged building", "power outage", "clinic inaccessible", "school affected", "bridge damaged"];

export default function ReportPage() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("");
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
      setStatus(data.fallback_used ? "Saved locally for demo mode. Add Supabase keys to store live reports." : "Report submitted to responder dashboard.");
      event.currentTarget.reset();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Report failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <Panel className="mx-auto max-w-2xl">
        <p className="text-sm font-semibold text-emergency-green">Community signal</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white">Report a hazard</h1>
        <form onSubmit={submit} className="mt-5 grid gap-4">
          <Input name="location" label="Location" placeholder="Village, road, school, or landmark" />
          <label className="grid gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Hazard type
            <select name="report_type" className="focus-ring rounded-2xl border border-black/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-950">
              {reportTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Severity
            <select name="severity" className="focus-ring rounded-2xl border border-black/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-950">
              {["Low", "Medium", "High", "Critical"].map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            What is happening?
            <textarea name="description" rows={5} className="focus-ring rounded-2xl border border-black/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-950" placeholder="Example: Water is covering the only road to the clinic." />
          </label>
          <button disabled={loading} className="focus-ring inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white shadow-soft transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950">
            <Send size={18} />
            Submit report
          </button>
        </form>
        {status && <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 dark:bg-white/[0.04] dark:text-slate-300">{status}</p>}
      </Panel>
    </PageShell>
  );
}

function Input({ name, label, placeholder }: { name: string; label: string; placeholder: string }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
      {label}
      <input name={name} className="focus-ring rounded-2xl border border-black/10 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-950" placeholder={placeholder} />
    </label>
  );
}
