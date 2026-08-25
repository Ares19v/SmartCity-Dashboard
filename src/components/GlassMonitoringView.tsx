import React, { useState } from 'react';
import {
  Activity,
  Radio,
  Server,
  Shield,
  Wifi,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Droplets,
  Thermometer,
  Wind,
  Cpu,
  Search,
  Check,
  Maximize2
} from 'lucide-react';
import type { SimulationData, SectorStatus } from '@/hooks/useLiveSimulation';

interface GlassMonitoringViewProps {
  simulation: SimulationData;
  onSectorSelect: (sector: SectorStatus) => void;
}

export function GlassMonitoringView({ simulation, onSectorSelect }: GlassMonitoringViewProps) {
  const { sectors, alerts, trafficLights, energyLoad, emergencyUnits } = simulation;
  const [filter, setFilter] = useState<'all' | 'warning' | 'critical'>('all');
  const [diagnosingSectorId, setDiagnosingSectorId] = useState<number | null>(null);
  const [diagnosedSectors, setDiagnosedSectors] = useState<Set<number>>(new Set());
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState<Set<string>>(new Set());

  const handleRunDiagnostic = (sectorId: number) => {
    setDiagnosingSectorId(sectorId);
    setTimeout(() => {
      setDiagnosingSectorId(null);
      setDiagnosedSectors((prev) => {
        const next = new Set(prev);
        next.add(sectorId);
        return next;
      });
    }, 1200);
  };

  const handleAcknowledgeAlert = (id: string) => {
    setAcknowledgedAlerts((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const filteredSectors = sectors.filter((s) => {
    if (filter === 'all') return true;
    return s.status === filter;
  });

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-300">
      {/* Top Network Pulse Bar */}
      <div className="bg-white rounded-[28px] p-5 border border-slate-100 shadow-[0_4px_25px_rgba(0,0,0,0.03)] grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Radio className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mesh Telemetry</p>
            <p className="text-base font-bold text-slate-900">12 / 12 Nodes Online</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Wifi className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Ping</p>
            <p className="text-base font-bold text-slate-900 tabular-nums">3.8 ms</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Server className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Packet Loss</p>
            <p className="text-base font-bold text-emerald-600 tabular-nums">0.00%</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Incidents</p>
            <p className="text-base font-bold text-slate-900 tabular-nums">{alerts.length} Dispatches</p>
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: 12-Sector Status Matrix */}
        <div className="lg:col-span-8 bg-white rounded-[32px] p-6 border border-slate-100 shadow-[0_6px_35px_rgba(0,0,0,0.04)] flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Sector IoT Mesh Telemetry Grid</h3>
              <p className="text-xs text-slate-400 font-light mt-0.5">Real-time status, optical latency, and live diagnostic tools</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full text-xs">
              {(['all', 'warning', 'critical'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1 rounded-full capitalize font-medium transition-all ${
                    filter === f ? 'bg-black text-white shadow-sm' : 'text-slate-500 hover:text-black'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* 12-Sector Grid Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {filteredSectors.map((sec) => {
              const isDiagnosing = diagnosingSectorId === sec.id;
              const isDiagnosed = diagnosedSectors.has(sec.id);
              return (
                <div
                  key={sec.id}
                  onClick={() => onSectorSelect(sec)}
                  className="bg-[#f8fafc] hover:bg-white hover:shadow-md p-3.5 rounded-2xl border border-slate-200/60 transition-all cursor-pointer flex flex-col justify-between gap-2.5 group"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-black">{sec.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">SEC-0{sec.id} • {(sec.id * 3.4 + 1.2).toFixed(1)}ms</p>
                    </div>
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        sec.status === 'normal'
                          ? 'bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]'
                          : sec.status === 'warning'
                          ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                          : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-ping'
                      }`}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/40">
                    <span>Active Sensors</span>
                    <span className="font-bold text-slate-800">24 / 24</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRunDiagnostic(sec.id);
                    }}
                    disabled={isDiagnosing}
                    className="w-full text-center py-1.5 px-2 rounded-xl text-[10px] font-medium bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-all flex items-center justify-center gap-1 shadow-xs"
                  >
                    {isDiagnosing ? (
                      <>
                        <RefreshCw className="h-3 w-3 animate-spin text-slate-500" />
                        Probing...
                      </>
                    ) : isDiagnosed ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-600" />
                        Diagnosed (OK)
                      </>
                    ) : (
                      'Run Diagnostic'
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Environmental Sensors & Live Incident Dispatch Feed */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Live Environmental IoT Streams */}
          <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-[0_6px_35px_rgba(0,0,0,0.04)] flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-slate-900">Environmental Sensors</h3>
            
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-[#f8fafc] p-3 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase font-medium">
                  <Wind className="h-3 w-3 text-teal-500" /> Air Quality (AQI)
                </div>
                <p className="text-xl font-bold text-slate-900 mt-1 tabular-nums">28 <span className="text-xs font-normal text-emerald-600">Good</span></p>
              </div>

              <div className="bg-[#f8fafc] p-3 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase font-medium">
                  <Thermometer className="h-3 w-3 text-amber-500" /> Substation Temp
                </div>
                <p className="text-xl font-bold text-slate-900 mt-1 tabular-nums">22.4°C</p>
              </div>

              <div className="bg-[#f8fafc] p-3 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase font-medium">
                  <Droplets className="h-3 w-3 text-sky-500" /> Water Pressure
                </div>
                <p className="text-xl font-bold text-slate-900 mt-1 tabular-nums">64 <span className="text-xs font-normal text-slate-400">PSI</span></p>
              </div>

              <div className="bg-[#f8fafc] p-3 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 uppercase font-medium">
                  <Cpu className="h-3 w-3 text-indigo-500" /> Grid Controllers
                </div>
                <p className="text-xl font-bold text-slate-900 mt-1 tabular-nums">{trafficLights}</p>
              </div>
            </div>
          </div>

          {/* Live Incident Dispatch Feed */}
          <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-[0_6px_35px_rgba(0,0,0,0.04)] flex-1 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">Incident Dispatch Console</h3>
              <span className="text-[10px] font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                {alerts.length} Active
              </span>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-72 pr-1">
              {alerts.map((a) => {
                const isAcked = acknowledgedAlerts.has(a.id);
                return (
                  <div
                    key={a.id}
                    className={`p-3 rounded-2xl border text-xs transition-all ${
                      isAcked
                        ? 'bg-slate-50 border-slate-100 opacity-60'
                        : a.severity === 'critical'
                        ? 'bg-rose-50/70 border-rose-100 text-rose-950'
                        : 'bg-amber-50/70 border-amber-100 text-amber-950'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold">{a.message}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Sector {a.sector} • {a.severity}</p>
                      </div>
                      <button
                        onClick={() => handleAcknowledgeAlert(a.id)}
                        className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 text-[10px] font-medium rounded-lg border border-slate-200 shadow-xs shrink-0"
                      >
                        {isAcked ? 'Acknowledged' : 'Acknowledge'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
