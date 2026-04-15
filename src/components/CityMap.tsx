import { Feather, Building, TreePine, Heart, Home, Cpu, Waves, GraduationCap, ShoppingBag, TrainFront, Zap, Landmark, SlidersHorizontal } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { SectorStatus } from "@/hooks/useLiveSimulation";
import { useMemo, useState } from "react";

const ICON_MAP: Record<string, React.ElementType> = {
  Building2: Building, Factory: Cpu, Trees: Feather, Hospital: Heart,
  Home, Cpu, Ship: Waves, GraduationCap, ShoppingBag, Train: TrainFront, Zap, Landmark,
};

const STATUS_DOT: Record<string, string> = {
  normal: "bg-primary",
  warning: "bg-warning",
  critical: "bg-destructive",
};

interface SectorDetail {
  metrics: { label: string; value: string }[];
}

const SECTOR_DETAILS: Record<string, SectorDetail> = {
  "Downtown Core": {
    metrics: [
      { label: "Pedestrian Flow", value: "" },
      { label: "Noise Level (dB)", value: "" },
      { label: "Parking Occupancy", value: "" },
    ],
  },
  "Industrial Zone": {
    metrics: [
      { label: "Emissions Index", value: "" },
      { label: "Equipment Uptime", value: "" },
      { label: "Freight Volume", value: "" },
    ],
  },
  "Green Park": {
    metrics: [
      { label: "Irrigation Level", value: "" },
      { label: "Air Quality (AQI)", value: "" },
      { label: "Visitor Traffic", value: "" },
    ],
  },
  "Medical District": {
    metrics: [
      { label: "Bed Availability", value: "" },
      { label: "Ambulance Units", value: "" },
      { label: "Wait Time (avg)", value: "" },
    ],
  },
  "Residential North": {
    metrics: [
      { label: "Water Pressure (psi)", value: "" },
      { label: "Waste Collection", value: "" },
      { label: "Grid Stability", value: "" },
    ],
  },
  "Tech Hub": {
    metrics: [
      { label: "Network Latency (ms)", value: "" },
      { label: "Server Load", value: "" },
      { label: "Data Throughput", value: "" },
    ],
  },
  "Harbor Front": {
    metrics: [
      { label: "Tide Level (m)", value: "" },
      { label: "Vessel Count", value: "" },
      { label: "Water Quality", value: "" },
    ],
  },
  "University": {
    metrics: [
      { label: "Campus Occupancy", value: "" },
      { label: "Lab Utilization", value: "" },
      { label: "Transit Demand", value: "" },
    ],
  },
  "Commercial East": {
    metrics: [
      { label: "Foot Traffic", value: "" },
      { label: "Energy Use (kWh)", value: "" },
      { label: "Waste Diversion", value: "" },
    ],
  },
  "Transit Hub": {
    metrics: [
      { label: "On-Time Rate", value: "" },
      { label: "Ridership (hourly)", value: "" },
      { label: "Platform Load", value: "" },
    ],
  },
  "Power Grid": {
    metrics: [
      { label: "Load Factor", value: "" },
      { label: "Renewable Mix", value: "" },
      { label: "Transformer Temp (°C)", value: "" },
    ],
  },
  "Civic Center": {
    metrics: [
      { label: "Building Occupancy", value: "" },
      { label: "HVAC Efficiency", value: "" },
      { label: "Security Level", value: "" },
    ],
  },
};

