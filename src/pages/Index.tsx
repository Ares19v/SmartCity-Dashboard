import React, { useEffect, useState } from "react";
import { TrafficCone, Zap, Shield, Check, Search, Activity, Radio, Sparkles, Layers } from "lucide-react";
import { useLiveSimulation, type SectorStatus } from "@/hooks/useLiveSimulation";
import { CityMap } from "@/components/CityMap";
import { SectorMap } from "@/components/SectorMap";
import { PowerChart } from "@/components/PowerChart";
import { EmergencyFeed } from "@/components/EmergencyFeed";
import { GlassDashboard } from "@/components/GlassDashboard";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  unit: string;
  subtext: string;
  progress: number;
  accent: "sky" | "emerald" | "indigo";
}

const ACCENT_STYLES = {
  sky: {
    iconBg: "bg-sky-500/10 border-sky-500/20 text-sky-600 dark:text-sky-400",
    badge: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20",
    bar: "bg-sky-500",
  },
  emerald: {
    iconBg: "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
    bar: "bg-emerald-500",
  },
  indigo: {
    iconBg: "bg-indigo-500/10 border-indigo-500/20 text-indigo-600 dark:text-indigo-400",
    badge: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
    bar: "bg-indigo-500",
  },
};

function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  subtext,
  progress,
  accent,
}: StatCardProps) {
  const styles = ACCENT_STYLES[accent];

  return (
    <div className="calm-card p-4 md:p-5 transition-all duration-300 group hover:border-border">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className={`p-2 rounded-lg border shrink-0 transition-transform group-hover:scale-105 ${styles.iconBg}`}>
          <Icon className="h-4 w-4 md:h-4.5 md:w-4.5" strokeWidth={1.75} />
        </div>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border tabular-nums ${styles.badge}`}>
          {subtext}
        </span>
      </div>

      <div className="mt-1">
        <p className="text-[10px] md:text-[11px] text-muted-foreground font-medium tracking-wider uppercase truncate">
          {label}
        </p>
        <p className="text-2xl md:text-3xl font-light text-foreground tabular-nums tracking-tight mt-0.5">
          {value.toLocaleString()}
          {unit && <span className="text-xs md:text-sm text-muted-foreground font-normal ml-1.5">{unit}</span>}
        </p>
      </div>

      {/* Progress Bar Indicator */}
      <div className="w-full bg-muted/60 h-1.5 rounded-full mt-3 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${styles.bar}`}
          style={{ width: `${Math.min(100, Math.max(10, progress))}%` }}
        />
      </div>
    </div>
  );
}

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/25 text-indigo-900 dark:text-indigo-200 px-3 py-1.5 rounded-lg shadow-sm">
      <Radio className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
      <span className="font-mono font-medium tabular-nums text-xs md:text-sm">
        {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </span>
    </div>
  );
}

