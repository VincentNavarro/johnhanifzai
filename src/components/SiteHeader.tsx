import { useTypewriter } from '../hooks/useTypewriter'

const NAME = 'John Hanifzai'
const FONTS = ['Calera Display', 'Fantai', 'Trovical', 'Walona Handraw', 'Inkquest']

// Calera Display renders far wider than the other 4 fonts at the same
// size - on mobile it comes in at ~99% of a 375px viewport, edge to edge
// with no breathing room. The others sit at 72% or less, so only this one
// needs the mobile-only size trim (see .site-header__text--wide).
const WIDE_FONT = 'Calera Display'

export function SiteHeader() {
  const { displayed, font, showCursor } = useTypewriter(NAME, FONTS)
  const textClassName =
    font === WIDE_FONT ? 'site-header__text site-header__text--wide' : 'site-header__text'

  return (
    <header className="site-header">
      <h1 className="site-header__name" aria-label={NAME}>
        <span className={textClassName} aria-hidden="true" style={{ fontFamily: font }}>
          {displayed}
          {showCursor && <span className="site-header__cursor" />}
        </span>
      </h1>
    </header>
  )
}
