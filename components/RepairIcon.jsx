// Small decorative SVGs keep the new repair UI independent of icon webfonts.
const paths = {
  'fa-location-dot': 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  'fa-magnifying-glass': 'M16 10a6 6 0 1 1-12 0 6 6 0 0 1 12 0ZM15 15l6 6',
  'fa-file-invoice': 'M6 3h9l4 4v14H6ZM14 3v5h5M9 12h7M9 16h5',
  'fa-screwdriver-wrench': 'M14 4a6 6 0 0 0-7 8L3 17a3 3 0 0 0 4 4l6-6a6 6 0 0 0 7-8l-4 4-3-3 4-4Z',
  'fa-arrow-right': 'M4 12h16M14 6l6 6-6 6',
  'fa-phone': 'M5 3h4l2 5-2 2c2 3 4 5 7 6l2-2 4 2v4C12 22 2 12 5 3Z',
  'fa-whatsapp': 'M21 11a9 9 0 0 1-13 8l-5 2 1-5a9 9 0 1 1 17-5ZM8 8c1 4 3 6 7 7M8 8h2M15 13v2',
  'fa-layer-group': 'M3 7l9-4 9 4-9 4ZM3 12l9 4 9-4M3 17l9 4 9-4',
  'fa-wifi': 'M3 8a15 15 0 0 1 18 0M6 12a10 10 0 0 1 12 0M9 16a5 5 0 0 1 6 0M12 20h.01',
  'fa-microchip': 'M7 7h10v10H7ZM10 1v6M14 1v6M10 17v6M14 17v6M1 10h6M1 14h6M17 10h6M17 14h6',
  'fa-plug': 'M8 3v5M16 3v5M5 8h14M7 8v4a5 5 0 0 0 10 0V8M12 17v5',
  'fa-power-off': 'M12 2v10M6 5a9 9 0 1 0 12 0',
  'fa-tv': 'M3 4h18v13H3ZM8 21h8M12 17v4',
  'fa-truck-ramp-box': 'M3 4h12v12H3ZM9 4v5M2 21h20M16 16l6-6M17 10h5v5',
  'fa-check': 'M4 12l5 5L20 6',
};

export default function RepairIcon({ name, className }) {
  const key = name.split(' ').pop();
  return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={paths[key] || paths['fa-check']} /></svg>;
}
