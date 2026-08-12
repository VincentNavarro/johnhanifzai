import type { Link } from '../links'

type LinkItemProps = {
  link: Link
  step: number
}

export function LinkItem({ link, step }: LinkItemProps) {
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className="link-item"
      style={{ marginLeft: 'calc(var(--i) * var(--step))', '--i': step } as React.CSSProperties}
    >
      {link.label}
    </a>
  )
}
