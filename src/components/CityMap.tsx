import { Feather, Building, Heart, Home, Cpu, Waves, GraduationCap, ShoppingBag, TrainFront, Zap, Landmark, SlidersHorizontal, RotateCcw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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

const STATUS_LABEL: Record<string, string> = {
  normal: "Nominal",
  warning: "Degraded",
  critical: "Critical",
};

interface SectorHealth {
  waterPressure: string;
  airQuality: { value: number; label: string };
  connectivity: string;
}

function generateHealth(): SectorHealth {
  const aqi = Math.floor(Math.random() * 50) + 5;
  const aqiLabel = aqi <= 15 ? "Excellent" : aqi <= 30 ? "Good" : aqi <= 45 ? "Moderate" : "Fair";
  return {
    waterPressure: `${Math.floor(Math.random() * 20) + 55} psi`,
    airQuality: { value: aqi, label: aqiLabel },
    connectivity: ["Stable", "Stable", "Stable", "Intermittent"][Math.floor(Math.random() * 4)],
  };
}

function generateTooltipValue(label: string): string {
  if (label.includes("AQI")) {
    const v = Math.floor(Math.random() * 40) + 5;
    const q = v <= 20 ? "Good" : v <= 35 ? "Moderate" : "Fair";
    return `${v} (${q})`;
  }
  if (label.includes("Traffic") || label.includes("Demand") || label.includes("Volume"))
    return ["Low", "Moderate", "High"][Math.floor(Math.random() * 3)];
  if (label.includes("Level") && !label.includes("dB") && !label.includes("Security"))
    return `${Math.floor(Math.random() * 25) + 72}%`;
  if (label.includes("Quality"))
    return ["Good", "Excellent", "Fair"][Math.floor(Math.random() * 3)];
  if (label.includes("Rate") || label.includes("Occupancy") || label.includes("Uptime") || label.includes("Stability") || label.includes("Efficiency") || label.includes("Utilization") || label.includes("Mix") || label.includes("Diversion") || label.includes("Collection"))
    return `${Math.floor(Math.random() * 20) + 78}%`;
  if (label.includes("psi")) return `${Math.floor(Math.random() * 15) + 55}`;
  if (label.includes("dB")) return `${Math.floor(Math.random() * 25) + 45}`;
  if (label.includes("ms")) return `${Math.floor(Math.random() * 8) + 2}`;
  if (label.includes("°C")) return `${Math.floor(Math.random() * 15) + 38}`;
  if (label.includes("(m)")) return `${(Math.random() * 2 + 0.5).toFixed(1)}`;
  if (label.includes("kWh")) return `${Math.floor(Math.random() * 300) + 200}`;
  if (label.includes("Count") || label.includes("Units")) return `${Math.floor(Math.random() * 12) + 3}`;
  if (label.includes("Ridership")) return `${Math.floor(Math.random() * 800) + 400}`;
  if (label.includes("Time")) return `${Math.floor(Math.random() * 20) + 8} min`;
  if (label.includes("Factor")) return `${(Math.random() * 0.3 + 0.65).toFixed(2)}`;
  if (label.includes("Security")) return ["Standard", "Elevated", "High"][Math.floor(Math.random() * 3)];
  if (label.includes("Flow")) return ["Steady", "Light", "Moderate", "Heavy"][Math.floor(Math.random() * 4)];
  if (label.includes("Index")) return `${Math.floor(Math.random() * 30) + 15}`;
  return `${Math.floor(Math.random() * 50) + 50}%`;
}

const SECTOR_TOOLTIP_METRICS: Record<string, string[]> = {
  "Downtown Core": ["Pedestrian Flow", "Noise Level (dB)", "Parking Occupancy"],
  "Industrial Zone": ["Emissions Index", "Equipment Uptime", "Freight Volume"],
  "Green Park": ["Irrigation Level", "Air Quality (AQI)", "Visitor Traffic"],
  "Medical District": ["Bed Availability", "Ambulance Units", "Wait Time (avg)"],
  "Residential North": ["Water Pressure (psi)", "Waste Collection", "Grid Stability"],
  "Tech Hub": ["Network Latency (ms)", "Server Load", "Data Throughput"],
  "Harbor Front": ["Tide Level (m)", "Vessel Count", "Water Quality"],
  "University": ["Campus Occupancy", "Lab Utilization", "Transit Demand"],
  "Commercial East": ["Foot Traffic", "Energy Use (kWh)", "Waste Diversion"],
  "Transit Hub": ["On-Time Rate", "Ridership (hourly)", "Platform Load"],
  "Power Grid": ["Load Factor", "Renewable Mix", "Transformer Temp (°C)"],
  "Civic Center": ["Building Occupancy", "HVAC Efficiency", "Security Level"],
};

const INFRASTRUCTURE = ["Downtown Core", "Industrial Zone", "Power Grid", "Transit Hub", "Harbor Front"];
const SERVICE = ["Green Park", "Medical District", "University", "Commercial East", "Civic Center", "Residential North", "Tech Hub"];

export function CityMap({ sectors, onSectorSelect }: { sectors: SectorStatus[]; onSectorSelect?: (sector: SectorStatus) => void }) {
  const [sectorFilter, setSectorFilter] = useState<"all" | "infrastructure" | "service">("all");
  const [selectedSector, setSelectedSector] = useState<SectorStatus | null>(null);
  const [health, setHealth] = useState<SectorHealth | null>(null);
  const [resetFlash, setResetFlash] = useState(false);

  const tooltipData = useMemo(() => {
    const map: Record<string, { label: string; value: string }[]> = {};
    for (const sector of sectors) {
      const labels = SECTOR_TOOLTIP_METRICS[sector.name] || [];
      map[sector.name] = labels.map(l => ({ label: l, value: generateTooltipValue(l) }));
    }
    return map;
  }, [sectors]);

  const filteredSectors = useMemo(() => {
    if (sectorFilter === "infrastructure") return sectors.filter(s => INFRASTRUCTURE.includes(s.name));
    if (sectorFilter === "service") return sectors.filter(s => SERVICE.includes(s.name));
    return sectors;
  }, [sectors, sectorFilter]);

  const handleSectorClick = (sector: SectorStatus) => {
    setSelectedSector(sector);
    setHealth(generateHealth());
    setResetFlash(false);
    onSectorSelect?.(sector);
  };

  const handleReset = () => {
    setResetFlash(true);
    setHealth(generateHealth());
    setTimeout(() => setResetFlash(false), 600);
  };

  return (
    <>
      <div className="calm-card p-4 md:p-5">
        <div className="flex items-center justify-between gap-2 mb-3.5 flex-wrap">
          <div className="flex items-center gap-2">
            <Building className="h-3.5 w-3.5 text-primary" strokeWidth={1.5} />
            <h2 className="text-[11px] font-medium text-muted-foreground tracking-wider uppercase">
              Municipal Sector Grid
            </h2>
          </div>

          {/* Quick Segmented Filter */}
          <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg text-[10px]">
            {(["all", "infrastructure", "service"] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setSectorFilter(opt)}
                className={`px-2 py-1 rounded-md transition-all font-light ${
                  sectorFilter === opt
                    ? "bg-card text-foreground font-medium shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {opt === "all" ? "All (12)" : opt === "infrastructure" ? "Infra (5)" : "Services (7)"}
              </button>
            ))}
          </div>
        </div>

        {/* 4-column Sector Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {filteredSectors.map((sector) => {
            const Icon = ICON_MAP[sector.icon] || Building;
            const metrics = tooltipData[sector.name] || [];
            return (
              <Tooltip key={sector.id} delayDuration={200}>
                <TooltipTrigger asChild>
                  <div
                    onClick={() => handleSectorClick(sector)}
                    className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-lg border border-border/40 bg-muted/20 hover:bg-muted/60 hover:border-border transition-all cursor-pointer group"
                  >
                    <div className="relative">
                      <div className="p-1.5 rounded-md bg-card border border-border/50 group-hover:border-primary/40 transition-all">
                        <Icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" strokeWidth={1.5} />
                      </div>
                      <div className={`absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full ${STATUS_DOT[sector.status]} ring-2 ring-card`} />
                    </div>
                    <span className="text-[10px] text-muted-foreground group-hover:text-foreground font-light truncate w-full text-center leading-tight transition-colors">
                      {sector.name}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-card border-border px-3.5 py-3 max-w-[210px] shadow-lg" side="top">
                  <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-1.5 mb-2">
                    <p className="font-medium text-xs text-foreground">{sector.name}</p>
                    <span className={`text-[9px] uppercase font-medium px-1.5 py-0.2 rounded ${
                      sector.status === "normal" ? "bg-primary/10 text-primary" :
                      sector.status === "warning" ? "bg-warning/10 text-warning" :
                      "bg-destructive/10 text-destructive"
                    }`}>
                      {sector.status}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {metrics.map((m) => (
                      <div key={m.label} className="flex justify-between gap-3 text-[11px]">
                        <span className="text-muted-foreground font-light">{m.label}</span>
                        <span className="text-foreground font-medium whitespace-nowrap">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>

      {/* Sector Diagnostic Modal */}
      <Dialog open={!!selectedSector} onOpenChange={(open) => !open && setSelectedSector(null)}>
        <DialogContent className="bg-card border-border max-w-sm rounded-xl p-5 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-sm font-medium text-foreground flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {selectedSector && (() => {
                  const Icon = ICON_MAP[selectedSector.icon] || Building;
                  return <Icon className="h-4 w-4 text-primary" strokeWidth={1.5} />;
                })()}
                <span>{selectedSector?.name}</span>
              </div>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                selectedSector?.status === "normal" ? "bg-primary/10 text-primary border-primary/20" :
                selectedSector?.status === "warning" ? "bg-warning/10 text-warning border-warning/20" :
                "bg-destructive/10 text-destructive border-destructive/20"
              }`}>
                {selectedSector && STATUS_LABEL[selectedSector.status]}
              </span>
            </DialogTitle>
          </DialogHeader>

          {health && (
            <div className={`space-y-3 pt-2 transition-opacity duration-300 ${resetFlash ? "opacity-40" : "opacity-100"}`}>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-wider">
                <span>Diagnostic Telemetry</span>
                <span>Node #{selectedSector?.id}</span>
              </div>

              <div className="space-y-2 text-xs">
                {/* Water Pressure */}
                <div className="p-2.5 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-between">
                  <span className="text-muted-foreground font-light">Water Pressure</span>
                  <span className="text-foreground font-medium tabular-nums">{health.waterPressure}</span>
                </div>

                {/* Air Quality */}
                <div className="p-2.5 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground font-light">Air Quality Index (AQI)</p>
                    <p className="text-[10px] text-muted-foreground/70">Category: {health.airQuality.label}</p>
                  </div>
                  <span className="text-foreground font-medium tabular-nums text-sm">{health.airQuality.value}</span>
                </div>

                {/* Connectivity */}
                <div className="p-2.5 rounded-lg bg-muted/40 border border-border/40 flex items-center justify-between">
                  <span className="text-muted-foreground font-light">Mesh Connectivity</span>
                  <span className={`font-medium text-xs px-2 py-0.5 rounded ${
                    health.connectivity === "Stable" ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"
                  }`}>
                    {health.connectivity}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="w-full text-xs font-light h-9 border-border/80 hover:bg-muted/60 transition-all"
                >
                  <RotateCcw className="h-3 w-3 mr-2 text-primary" strokeWidth={1.5} />
                  Re-calibrate Sector Telemetry
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
