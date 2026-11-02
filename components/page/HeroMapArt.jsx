// Decorative "local area" drawing for heroes that have no photo (locality
// pages). Inline SVG, hidden from assistive technology and from image search;
// it only fills the empty desktop column.
export default function HeroMapArt({ className = '' }) {
  return (
    <svg
      viewBox="0 0 440 440"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <defs>
        <radialGradient id="hero-map-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#CFF0F5" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#CFF0F5" stopOpacity="0" />
        </radialGradient>
        <clipPath id="hero-map-clip">
          <circle cx="220" cy="220" r="210" />
        </clipPath>
      </defs>

      <circle cx="220" cy="220" r="210" fill="#ffffff" />
      <g clipPath="url(#hero-map-clip)" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round">
        {/* Streets */}
        <path d="M0 150 C 120 140, 200 190, 440 170" />
        <path d="M0 300 C 140 280, 260 330, 440 290" />
        <path d="M120 0 C 140 120, 110 260, 150 440" />
        <path d="M310 0 C 290 140, 330 300, 300 440" />
        <path d="M0 60 L 440 380" strokeDasharray="2 8" />
        <path d="M60 440 L 420 40" strokeDasharray="2 8" />
        {/* Blocks */}
        <rect x="170" y="70" width="70" height="44" rx="8" fill="#F5F8FC" />
        <rect x="335" y="200" width="60" height="60" rx="8" fill="#F5F8FC" />
        <rect x="40" y="190" width="60" height="70" rx="8" fill="#F5F8FC" />
        <rect x="190" y="330" width="80" height="48" rx="8" fill="#F5F8FC" />
      </g>

      <circle cx="220" cy="220" r="150" fill="url(#hero-map-glow)" />
      <circle cx="220" cy="220" r="96" stroke="#5CC8DA" strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="4 6" />
      <circle cx="220" cy="220" r="150" stroke="#B9D0F1" strokeOpacity="0.6" strokeWidth="1.5" />
      <circle cx="220" cy="220" r="209" stroke="#E2E8F0" strokeWidth="2" />

      {/* Nearby visits */}
      <circle cx="120" cy="150" r="7" fill="#8BB0E6" />
      <circle cx="318" cy="128" r="6" fill="#8BB0E6" />
      <circle cx="300" cy="300" r="7" fill="#8BB0E6" />
      <circle cx="150" cy="318" r="5" fill="#8BB0E6" />

      {/* Pin */}
      <g transform="translate(220 196)">
        <ellipse cx="0" cy="58" rx="22" ry="6" fill="#071F47" fillOpacity="0.12" />
        <path
          d="M0 56 C -6 44, -38 18, -38 -6 A 38 38 0 1 1 38 -6 C 38 18, 6 44, 0 56 Z"
          fill="#0E7C90"
        />
        <circle cx="0" cy="-6" r="15" fill="#ffffff" />
        <circle cx="0" cy="-6" r="6" fill="#0D47A1" />
      </g>
    </svg>
  );
}
