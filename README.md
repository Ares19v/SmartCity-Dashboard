# 🏙️ SmartCity Dashboard

A real-time urban analytics dashboard that consolidates city-wide metrics into a single, responsive interface. Built with a modern React + TypeScript stack, featuring interactive maps, live charts, and a clean component-driven architecture.

![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)

---

## Features

- **Interactive Maps** — Leaflet-powered geospatial views via `react-leaflet`
- **Data Visualization** — Charts and graphs powered by `recharts`
- **Real-time Data Fetching** — Server state management with `@tanstack/react-query`
- **Multi-page Routing** — Client-side navigation with `react-router-dom`
- **Dark / Light Mode** — Theme switching via `next-themes`
- **Accessible UI Components** — Built on the full Radix UI primitive suite
- **Form Validation** — `react-hook-form` + `zod` schema validation
- **Fully Typed** — 98% TypeScript coverage

---

## Tech Stack

| Category | Technology |
|---|---|
| Framework | React 18 + TypeScript 5 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS + tailwindcss-animate |
| Components | shadcn/ui (Radix UI primitives) |
| Charts | Recharts |
| Maps | Leaflet + react-leaflet |
| Data Fetching | TanStack Query v5 |
| Routing | React Router v6 |
| Forms | React Hook Form + Zod |
| Theming | next-themes |
| Package Manager | Bun |
| Testing | Vitest + Testing Library |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+ **or** [Bun](https://bun.sh/)

### Install & Run

```bash
# Clone the repo
git clone https://github.com/Ares19v/SmartCity-Dashboard.git
cd SmartCity-Dashboard

# Install dependencies
bun install
# or: npm install

# Start the dev server
bun run dev
# or: npm run dev
```

App runs at `http://localhost:5173`

### Other Commands

```bash
bun run build       # Production build
bun run preview     # Preview production build locally
bun run test        # Run tests once
bun run test:watch  # Run tests in watch mode
bun run lint        # Lint the codebase
```

---

## Project Structure

```
SmartCity-Dashboard/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Route-level views
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utilities and helpers
│   └── main.tsx        # App entry point
├── index.html
├── vite.config.ts
├── tailwind.config.ts
└── package.json
```

---

## Built By

[Ares19v](https://github.com/Ares19v)
