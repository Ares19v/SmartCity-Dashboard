import React, { useState } from "react";
import {
  Maximize2,
  AlertTriangle,
  Info,
  Bell,
  ChevronDown,
  Calendar,
  Settings,
  Layers,
  Sparkles,
  Zap,
  Activity,
  Droplets,
  Wind,
  Shield,
  Search,
  CheckCircle2,
} from "lucide-react";
import type { SimulationData, SectorStatus } from "@/hooks/useLiveSimulation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface GlassDashboardProps {
  simulation: SimulationData;
  onSectorSelect: (sector: SectorStatus) => void;
  focusedSectorId: number | null;
  mode: "standard" | "glass";
  setMode: (mode: "standard" | "glass") => void;
}

function ArcGauge({
  value,
  label,
  color = "#22c55e",
  percent = 70,
}: {
  value: number;
  label: string;
  color?: string;
  percent?: number;
}) {
  const arcLength = 125.66;
  const strokeOffset = arcLength * (1 - Math.min(1, Math.max(0, percent / 100)));

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative w-28 h-18 flex items-center justify-center">
        <svg className="w-full h-full" viewBox="0 0 110 65">
          {/* Background Track */}
          <path
            d="M 15,55 A 40,40 0 0,1 95,55"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="7"
            strokeLinecap="round"
          />
          {/* Active Fill */}
          <path
            d="M 15,55 A 40,40 0 0,1 95,55"
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={arcLength}
            strokeDashoffset={strokeOffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-0.5">
          <span className="text-2xl font-bold text-slate-900 tabular-nums tracking-tight">{value}</span>
        </div>
      </div>
      <p className="text-xs text-slate-500 font-light mt-1">{label}</p>
    </div>
  );
}

