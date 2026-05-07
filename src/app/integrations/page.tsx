"use client";

import { useEffect, useState } from "react";
import { CloudSun, Database, BrainCircuit } from "lucide-react";
import { EmptyState, PageShell, Panel } from "@/components/ui";

type Status = {
  supabase: { ok: boolean; message: string };
  nvidia: { ok: boolean; message: string };
  open_meteo: { ok: boolean; message: string };
};

export default function IntegrationsPage() {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    fetch("/api/integrations/status")
      .then((response) => response.json())
      .then(setStatus)
      .catch(() => setStatus(null));
  }, []);

  return (
    <PageShell>
      <h1 className="text-2xl font-black text-emergency-ink">System Health</h1>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-emergency-ink/72">
        Internal build diagnostics for API providers. This page is for maintainers, not the public emergency workflow.
      </p>
      {!status ? (
        <div className="mt-5">
          <EmptyState title="Checking integrations" text="Loading provider status from the backend." />
        </div>
      ) : (
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <IntegrationCard icon={<CloudSun />} title="Open-Meteo" ok={status.open_meteo.ok} message={status.open_meteo.message} />
          <IntegrationCard icon={<Database />} title="Supabase" ok={status.supabase.ok} message={status.supabase.message} />
          <IntegrationCard icon={<BrainCircuit />} title="Advanced Risk Model" ok={status.nvidia.ok} message={status.nvidia.message} />
        </div>
      )}
    </PageShell>
  );
}

function IntegrationCard({ icon, title, ok, message }: { icon: React.ReactNode; title: string; ok: boolean; message: string }) {
  return (
    <Panel>
      <div className="flex items-start justify-between gap-3">
        <div className="text-emergency-green">{icon}</div>
        <span className={`rounded px-2 py-1 text-xs font-bold ${ok ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
          {ok ? "Connected" : "Unavailable"}
        </span>
      </div>
      <h2 className="mt-4 font-black">{title}</h2>
      <p className="mt-2 break-words text-sm leading-6 text-emergency-ink/72">{message}</p>
    </Panel>
  );
}
