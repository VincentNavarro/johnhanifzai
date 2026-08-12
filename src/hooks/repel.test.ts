import { describe, expect, it } from 'vitest'
import { computeRepelOffset, lerp } from './repel'

describe('computeRepelOffset', () => {
  const center = { x: 100, y: 100 }
  const radius = 200
  const maxOffset = 10

  it('is zero when the mouse sits exactly on the center (avoids divide-by-zero)', () => {
    expect(computeRepelOffset(center, center, radius, maxOffset)).toEqual({ x: 0, y: 0 })
  })

  it('is zero once the mouse is outside the radius', () => {
    const farMouse = { x: center.x + radius, y: center.y }
    expect(computeRepelOffset(farMouse, center, radius, maxOffset)).toEqual({ x: 0, y: 0 })
  })

  it('pushes directly away from the mouse', () => {
    const mouse = { x: center.x + 50, y: center.y }
    const offset = computeRepelOffset(mouse, center, radius, maxOffset)
    expect(offset.x).toBeLessThan(0)
    expect(offset.y).toBeCloseTo(0)
  })

  it('never exceeds maxOffset in magnitude', () => {
    const veryCloseMouse = { x: center.x + 0.001, y: center.y }
    const offset = computeRepelOffset(veryCloseMouse, center, radius, maxOffset)
    const magnitude = Math.hypot(offset.x, offset.y)
    expect(magnitude).toBeLessThanOrEqual(maxOffset)
  })

  it('fades linearly with distance from center', () => {
    const halfway = { x: center.x + radius / 2, y: center.y }
    const offset = computeRepelOffset(halfway, center, radius, maxOffset)
    expect(Math.hypot(offset.x, offset.y)).toBeCloseTo(maxOffset / 2, 5)
  })
})

describe('lerp', () => {
  it('returns current unchanged when ease is 0', () => {
    expect(lerp(0, 10, 0)).toBe(0)
  })

  it('jumps straight to target when ease is 1', () => {
    expect(lerp(0, 10, 1)).toBe(10)
  })

  it('moves partway toward target for a fractional ease', () => {
    expect(lerp(0, 10, 0.5)).toBe(5)
  })
})
