import { useEffect, useRef } from 'react'
import qrCode from '../assets/qr-code.svg'
import johnOriginal from '../assets/john-original.svg'

const SITE_URL = 'https://johnhanifzai.11integral.com'

type QrCodeModalProps = {
  open: boolean
  onClose: () => void
}

export function QrCodeModal({ open, onClose }: QrCodeModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const lastFocused = useRef<HTMLElement | null>(null)

  // move focus into the dialog and return it to whatever opened it once it
  // closes, same pattern as FocusIntentModal
  useEffect(() => {
    if (!open) return
    lastFocused.current = document.activeElement as HTMLElement
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

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-labelledby="qrModalTitle">
      <button type="button" className="lightbox__backdrop" aria-label="Close" onClick={onClose} />
      <div className="qr-modal__card" ref={cardRef}>
        <button type="button" className="lightbox__close" ref={closeRef} aria-label="Close" onClick={onClose}>
          ✕
        </button>
        <h2 className="qr-modal__title" id="qrModalTitle">
          Scan to visit the site
        </h2>
        <div className="qr-modal__code">
          <img className="qr-modal__qr" src={qrCode} alt="" />
          <div className="qr-modal__badge">
            <img className="qr-modal__portrait" src={johnOriginal} alt="" />
          </div>
        </div>
        <a className="qr-modal__url" href={SITE_URL} target="_blank" rel="noopener noreferrer">
          {SITE_URL}
        </a>
      </div>
    </div>
  )
}
