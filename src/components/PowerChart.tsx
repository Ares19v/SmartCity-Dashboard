import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { Zap } from "lucide-react";
import { useMemo } from "react";

export function PowerChart({ data }: { data: { hour: string; usage: number }[] }) {
  const { peak, min, current } = useMemo(() => {
    if (!data || data.length === 0) return { peak: 0, min: 0, current: 0 };
    const values = data.map((d) => d.usage);
    return {
      peak: Math.max(...values),
      min: Math.min(...values),
      current: data[data.length - 1]?.usage || 0,
    };
  }, [data]);

  return (
    <div className="calm-card p-4 md:p-5">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Zap className="h-3.5 w-3.5 text-primary" strokeWidth={1.5} />
          <h2 className="text-[11px] font-medium text-muted-foreground tracking-wider uppercase">
            24h Grid Power Load
          </h2>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-light tabular-nums">
          <span>Peak: <strong className="text-emerald-700 dark:text-emerald-400 font-medium">{peak} MW</strong></span>
          <span className="hidden sm:inline">Min: <strong className="text-sky-700 dark:text-sky-400 font-medium">{min} MW</strong></span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-medium">
            Live: {current} MW
          </span>
        </div>
      </div>

      <div className="h-[190px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.35} />
                <stop offset="60%" stopColor="#0284c7" stopOpacity={0.12} />
                <stop offset="100%" stopColor="#0284c7" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.7)" vertical={false} />
            <XAxis
              dataKey="hour"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10, fontWeight: 300 }}
              interval={3}
              axisLine={{ stroke: "hsl(var(--border) / 0.7)" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10, fontWeight: 300 }}
              axisLine={false}
              tickLine={false}
              domain={["dataMin - 30", "dataMax + 30"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                borderColor: "hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
                padding: "8px 12px",
                fontSize: "11px",
              }}
              labelStyle={{ color: "hsl(var(--muted-foreground))", fontWeight: 400, marginBottom: "2px" }}
              formatter={(value: number) => [`${value} MW`, "Load Demand"]}
            />
            <Area
              type="monotone"
              dataKey="usage"
              stroke="hsl(var(--primary))"
              strokeWidth={1.8}
              fillOpacity={1}
              fill="url(#powerGradient)"
              dot={false}
              activeDot={{ r: 4, fill: "hsl(var(--primary))", stroke: "hsl(var(--card))", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
