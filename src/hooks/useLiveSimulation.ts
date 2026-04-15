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
  const alertCounter = useRef(0);

  const tick = useCallback(() => {
    setTrafficLights(v => Math.max(1100, Math.min(1400, v + Math.floor(Math.random() * 40 - 20))));
    setEnergyLoad(v => Math.max(350, Math.min(620, v + Math.floor(Math.random() * 30 - 15))));
    setEmergencyUnits(v => Math.max(12, Math.min(38, v + Math.floor(Math.random() * 6 - 3))));

    setSectors(prev => prev.map(s => ({
      ...s,
      status: Math.random() > 0.85 ? (Math.random() > 0.5 ? "warning" : "critical") : "normal",
    })));

    setPowerData(prev => prev.map(p => ({
      ...p,
      usage: Math.max(200, Math.min(600, p.usage + Math.floor(Math.random() * 20 - 10))),
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

  useEffect(() => {
    // Initial alerts
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

    const interval = setInterval(tick, 3000);
    return () => clearInterval(interval);
  }, [tick]);

  return { trafficLights, energyLoad, emergencyUnits, sectors, alerts, powerData };
}
