import { useEffect, useState } from "react";
import { TrafficCone, Zap, Shield, Check } from "lucide-react";
import { useLiveSimulation } from "@/hooks/useLiveSimulation";
import { CityMap } from "@/components/CityMap";
import { PowerChart } from "@/components/PowerChart";
import { EmergencyFeed } from "@/components/EmergencyFeed";

function StatCard({ icon: Icon, label, value, unit }: {
  icon: React.ElementType; label: string; value: number; unit: string;
}) {
  return (
    <div className="calm-card p-5 transition-all duration-500">
      <div className="flex items-center gap-4">
        <Icon className="h-5 w-5 text-primary shrink-0" strokeWidth={1.5} />
        <div className="flex-1">
          <p className="text-[11px] text-muted-foreground font-medium tracking-wide uppercase">{label}</p>
          <p className="text-2xl font-light text-foreground tabular-nums mt-0.5">
            {value.toLocaleString()}
            {unit && <span className="text-sm text-muted-foreground ml-1.5">{unit}</span>}
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
    <span className="text-muted-foreground font-light tabular-nums text-sm">
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  );
}

export default function Index() {
  const { trafficLights, energyLoad, emergencyUnits, sectors, alerts, powerData } = useLiveSimulation();

  return (
    <div className="min-h-screen bg-background p-5 md:p-6 flex flex-col gap-5">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="text-base font-medium tracking-wide text-foreground">
          NeoCity <span className="text-muted-foreground font-light">Command</span>
        </h1>
        <div className="flex items-center gap-5 text-sm">
          <span className="flex items-center gap-1.5 text-primary text-xs font-medium">
            <Check className="h-3.5 w-3.5" strokeWidth={2} />
            Operational
          </span>
          <LiveClock />
        </div>
      </header>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard icon={TrafficCone} label="Active Traffic Lights" value={trafficLights} unit="" />
        <StatCard icon={Zap} label="Current Energy Load" value={energyLoad} unit="MW" />
        <StatCard icon={Shield} label="Emergency Units" value={emergencyUnits} unit="active" />
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
