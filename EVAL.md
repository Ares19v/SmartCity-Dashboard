# EVAL — SmartCity Dashboard

> **Evaluation Date:** 2026-05-29
> **Evaluator:** Automated Portfolio Review
> **Maturity Level:** MVP / Prototype (Frontend Only)

---

## 1. Project Purpose & Problem Statement

SmartCity Dashboard (NeoCity Command) is a client-side real-time urban analytics dashboard that consolidates city-wide operational metrics (Traffic Lights, Energy Load, and Active Emergency Units) into a clean, modern, responsive map and chart-centric interface.

The project demonstrates high-quality frontend engineering, layout consistency, and interactive states, mimicking a central IoT control room dashboard. It serves as an impressive visual portfolio piece showing how complex real-time geospatial data could be rendered and manipulated in a real production environment.

---

## 2. Technical Architecture

The project is built entirely as a Single Page Application (SPA):

- **Framework & Build Tool:** React 18 + TypeScript 5 with Vite 5. The choice of **Bun** as the package manager and test runner suggests an emphasis on modern JS ecosystem tools and rapid developer workflows.
- **Geospatial Rendering:** `leaflet` and `react-leaflet` to display interactive geographic sectors and locations.
- **Data Visualization:** `recharts` for displaying historical electrical load and capacity.
- **Simulation Engine:** `useLiveSimulation.ts` generates simulated telemetry (±2% stat fluctuations every 4 seconds, sliding-window power chart additions every 10 seconds, and randomized high-severity emergency alert injections).
- **Styling & Components:** Built using Tailwind CSS, Radix UI primitives, and `shadcn/ui`.
- **State Management & Routing:** Client-side routing with `react-router-dom` and TanStack Query (`@tanstack/react-query`) for structured server-state fetching (though currently unused or mocked).

---

## 3. Strengths

- **Beautiful UX/UI Design:** Minimalist "NeoCity Command" dark theme using modern CSS aesthetics, clean stat cards, dynamic active indicators, and high contrast typography.
- **Highly Responsive Layout:** Handles cross-device resizing cleanly, reorganizing maps and feeds efficiently between desktop, tablet, and mobile views.
- **Strict TypeScript Typing:** Excellent type discipline throughout component boundaries, reducing runtime bugs and improving developer experience.
- **Dynamic Leaflet Integration:** Incorporating Leaflet maps with custom sectors, warning states, and interactive click events demonstrates strong map-integration proficiency.
- **Comprehensive Testing Infrastructure:** Configured with Vitest and React Testing Library, showcasing professional automated testing best practices.

---

## 4. Limitations & Known Gaps

- **Simulation Only (No Backend):** The application relies entirely on client-side interval simulation (`useLiveSimulation`). It does not connect to real IoT sensors, WebSockets, or a REST API backend.
- **No Persistence:** Alerts, watchlist items, or filter parameters do not persist beyond a page reload because there is no database or server-side store (and no localStorage implementation like other projects).
- **Leaflet CPU Overhead:** Heavy map marker rendering and custom DOM shapes in Leaflet can consume high CPU resources if the simulation ticks too frequently or if the sector list grows from 12 to 10,000.
- **Static Map Boundaries:** The coordinates are hardcoded into local simulation assets; they do not fetch dynamically from an external GeoJSON source.

---

## 5. Code Quality Assessment

- **Structure:** Clean, modular structure separating components, pages, custom hooks, and styles (`src/components/`, `src/hooks/`, `src/pages/`, `src/lib/`).
- **Tooling Integration:** Correct integration of Tailwind, ESLint, TypeScript, and Vitest.
- **Documentation:** The project README is functional, detailing the Bun tech stack and standard install/run procedures.

---

## 6. Maturity Breakdown

| Dimension | Score | Notes |
|-----------|-------|-------|
| Functionality | 6/10 | Visually complete and highly interactive, but data is entirely simulated. |
| Code Quality | 9/10 | Excellent TypeScript conventions, clean component structures, and proper styling separation. |
| Documentation | 7/10 | Straightforward README; lacks full architectural diagrams. |
| Scalability | 5/10 | Client-side only; would require rewrite to hook into active WebSockets. |
| Security | 8/10 | High because there is no backend surface area, auth secrets, or direct injection vectors. |
| **Overall** | **7.0/10** | Outstanding frontend prototype that is ready to be connected to an actual server-side WebSocket/IoT gateway. |

---

## 7. Suggested Next Steps

1. **Integrate Real-Time WebSockets:** Implement a simple Node.js or FastAPI backend that broadcasts real-time IoT events via WebSockets (`ws://`), changing `useLiveSimulation` to listen to actual network events instead of using `setInterval`.
2. **Dynamic GeoJSON Loading:** Modify `CityMap` to fetch official municipal boundaries or sector coordinates from an external GeoJSON API, enabling dynamic geography mapping.
3. **Database Alert Logging:** Persist critical alerts in a backend database (e.g. SQLite/PostgreSQL) and implement historical query features using `@tanstack/react-query`.

---

<p align="center">Made by Devansh Tyagi @ 2026</p>
