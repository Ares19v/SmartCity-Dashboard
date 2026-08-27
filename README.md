<div align="center">

# ??? SmartCity Dashboard
### Real-Time Urban Telemetry, IoT Geospatial Analytics & Infrastructure Operations

[![CI](https://github.com/Ares19v/SmartCity-Dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/Ares19v/SmartCity-Dashboard/actions/workflows/ci.yml)


[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Leaflet](https://img.shields.io/badge/Leaflet-Geospatial-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

<p align="center">
  <b>A comprehensive, real-time smart city management platform consolidating traffic flow sensors, renewable energy grids, air quality indices, municipal emergency dispatch, and public transit telemetry into an interactive geospatial command dashboard.</b>
</p>

</div>

---

## ?? Overview

**SmartCity Dashboard** provides urban planners, city engineers, and municipal emergency response coordinators with a unified situational awareness console. Built on a modular React + TypeScript architecture, the platform pairs real-time geospatial map layers with reactive charts, simulated sensor streams, and automated anomaly alerts.

---

## ? Key Features

- **Interactive Geospatial Map (Leaflet / OpenStreetMap)**: Live city mapping featuring custom vector markers for traffic congestion points, municipal buses, electric vehicle charging stations, and air quality stations.
- **Multi-Sector Infrastructure Monitoring**:
  - ?? **Traffic & Mobility**: Real-time vehicle density, intersection delays, and incident heatmaps.
  - ? **Energy & Power Grid**: Live solar/wind generation rates, substation loads, and municipal grid efficiency.
  - ?? **Environmental Telemetry**: PM2.5, PM10, AQI readings, noise level meters, and urban heat island tracking across city sectors (Downtown, Green Zones, Industrial, Residential).
  - ?? **Emergency & Civic Response**: Active 911 dispatch status, fire department routing, and hospital bed availability.
- **Sector Visualizers**: High-fidelity architectural sector overviews with dedicated metrics for specialized city zones.
- **Comprehensive UI Component Suite**: Built on top of Radix UI primitives with smooth transitions, theme switches, and mobile-responsive drawer controls.

---

## ??? Tech Stack & Structure

```
SmartCity-Dashboard/
??? src/
?   ??? components/         # Metric cards, alert feeds, and control panels
?   ??? components/map/     # Leaflet map container, custom pins & overlays
?   ??? components/ui/      # Radix UI glassmorphic component primitives
?   ??? hooks/              # Sensor stream simulation & polling hooks
?   ??? types/              # TypeScript schema definitions for urban telemetry
??? public/                 # High-resolution sector imagery and vector icons
??? EVAL.md                 # System benchmark, UX audits & performance review
??? vite.config.ts          # Vite build configuration
??? package.json            # Dependencies and scripts
```

- **Core**: React 18, TypeScript 5.x
- **Mapping**: Leaflet, React-Leaflet
- **Data Visualization**: Recharts, TanStack Query
- **Styling & UI**: TailwindCSS, Radix UI, Lucide Icons, Framer Motion

---

## ?? Quick Start

### Prerequisites
- Node.js 18+ or Bun

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/Ares19v/SmartCity-Dashboard.git
cd SmartCity-Dashboard

# Install dependencies (using npm or bun)
npm install

# Start the Vite development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

© 2026 Devansh Tyagi (Ares19v). All Rights Reserved.
