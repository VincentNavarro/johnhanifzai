import { useEffect, useRef, useState } from 'react'
import focusIntentStart from '../assets/focus-intent-start.webp'
import focusIntentSettings from '../assets/focus-intent-settings.webp'
import focusIntentNudge from '../assets/focus-intent-nudge.webp'

const SCREENSHOTS = [
  { src: focusIntentStart, alt: 'Focus Intent: starting a session with an intent and a duration' },
  { src: focusIntentSettings, alt: 'Focus Intent settings: sensitivity and allow/block site lists' },
  { src: focusIntentNudge, alt: 'Focus Intent nudging you back after opening an off-intent tab' },
]

type FocusIntentModalProps = {
  open: boolean
  href: string
  onClose: () => void
}

export function FocusIntentModal({ open, href, onClose }: FocusIntentModalProps) {
  const [index, setIndex] = useState(0)
  const closeRef = useRef<HTMLButtonElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const lastFocused = useRef<HTMLElement | null>(null)

  const step = (delta: number) => setIndex((i) => (i + delta + SCREENSHOTS.length) % SCREENSHOTS.length)

  // reset to the first screenshot, move focus into the dialog, and return
  // it to whatever opened the modal once it closes - both the reset and
  // the restore only make sense tied to open/close, not to re-renders
  // triggered by paging through screenshots
  useEffect(() => {
    if (!open) return
    lastFocused.current = document.activeElement as HTMLElement
    setIndex(0)
    closeRef.current?.focus()
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
      lastFocused.current?.focus()
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    function handleKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key === 'ArrowRight') {
        step(1)
        return
      }
      if (e.key === 'ArrowLeft') {
        step(-1)
        return
      }
      // simple focus trap: wrap Tab at the first/last focusable element
      // instead of letting it escape to the page underneath
      if (e.key === 'Tab' && cardRef.current) {
        const focusable = cardRef.current.querySelectorAll<HTMLElement>('button, a[href]')
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [open, onClose])

  if (!open) return null

  const current = SCREENSHOTS[index]

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-labelledby="focusIntentTitle">
      <button type="button" className="lightbox__backdrop" aria-label="Close" onClick={onClose} />
      <div className="lightbox__card" ref={cardRef}>
        <button type="button" className="lightbox__close" ref={closeRef} aria-label="Close" onClick={onClose}>
          ✕
        </button>
        <div className="lightbox__stage">
          <button
            type="button"
            className="lightbox__nav lightbox__nav--prev"
            aria-label="Previous screenshot"
            onClick={() => step(-1)}
          >
            ‹
          </button>
          <div className="lightbox__frame">
            <img src={current.src} alt={current.alt} />
          </div>
          <button
            type="button"
            className="lightbox__nav lightbox__nav--next"
            aria-label="Next screenshot"
            onClick={() => step(1)}
          >
            ›
          </button>
        </div>
        <div className="lightbox__dots">
          {SCREENSHOTS.map((_, i) => (
            <button
              key={i}
              type="button"
              className="lightbox__dot"
              aria-label={`Screenshot ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
            >
              <span className="lightbox__dot-visual" />
            </button>
          ))}
        </div>
        <div className="lightbox__body">
          <h2 className="lightbox__title" id="focusIntentTitle">
            Focus Intent
          </h2>
          <p className="lightbox__desc">
            Tell it what you're doing and for how long. Open a blocked site anyway and it catches you
            red-handed. Everything stays on your device, nothing gets shipped anywhere.
          </p>
          <a className="lightbox__link" href={href} target="_blank" rel="noopener noreferrer">
            Try Focus Intent ↗
          </a>
        </div>
      </div>
    </div>
  )
}
