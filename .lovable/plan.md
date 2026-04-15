

# Smart City Management Dashboard

## Layout
- Full-screen dark dashboard with a sidebar for emergency feed and a main content area
- Cyberpunk/enterprise aesthetic: dark backgrounds (#0a0a1a), glowing neon borders (cyan/blue/purple), glassmorphism panels with backdrop-blur and semi-transparent backgrounds

## Design System Updates
- Dark mode as default with custom CSS variables for neon accent colors (cyan `#00f0ff`, electric blue `#3b82f6`, alert red, warning amber)
- Glowing border utility classes using box-shadow with color spread
- Glass panel styles: `bg-white/5 backdrop-blur-xl border border-white/10`

## Components

### 1. Dashboard Layout (`pages/Index.tsx`)
- Grid layout: left emergency sidebar, center map + stats, right area for chart
- Header with city name, current time (live-updating), and overall status indicator

### 2. City Stats Bar (top cards)
- Three animated stat cards: **Active Traffic Lights**, **Current Energy Load (MW)**, **Active Emergency Units**
- `useEffect` hook updates values randomly every 3 seconds with smooth number transitions
- Each card has a lucide-react icon and a glowing accent color

### 3. Interactive City Map (`components/CityMap.tsx`)
- Grid-based sector map (e.g., 4x3 grid) using styled divs with lucide-react icons (Building2, Factory, Trees, Hospital, etc.)
- Each sector shows status (normal/warning/critical) with color-coded glowing borders
- Hover tooltips showing sector details

### 4. Power Consumption Chart (`components/PowerChart.tsx`)
- Recharts `AreaChart` showing 24-hour energy usage with gradient fill
- Styled to match cyberpunk theme (neon line color, dark grid)
- Simulated data that shifts over time

### 5. Emergency Feed Sidebar (`components/EmergencyFeed.tsx`)
- Scrolling list of alert notifications with timestamps
- Color-coded severity (red=critical, amber=warning, blue=info)
- New alerts auto-added every few seconds via simulation
- Auto-scroll to latest alert

### 6. Live Simulation Hook (`hooks/useLiveSimulation.ts`)
- Custom hook managing all simulated data: stats, emergency alerts, sector statuses
- Random updates every 3 seconds with realistic value ranges

