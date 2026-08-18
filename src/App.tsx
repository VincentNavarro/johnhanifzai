import { links } from './links'
import { CoffeeCup } from './components/CoffeeCup'
import { LinkItem, type LinkItemVariant } from './components/LinkItem'
import { SiteHeader } from './components/SiteHeader'
import { ThemeChooser } from './components/ThemeChooser'
import { useMagneticRepel } from './hooks/useMagneticRepel'
import { useRandomSound } from './hooks/useRandomSound'
import johnImage from './assets/john.webp'

const HOVER_VARIANTS: LinkItemVariant[] = ['pop', 'sparkle', 'wobble']

function App() {
  const imageRef = useMagneticRepel<HTMLImageElement>()
  const playRandomSound = useRandomSound()

  return (
    <>
      {/* hidden filter defs: a white "sticker trace" grown from the portrait's
          own alpha silhouette, so it stays legible on a busy/dark background
          instead of a box around it - plus a per-theme ink recolor (see
          .page__image in index.css for which themes use which) */}
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
          <filter id="recolor-navy" x="-20%" y="-20%" width="140%" height="140%">
            {/* recolors the portrait's near-black opaque ink (hair, beard,
                outline strokes) to navy, leaving everything else - skin
                tone, the gray glasses frame, eye whites, and the gray
                shading strokes inside the hair - untouched. luminance-to-
                alpha gives a mask where dark = low alpha; inverting and
                intersecting with the source's own alpha keeps the
                transparent background (also "dark") from being picked up
                as ink. Cutoff is tight (full selection gone by ~L0.008,
                ~2/255) so it only catches true #000000-ish ink - a looser
                first pass (slope -8/4, cutoff ~L0.5) was sweeping the gray
                shading strokes into navy too. */}
            <feColorMatrix in="SourceGraphic" type="luminanceToAlpha" result="luma" />
            <feComponentTransfer in="luma" result="darkMask">
              <feFuncA type="linear" slope={-125} intercept={1} />
            </feComponentTransfer>
            <feComposite in="darkMask" in2="SourceAlpha" operator="in" result="inkMask" />
            <feFlood floodColor="#084973" floodOpacity="1" result="navy" />
            <feComposite in="navy" in2="inkMask" operator="in" result="navyInk" />
            <feComposite in="SourceGraphic" in2="inkMask" operator="out" result="rest" />
            <feMerge>
              <feMergeNode in="rest" />
              <feMergeNode in="navyInk" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      <ThemeChooser />
      <CoffeeCup />
      <SiteHeader />
      <main className="page">
        <div className="page__portrait">
          <button
            type="button"
            className="page__portrait-button"
            aria-label="Play a random sound"
            onClick={playRandomSound}
          >
            <img
              ref={imageRef}
              className="page__image"
              src={johnImage}
              alt=""
              width={912}
              height={881}
            />
          </button>
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
