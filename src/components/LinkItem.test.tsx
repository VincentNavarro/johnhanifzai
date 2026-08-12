import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LinkItem } from './LinkItem'

describe('LinkItem', () => {
  it('renders the label as link text', () => {
    render(<LinkItem link={{ label: 'Example', href: 'https://example.com' }} step={0} variant="pop" />)
    expect(screen.getByRole('link', { name: 'Example' })).toBeInTheDocument()
  })

  it('points at the given href', () => {
    render(<LinkItem link={{ label: 'Example', href: 'https://example.com' }} step={0} variant="pop" />)
    expect(screen.getByRole('link', { name: 'Example' })).toHaveAttribute(
      'href',
      'https://example.com',
    )
  })

  it('opens external links safely', () => {
    render(<LinkItem link={{ label: 'Example', href: 'https://example.com' }} step={0} variant="pop" />)
    const link = screen.getByRole('link', { name: 'Example' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('exposes its stagger index as the --i custom property', () => {
    render(<LinkItem link={{ label: 'Example', href: 'https://example.com' }} step={3} variant="pop" />)
    const link = screen.getByRole('link', { name: 'Example' })
    expect(link.style.getPropertyValue('--i')).toBe('3')
  })

  it.each(['pop', 'sparkle', 'wobble'] as const)('applies the %s variant class', (variant) => {
    render(<LinkItem link={{ label: 'Example', href: 'https://example.com' }} step={0} variant={variant} />)
    expect(screen.getByRole('link', { name: 'Example' })).toHaveClass(`link-item--${variant}`)
  })

  it('renders three decorative sparks only for the sparkle variant', () => {
    render(<LinkItem link={{ label: 'Example', href: 'https://example.com' }} step={0} variant="sparkle" />)
    const link = screen.getByRole('link', { name: 'Example' })
    expect(link.querySelectorAll('.link-item__spark')).toHaveLength(3)
  })

  it('does not render sparks for the pop or wobble variants', () => {
    render(<LinkItem link={{ label: 'Example', href: 'https://example.com' }} step={0} variant="pop" />)
    const link = screen.getByRole('link', { name: 'Example' })
    expect(link.querySelectorAll('.link-item__spark')).toHaveLength(0)
  })
})
