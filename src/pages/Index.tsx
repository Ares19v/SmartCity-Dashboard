import { useEffect, useState } from "react";
import { TrafficCone, Zap, Shield, Check, Search, Activity, Radio } from "lucide-react";
import { useLiveSimulation, type SectorStatus } from "@/hooks/useLiveSimulation";
import { CityMap } from "@/components/CityMap";
import { SectorMap } from "@/components/SectorMap";
import { PowerChart } from "@/components/PowerChart";
import { EmergencyFeed } from "@/components/EmergencyFeed";

function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  subtext,
  progress,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  unit: string;
  subtext: string;
  progress: number;
}) {
  return (
    <div className="calm-card p-4 md:p-5 transition-all duration-300 group">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary shrink-0 transition-transform group-hover:scale-105">
          <Icon className="h-4 w-4 md:h-4.5 md:w-4.5" strokeWidth={1.75} />
        </div>
        <span className="text-[10px] text-primary/90 font-medium px-2 py-0.5 rounded-full bg-primary/10 tabular-nums">
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
      <div className="w-full bg-muted/60 h-1 rounded-full mt-3 overflow-hidden">
        <div
          className="bg-primary h-full rounded-full transition-all duration-700"
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
    <span className="text-muted-foreground font-light tabular-nums text-xs md:text-sm flex items-center gap-1.5 bg-muted/40 px-2.5 py-1 rounded-md border border-border/40">
      <Radio className="h-3 w-3 text-primary animate-pulse" />
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
    <div className="min-h-screen bg-background p-3 md:p-6 flex flex-col gap-3 md:gap-5 max-w-[1700px] mx-auto">
      {/* Header */}
      <header className="calm-card px-4 py-3 md:px-5 md:py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
            <Activity className="h-4 w-4" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-sm md:text-base font-medium tracking-tight text-foreground flex items-center gap-2">
              NeoCity <span className="text-muted-foreground font-light">Command Center</span>
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping inline-block" />
            </h1>
            <p className="text-[10px] text-muted-foreground font-light hidden sm:block">
              Integrated Urban Analytics & IoT Sensor Grid
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 md:gap-3 text-sm flex-wrap w-full sm:w-auto justify-between sm:justify-end">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground/60" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search activity log… (/)"
              value={logFilter}
              onChange={(e) => setLogFilter(e.target.value)}
              className="h-8 w-full sm:w-48 md:w-56 rounded-lg bg-muted/50 border border-border/50 pl-7 pr-3 text-xs text-foreground placeholder:text-muted-foreground/60 font-light focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-all"
            />
          </div>
          <span className="hidden md:flex items-center gap-1.5 text-primary text-xs font-medium bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-md">
            <Check className="h-3 w-3" strokeWidth={2.5} />
            All Systems Nominal
          </span>
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
        />
        <StatCard
          icon={Zap}
          label="Grid Energy Demand"
          value={energyLoad}
          unit="MW"
          subtext="Normal Range"
          progress={(energyLoad / 600) * 100}
        />
        <StatCard
          icon={Shield}
          label="Emergency Response Fleet"
          value={emergencyUnits}
          unit="units"
          subtext="Ready / Standby"
          progress={(emergencyUnits / 40) * 100}
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
