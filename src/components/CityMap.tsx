import { Feather, Building, TreePine, Heart, Home, Cpu, Waves, GraduationCap, ShoppingBag, TrainFront, Zap, Landmark } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { SectorStatus } from "@/hooks/useLiveSimulation";

const ICON_MAP: Record<string, React.ElementType> = {
  Building2: Building, Factory: Cpu, Trees: Feather, Hospital: Heart,
  Home, Cpu, Ship: Waves, GraduationCap, ShoppingBag, Train: TrainFront, Zap, Landmark,
};

const STATUS_DOT: Record<string, string> = {
  normal: "bg-primary",
  warning: "bg-warning",
  critical: "bg-destructive",
};

export function CityMap({ sectors }: { sectors: SectorStatus[] }) {
  return (
    <div className="calm-card p-5">
      <h2 className="text-[11px] font-medium text-muted-foreground mb-4 tracking-wide uppercase">City Sectors</h2>
      <div className="grid grid-cols-4 grid-rows-3 gap-3">
        {sectors.map((sector) => {
          const Icon = ICON_MAP[sector.icon] || Building;
          return (
            <Tooltip key={sector.id}>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-md hover:bg-muted/50 transition-colors cursor-pointer group">
                  <div className="relative">
                    <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" strokeWidth={1.5} />
                    <div className={`absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full ${STATUS_DOT[sector.status]}`} />
                  </div>
                  <span className="text-[10px] text-muted-foreground font-light truncate w-full text-center">{sector.name}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-card border-border">
                <p className="font-medium text-sm">{sector.name}</p>
                <p className="text-xs capitalize text-muted-foreground">Status: {sector.status}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
