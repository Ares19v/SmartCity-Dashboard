import { useEffect, useState } from "react";
import { TrafficCone, Zap, Shield, Check, Search, Activity, Radio } from "lucide-react";
import { useLiveSimulation, type SectorStatus } from "@/hooks/useLiveSimulation";
import { CityMap } from "@/components/CityMap";
import { SectorMap } from "@/components/SectorMap";
import { PowerChart } from "@/components/PowerChart";
import { EmergencyFeed } from "@/components/EmergencyFeed";

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
    <div className="flex items-center gap-2 bg-card/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-border/60 shadow-sm">
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-[9px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-medium">
          LIVE
        </span>
      </div>
      <div className="h-3 w-[1px] bg-border/80" />
      <span className="text-foreground font-mono font-medium tabular-nums text-xs md:text-sm">
        {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </span>
    </div>
  );
}

export default function Index() {
  const { trafficLights, energyLoad, emergencyUnits, sectors, alerts, powerData, lastSync } = useLiveSimulation();
  const [logFilter, setLogFilter] = useState("");
  const [focusedSectorId, setFocusedSectorId] = useState<number | null>(null);

  const handleSectorSelect = (sector: SectorStatus) => setFocusedSectorId(sector.id);

  const filteredAlerts = logFilter
    ? alerts.filter(
        (a) =>
          a.message.toLowerCase().includes(logFilter.toLowerCase()) ||
          `sector ${a.sector}`.toLowerCase().includes(logFilter.toLowerCase())
      )
    : alerts;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/50 to-sky-50/30 p-3 md:p-6 flex flex-col gap-3 md:gap-5 max-w-[1700px] mx-auto">
      {/* High-Tech Command Header */}
      <header className="calm-card p-3 md:px-5 md:py-3.5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 border border-border/80 bg-card/90 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden">
        {/* Ambient Top Glow Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-teal-500 via-sky-500 to-indigo-500 opacity-80" />

        {/* Left: Brand Identity & Sub-badge */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-teal-600 via-emerald-500 to-sky-500 flex items-center justify-center text-white shadow-md shadow-teal-500/25 ring-2 ring-white/60">
              <Activity className="h-5 w-5" strokeWidth={2.2} />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-400/50 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-lg font-bold tracking-tight text-foreground flex items-center gap-1.5">
                NEOCITY
                <span className="text-xs md:text-sm font-normal text-sky-600 dark:text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/20">
                  COMMAND OS
                </span>
              </h1>
              <span className="text-[10px] text-muted-foreground font-mono bg-muted/60 px-1.5 py-0.5 rounded">
                v2.4
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground/80 font-light flex items-center gap-1.5 mt-0.5">
              <span>Autonomous IoT Sensor Grid</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
              <span className="text-emerald-600 font-medium">12/12 Nodes Online</span>
            </p>
          </div>
        </div>

        {/* Center: Live Telemetry Micro-HUD */}
        <div className="hidden xl:flex items-center gap-2.5 bg-muted/30 p-1 rounded-xl border border-border/50">
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-card border border-border/40 text-xs shadow-sm">
            <Zap className="h-3.5 w-3.5 text-emerald-500" strokeWidth={1.75} />
            <span className="text-muted-foreground font-light">Grid Load:</span>
            <strong className="text-foreground font-medium tabular-nums">{energyLoad} MW</strong>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-card border border-border/40 text-xs shadow-sm">
            <Radio className="h-3.5 w-3.5 text-sky-500" strokeWidth={1.75} />
            <span className="text-muted-foreground font-light">Mesh Latency:</span>
            <strong className="text-foreground font-medium tabular-nums">4.2 ms</strong>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-card border border-border/40 text-xs shadow-sm">
            <Shield className="h-3.5 w-3.5 text-indigo-500" strokeWidth={1.75} />
            <span className="text-muted-foreground font-light">Fleet Standby:</span>
            <strong className="text-foreground font-medium tabular-nums">{emergencyUnits} Units</strong>
          </div>
        </div>

        {/* Right: Search, Status, and Clock */}
        <div className="flex items-center gap-2.5 md:gap-3 text-sm flex-wrap w-full lg:w-auto justify-between lg:justify-end">
          {/* Interactive Search */}
          <div className="relative flex-1 sm:flex-initial min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" strokeWidth={1.75} />
            <input
              type="text"
              placeholder="Filter activity log…"
              value={logFilter}
              onChange={(e) => setLogFilter(e.target.value)}
              className="h-8.5 w-full sm:w-52 md:w-60 rounded-lg bg-muted/40 border border-border/70 pl-8 pr-12 text-xs text-foreground placeholder:text-muted-foreground/60 font-light focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 transition-all shadow-inner"
            />
            {logFilter ? (
              <button
                onClick={() => setLogFilter("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground p-0.5"
              >
                ✕
              </button>
            ) : (
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground/60 font-mono bg-card px-1.5 py-0.5 rounded border border-border/50">
                /
              </span>
            )}
          </div>

          {/* Operational Status Pill */}
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-lg shadow-sm">
            <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
            <span>All Systems Nominal</span>
          </div>

          {/* Live Telemetry Clock */}
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
