import { Building2, Factory, Trees, Hospital, Home, Cpu, Ship, GraduationCap, ShoppingBag, Train, Zap, Landmark } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { SectorStatus } from "@/hooks/useLiveSimulation";

const ICON_MAP: Record<string, React.ElementType> = {
  Building2, Factory, Trees, Hospital, Home, Cpu, Ship, GraduationCap, ShoppingBag, Train, Zap, Landmark,
};

const STATUS_STYLES: Record<string, string> = {
  normal: "border-primary/30 glow-cyan",
  warning: "border-yellow-500/50 glow-amber",
  critical: "border-destructive/50 glow-red",
};

const STATUS_ICON_COLOR: Record<string, string> = {
  normal: "text-primary",
  warning: "text-yellow-400",
  critical: "text-destructive",
};

export function CityMap({ sectors }: { sectors: SectorStatus[] }) {
  return (
    <div className="glass-panel p-4 glow-blue">
      <h2 className="text-sm font-semibold text-secondary mb-3 tracking-widest uppercase">City Sectors</h2>
      <div className="grid grid-cols-4 grid-rows-3 gap-2">
        {sectors.map((sector) => {
          const Icon = ICON_MAP[sector.icon] || Building2;
          return (
            <Tooltip key={sector.id}>
              <TooltipTrigger asChild>
                <div
                  className={`glass-panel flex flex-col items-center justify-center gap-1 p-3 border transition-all duration-500 cursor-pointer hover:scale-105 ${STATUS_STYLES[sector.status]}`}
                >
                  <Icon className={`h-5 w-5 ${STATUS_ICON_COLOR[sector.status]}`} />
                  <span className="text-[10px] text-muted-foreground truncate w-full text-center">{sector.name}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="glass-panel border-primary/30">
                <p className="font-medium">{sector.name}</p>
                <p className="text-xs capitalize text-muted-foreground">Status: <span className={STATUS_ICON_COLOR[sector.status]}>{sector.status}</span></p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
