type Point = { x: number; y: number };
type Size = { width: number; height: number };

export function constrainPostcard(point: Point, frame: Size, card: Size, rotation: number): Point {
  const radians = rotation * Math.PI / 180;
  const cosine = Math.abs(Math.cos(radians));
  const sine = Math.abs(Math.sin(radians));
  const insetX = Math.min(frame.width / 2, (card.width * cosine + card.height * sine) / 2 + 8);
  const insetY = Math.min(frame.height / 2, (card.width * sine + card.height * cosine) / 2 + 8);
  return {
    x: Math.max(insetX, Math.min(frame.width - insetX, point.x)),
    y: Math.max(insetY, Math.min(frame.height - insetY, point.y)),
  };
}
