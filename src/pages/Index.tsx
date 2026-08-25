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
    <span className="text-muted-foreground font-light tabular-nums text-xs md:text-sm bg-muted/30 px-2.5 py-1 rounded-lg border border-border/40">
      {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
    </span>
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
      {/* Clean & Cohesive Header */}
      <header className="calm-card px-4 py-3 md:px-5 md:py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
            <Activity className="h-4 w-4" strokeWidth={1.75} />
          </div>
          <div>
            <h1 className="text-sm md:text-base font-medium tracking-tight text-foreground flex items-center gap-2">
              NeoCity <span className="text-muted-foreground font-light">Command Center</span>
            </h1>
            <p className="text-[10px] md:text-[11px] text-muted-foreground/80 font-light">
              Municipal Operations & Autonomous IoT Sensor Grid
            </p>
          </div>
        </div>

        {/* Right: Search, Status, and Clock */}
        <div className="flex items-center gap-2.5 md:gap-3 text-sm flex-wrap w-full sm:w-auto justify-between sm:justify-end">
          {/* Search Filter */}
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Filter activity log…"
              value={logFilter}
              onChange={(e) => setLogFilter(e.target.value)}
              className="h-8 w-full sm:w-44 md:w-56 rounded-lg bg-muted/40 border border-border/60 pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground/50 font-light focus:outline-none focus:ring-1 focus:ring-emerald-500/30 focus:border-emerald-500/40 transition-all"
            />
          </div>

          {/* Operational Status Badge */}
          <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            All Systems Nominal
          </span>

          {/* Clock */}
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