export function GlassDashboard({
  simulation,
  onSectorSelect,
  focusedSectorId,
  mode,
  setMode,
}: GlassDashboardProps) {
  const { trafficLights, energyLoad, emergencyUnits, sectors, alerts, powerData } = simulation;
  const [activeTab, setActiveTab] = useState<"overview" | "analytics" | "monitoring">("overview");
  const [powerTab, setPowerTab] = useState<"storage" | "energy">("energy");
  const [activeModal, setActiveModal] = useState<"conditions" | "consumption" | "alerts" | "growth" | null>(null);
  const [showBellMenu, setShowBellMenu] = useState(false);

  const selectedSector = sectors.find((s) => s.id === focusedSectorId) || sectors[0];

  // Dynamic calculations based on live simulation
  const stability = Math.min(99.9, +(96 + (trafficLights % 30) * 0.12).toFixed(1));
  const carbonOffset = Math.round(380 + (energyLoad % 50) * 1.6);
  const solarGen = +(energyLoad * 0.58).toFixed(1);
  const gridGen = +(energyLoad * 0.42).toFixed(1);
  const sectorPowerKw = +(energyLoad * 0.28).toFixed(2);

  return (
    <div className="min-h-screen bg-[#eef1f4] text-[#1e293b] p-3 md:p-6 lg:p-8 font-sans antialiased flex flex-col justify-center items-center">
      {/* Outer Glass Frame */}
      <div className="w-full max-w-[1580px] bg-[#f8fafc]/95 backdrop-blur-2xl rounded-[32px] p-4 md:p-7 border border-white shadow-[0_20px_60px_rgba(0,0,0,0.05),0_1px_3px_rgba(0,0,0,0.02)] flex flex-col gap-5">
        
        {/* Top Header */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-4 pb-1">
          {/* Left: Logo Mark */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-2xl bg-black text-white flex items-center justify-center shadow-md shadow-black/10">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
                  <circle cx="12" cy="7" r="3" />
                  <circle cx="7" cy="15" r="3" />
                  <circle cx="17" cy="15" r="3" />
                </svg>
              </div>
              <div>
                <span className="text-base font-semibold tracking-tight text-slate-900">NeoCity</span>
                <span className="text-xs text-slate-400 block -mt-1 font-light">Glass Eco-Grid</span>
              </div>
            </div>

            {/* Mode Switcher on Mobile */}
            <div className="md:hidden flex items-center gap-1 bg-slate-200/70 p-1 rounded-full text-xs">
              <button
                onClick={() => setMode("standard")}
                className={`px-3 py-1 rounded-full transition-all ${
                  mode === "standard" ? "bg-white text-black font-medium shadow-sm" : "text-slate-500"
                }`}
              >
                HUD
              </button>
              <button
                onClick={() => setMode("glass")}
                className={`px-3 py-1 rounded-full transition-all ${
                  mode === "glass" ? "bg-white text-black font-medium shadow-sm" : "text-slate-500"
                }`}
              >
                Glass
              </button>
            </div>
          </div>

          {/* Center: Navigation Pills */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-full text-xs border border-slate-200/50 shadow-inner">
            {(["overview", "analytics", "monitoring"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full capitalize transition-all ${
                  activeTab === tab
                    ? "bg-white text-slate-900 font-semibold shadow-sm"
                    : "text-slate-500 hover:text-slate-900 font-normal"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Right: Mode Switcher, Bell & Profile */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap relative">
            {/* Mode Switcher Pill */}
            <div className="hidden md:flex items-center gap-1 bg-slate-200/70 p-1 rounded-full text-xs">
              <button
                onClick={() => setMode("standard")}
                className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                  mode === "standard" ? "bg-white text-black font-medium shadow-sm" : "text-slate-500 hover:text-black"
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                Command HUD
              </button>
              <button
                onClick={() => setMode("glass")}
                className={`px-3.5 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                  mode === "glass" ? "bg-black text-white font-medium shadow-sm" : "text-slate-500 hover:text-black"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
                Glass Mode
              </button>
            </div>

            {/* Bell Icon & Dropdown */}
            <div className="relative">
              <div
                onClick={() => setShowBellMenu(!showBellMenu)}
                className="h-9 w-9 rounded-full bg-white border border-slate-200/60 shadow-sm flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <Bell className="h-4 w-4 text-slate-600" />
                {alerts.length > 0 && (
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
                )}
              </div>

              {showBellMenu && (
                <div className="absolute right-0 top-11 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs font-semibold text-slate-900">
                    <span>Recent Incidents ({alerts.length})</span>
                    <button onClick={() => setShowBellMenu(false)} className="text-slate-400 hover:text-slate-700">✕</button>
                  </div>
                  <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
                    {alerts.slice(0, 4).map((a) => (
                      <div key={a.id} className="text-[11px] p-2 rounded-xl bg-slate-50">
                        <p className="font-medium text-slate-800">{a.message}</p>
                        <p className="text-[10px] text-slate-400">Sector {a.sector} • {a.severity}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2.5 bg-white border border-slate-200/60 shadow-sm pl-1.5 pr-3 py-1 rounded-full cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 text-white font-semibold text-xs flex items-center justify-center">
                DT
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-slate-800 leading-tight">Devansh Tyagi</p>
                <p className="text-[10px] text-slate-400 leading-tight font-light">Municipal Admin</p>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </div>
          </div>
        </header>

        {/* Main 3-Column Glass Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-5 items-stretch">
          
          {/* LEFT COLUMN: Conditions, Consumption & Alerts */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Card 1: Current Conditions */}
            <div className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">Current Conditions</h2>
                  <p className="text-[11px] text-slate-400 font-light mt-0.5">Last update live seconds ago</p>
                </div>
                <button
                  onClick={() => setActiveModal("conditions")}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* 2x2 Metric Tiles */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="bg-[#f8fafc] p-3 rounded-2xl border border-slate-100/80">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Grid Temp</p>
                  <p className="text-xl font-light text-slate-900 mt-1 tabular-nums">22°C</p>
                </div>
                <div className="bg-[#f8fafc] p-3 rounded-2xl border border-slate-100/80">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Active Nodes</p>
                  <p className="text-xl font-light text-slate-900 mt-1 tabular-nums">{trafficLights.toLocaleString()}</p>
                </div>
                <div className="bg-[#f8fafc] p-3 rounded-2xl border border-slate-100/80">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Mesh Sync</p>
                  <p className="text-xl font-light text-slate-900 mt-1 tabular-nums">{stability}%</p>
                </div>
                <div className="bg-[#f8fafc] p-3 rounded-2xl border border-slate-100/80">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Demand Level</p>
                  <p className="text-xl font-light text-slate-900 mt-1 tabular-nums">{energyLoad} <span className="text-xs text-slate-400">MW</span></p>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 font-light flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                Sensor readings reflect live urban sector telemetry.
              </p>

              <button
                onClick={() => setActiveModal("conditions")}
                className="w-full bg-black text-white text-xs font-medium py-3 rounded-2xl hover:bg-slate-800 transition-colors shadow-sm active:scale-[0.99]"
              >
                View Detailed Report
              </button>
            </div>

            {/* Card 2: Consumption */}
            <div className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                  <span>Consumption</span>
                  <Info className="h-3 w-3 text-slate-400" />
                </div>
                <button
                  onClick={() => setActiveModal("consumption")}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div>
                <p className="text-2xl font-light text-slate-900 tabular-nums">
                  {(energyLoad * 0.12).toFixed(2)} <span className="text-xs font-normal text-slate-400">GW / h</span>
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-light mt-2">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-[#22c55e]" /> {solarGen} MW Solar
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-[#86efac]" /> {gridGen} MW Grid
                  </span>
                </div>
              </div>

              {/* Progress Split Bar */}
              <div className="w-full h-4 bg-slate-100 rounded-full flex overflow-hidden p-0.5 gap-1">
                <div className="bg-[#22c55e] h-full rounded-full flex items-center justify-center text-[9px] font-semibold text-white transition-all duration-700" style={{ width: "58%" }}>
                  58%
                </div>
                <div className="bg-[#bbf7d0] h-full rounded-full flex items-center justify-center text-[9px] font-semibold text-emerald-800 transition-all duration-700" style={{ width: "42%" }}>
                  42%
                </div>
              </div>
            </div>

            {/* Card 3: Alerts Feed */}
            <div className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex-1 flex flex-col gap-3 min-h-[180px]">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-900">
                  Active Alerts ({alerts.length})
                </h3>
                <button
                  onClick={() => setActiveModal("alerts")}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2.5 max-h-[170px] pr-1">
                {alerts.slice(0, 3).map((a) => (
                  <div key={a.id} className="flex items-start gap-2.5 text-xs">
                    {a.severity === "critical" ? (
                      <span className="p-1.5 rounded-full bg-rose-100 text-rose-600 mt-0.5 shrink-0">
                        <AlertTriangle className="h-3.5 w-3.5" />
                      </span>
                    ) : (
                      <span className="p-1.5 rounded-full bg-amber-100 text-amber-600 mt-0.5 shrink-0">
                        <AlertTriangle className="h-3.5 w-3.5" />
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-800 truncate">{a.message}</p>
                      <p className="text-[10px] text-slate-400 capitalize">
                        Sector {a.sector} • <span className={a.severity === "critical" ? "text-rose-500 font-medium" : "text-amber-500 font-medium"}>{a.severity}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER COLUMN: 3D Greenhouse / Solar Infrastructure Hero */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="bg-white rounded-[32px] p-4 border border-slate-100 shadow-[0_6px_35px_rgba(0,0,0,0.04)] h-full flex flex-col relative overflow-hidden group">
              {/* Sector Quick Picker */}
              <div className="flex items-center justify-between mb-3 px-2 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-xs font-semibold text-slate-800">{selectedSector.name}</span>
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  {sectors.slice(0, 5).map((s) => (
                    <button
                      key={s.id}
                      onClick={() => onSectorSelect(s)}
                      className={`px-3 py-1 rounded-full text-[10px] font-medium transition-all ${
                        s.id === selectedSector.id
                          ? "bg-black text-white shadow-sm"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      {s.name.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3D Visual Rendering Container */}
              <div className="relative w-full flex-1 rounded-[24px] overflow-hidden bg-gradient-to-b from-[#edf2f7] to-[#e2e8f0] flex items-center justify-center min-h-[380px]">
                <img
                  src="/glass_hero.png"
                  alt="3D Smart Infrastructure Hero"
                  className="w-full h-full object-cover rounded-[24px] transform group-hover:scale-102 transition-transform duration-700"
                />

                {/* Bottom Glass Overlay Card */}
                <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-xl p-4 rounded-2xl border border-white/70 shadow-lg flex flex-col gap-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-slate-900 leading-snug">
                        {selectedSector.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-light">
                        Sector ID: <span className="font-mono font-medium text-slate-700">SEC-0{selectedSector.id}</span> • Smart Eco-Facility
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-semibold text-slate-900 tabular-nums">
                        {sectorPowerKw} <span className="text-xs font-normal text-slate-500">kW</span>
                      </span>
                      <p className="text-[10px] text-slate-400 font-light">Live Node Production</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 pt-1 border-t border-slate-200/50 text-[10px] text-slate-500 font-light">
                    <div>
                      <span className="text-slate-400">Deployment Date:</span> March 15, 2026
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400">Location:</span> Puget Sound Basin
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Growth Metrics Arc & Site Power Dot Matrix */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Top Date & Config Bar */}
            <div className="flex items-center justify-between bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm text-xs text-slate-600">
              <div className="flex items-center gap-1.5 font-medium text-slate-800">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>Today</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-mono text-[11px]">08/25/2026</span>
                <Settings
                  onClick={() => setActiveModal("conditions")}
                  className="h-3.5 w-3.5 text-slate-400 hover:text-slate-800 cursor-pointer transition-colors"
                />
              </div>
            </div>

            {/* Card 1: Performance Arc Gauges */}
            <div className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">Growth & Efficiency</h3>
                <button
                  onClick={() => setActiveModal("growth")}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Two Circular Semi-Arc Gauges */}
              <div className="grid grid-cols-2 gap-4 items-center justify-center py-2">
                <ArcGauge
                  value={42}
                  label={`CO₂ ${carbonOffset} ppm`}
                  color="#22c55e"
                  percent={42}
                />
                <ArcGauge
                  value={56}
                  label={`Grid Health ${(stability / 14).toFixed(1)}`}
                  color="#10b981"
                  percent={56}
                />
              </div>
            </div>

            {/* Card 2: Site Power & Vertical Matrix Dot Graph */}
            <div className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex-1 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-900">
                  <span>Site Power</span>
                  <Info className="h-3 w-3 text-slate-400" />
                </div>
              </div>

              {/* Storage / Energy Toggle Pills */}
              <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-full text-xs font-medium">
                <button
                  onClick={() => setPowerTab("storage")}
                  className={`py-1.5 rounded-full transition-all text-center ${
                    powerTab === "storage" ? "bg-black text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Storage (84%)
                </button>
                <button
                  onClick={() => setPowerTab("energy")}
                  className={`py-1.5 rounded-full transition-all text-center ${
                    powerTab === "energy" ? "bg-black text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Energy ({energyLoad} MW)
                </button>
              </div>

              {/* Vertical Dot Matrix Chart */}
              <div className="flex items-end justify-between px-2 pt-2 flex-1 min-h-[140px]">
                {[
                  { time: "00:00", activeDots: powerTab === "storage" ? 6 : 1 },
                  { time: "04:00", activeDots: powerTab === "storage" ? 7 : 2 },
                  { time: "08:00", activeDots: powerTab === "storage" ? 4 : 5 },
                  { time: "12:00", activeDots: powerTab === "storage" ? 2 : 7, isCurrent: true },
                  { time: "16:00", activeDots: powerTab === "storage" ? 5 : 4 },
                  { time: "20:00", activeDots: powerTab === "storage" ? 8 : 6 },
                ].map((col, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1.5 select-none">
                    {/* Vertical Stack of 8 Dots */}
                    <div className="flex flex-col-reverse gap-1.5">
                      {Array.from({ length: 8 }).map((_, dotIdx) => (
                        <span
                          key={dotIdx}
                          className={`h-2.5 w-2.5 rounded-full transition-all duration-500 ${
                            dotIdx < col.activeDots
                              ? powerTab === "storage"
                                ? "bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,0.5)]"
                                : "bg-[#22c55e] shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                              : "bg-slate-100"
                          }`}
                        />
                      ))}
                    </div>
                    {col.isCurrent ? (
                      <span className="text-[9px] font-mono text-slate-900 font-bold bg-slate-100 px-1.5 py-0.5 rounded-md mt-1">
                        {col.time}
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono mt-1">{col.time}</span>
                    )}
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-slate-400 font-light flex items-center gap-1.5 border-t border-slate-100 pt-3">
                <Info className="h-3 w-3 text-slate-400 shrink-0" />
                Total energy produced so far is {solarGen} kWh from Solar and {gridGen} kWh from Grid.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Modal Dialogs for Detailed Inspection */}
      <Dialog open={activeModal !== null} onOpenChange={() => setActiveModal(null)}>
        <DialogContent className="bg-white max-w-lg rounded-[28px] p-6 shadow-2xl border-none">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold text-slate-900 flex items-center justify-between">
              <span>
                {activeModal === "conditions" && "Live Conditions & Telemetry"}
                {activeModal === "consumption" && "Energy Consumption Breakdown"}
                {activeModal === "alerts" && "Incident Dispatch Log"}
                {activeModal === "growth" && "Ecological & Grid Analytics"}
              </span>
              <span className="text-xs font-normal text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Nominal
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-3 text-xs text-slate-600">
            {activeModal === "conditions" && (
              <>
                <div className="p-3 bg-slate-50 rounded-2xl flex justify-between">
                  <span>Selected Sector</span>
                  <strong className="text-slate-900 font-semibold">{selectedSector.name} (SEC-0{selectedSector.id})</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl flex justify-between">
                  <span>Active Traffic Controllers</span>
                  <strong className="text-slate-900 font-semibold">{trafficLights.toLocaleString()} Nodes</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl flex justify-between">
                  <span>Grid Power Demand</span>
                  <strong className="text-slate-900 font-semibold">{energyLoad} MW Live</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl flex justify-between">
                  <span>Mesh Synchronization</span>
                  <strong className="text-slate-900 font-semibold">{stability}% Uptime</strong>
                </div>
              </>
            )}

            {activeModal === "consumption" && (
              <>
                <div className="p-3 bg-slate-50 rounded-2xl flex justify-between">
                  <span>Total Hourly Draw</span>
                  <strong className="text-slate-900 font-semibold">{(energyLoad * 0.12).toFixed(2)} GW/h</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl flex justify-between">
                  <span>Solar Array Contribution</span>
                  <strong className="text-emerald-600 font-semibold">{solarGen} MW (58%)</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl flex justify-between">
                  <span>Municipal Grid Power</span>
                  <strong className="text-sky-600 font-semibold">{gridGen} MW (42%)</strong>
                </div>
              </>
            )}

            {activeModal === "alerts" && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {alerts.map((a) => (
                  <div key={a.id} className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-800">{a.message}</p>
                      <p className="text-[10px] text-slate-400">Sector {a.sector} • {a.severity}</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">Live</span>
                  </div>
                ))}
              </div>
            )}

            {activeModal === "growth" && (
              <>
                <div className="p-3 bg-slate-50 rounded-2xl flex justify-between">
                  <span>Carbon Offset Level</span>
                  <strong className="text-slate-900 font-semibold">CO₂ {carbonOffset} ppm</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-2xl flex justify-between">
                  <span>Grid Health Index</span>
                  <strong className="text-slate-900 font-semibold">{(stability / 14).toFixed(2)} / 7.0</strong>
                </div>
              </>
            )}

            <button
              onClick={() => setActiveModal(null)}
              className="w-full mt-3 bg-black text-white text-xs font-medium py-3 rounded-xl hover:bg-slate-800 transition-all"
            >
              Close Inspector
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
