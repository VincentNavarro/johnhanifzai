import { links } from './links'
import { LinkItem, type LinkItemVariant } from './components/LinkItem'
import { SiteHeader } from './components/SiteHeader'
import { ThemeChooser } from './components/ThemeChooser'
import { useMagneticRepel } from './hooks/useMagneticRepel'
import johnImage from './assets/john.webp'

const HOVER_VARIANTS: LinkItemVariant[] = ['pop', 'sparkle', 'wobble']

function App() {
  const imageRef = useMagneticRepel<HTMLImageElement>()

  return (
    <>
      {/* hidden filter def: a white "sticker trace" grown from the portrait's
          own alpha silhouette, so it stays legible on a busy/dark background
          instead of a box around it */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <filter id="sticker-trim-white" x="-40%" y="-40%" width="180%" height="180%">
            {/* morphological "closing" (dilate then erode by the same amount)
                fills gaps inside the silhouette - between hair strands, in the
                beard - without growing the outer edge, since the erode undoes
                that growth everywhere except where dilate already sealed a hole */}
            <feMorphology in="SourceAlpha" operator="dilate" radius="24" result="closeDilate" />
            <feMorphology in="closeDilate" operator="erode" radius="24" result="closed" />
            <feMorphology in="closed" operator="dilate" radius="6" result="dilated" />
            <feGaussianBlur in="dilated" stdDeviation="1.4" result="smoothed" />
            <feComponentTransfer in="smoothed" result="crisped">
              <feFuncA type="linear" slope={7} intercept={-1.4} />
            </feComponentTransfer>
            <feFlood floodColor="#f3ead9" floodOpacity="1" result="flood" />
            <feComposite in="flood" in2="crisped" operator="in" result="trim" />
            <feMerge>
              <feMergeNode in="trim" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      <ThemeChooser />
      <SiteHeader />
      <main className="page">
        <div className="page__portrait">
          <img
            ref={imageRef}
            className="page__image"
            src={johnImage}
            // TODO: real alt text
            alt="John"
            width={912}
            height={881}
          />
        </div>
        <div className="page__links">
          {links.map((link, i) => (
            <LinkItem
              key={link.href}
              link={link}
              step={links.length - 1 - i}
              variant={HOVER_VARIANTS[i % HOVER_VARIANTS.length]}
            />
          ))}
        </div>
      </main>
    </>
  )
}

export default App
