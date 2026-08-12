import { links } from './links'
import { LinkItem } from './components/LinkItem'
import { SiteHeader } from './components/SiteHeader'
import { useMagneticRepel } from './hooks/useMagneticRepel'
import johnImage from './assets/john.webp'

function App() {
  const imageRef = useMagneticRepel<HTMLImageElement>()

  return (
    <>
      <SiteHeader />
      <main className="page">
        <img
          ref={imageRef}
          className="page__image"
          src={johnImage}
          // TODO: real alt text
          alt="John"
          width={912}
          height={881}
        />
        <div className="page__links">
          {links.map((link, i) => (
            <LinkItem key={link.href} link={link} step={links.length - 1 - i} />
          ))}
        </div>
      </main>
    </>
  )
}

export default App
