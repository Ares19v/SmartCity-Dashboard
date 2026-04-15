import { useEffect, useRef } from "react";
import { Droplets, Flame, Wind, AlertCircle, Wrench, Lightbulb } from "lucide-react";
import type { EmergencyAlert } from "@/hooks/useLiveSimulation";

const SEVERITY_TEXT: Record<string, string> = {
  critical: "text-destructive",
  warning: "text-warning",
  info: "text-muted-foreground",
};

const ALERT_ICON: Record<string, React.ElementType> = {
  "Water Main Leak": Droplets,
  "Fire Alert": Flame,
  "Gas Leak Reported": Wind,
  "Flooding Risk": Droplets,
  "Air Quality Warning": Wind,
  "Power Surge Detected": Lightbulb,
  "Street Light Outage": Lightbulb,
};

export function EmergencyFeed({ alerts }: { alerts: EmergencyAlert[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [alerts]);

  return (
    <div className="calm-card flex flex-col h-full">
      <div className="p-5 pb-3">
        <h2 className="text-[11px] font-medium text-muted-foreground tracking-wide uppercase">Activity Log</h2>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 pb-5 space-y-1">
        {alerts.map((alert) => {
          const Icon = ALERT_ICON[alert.message] || AlertCircle;
          return (
            <div
              key={alert.id}
              className="py-2 flex items-start gap-2.5 border-b border-border/50 last:border-0"
            >
              <Icon className={`h-3.5 w-3.5 mt-0.5 shrink-0 ${SEVERITY_TEXT[alert.severity]}`} strokeWidth={1.5} />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-foreground font-light leading-relaxed">
                  <span className="text-muted-foreground">Sector {alert.sector}</span>
                  {" · "}
                  <span className={alert.severity === "critical" ? "font-medium" : ""}>{alert.message}</span>
                </p>
                <p className="text-[10px] text-muted-foreground/70 mt-0.5 font-light">
                  {alert.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
