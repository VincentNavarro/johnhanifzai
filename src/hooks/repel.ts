export type Point = { x: number; y: number }

/**
 * Offset that pushes a point away from the mouse, strongest at the center
 * of `radius` and fading to zero at its edge. Magnitude never exceeds maxOffset.
 */
export function computeRepelOffset(
  mouse: Point,
  center: Point,
  radius: number,
  maxOffset: number,
): Point {
  const dx = mouse.x - center.x
  const dy = mouse.y - center.y
  const distance = Math.hypot(dx, dy)

  if (distance === 0 || distance >= radius) {
    return { x: 0, y: 0 }
  }

  const strength = (1 - distance / radius) * maxOffset
  return {
    x: (-dx / distance) * strength,
    y: (-dy / distance) * strength,
  }
}

export function lerp(current: number, target: number, ease: number): number {
  return current + (target - current) * ease
}
