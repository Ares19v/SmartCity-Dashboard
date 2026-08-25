import React, { useState } from 'react';
import {
  Zap,
  TrendingUp,
  Sun,
  Leaf,
  BarChart3,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  Layers,
  Wind
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import type { SimulationData } from '@/hooks/useLiveSimulation';

interface GlassAnalyticsViewProps {
  simulation: SimulationData;
}

export function GlassAnalyticsView({ simulation }: GlassAnalyticsViewProps) {
  const { energyLoad, powerData } = simulation;
  const [timeFilter, setTimeFilter] = useState<'24h' | '7d' | '30d'>('24h');
  const [selectedMetric, setSelectedMetric] = useState<'power' | 'carbon'>('power');

  const chartData = powerData.map((d) => {
    const baseSolar = Math.round(d.usage * 0.58);
    const baseGrid = Math.round(d.usage * 0.42);
    return {
      hour: d.hour,
      solar: baseSolar,
      grid: baseGrid,
      total: d.usage,
      carbonOffset: Math.round(baseSolar * 0.85),
    };
  });

  const totalDailyYield = (energyLoad * 0.12).toFixed(2);
  const cleanEnergyPercent = 58;
  const carbonOffsetToday = Math.round(energyLoad * 1.8);
  const peakForecast = Math.round(energyLoad * 1.25);

  const sectorRankings = [
    { name: 'Downtown Core', draw: +(energyLoad * 0.32).toFixed(1), clean: 64, grade: 'A+' },
    { name: 'Industrial Zone', draw: +(energyLoad * 0.28).toFixed(1), clean: 48, grade: 'B' },
    { name: 'Tech Hub', draw: +(energyLoad * 0.18).toFixed(1), clean: 78, grade: 'A+' },
    { name: 'Residential North', draw: +(energyLoad * 0.14).toFixed(1), clean: 72, grade: 'A' },
    { name: 'Medical District', draw: +(energyLoad * 0.08).toFixed(1), clean: 88, grade: 'A+' },
  ];

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-300">
      {/* Top 4 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Daily Generation</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Sun className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {totalDailyYield} <span className="text-xs font-normal text-slate-400 font-sans">GW/h</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <ArrowUpRight className="h-3 w-3" /> +8.4% vs last week
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Clean Energy Ratio</span>
            <span className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Leaf className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {cleanEnergyPercent}% <span className="text-xs font-normal text-slate-400 font-sans">Renewable</span>
            </div>
            <p className="text-[11px] text-sky-600 font-medium flex items-center gap-1 mt-1">
              <CheckCircle2 className="h-3 w-3" /> Exceeding Net-Zero Target
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">CO₂ Offset Today</span>
            <span className="p-2 rounded-xl bg-teal-50 text-teal-600">
              <Sparkles className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {carbonOffsetToday} <span className="text-xs font-normal text-slate-400 font-sans">Tons</span>
            </div>
            <p className="text-[11px] text-teal-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" /> Geodesic bio-dome capture
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Peak Load Forecast</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Zap className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-slate-900 tabular-nums">
              {peakForecast} <span className="text-xs font-normal text-slate-400 font-sans">MW</span>
            </div>
            <p className="text-[11px] text-slate-500 font-light flex items-center gap-1 mt-1">
              Peak expected at 18:00
            </p>
          </div>
        </div>
      </div>

      {/* Main 2-Column Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: 24h Solar vs Grid Generation Chart */}
        <div className="lg:col-span-8 bg-white rounded-[32px] p-6 border border-slate-100 shadow-[0_6px_35px_rgba(0,0,0,0.04)] flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-slate-900">24-Hour Energy Generation & Grid Split</h3>
              <p className="text-xs text-slate-400 font-light mt-0.5">Live hourly breakdown of solar generation vs municipal grid draw</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full text-xs">
              {(['24h', '7d', '30d'] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeFilter(tf)}
                  className={`px-3 py-1 rounded-full font-medium transition-all ${
                    timeFilter === tf ? 'bg-black text-white shadow-sm' : 'text-slate-500 hover:text-black'
                  }`}
                >
                  {tf === '24h' ? '24 Hours' : tf === '7d' ? '7 Days' : '30 Days'}
                </button>
              ))}
            </div>
          </div>

          {/* Metric Selector Pills */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setSelectedMetric('power')}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                selectedMetric === 'power'
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                  : 'bg-slate-50 text-slate-600 border-slate-200/60 hover:bg-slate-100'
              }`}
            >
              Solar vs Grid (MW)
            </button>
            <button
              onClick={() => setSelectedMetric('carbon')}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                selectedMetric === 'carbon'
                  ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                  : 'bg-slate-50 text-slate-600 border-slate-200/60 hover:bg-slate-100'
              }`}
            >
              CO₂ Sequestration Curve
            </button>
          </div>

          {/* Recharts Area Container */}
          <div className="w-full h-72 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorGrid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #f1f5f9',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    fontSize: '12px',
                    color: '#0f172a',
                  }}
                />
                {selectedMetric === 'power' ? (
                  <>
                    <Area type="monotone" dataKey="solar" name="Solar Power (MW)" stroke="#22c55e" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSolar)" />
                    <Area type="monotone" dataKey="grid" name="Grid Supply (MW)" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorGrid)" />
                  </>
                ) : (
                  <Area type="monotone" dataKey="carbonOffset" name="Carbon Offset (Tons)" stroke="#0d9488" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCarbon)" />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Renewable Resource Distribution */}
        <div className="lg:col-span-4 bg-white rounded-[32px] p-6 border border-slate-100 shadow-[0_6px_35px_rgba(0,0,0,0.04)] flex flex-col justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Energy Matrix Allocation</h3>
            <p className="text-xs text-slate-400 font-light mt-0.5">Clean energy mix across all municipal generation hubs</p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5"><Sun className="h-3.5 w-3.5 text-emerald-500" /> Solar Photovoltaic Grid</span>
                <span className="font-bold text-slate-900">58% ({(energyLoad * 0.58).toFixed(1)} MW)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '58%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-sky-500" /> Municipal Substation Grid</span>
                <span className="font-bold text-slate-900">42% ({(energyLoad * 0.42).toFixed(1)} MW)</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-sky-500 h-full rounded-full" style={{ width: '42%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5"><Layers className="h-3.5 w-3.5 text-indigo-500" /> Battery Reserve Vaults</span>
                <span className="font-bold text-slate-900">84% Capacity</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: '84%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1.5">
                <span className="flex items-center gap-1.5"><Wind className="h-3.5 w-3.5 text-teal-500" /> Micro-Turbine Capture</span>
                <span className="font-bold text-slate-900">16% Output</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full rounded-full" style={{ width: '16%' }} />
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-500 font-light flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Greenhouse bio-domes currently offsetting <strong>412 ppm CO₂</strong> across central Puget Sound basin.</span>
          </div>
        </div>

      </div>

      {/* Sector Power Distribution Ranking Table */}
      <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-[0_6px_35px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Sector Consumption & Sustainability Ranking</h3>
            <p className="text-xs text-slate-400 font-light mt-0.5">Live power demand, solar offset ratio, and energy efficiency ratings</p>
          </div>
          <span className="text-xs text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full font-medium border border-emerald-200/60">
            All Sectors Nominal
          </span>
        </div>

        <div className="overflow-x-auto mt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100 font-medium">
                <th className="py-3 px-2">Sector Name</th>
                <th className="py-3 px-2">Current Load</th>
                <th className="py-3 px-2">Clean Energy %</th>
                <th className="py-3 px-2">Grid Stability</th>
                <th className="py-3 px-2 text-right">Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {sectorRankings.map((sec, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-2 font-semibold text-slate-900 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    {sec.name}
                  </td>
                  <td className="py-3 px-2 font-mono tabular-nums font-medium">{sec.draw} MW</td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">{sec.clean}%</span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${sec.clean}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-emerald-600 font-medium">99.8% Sync</td>
                  <td className="py-3 px-2 text-right font-bold text-slate-900">
                    <span className="bg-slate-100 px-2.5 py-1 rounded-lg text-[11px]">{sec.grade}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
