// Generates app/icons.css: a self-hosted subset of the Font Awesome Free icons this
// site uses. Run from the repo root after installing the icon packages without
// saving them (they are build-time inputs only, not dependencies):
//   npm i --no-save @fortawesome/free-solid-svg-icons@6 @fortawesome/free-brands-svg-icons@6
//   node scripts/generate-icons.cjs

const solid = require('@fortawesome/free-solid-svg-icons');
const brands = require('@fortawesome/free-brands-svg-icons');
const fs = require('fs');
const names = 'arrow-right bars bolt calendar-check certificate check chevron-down circle-check circle-exclamation clipboard-list comments desktop display envelope file-invoice hand-holding-dollar headset location-dot magnifying-glass microchip panorama paper-plane phone phone-volume shield-halved spinner truck-fast tv wrench xmark'.split(' ');
const brandNames = ['whatsapp'];
const find = (pack, name) => Object.values(pack).find((d) => d && d.iconName === name);
const version = require('@fortawesome/free-solid-svg-icons/package.json').version;
let css = `/*!
 * Self-hosted icon subset generated from Font Awesome Free ${version}
 * https://fontawesome.com  License: https://fontawesome.com/license/free
 * Icons: CC BY 4.0. Only the ${names.length + brandNames.length} icons used on this site are included.
 *
 * Replaces the render-blocking cdnjs Font Awesome stylesheet + webfonts. Each icon
 * is an inline SVG used as a CSS mask, so it inherits currentColor and scales with
 * font-size exactly like the original glyphs. Markup is unchanged:
 *   <i className="fa-solid fa-phone" />
 *
 * To add an icon: add its name to scripts/generate-icons.cjs, then run
 *   npm i --no-save @fortawesome/free-solid-svg-icons@6 @fortawesome/free-brands-svg-icons@6
 *   node scripts/generate-icons.cjs
 */
.fa-solid, .fa-brands {
  display: inline-block;
  width: calc(var(--fa-w, 512) / 512 * 1em);
  height: 1em;
  vertical-align: -0.125em;
  background-color: currentColor;
  -webkit-mask: var(--fa-i) no-repeat center / contain;
  mask: var(--fa-i) no-repeat center / contain;
  flex-shrink: 0;
}
.fa-spin { animation: fa-spin 1s linear infinite; }
@keyframes fa-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) { .fa-spin { animation: none; } }
`;
const missing = [];
const emit = (pack, name) => {
  const def = find(pack, name);
  if (!def) return missing.push(name);
  const [w, h, , , path] = def.icon;
  const d = Array.isArray(path) ? path.join(' ') : path;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}'><path d='${d}'/></svg>`;
  css += `.fa-${name} { --fa-w: ${w}; --fa-i: url("data:image/svg+xml,${encodeURIComponent(svg).replace(/%20/g, ' ').replace(/%3D/g, '=').replace(/%3A/g, ':').replace(/%2F/g, '/').replace(/%2C/g, ',').replace(/%27/g, "'")}"); }\n`;
};
names.forEach((n) => emit(solid, n));
brandNames.forEach((n) => emit(brands, n));
fs.writeFileSync(require('path').join(__dirname, '..', 'app', 'icons.css'), css);
console.log('icons written:', names.length + brandNames.length - missing.length, 'missing:', missing.join(',') || 'none', '| bytes:', css.length);
