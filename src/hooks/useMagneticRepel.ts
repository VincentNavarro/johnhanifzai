import { useEffect, useRef } from 'react'
import { computeRepelOffset, lerp } from './repel'

const RADIUS = 180
const MAX_OFFSET = 10
const EASE = 0.15

export function useMagneticRepel<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const target = { x: 0, y: 0 }
    const current = { x: 0, y: 0 }
    // The element's resting (untransformed) center. Cached instead of
    // re-measured on every mousemove: measuring while a transform is
    // already applied would read the shifted position and feed back into
    // itself, and it also avoids forcing a layout read on a hot path.
    let center = { x: 0, y: 0 }
    let frame: number

    function measureCenter() {
      const rect = el!.getBoundingClientRect()
      center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    }

    function handleMouseMove(event: MouseEvent) {
      const mouse = { x: event.clientX, y: event.clientY }
      const offset = computeRepelOffset(mouse, center, RADIUS, MAX_OFFSET)
      target.x = offset.x
      target.y = offset.y
    }

    function handleMouseLeave() {
      target.x = 0
      target.y = 0
    }

    function tick() {
      current.x = lerp(current.x, target.x, EASE)
      current.y = lerp(current.y, target.y, EASE)
      el!.style.transform = `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0)`
      frame = requestAnimationFrame(tick)
    }

    measureCenter()
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('resize', measureCenter)
    frame = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('resize', measureCenter)
      cancelAnimationFrame(frame)
    }
  }, [])

  return ref
}
