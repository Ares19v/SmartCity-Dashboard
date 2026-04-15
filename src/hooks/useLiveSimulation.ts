import { useState, useEffect, useCallback, useRef } from "react";

export interface SectorStatus {
  id: number;
  name: string;
  status: "normal" | "warning" | "critical";
  icon: string;
}

export interface EmergencyAlert {
  id: string;
  message: string;
  sector: number;
  severity: "critical" | "warning" | "info";
  timestamp: Date;
}

export interface SimulationData {
  trafficLights: number;
  energyLoad: number;
  emergencyUnits: number;
  sectors: SectorStatus[];
  alerts: EmergencyAlert[];
  powerData: { hour: string; usage: number }[];
  lastSync: Date;
}

const SECTOR_NAMES = [
  "Downtown Core", "Industrial Zone", "Green Park", "Medical District",
  "Residential North", "Tech Hub", "Harbor Front", "University",
  "Commercial East", "Transit Hub", "Power Grid", "Civic Center",
];

const SECTOR_ICONS = [
  "Building2", "Factory", "Trees", "Hospital",
  "Home", "Cpu", "Ship", "GraduationCap",
  "ShoppingBag", "Train", "Zap", "Landmark",
];

const ALERT_TEMPLATES = [
  { msg: "Water Main Leak", severity: "critical" as const },
  { msg: "Fire Alert", severity: "critical" as const },
  { msg: "Power Surge Detected", severity: "warning" as const },
  { msg: "Traffic Congestion", severity: "warning" as const },
  { msg: "Air Quality Warning", severity: "warning" as const },
  { msg: "Routine Maintenance", severity: "info" as const },
  { msg: "Sensor Calibration", severity: "info" as const },
  { msg: "Street Light Outage", severity: "info" as const },
  { msg: "Gas Leak Reported", severity: "critical" as const },
  { msg: "Flooding Risk", severity: "warning" as const },
];

function generatePowerData(): { hour: string; usage: number }[] {
  return Array.from({ length: 24 }, (_, i) => {
    const base = 300 + 150 * Math.sin((i - 6) * Math.PI / 12);
    return { hour: `${i.toString().padStart(2, "0")}:00`, usage: Math.round(base + Math.random() * 80) };
  });
}

function initSectors(): SectorStatus[] {
  return SECTOR_NAMES.map((name, i) => ({
    id: i + 1,
    name,
    status: "normal" as const,
    icon: SECTOR_ICONS[i],
  }));
}

export function useLiveSimulation(): SimulationData {
  const [trafficLights, setTrafficLights] = useState(1247);
  const [energyLoad, setEnergyLoad] = useState(482);
  const [emergencyUnits, setEmergencyUnits] = useState(23);
  const [sectors, setSectors] = useState<SectorStatus[]>(initSectors);
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);
  const [powerData, setPowerData] = useState(generatePowerData);
  const [lastSync, setLastSync] = useState(new Date());
  const alertCounter = useRef(0);
  const powerTickCounter = useRef(0);

  // ±2% stat fluctuations every 4s
  const statTick = useCallback(() => {
    setTrafficLights(v => {
      const delta = Math.round(v * 0.02 * (Math.random() * 2 - 1));
      return Math.max(1100, Math.min(1400, v + delta));
    });
    setEnergyLoad(v => {
      const delta = Math.round(v * 0.02 * (Math.random() * 2 - 1));
      return Math.max(350, Math.min(620, v + delta));
    });
    setEmergencyUnits(v => {
      const delta = Math.round(v * 0.02 * (Math.random() * 2 - 1)) || (Math.random() > 0.5 ? 1 : -1);
      return Math.max(12, Math.min(38, v + delta));
    });

    setSectors(prev => prev.map(s => ({
      ...s,
      status: Math.random() > 0.85 ? (Math.random() > 0.5 ? "warning" : "critical") : "normal",
    })));

    if (Math.random() > 0.3) {
      const template = ALERT_TEMPLATES[Math.floor(Math.random() * ALERT_TEMPLATES.length)];
      const sector = Math.floor(Math.random() * 12) + 1;
      alertCounter.current += 1;
      setAlerts(prev => [
        ...prev.slice(-49),
        {
          id: `alert-${alertCounter.current}`,
          message: template.msg,
          sector,
          severity: template.severity,
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  // Scrolling chart: every 10s add new point, shift left
  const chartTick = useCallback(() => {
    powerTickCounter.current += 1;
    setPowerData(prev => {
      const last = prev[prev.length - 1];
      const lastHour = parseInt(last.hour.split(":")[0]);
      const nextHour = (lastHour + 1) % 24;
      const base = 300 + 150 * Math.sin((nextHour - 6) * Math.PI / 12);
      const newPoint = {
        hour: `${nextHour.toString().padStart(2, "0")}:00`,
        usage: Math.round(base + Math.random() * 80),
      };
      return [...prev.slice(1), newPoint];
    });
  }, []);

  useEffect(() => {
    for (let i = 0; i < 5; i++) {
      const template = ALERT_TEMPLATES[Math.floor(Math.random() * ALERT_TEMPLATES.length)];
      alertCounter.current += 1;
      setAlerts(prev => [...prev, {
        id: `alert-${alertCounter.current}`,
        message: template.msg,
        sector: Math.floor(Math.random() * 12) + 1,
        severity: template.severity,
        timestamp: new Date(Date.now() - (5 - i) * 15000),
      }]);
    }

    const statInterval = setInterval(statTick, 4000);
    const chartInterval = setInterval(chartTick, 10000);
    const syncInterval = setInterval(() => setLastSync(new Date()), 60000);

    return () => {
      clearInterval(statInterval);
      clearInterval(chartInterval);
      clearInterval(syncInterval);
    };
  }, [statTick, chartTick]);

  return { trafficLights, energyLoad, emergencyUnits, sectors, alerts, powerData, lastSync };
}
