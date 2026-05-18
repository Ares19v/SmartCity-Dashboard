import { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip as LeafletTooltip, useMap } from "react-leaflet";
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
  normal: "hsl(var(--primary))",
  warning: "hsl(var(--warning))",
  critical: "hsl(var(--destructive))",
};

function FlyTo({ target }: { target: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, 14, { duration: 1.2 });
  }, [target, map]);
  return null;
}

interface SectorMapProps {
  sectors: SectorStatus[];
  selectedId: number | null;
  onSelect: (sector: SectorStatus) => void;
}

export function SectorMap({ sectors, selectedId, onSelect }: SectorMapProps) {
  const points = useMemo(
    () =>
      sectors
        .map((s) => ({ sector: s, coords: SECTOR_COORDS[s.name] }))
        .filter((p): p is { sector: SectorStatus; coords: [number, number] } => !!p.coords),
    [sectors]
  );

  const selectedTarget = useMemo(() => {
    const found = points.find((p) => p.sector.id === selectedId);
    return found ? found.coords : null;
  }, [points, selectedId]);

  const mapRef = useRef(null);

  return (
    <div className="calm-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-[11px] font-medium text-muted-foreground tracking-wide uppercase">
          Sector Map
        </h2>
        <span className="text-[10px] text-muted-foreground/60 font-light ml-auto">
          Click any marker to focus
        </span>
      </div>
      <div className="h-[260px] w-full rounded-md overflow-hidden border border-border/60">
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
            attribution='&copy; OpenStreetMap &copy; CARTO'
          />
          <FlyTo target={selectedTarget} />
          {points.map(({ sector, coords }) => (
            <CircleMarker
              key={sector.id}
              center={coords}
              radius={selectedId === sector.id ? 9 : 6}
              pathOptions={{
                color: STATUS_COLOR[sector.status],
                fillColor: STATUS_COLOR[sector.status],
                fillOpacity: selectedId === sector.id ? 0.85 : 0.55,
                weight: selectedId === sector.id ? 2 : 1.2,
              }}
              eventHandlers={{ click: () => onSelect(sector) }}
            >
              <LeafletTooltip direction="top" offset={[0, -6]} opacity={1}>
                <span style={{ fontSize: 11, fontWeight: 500 }}>{sector.name}</span>
              </LeafletTooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
