"use client";

import { useEffect, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { PageHeader, PageShell, Panel, PrimaryButton, SecondaryButton } from "@/components/ui";

type SettingsState = {
  appearance: {
    theme: "light" | "dark" | "system";
    compactMode: boolean;
    reduceMotion: boolean;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    frequency: "Immediate" | "Hourly digest" | "Daily digest";
  };
  risk: {
    threshold: "Medium" | "High" | "Critical";
    defaultLocation: string;
    vulnerableGroups: string[];
    autoEscalateCritical: boolean;
  };
  offline: {
    saveLatest: boolean;
    cacheChecklist: boolean;
  };
  sync: {
    refreshInterval: "5 min" | "15 min" | "30 min";
    useMockFallback: boolean;
    lastSync: string;
  };
  workspace: {
    workspaceName: string;
    operatorName: string;
    role: "Admin" | "Responder" | "Viewer";
    regionCoverage: string;
  };
};

const storageKey = "stormbridge:settings";

const defaultSettings: SettingsState = {
  appearance: { theme: "system", compactMode: false, reduceMotion: false },
  notifications: { email: true, sms: false, whatsapp: true, frequency: "Immediate" },
  risk: {
    threshold: "High",
    defaultLocation: "",
    vulnerableGroups: ["Children", "Elderly", "Disabled people"],
    autoEscalateCritical: true,
  },
  offline: { saveLatest: true, cacheChecklist: true },
  sync: { refreshInterval: "15 min", useMockFallback: true, lastSync: "Not synced yet" },
  workspace: { workspaceName: "StormBridge Operations", operatorName: "", role: "Admin", regionCoverage: "Global" },
};

const vulnerableOptions = ["Children", "Elderly", "Disabled people", "Outdoor workers"];

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [toast, setToast] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [storageStatus, setStorageStatus] = useState("Checking storage...");

  useEffect(() => {
    const raw = localStorage.getItem(storageKey);
    if (raw) setSettings(mergeSettings(JSON.parse(raw)));
    setStorageStatus(localStorage.getItem("stormbridge:last-alert") ? "Latest guidance saved" : "No saved guidance");
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(settings));
    window.dispatchEvent(new Event("stormbridge-settings-updated"));
  }, [settings]);

  function update<T extends keyof SettingsState>(section: T, value: Partial<SettingsState[T]>) {
    setSettings((current) => ({ ...current, [section]: { ...current[section], ...value } }));
    setToast("Settings saved.");
  }

  function toggleGroup(group: string) {
    const current = settings.risk.vulnerableGroups;
    update("risk", {
      vulnerableGroups: current.includes(group) ? current.filter((item) => item !== group) : [...current, group],
    });
  }

  function clearOfflineGuidance() {
    localStorage.removeItem("stormbridge:last-alert");
    setStorageStatus("No saved guidance");
    setToast("Offline guidance cleared.");
  }

  async function manualSync() {
    setSyncing(true);
    setToast("Sync in progress...");
    await new Promise((resolve) => setTimeout(resolve, 900));
    update("sync", { lastSync: new Date().toLocaleString() });
    setSyncing(false);
    setToast("Manual sync complete.");
  }

  function confirmAction(message: string, success: string, action?: () => void) {
    if (window.confirm(message)) {
      action?.();
      setToast(success);
    }
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow="Settings"
        title="Workspace controls"
        description="Manage operator preferences, alert behavior, offline storage, sync cadence, and workspace access."
      />

      {toast && <p className="mb-4 rounded-xl border border-black/5 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-soft dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-300">{toast}</p>}

      <div className="grid gap-6 xl:grid-cols-2">
        <SettingCard title="Appearance" description="Control the workspace display and motion preferences.">
          <Segmented
            label="Theme"
            value={settings.appearance.theme}
            options={["light", "dark", "system"]}
            onChange={(theme) => update("appearance", { theme: theme as SettingsState["appearance"]["theme"] })}
          />
          <Toggle label="Compact mode" checked={settings.appearance.compactMode} onChange={(compactMode) => update("appearance", { compactMode })} />
          <Toggle label="Reduce motion" checked={settings.appearance.reduceMotion} onChange={(reduceMotion) => update("appearance", { reduceMotion })} />
        </SettingCard>

        <SettingCard title="Notifications" description="Choose how operators receive alerts and digests.">
          <Toggle label="Email alerts" checked={settings.notifications.email} onChange={(email) => update("notifications", { email })} />
          <Toggle label="SMS alerts" checked={settings.notifications.sms} onChange={(sms) => update("notifications", { sms })} />
          <Toggle label="WhatsApp alerts" checked={settings.notifications.whatsapp} onChange={(whatsapp) => update("notifications", { whatsapp })} />
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">Critical alerts always enabled</div>
          <SelectRow label="Notification frequency" value={settings.notifications.frequency} options={["Immediate", "Hourly digest", "Daily digest"]} onChange={(frequency) => update("notifications", { frequency: frequency as SettingsState["notifications"]["frequency"] })} />
        </SettingCard>

        <SettingCard title="Risk Preferences" description="Set defaults that affect risk triage and escalation.">
          <SelectRow label="Default alert threshold" value={settings.risk.threshold} options={["Medium", "High", "Critical"]} onChange={(threshold) => update("risk", { threshold: threshold as SettingsState["risk"]["threshold"] })} />
          <InputRow label="Default region/location" value={settings.risk.defaultLocation} placeholder="Global, region, or operating area" onChange={(defaultLocation) => update("risk", { defaultLocation })} />
          <div>
            <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">Vulnerable groups focus</p>
            <div className="flex flex-wrap gap-2">
              {vulnerableOptions.map((group) => (
                <button
                  key={group}
                  onClick={() => toggleGroup(group)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                    settings.risk.vulnerableGroups.includes(group)
                      ? "border-slate-950 bg-slate-950 text-white dark:border-white dark:bg-white dark:text-slate-950"
                      : "border-black/10 bg-white text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300"
                  }`}
                >
                  {group}
                </button>
              ))}
            </div>
          </div>
          <Toggle label="Auto-escalate critical reports" checked={settings.risk.autoEscalateCritical} onChange={(autoEscalateCritical) => update("risk", { autoEscalateCritical })} />
        </SettingCard>

        <SettingCard title="Offline & Storage" description="Control what remains available when connectivity is unreliable.">
          <Toggle label="Save latest guidance offline" checked={settings.offline.saveLatest} onChange={(saveLatest) => update("offline", { saveLatest })} />
          <Toggle label="Auto-cache emergency checklist" checked={settings.offline.cacheChecklist} onChange={(cacheChecklist) => update("offline", { cacheChecklist })} />
          <div className="rounded-xl border border-black/5 bg-slate-50 p-3 text-sm dark:border-white/10 dark:bg-white/[0.04]">
            <p className="font-semibold text-slate-950 dark:text-white">Local storage status</p>
            <p className="mt-1 text-slate-600 dark:text-slate-400">{storageStatus}</p>
          </div>
          <SecondaryButton onClick={clearOfflineGuidance}>Clear offline guidance</SecondaryButton>
        </SettingCard>

        <SettingCard title="Data & Sync" description="Set refresh cadence and fallback behavior for operational screens.">
          <SelectRow label="Weather refresh interval" value={settings.sync.refreshInterval} options={["5 min", "15 min", "30 min"]} onChange={(refreshInterval) => update("sync", { refreshInterval: refreshInterval as SettingsState["sync"]["refreshInterval"] })} />
          <div className="rounded-xl border border-black/5 bg-slate-50 p-3 text-sm dark:border-white/10 dark:bg-white/[0.04]">
            <p className="font-semibold text-slate-950 dark:text-white">Last sync status</p>
            <p className="mt-1 text-slate-600 dark:text-slate-400">{settings.sync.lastSync}</p>
          </div>
          <PrimaryButton onClick={manualSync} disabled={syncing}>
            {syncing ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
            Manual sync
          </PrimaryButton>
          <Toggle label="Use mock data when APIs fail" checked={settings.sync.useMockFallback} onChange={(useMockFallback) => update("sync", { useMockFallback })} />
        </SettingCard>

        <SettingCard title="Account / Workspace" description="Manage local workspace identity for operational context.">
          <InputRow label="Workspace name" value={settings.workspace.workspaceName} onChange={(workspaceName) => update("workspace", { workspaceName })} />
          <InputRow label="Operator name" value={settings.workspace.operatorName} placeholder="Operator display name" onChange={(operatorName) => update("workspace", { operatorName })} />
          <SelectRow label="Role" value={settings.workspace.role} options={["Admin", "Responder", "Viewer"]} onChange={(role) => update("workspace", { role: role as SettingsState["workspace"]["role"] })} />
          <InputRow label="Region coverage" value={settings.workspace.regionCoverage} onChange={(regionCoverage) => update("workspace", { regionCoverage })} />
        </SettingCard>
      </div>

      <Panel className="mt-6 border-red-200 bg-red-50/80 dark:border-red-500/20 dark:bg-red-500/10">
        <h2 className="font-semibold text-red-900 dark:text-red-200">Danger Zone</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <SecondaryButton onClick={() => confirmAction("Reset demo data preferences?", "Demo preferences reset.", () => setSettings(defaultSettings))}>Reset demo data</SecondaryButton>
          <SecondaryButton onClick={() => confirmAction("Clear local report filters and saved report state?", "Local reports cleared.")}>Clear all local reports</SecondaryButton>
          <button
            onClick={() => confirmAction("Disable this workspace locally? This is a demo control.", "Workspace disable request recorded.")}
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-xl border border-red-300 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 shadow-soft transition hover:-translate-y-0.5 dark:border-red-500/30 dark:bg-red-950/20 dark:text-red-200"
          >
            Disable workspace
          </button>
        </div>
      </Panel>
    </PageShell>
  );
}

function SettingCard({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <Panel>
      <div className="border-b border-black/5 pb-4 dark:border-white/10">
        <h2 className="font-semibold text-slate-950 dark:text-white">{title}</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <div className="mt-4 space-y-4">{children}</div>
    </Panel>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} className="flex w-full items-center justify-between rounded-xl border border-black/5 bg-slate-50 px-3 py-2.5 text-left dark:border-white/10 dark:bg-white/[0.04]">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      <span className={`flex h-6 w-11 items-center rounded-full p-0.5 transition ${checked ? "bg-slate-950 dark:bg-white" : "bg-slate-300 dark:bg-slate-700"}`}>
        <span className={`size-5 rounded-full bg-white transition dark:bg-slate-950 ${checked ? "translate-x-5" : "translate-x-0"}`} />
      </span>
    </button>
  );
}

function Segmented({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</p>
      <div className="grid grid-cols-3 gap-1 rounded-xl border border-black/5 bg-slate-100 p-1 dark:border-white/10 dark:bg-white/[0.04]">
        {options.map((option) => (
          <button key={option} onClick={() => onChange(option)} className={`rounded-lg px-3 py-2 text-sm font-semibold capitalize transition ${value === option ? "bg-white text-slate-950 shadow-soft dark:bg-white dark:text-slate-950" : "text-slate-600 dark:text-slate-400"}`}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

function SelectRow({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="focus-ring rounded-xl border border-black/10 bg-white px-3 py-2.5 dark:border-white/10 dark:bg-slate-950">
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function InputRow({ label, value, onChange, placeholder = "" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
      {label}
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="focus-ring rounded-xl border border-black/10 bg-white px-3 py-2.5 dark:border-white/10 dark:bg-slate-950" />
    </label>
  );
}

function mergeSettings(value: Partial<SettingsState>): SettingsState {
  return {
    appearance: { ...defaultSettings.appearance, ...value.appearance },
    notifications: { ...defaultSettings.notifications, ...value.notifications },
    risk: { ...defaultSettings.risk, ...value.risk },
    offline: { ...defaultSettings.offline, ...value.offline },
    sync: { ...defaultSettings.sync, ...value.sync },
    workspace: { ...defaultSettings.workspace, ...value.workspace },
  };
}
