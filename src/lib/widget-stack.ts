export function widgetSwipe(x: number, y: number): number {
  return Math.abs(y) >= 40 && Math.abs(y) > Math.abs(x) ? (y < 0 ? 1 : -1) : 0;
}
export function nextWidgetIndex(index: number, step: number, length: number): number {
  return ((index + step) % length + length) % length;
}
