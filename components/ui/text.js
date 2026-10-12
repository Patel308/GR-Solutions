// "OLED/QLED TV Repair" -> "OLED/QLED TV repair", "Plasma TV Repair" -> "plasma TV repair".
// Lower-cases a service title for use mid-sentence while keeping acronyms intact
// (a plain toLowerCase() printed "oled/qled tv repair").
export function lowerServiceTitle(title = '') {
  return title
    .split(' ')
    .map((word) => (/^[A-Z0-9/]{2,}$/.test(word) ? word : word.toLowerCase()))
    .join(' ');
}