function generateValue(label: string): string {
  if (label.includes("AQI")) {
    const v = Math.floor(Math.random() * 40) + 5;
    const q = v <= 20 ? "Good" : v <= 35 ? "Moderate" : "Fair";
    return `${v} (${q})`;
  }
  if (label.includes("Traffic") || label.includes("Demand") || label.includes("Volume")) {
    return ["Low", "Moderate", "High"][Math.floor(Math.random() * 3)];
  }
  if (label.includes("Level") && !label.includes("dB") && !label.includes("Security")) {
    return `${Math.floor(Math.random() * 25) + 72}%`;
  }
  if (label.includes("Quality")) {
    return ["Good", "Excellent", "Fair"][Math.floor(Math.random() * 3)];
  }
  if (label.includes("%") || label.includes("Rate") || label.includes("Occupancy") || label.includes("Uptime") || label.includes("Stability") || label.includes("Efficiency") || label.includes("Utilization") || label.includes("Mix") || label.includes("Diversion") || label.includes("Collection")) {
    return `${Math.floor(Math.random() * 20) + 78}%`;
  }
  if (label.includes("psi")) return `${Math.floor(Math.random() * 15) + 55}`;
  if (label.includes("dB")) return `${Math.floor(Math.random() * 25) + 45}`;
  if (label.includes("ms")) return `${Math.floor(Math.random() * 8) + 2}`;
  if (label.includes("°C")) return `${Math.floor(Math.random() * 15) + 38}`;
  if (label.includes("(m)")) return `${(Math.random() * 2 + 0.5).toFixed(1)}`;
  if (label.includes("kWh")) return `${Math.floor(Math.random() * 300) + 200}`;
  if (label.includes("Count") || label.includes("Units")) return `${Math.floor(Math.random() * 12) + 3}`;
  if (label.includes("Ridership")) return `${Math.floor(Math.random() * 800) + 400}`;
  if (label.includes("Time")) return `${Math.floor(Math.random() * 20) + 8} min`;
  if (label.includes("Throughput") || label.includes("Load") && !label.includes("Factor")) return `${Math.floor(Math.random() * 30) + 55}%`;
  if (label.includes("Factor")) return `${(Math.random() * 0.3 + 0.65).toFixed(2)}`;
  if (label.includes("Security")) return ["Standard", "Elevated", "High"][Math.floor(Math.random() * 3)];
  if (label.includes("Flow")) return ["Steady", "Light", "Moderate", "Heavy"][Math.floor(Math.random() * 4)];
  if (label.includes("Index")) return `${Math.floor(Math.random() * 30) + 15}`;
  return `${Math.floor(Math.random() * 50) + 50}`;
}

export function CityMap({ sectors }: { sectors: SectorStatus[] }) {
  const sectorMetrics = useMemo(() => {
    const map: Record<string, { label: string; value: string }[]> = {};
    for (const sector of sectors) {
      const detail = SECTOR_DETAILS[sector.name];
      if (detail) {
        map[sector.name] = detail.metrics.map(m => ({
          label: m.label,
          value: generateValue(m.label),
        }));
      }
    }
    return map;
  }, [sectors]);

  const [sectorFilter, setSectorFilter] = useState<"all" | "infrastructure" | "service">("all");

  const INFRASTRUCTURE = ["Downtown Core", "Industrial Zone", "Power Grid", "Transit Hub", "Harbor Front"];
  const SERVICE = ["Green Park", "Medical District", "University", "Commercial East", "Civic Center", "Residential North", "Tech Hub"];

  const filteredSectors = useMemo(() => {
    if (sectorFilter === "infrastructure") return sectors.filter(s => INFRASTRUCTURE.includes(s.name));
    if (sectorFilter === "service") return sectors.filter(s => SERVICE.includes(s.name));
    return sectors;
  }, [sectors, sectorFilter]);

  return (
    <div className="calm-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <Popover>
          <PopoverTrigger asChild>
            <button className="p-1 rounded hover:bg-muted/60 transition-colors">
              <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="bg-card border-border w-44 p-2" align="start">
            {(["all", "infrastructure", "service"] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setSectorFilter(opt)}
                className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-light transition-colors ${
                  sectorFilter === opt ? "bg-muted text-foreground font-medium" : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                {opt === "all" ? "All Sectors" : opt === "infrastructure" ? "Infrastructure Status" : "Service Level"}
              </button>
            ))}
          </PopoverContent>
        </Popover>
        <h2 className="text-[11px] font-medium text-muted-foreground tracking-wide uppercase">City Sectors</h2>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {filteredSectors.map((sector) => {
          const Icon = ICON_MAP[sector.icon] || Building;
          const metrics = sectorMetrics[sector.name] || [];
          return (
            <Tooltip key={sector.id} delayDuration={200}>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-md hover:bg-muted/50 transition-colors cursor-pointer group">
                  <div className="relative">
                    <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" strokeWidth={1.5} />
                    <div className={`absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full ${STATUS_DOT[sector.status]}`} />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-light truncate w-full text-center">{sector.name}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-card border-border px-3.5 py-3 max-w-[200px]" side="top">
                <p className="font-medium text-xs text-foreground mb-2">{sector.name}</p>
                <div className="space-y-1.5">
                  {metrics.map((m) => (
                    <div key={m.label} className="flex justify-between gap-3 text-[11px]">
                      <span className="text-muted-foreground font-light">{m.label}</span>
                      <span className="text-primary font-medium whitespace-nowrap">{m.value}</span>
                    </div>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
