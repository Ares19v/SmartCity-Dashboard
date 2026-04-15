import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

export function PowerChart({ data }: { data: { hour: string; usage: number }[] }) {
  return (
    <div className="glass-panel p-4 glow-purple">
      <h2 className="text-sm font-semibold text-accent mb-3 tracking-widest uppercase">24h Power Consumption</h2>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="powerGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(185, 100%, 50%)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="hsl(270, 60%, 55%)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
            <XAxis dataKey="hour" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 10 }} interval={3} />
            <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(230, 20%, 8%)",
                border: "1px solid hsl(185, 100%, 50%, 0.3)",
                borderRadius: "8px",
                color: "hsl(210, 40%, 92%)",
              }}
              labelStyle={{ color: "hsl(185, 100%, 50%)" }}
              formatter={(value: number) => [`${value} MW`, "Usage"]}
            />
            <Area
              type="monotone"
              dataKey="usage"
              stroke="hsl(185, 100%, 50%)"
              strokeWidth={2}
              fill="url(#powerGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
