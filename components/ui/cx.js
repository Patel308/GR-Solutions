/** Join class names, skipping falsy values. */
export default function cx(...values) {
  return values.filter(Boolean).join(' ');
}
