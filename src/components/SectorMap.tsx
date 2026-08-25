import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip as LeafletTooltip, useMap } from "react-leaflet";
import { MapPin, Navigation, RotateCcw } from "lucide-react";
import type { SectorStatus } from "@/hooks/useLiveSimulation";
import "leaflet/dist/leaflet.css";

// Approximate coordinates around a fictional city centered on a calm coastal area.
const SECTOR_COORDS: Record<string, [number, number]> = {
  "Downtown Core":      [47.6062, -122.3321],
  "Industrial Zone":    [47.5780, -122.3500],
  "Green Park":         [47.6205, -122.3493],
  "Medical District":   [47.6101, -122.3200],
  "Residential North":  [47.6450, -122.3300],
  "Tech Hub":           [47.6150, -122.3420],
  "Harbor Front":       [47.6080, -122.3550],
  "University":         [47.6553, -122.3035],
  "Commercial East":    [47.6120, -122.3100],
  "Transit Hub":        [47.5985, -122.3300],
  "Power Grid":         [47.5900, -122.3650],
  "Civic Center":       [47.6030, -122.3290],
};

const STATUS_COLOR: Record<string, string> = {
  normal: "#10b981",
  warning: "#f59e0b",
  critical: "#f43f5e",
};

function FlyTo({ target, resetCenter }: { target: [number, number] | null; resetCenter: number }) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo(target, 14, { duration: 1.2 });
    }
  }, [target, map]);

  useEffect(() => {
    if (resetCenter > 0) {
      map.flyTo([47.6062, -122.3321], 12, { duration: 1.0 });
    }
  }, [resetCenter, map]);

  return null;
}

interface SectorMapProps {
  sectors: SectorStatus[];
  selectedId: number | null;
  onSelect: (sector: SectorStatus) => void;
}

export function SectorMap({ sectors, selectedId, onSelect }: SectorMapProps) {
  const [resetTick, setResetTick] = useState(0);

  const points = useMemo(
    () =>
      sectors
        .map((s) => ({ sector: s, coords: SECTOR_COORDS[s.name] }))
        .filter((p): p is { sector: SectorStatus; coords: [number, number] } => !!p.coords),
    [sectors]
  );

  const selectedPoint = useMemo(() => {
    return points.find((p) => p.sector.id === selectedId) || null;
  }, [points, selectedId]);

  const mapRef = useRef(null);

  return (
    <div className="calm-card p-4 md:p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Navigation className="h-3.5 w-3.5 text-primary" strokeWidth={1.5} />
          <h2 className="text-[11px] font-medium text-muted-foreground tracking-wider uppercase">
            Geospatial Sector Map
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {selectedPoint && (
            <span className="hidden sm:flex items-center gap-1 text-[10px] text-muted-foreground font-light tabular-nums bg-muted/60 px-2 py-0.5 rounded">
              <MapPin className="h-2.5 w-2.5 text-primary" />
              {selectedPoint.coords[0].toFixed(3)}°N, {Math.abs(selectedPoint.coords[1]).toFixed(3)}°W
            </span>
          )}
          <button
            onClick={() => setResetTick((t) => t + 1)}
            title="Reset Map View"
            className="p-1 rounded hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="h-3 w-3" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 min-h-[260px] w-full rounded-lg overflow-hidden border border-border/60 relative">
        <MapContainer
          center={[47.6062, -122.3321]}
          zoom={12}
          scrollWheelZoom={false}
          ref={mapRef}
          style={{ height: "100%", width: "100%", background: "hsl(var(--muted))" }}
          attributionControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap &copy; CARTO"
          />
          <FlyTo target={selectedPoint ? selectedPoint.coords : null} resetCenter={resetTick} />
          {points.map(({ sector, coords }) => (
            <CircleMarker
              key={sector.id}
              center={coords}
              radius={selectedId === sector.id ? 10 : 6.5}
              pathOptions={{
                color: STATUS_COLOR[sector.status],
                fillColor: STATUS_COLOR[sector.status],
                fillOpacity: selectedId === sector.id ? 0.9 : 0.6,
                weight: selectedId === sector.id ? 2.5 : 1.2,
              }}
              eventHandlers={{ click: () => onSelect(sector) }}
            >
              <LeafletTooltip direction="top" offset={[0, -6]} opacity={1}>
                <div className="text-[11px] font-medium py-0.5">
                  <span>{sector.name}</span>
                  <span className="text-[9px] block text-muted-foreground uppercase font-light">
                    Status: {sector.status}
                  </span>
                </div>
              </LeafletTooltip>
            </CircleMarker>
          ))}
        </MapContainer>

        {/* Floating Legend Overlay */}
        <div className="absolute bottom-2.5 left-2.5 z-[1000] bg-card/90 backdrop-blur-md px-2.5 py-1.5 rounded-md border border-border/60 shadow-sm flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-primary" /> Nominal
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-warning" /> Warning
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-destructive" /> Critical
          </span>
        </div>
      </div>
    </div>
  );
}
