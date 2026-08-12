import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LinkItem } from './LinkItem'

describe('LinkItem', () => {
  it('renders the label as link text', () => {
    render(<LinkItem link={{ label: 'Example', href: 'https://example.com' }} step={0} />)
    expect(screen.getByRole('link', { name: 'Example' })).toBeInTheDocument()
  })

  it('points at the given href', () => {
    render(<LinkItem link={{ label: 'Example', href: 'https://example.com' }} step={0} />)
    expect(screen.getByRole('link', { name: 'Example' })).toHaveAttribute(
      'href',
      'https://example.com',
    )
  })

  it('opens external links safely', () => {
    render(<LinkItem link={{ label: 'Example', href: 'https://example.com' }} step={0} />)
    const link = screen.getByRole('link', { name: 'Example' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('exposes its stagger index as the --i custom property', () => {
    render(<LinkItem link={{ label: 'Example', href: 'https://example.com' }} step={3} />)
    const link = screen.getByRole('link', { name: 'Example' })
    expect(link.style.getPropertyValue('--i')).toBe('3')
  })
})
