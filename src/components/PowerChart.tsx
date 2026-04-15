import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

export function PowerChart({ data }: { data: { hour: string; usage: number }[] }) {
  return (
    <div className="calm-card p-5">
      <h2 className="text-[11px] font-medium text-muted-foreground mb-4 tracking-wide uppercase">24h Power Consumption</h2>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(40, 10%, 88%)" />
            <XAxis dataKey="hour" tick={{ fill: "hsl(200, 8%, 48%)", fontSize: 10 }} interval={3} axisLine={{ stroke: "hsl(40, 10%, 88%)" }} tickLine={false} />
            <YAxis tick={{ fill: "hsl(200, 8%, 48%)", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(40, 15%, 97%)",
                border: "1px solid hsl(40, 10%, 88%)",
                borderRadius: "6px",
                color: "hsl(200, 10%, 20%)",
                fontSize: 12,
              }}
              labelStyle={{ color: "hsl(200, 8%, 48%)" }}
              formatter={(value: number) => [`${value} MW`, "Usage"]}
            />
            <Line
              type="monotone"
              dataKey="usage"
              stroke="hsl(160, 30%, 32%)"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3, fill: "hsl(160, 30%, 32%)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
