import { useEffect, useState } from "react";
import { TrafficCone, Zap, Shield, Check, Search } from "lucide-react";
import { useLiveSimulation, type SectorStatus } from "@/hooks/useLiveSimulation";
import { CityMap } from "@/components/CityMap";
import { SectorMap } from "@/components/SectorMap";
import { PowerChart } from "@/components/PowerChart";
import { EmergencyFeed } from "@/components/EmergencyFeed";

function StatCard({ icon: Icon, label, value, unit }: {
  icon: React.ElementType; label: string; value: number; unit: string;
}) {
  return (
    <div className="calm-card p-4 md:p-5 transition-all duration-500">
      <div className="flex items-center gap-3 md:gap-4">
        <Icon className="h-4 w-4 md:h-5 md:w-5 text-primary shrink-0" strokeWidth={1.5} />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] md:text-[11px] text-muted-foreground font-medium tracking-wide uppercase truncate">{label}</p>
          <p className="text-xl md:text-2xl font-light text-foreground tabular-nums mt-0.5 transition-all duration-700">
            {value.toLocaleString()}
            {unit && <span className="text-xs md:text-sm text-muted-foreground ml-1.5">{unit}</span>}
          </p>
        </div>
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
    <span className="text-muted-foreground font-light tabular-nums text-xs md:text-sm">
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  );
}

export default function Index() {
  const { trafficLights, energyLoad, emergencyUnits, sectors, alerts, powerData, lastSync } = useLiveSimulation();
  const [logFilter, setLogFilter] = useState("");
  const [focusedSectorId, setFocusedSectorId] = useState<number | null>(null);

  const handleSectorSelect = (sector: SectorStatus) => setFocusedSectorId(sector.id);

  const filteredAlerts = logFilter
    ? alerts.filter(a =>
        a.message.toLowerCase().includes(logFilter.toLowerCase()) ||
        `sector ${a.sector}`.toLowerCase().includes(logFilter.toLowerCase())
      )
    : alerts;

  return (
    <div className="h-screen bg-background p-4 md:p-6 flex flex-col gap-4 md:gap-5 overflow-hidden">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h1 className="text-sm md:text-base font-medium tracking-wide text-foreground">
          NeoCity <span className="text-muted-foreground font-light">Command</span>
        </h1>
        <div className="flex items-center gap-3 md:gap-4 text-sm flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground/60" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Filter activity log…"
              value={logFilter}
              onChange={(e) => setLogFilter(e.target.value)}
              className="h-7 w-36 md:w-44 rounded-md bg-muted/60 border-none pl-7 pr-3 text-xs text-foreground placeholder:text-muted-foreground/50 font-light focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
            />
          </div>
          <span className="flex items-center gap-1.5 text-primary text-xs font-medium">
            <Check className="h-3.5 w-3.5" strokeWidth={2} />
            Operational
          </span>
          <LiveClock />
        </div>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <StatCard icon={TrafficCone} label="Active Traffic Lights" value={trafficLights} unit="" />
        <StatCard icon={Zap} label="Current Energy Load" value={energyLoad} unit="MW" />
        <StatCard icon={Shield} label="Emergency Units" value={emergencyUnits} unit="active" />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 md:gap-4 flex-1 min-h-0">
        <div className="md:col-span-1 lg:col-span-3 min-h-[300px] md:min-h-0 h-full overflow-hidden">
          <EmergencyFeed alerts={filteredAlerts} />
        </div>
        <div className="md:col-span-1 lg:col-span-5 flex flex-col gap-3 md:gap-4">
          <CityMap sectors={sectors} />
        </div>
        <div className="md:col-span-2 lg:col-span-4 flex flex-col gap-3 md:gap-4">
          <PowerChart data={powerData} />
        </div>
      </div>

      {/* Footer */}
      <footer className="flex items-center justify-end pt-1">
        <p className="text-[10px] text-muted-foreground/60 font-light">
          Last System Sync · {lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </footer>
    </div>
  );
}
