# PREP — SmartCity Dashboard (From-Scratch Study Guide)

Welcome to the beginner-friendly study guide for the **SmartCity Dashboard** (NeoCity Command). This guide covers core frontend engineering concepts: map integrations, real-time client-side simulations, and responsive dashboard design.

---

## 1. Geospatial Mapping with React-Leaflet

To visualize geographic sectors, the dashboard uses **Leaflet** via the `react-leaflet` library.

### What is Leaflet?
* Leaflet is a leading open-source JavaScript library for mobile-friendly interactive maps.
* `react-leaflet` binds Leaflet's imperative API into declarative React components.

### Core React-Leaflet Components:
1. **`<MapContainer>`**: Initializes the Leaflet map instance. It defines the initial center coordinate and default zoom level.
2. **`<TileLayer>`**: Renders the map background styling (tiles). Typically uses OpenStreetMap or CartoDB styles.
3. **`<Polygon>` / `<Marker>`**: Renders dynamic sectors or point indicators on top of the coordinates.
4. **`<Popup>`**: Tooltip bubbles that appear when users click or hover over map components.

### Example Leaflet Setup:
```tsx
import { MapContainer, TileLayer, Polygon, Popup } from 'react-leaflet';

function SimpleMap() {
  const center: [number, number] = [51.505, -0.09];
  const sectorCoords: [number, number][] = [
    [51.51, -0.08],
    [51.52, -0.06],
    [51.49, -0.07],
  ];

  return (
    <MapContainer center={center} zoom={13} style={{ height: '300px', width: '100%' }}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />
      <Polygon positions={sectorCoords} color="red">
        <Popup>Downtown Core Sector</Popup>
      </Polygon>
    </MapContainer>
  );
}
```

---

## 2. Managing Client-Side Real-Time Simulations

Since this dashboard does not have a live database backend, it simulates real-time data flow using React hooks and custom intervals.

### Memory Leak Prevention
Whenever you use asynchronous operations or intervals (`setInterval`) inside a React component, you **MUST** clear the interval when the component unmounts. Failing to do so causes **memory leaks** where background timers continue firing and trying to update non-existent state.

### The Standard Cleanup Pattern:
```typescript
useEffect(() => {
  const intervalId = setInterval(() => {
    // 1. Trigger simulation tick
    statTick();
  }, 4000);

  // 2. Return a cleanup function!
  return () => {
    clearInterval(intervalId);
  };
}, [statTick]);
```

### Key React Hooks Used:
* **`useCallback`**: Memoizes the state modifier ticks (`statTick`, `chartTick`) so they aren't re-instantiated on every single render pass.
* **`useRef`**: Tracks internal counters (like `alertCounter`) without triggering a UI re-render when they increment.

---

## 3. Tailwind CSS & Dashboard Layouts

The dashboard's layout adapts seamlessly across all devices using Tailwind's robust responsive design grids.

### Standard Dashboard Grid Layout:
```html
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
  <!-- Left Side: Emergency Feed -->
  <div className="lg:col-span-3">
    <EmergencyFeed />
  </div>

  <!-- Center Column: Map & Chart -->
  <div className="lg:col-span-5 flex flex-col gap-4">
    <CityMap />
    <PowerChart />
  </div>

  <!-- Right Column: Sector Breakdown -->
  <div className="lg:col-span-4">
    <SectorMap />
  </div>
</div>
```

### Responsive Grids Breakdowns:
* **`grid-cols-1`**: Mobile viewport standard; all columns stack vertically.
* **`md:grid-cols-2`**: Tablet viewport standard; shifts to a side-by-side split screen.
* **`lg:grid-cols-12`**: Desktop viewport standard; creates a highly customized 12-column layout apportioned into `3-5-4` widths.

### Conditional Severity Styling:
Using dynamic template strings, the UI highlights active issues instantly:
```typescript
const severityColors = {
  critical: "bg-red-500/10 border-red-500 text-red-500",
  warning: "bg-yellow-500/10 border-yellow-500 text-yellow-500",
  info: "bg-blue-500/10 border-blue-500 text-blue-500"
};
```

---

## 4. Beginner Exercises

1. **Persist the Activity Log**: Modify `useLiveSimulation.ts` to save and restore emergency alerts inside `localStorage`, so when a user reloads the browser, their prior alert feed is loaded instead of beginning empty.
2. **Dynamic Zoom Button**: Add a button next to each sector in the list that clicks to trigger `map.setView()` or fly to those exact coordinates on the Leaflet instance.
3. **Filter Active Alerts by Severity**: Add a dropdown filter in the header to filter the emergency log view strictly to `Critical` alerts.
