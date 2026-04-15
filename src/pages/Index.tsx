import { useEffect, useState } from "react";
import { TrafficCone, Zap, Siren } from "lucide-react";
import { useLiveSimulation } from "@/hooks/useLiveSimulation";
import { CityMap } from "@/components/CityMap";
import { PowerChart } from "@/components/PowerChart";
import { EmergencyFeed } from "@/components/EmergencyFeed";

function StatCard({ icon: Icon, label, value, unit, glowClass, iconColor }: {
  icon: React.ElementType; label: string; value: number; unit: string; glowClass: string; iconColor: string;
}) {
  return (
    <div className={`glass-panel p-4 ${glowClass} transition-all duration-500`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-white/5 ${iconColor}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold text-foreground tabular-nums">
            {value.toLocaleString()}
            <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>
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
    <span className="text-primary font-mono tabular-nums">
      {time.toLocaleTimeString()}
    </span>
  );
}

export default function Index() {
  const { trafficLights, energyLoad, emergencyUnits, sectors, alerts, powerData } = useLiveSimulation();

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col gap-4">
      {/* Header */}
      <header className="glass-panel px-6 py-3 flex items-center justify-between glow-cyan">
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <h1 className="text-lg font-bold tracking-wider text-foreground uppercase">
            Neo<span className="text-primary">City</span> Command
          </h1>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">System Status: <span className="text-green-400 font-medium">ONLINE</span></span>
          <LiveClock />
        </div>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={TrafficCone} label="Active Traffic Lights" value={trafficLights} unit="" glowClass="glow-cyan" iconColor="text-primary" />
        <StatCard icon={Zap} label="Current Energy Load" value={energyLoad} unit="MW" glowClass="glow-purple" iconColor="text-accent" />
        <StatCard icon={Siren} label="Emergency Units" value={emergencyUnits} unit="active" glowClass="glow-amber" iconColor="text-yellow-400" />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
        <div className="lg:col-span-3 min-h-[400px]">
          <EmergencyFeed alerts={alerts} />
        </div>
        <div className="lg:col-span-5 flex flex-col gap-4">
          <CityMap sectors={sectors} />
        </div>
        <div className="lg:col-span-4 flex flex-col gap-4">
          <PowerChart data={powerData} />
        </div>
      </div>
    </div>
  );
}
