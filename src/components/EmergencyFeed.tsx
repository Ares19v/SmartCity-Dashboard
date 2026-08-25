import { useEffect, useRef, useMemo, useState } from "react";
import { Droplets, Flame, Wind, AlertCircle, Lightbulb, Bell, AlertTriangle, ShieldCheck } from "lucide-react";
import type { EmergencyAlert } from "@/hooks/useLiveSimulation";

const SEVERITY_STYLE: Record<string, { badge: string; text: string; bg: string }> = {
  critical: {
    badge: "bg-destructive/10 text-destructive border-destructive/20",
    text: "text-destructive",
    bg: "hover:bg-destructive/5",
  },
  warning: {
    badge: "bg-warning/10 text-warning border-warning/20",
    text: "text-warning",
    bg: "hover:bg-warning/5",
  },
  info: {
    badge: "bg-muted text-muted-foreground border-border/50",
    text: "text-muted-foreground",
    bg: "hover:bg-muted/40",
  },
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
  const [filterSeverity, setFilterSeverity] = useState<"all" | "critical" | "warning">("all");

  const counts = useMemo(() => {
    return {
      critical: alerts.filter((a) => a.severity === "critical").length,
      warning: alerts.filter((a) => a.severity === "warning").length,
      info: alerts.filter((a) => a.severity === "info").length,
    };
  }, [alerts]);

  const displayedAlerts = useMemo(() => {
    if (filterSeverity === "critical") return alerts.filter((a) => a.severity === "critical");
    if (filterSeverity === "warning") return alerts.filter((a) => a.severity === "warning");
    return alerts;
  }, [alerts, filterSeverity]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [alerts]);

  return (
    <div className="calm-card flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 pb-3 border-b border-border/40">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <Bell className="h-3.5 w-3.5 text-primary" strokeWidth={1.5} />
            <h2 className="text-[11px] font-medium text-muted-foreground tracking-wider uppercase">
              Incident Dispatch Feed
            </h2>
          </div>
          <span className="text-[10px] text-muted-foreground font-light tabular-nums">
            {alerts.length} Total
          </span>
        </div>

        {/* Severity Filter Badges */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilterSeverity("all")}
            className={`px-2 py-0.5 rounded text-[10px] transition-all ${
              filterSeverity === "all"
                ? "bg-foreground text-background font-medium"
                : "bg-muted/60 text-muted-foreground hover:bg-muted"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterSeverity("critical")}
            className={`px-2 py-0.5 rounded text-[10px] flex items-center gap-1 transition-all ${
              filterSeverity === "critical"
                ? "bg-destructive text-destructive-foreground font-medium"
                : "bg-destructive/10 text-destructive hover:bg-destructive/20"
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
            {counts.critical} Crit
          </button>
          <button
            onClick={() => setFilterSeverity("warning")}
            className={`px-2 py-0.5 rounded text-[10px] flex items-center gap-1 transition-all ${
              filterSeverity === "warning"
                ? "bg-warning text-warning-foreground font-medium"
                : "bg-warning/10 text-warning hover:bg-warning/20"
            }`}
          >
            {counts.warning} Warn
          </button>
        </div>
      </div>

      {/* Scrollable Feed */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-1.5 custom-scrollbar">
        {displayedAlerts.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
            <ShieldCheck className="h-6 w-6 text-primary/60 mb-2" strokeWidth={1.5} />
            <p className="text-xs font-light">No incidents matching filter</p>
          </div>
        ) : (
          displayedAlerts.map((alert) => {
            const Icon = ALERT_ICON[alert.message] || AlertCircle;
            const style = SEVERITY_STYLE[alert.severity] || SEVERITY_STYLE.info;
            const isGasLeak = alert.message === "Gas Leak Reported";

            return (
              <div
                key={alert.id}
                className={`p-2.5 rounded-lg border border-border/40 transition-all ${style.bg} flex items-start gap-2.5`}
              >
                <div className={`p-1 rounded-md mt-0.5 ${style.badge} border shrink-0`}>
                  <Icon className="h-3 w-3" strokeWidth={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs text-foreground leading-snug truncate">
                      <span className="text-muted-foreground font-light mr-1">Sec {alert.sector}:</span>
                      <span className={alert.severity === "critical" ? "font-medium" : "font-normal"}>
                        {alert.message}
                      </span>
                      {isGasLeak && (
                        <span className="inline-block h-1.5 w-1.5 rounded-full bg-warning animate-ping ml-1.5" />
                      )}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[10px] text-muted-foreground/80 font-light">
                    <span className="uppercase text-[9px] tracking-wider">{alert.severity}</span>
                    <span className="tabular-nums">
                      {alert.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
