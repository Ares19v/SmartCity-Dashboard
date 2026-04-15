import { useEffect, useRef } from "react";
import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import type { EmergencyAlert } from "@/hooks/useLiveSimulation";

const SEVERITY_CONFIG = {
  critical: { icon: AlertTriangle, color: "text-destructive", border: "border-destructive/40", bg: "bg-destructive/10" },
  warning: { icon: AlertCircle, color: "text-yellow-400", border: "border-yellow-500/40", bg: "bg-yellow-500/10" },
  info: { icon: Info, color: "text-secondary", border: "border-secondary/40", bg: "bg-secondary/10" },
};

export function EmergencyFeed({ alerts }: { alerts: EmergencyAlert[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [alerts]);

  return (
    <div className="glass-panel glow-red flex flex-col h-full">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-sm font-semibold text-destructive tracking-widest uppercase flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Emergency Feed
        </h2>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin">
        {alerts.map((alert) => {
          const config = SEVERITY_CONFIG[alert.severity];
          const Icon = config.icon;
          return (
            <div
              key={alert.id}
              className={`p-2.5 rounded-md border ${config.border} ${config.bg} transition-all duration-300 animate-in slide-in-from-right-2`}
            >
              <div className="flex items-start gap-2">
                <Icon className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${config.color}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-foreground">
                    Sector {alert.sector}: {alert.message}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {alert.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
