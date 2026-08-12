import { useTypewriter } from '../hooks/useTypewriter'

const NAME = 'John Hanifzai'
const FONTS = ['Calera Display', 'Fantai', 'Trovical', 'Walona Handraw', 'Inkquest']

export function SiteHeader() {
  const { displayed, font, showCursor } = useTypewriter(NAME, FONTS)

  return (
    <header className="site-header">
      <h1 className="site-header__name" aria-label={NAME}>
        <span aria-hidden="true" style={{ fontFamily: font }}>
          {displayed}
          {showCursor && <span className="site-header__cursor" />}
        </span>
      </h1>
    </header>
  )
}
