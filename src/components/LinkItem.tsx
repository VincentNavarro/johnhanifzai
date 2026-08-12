import type { Link } from '../links'

export type LinkItemVariant = 'pop' | 'sparkle' | 'wobble'

type LinkItemProps = {
  link: Link
  step: number
  variant: LinkItemVariant
}

const SPARK_PATHS = [
  'M0,-7 C1,-2 2,-1 7,0 C2,1 1,2 0,7 C-1,2 -2,1 -7,0 C-2,-1 -1,-2 0,-7 Z',
  'M0,-5 C0.7,-1.4 1.4,-0.7 5,0 C1.4,0.7 0.7,1.4 0,5 C-0.7,1.4 -1.4,0.7 -5,0 C-1.4,-0.7 -0.7,-1.4 0,-5 Z',
  'M0,-6 C0.9,-1.7 1.7,-0.9 6,0 C1.7,0.9 0.9,1.7 0,6 C-0.9,1.7 -1.7,0.9 -6,0 C-1.7,-0.9 -0.9,-1.7 0,-6 Z',
]

export function LinkItem({ link, step, variant }: LinkItemProps) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`link-item link-item--${variant}`}
      style={{ marginLeft: 'calc(var(--i) * var(--step))', '--i': step } as React.CSSProperties}
    >
      <svg className="link-item__tail" viewBox="0 0 20 18" aria-hidden="true">
        <polygon className="link-item__tail-main" points="20,4 20,12 2,16" />
      </svg>
      <span className="link-item__body">
        {link.label}
        {variant === 'sparkle' && (
          <span className="link-item__sparks" aria-hidden="true">
            {SPARK_PATHS.map((d, i) => (
              <svg key={i} className={`link-item__spark link-item__spark--${i + 1}`} viewBox="-8 -8 16 16">
                <path d={d} />
              </svg>
            ))}
          </span>
        )}
      </span>
    </a>
  )
}
