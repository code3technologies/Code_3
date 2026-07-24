import React from 'react'

export const ICON_PRESET_OPTIONS = [
  { label: 'Shield (Security)', value: 'shield' },
  { label: 'Server', value: 'server' },
  { label: 'Cloud', value: 'cloud' },
  { label: 'Network', value: 'network' },
  { label: 'Phone (Communication)', value: 'phone' },
  { label: 'Monitor (Display/AV)', value: 'monitor' },
  { label: 'Wrench (Support)', value: 'wrench' },
  { label: 'Refresh (Backup/Sync)', value: 'refresh' },
  { label: 'Chart (Reporting)', value: 'chart' },
  { label: 'Users (Support Team)', value: 'users' },
  { label: 'Layout (Design)', value: 'layout' },
  { label: 'Code (Development)', value: 'code' },
  { label: 'Search (Research/Testing)', value: 'search' },
  { label: 'Smartphone (Mobile)', value: 'smartphone' },
  { label: 'Palette (Brand)', value: 'palette' },
  { label: 'Truck (Relocation/Logistics)', value: 'truck' },
  { label: 'Camera (Surveillance)', value: 'camera' },
  { label: 'Lock (Access Control)', value: 'lock' },
  { label: 'Box (Hardware/Setup)', value: 'box' },
  { label: 'Lightbulb (Consulting)', value: 'lightbulb' },
  { label: 'Headset (Support)', value: 'headset' },
  { label: 'Building (Office)', value: 'building' },
  { label: 'Pin (Location/Relocation)', value: 'pin' },
  { label: 'Database (Storage)', value: 'database' },
  { label: 'Settings (Configuration)', value: 'settings' },
  { label: 'Document (Licensing/Docs)', value: 'document' },
  { label: 'Graduation (Training)', value: 'graduation' },
  { label: 'Printer', value: 'printer' },
  { label: 'TV (Display/Signage)', value: 'tv' },
  { label: 'Mic (Audio)', value: 'mic' },
  { label: 'Wifi (Wireless)', value: 'wifi' },
  { label: 'Handshake (Transfer/Outsourcing)', value: 'handshake' },
  { label: 'Check (Completed/Success)', value: 'check' },
  { label: 'Smile (Satisfaction)', value: 'smile' },
] as const

export type IconPreset = (typeof ICON_PRESET_OPTIONS)[number]['value']

const ICON_PATHS: Record<IconPreset, string> = {
  shield: 'M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z',
  server: 'M3 4h18v6H3z M3 14h18v6H3z M7 7h.01 M7 17h.01',
  cloud: 'M6 18a4 4 0 010-8 5 5 0 019.6-1.5A4.5 4.5 0 0118 18H6z',
  network: 'M12 2v6 M12 16v6 M4.9 4.9l4.2 4.2 M14.9 14.9l4.2 4.2 M2 12h6 M16 12h6 M4.9 19.1l4.2-4.2 M14.9 9.1l4.2-4.2',
  phone: 'M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.68 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.9.32 1.85.55 2.81.68A2 2 0 0122 16.92z',
  monitor: 'M3 4h18v12H3z M8 20h8 M12 16v4',
  wrench: 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z',
  refresh: 'M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0114.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0020.49 15',
  chart: 'M3 3v18h18 M18 17V9 M13 17V5 M8 17v-3',
  users: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75',
  layout: 'M3 3h18v18H3z M3 9h18 M9 21V9',
  code: 'M16 18l6-6-6-6 M8 6l-6 6 6 6',
  search: 'M11 19a8 8 0 100-16 8 8 0 000 16z M21 21l-4.35-4.35',
  smartphone: 'M5 2h14a1 1 0 011 1v18a1 1 0 01-1 1H5a1 1 0 01-1-1V3a1 1 0 011-1z M12 18h.01',
  palette: 'M12 2a10 10 0 000 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.3-.5-.8-.5-1.2 0-1.1.9-2 2-2h2.4c2 0 3.6-1.6 3.6-3.6C21 6.4 17.1 2 12 2z M6.5 12a1.5 1.5 0 100-3 1.5 1.5 0 000 3z M9.5 7.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z M14.5 7.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z',
  truck: 'M1 3h15v13H1z M16 8h4l3 3v5h-7V8z M5.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z M18.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z',
  camera: 'M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z M12 17a4 4 0 100-8 4 4 0 000 8z',
  lock: 'M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z M7 11V7a5 5 0 0110 0v4',
  box: 'M21 8L12 3 3 8v8l9 5 9-5V8z M3 8l9 5 9-5 M12 13v8',
  lightbulb: 'M9 18h6 M10 22h4 M12 2a7 7 0 00-4 12.7c.5.4.8 1 .8 1.6V17h6.4v-.7c0-.6.3-1.2.8-1.6A7 7 0 0012 2z',
  headset: 'M3 18v-6a9 9 0 0118 0v6 M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3v5z M3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5z',
  building: 'M4 21V5a1 1 0 011-1h8a1 1 0 011 1v16 M14 9h5a1 1 0 011 1v11 M4 21h16 M8 7h.01 M8 11h.01 M8 15h.01 M17 13h.01 M17 17h.01',
  pin: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 13a3 3 0 100-6 3 3 0 000 6z',
  database: 'M12 4c4.97 0 9 1.34 9 3s-4.03 3-9 3-9-1.34-9-3 4.03-3 9-3z M3 7v5c0 1.66 4.03 3 9 3s9-1.34 9-3V7 M3 12v5c0 1.66 4.03 3 9 3s9-1.34 9-3v-5',
  settings: 'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15 1.65 1.65 0 003.17 14H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09A1.65 1.65 0 0015 4.6a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06A1.65 1.65 0 0019.4 9c.14.31.22.65.22 1V10a2 2 0 010 4z',
  document: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M9 13h6 M9 17h6 M9 9h1',
  graduation: 'M22 10L12 5 2 10l10 5 10-5z M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5 M22 10v6',
  printer: 'M6 9V2h12v7 M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2 M6 14h12v8H6z',
  tv: 'M3 7h18v12H3z M8 22h8 M12 19v3',
  mic: 'M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3z M19 10v1a7 7 0 01-14 0v-1 M12 18v4 M8 22h8',
  wifi: 'M5 12.5a11 11 0 0114 0 M8.5 16a6 6 0 017 0 M12 20h.01 M2 9a15.5 15.5 0 0120 0',
  handshake: 'M11 17l-2.2-2.2a2.5 2.5 0 013.5-3.5L14 13 M9 15l4.5 4.5a1.5 1.5 0 002.1-2.1L11 13 M2 12l5-5 4 4 M22 12l-5-5-2 2 M7 7l3-3 4 4-1.5 1.5',
  check: 'M22 11.08V12a10 10 0 11-5.93-9.14 M22 4L12 14.01l-3-3',
  smile: 'M12 22a10 10 0 100-20 10 10 0 000 20z M8 14s1.5 2 4 2 4-2 4-2 M9 9h.01 M15 9h.01',
}

export function ServiceIcon({ preset, className }: { preset: string; className?: string }) {
  const path = ICON_PATHS[preset as IconPreset] || ICON_PATHS.wrench
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={path} />
    </svg>
  )
}