export default function Index() {
  const simulation = useLiveSimulation();
  const { trafficLights, energyLoad, emergencyUnits, sectors, alerts, powerData, lastSync } = simulation;
  const [logFilter, setLogFilter] = useState("");
  const [focusedSectorId, setFocusedSectorId] = useState<number | null>(null);
  const [mode, setMode] = useState<"standard" | "glass">("glass");

  const handleSectorSelect = (sector: SectorStatus) => setFocusedSectorId(sector.id);

  const filteredAlerts = logFilter
    ? alerts.filter(
        (a) =>
          a.message.toLowerCase().includes(logFilter.toLowerCase()) ||
          `sector ${a.sector}`.toLowerCase().includes(logFilter.toLowerCase())
      )
    : alerts;

  if (mode === "glass") {
    return (
      <GlassDashboard
        simulation={simulation}
        onSectorSelect={handleSectorSelect}
        focusedSectorId={focusedSectorId}
        mode={mode}
        setMode={setMode}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/50 to-sky-50/30 p-3 md:p-6 flex flex-col gap-3 md:gap-5 max-w-[1700px] mx-auto">
      {/* Refined & Colorful Command Header */}
      <header className="calm-card p-3 md:px-5 md:py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 border border-sky-500/20 bg-gradient-to-r from-card via-card to-sky-500/[0.04] shadow-[0_2px_12px_rgba(14,165,233,0.05)]">
        {/* Left: Brand Identity with Vibrant Gradient Badge */}
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-teal-600 via-emerald-500 to-sky-500 text-white shadow-md shadow-teal-500/25 ring-2 ring-emerald-500/20 flex items-center justify-center shrink-0">
            <Activity className="h-4.5 w-4.5" strokeWidth={2} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm md:text-base font-semibold tracking-tight text-foreground">
                NeoCity
              </h1>
              <span className="text-[11px] font-medium text-sky-700 dark:text-sky-300 bg-sky-500/10 border border-sky-500/25 px-2 py-0.5 rounded-md">
                Command Center
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground/85 font-light flex items-center gap-1.5 mt-0.5">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">12/12 Nodes Online</span>
              <span className="text-muted-foreground/40">•</span>
              <span>Autonomous IoT Sensor Grid</span>
            </p>
          </div>
        </div>

        {/* Right: Mode Switcher, Search, Status, and Clock */}
        <div className="flex items-center gap-2.5 md:gap-3 text-sm flex-wrap w-full sm:w-auto justify-between sm:justify-end">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-lg text-xs">
            <button
              onClick={() => setMode("standard")}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                mode === "standard" ? "bg-card text-foreground font-medium shadow-sm" : "text-muted-foreground"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              HUD
            </button>
            <button
              onClick={() => setMode("glass")}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                mode === "glass" ? "bg-card text-foreground font-medium shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
              Glass Mode
            </button>
          </div>

          {/* Search Filter with Sky Blue Accent */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-sky-600/70 dark:text-sky-400" strokeWidth={1.75} />
            <input
              type="text"
              placeholder="Filter activity log…"
              value={logFilter}
              onChange={(e) => setLogFilter(e.target.value)}
              className="h-8.5 w-full sm:w-40 md:w-48 rounded-lg bg-card/90 border border-sky-500/25 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground/60 font-light focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500/60 transition-all shadow-sm"
            />
          </div>

          {/* Operational Status Badge with Rich Emerald Accent */}
          <span className="hidden md:flex items-center gap-1.5 text-xs font-medium text-emerald-800 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 rounded-lg shadow-sm shadow-emerald-500/10">
            <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
            All Systems Nominal
          </span>

          {/* Indigo Time Capsule Clock */}
          <LiveClock />
        </div>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <StatCard
          icon={TrafficCone}
          label="Active Traffic Controllers"
          value={trafficLights}
          unit="nodes"
          subtext="98.2% Sync"
          progress={(trafficLights / 1400) * 100}
          accent="sky"
        />
        <StatCard
          icon={Zap}
          label="Grid Energy Demand"
          value={energyLoad}
          unit="MW"
          subtext="Normal Range"
          progress={(energyLoad / 600) * 100}
          accent="emerald"
        />
        <StatCard
          icon={Shield}
          label="Emergency Response Fleet"
          value={emergencyUnits}
          unit="units"
          subtext="Ready / Standby"
          progress={(emergencyUnits / 40) * 100}
          accent="indigo"
        />
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 md:gap-4 flex-1 min-h-0">
        <div className="md:col-span-1 lg:col-span-3 min-h-[320px] lg:max-h-[calc(100vh-270px)] h-full overflow-hidden">
          <EmergencyFeed alerts={filteredAlerts} />
        </div>
        <div className="md:col-span-1 lg:col-span-5 flex flex-col gap-3 md:gap-4">
          <CityMap sectors={sectors} onSectorSelect={handleSectorSelect} />
          <PowerChart data={powerData} />
        </div>
        <div className="md:col-span-2 lg:col-span-4 flex flex-col gap-3 md:gap-4">
          <SectorMap sectors={sectors} selectedId={focusedSectorId} onSelect={handleSectorSelect} />
        </div>
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-between pt-1 text-[10px] text-muted-foreground/70 font-light border-t border-border/40 px-1">
        <span>NeoCity Autonomous Municipal OS v2.4</span>
        <span>
          Last Telemetry Ingestion · {lastSync.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
        </span>
      </footer>
    </div>
  );
}
