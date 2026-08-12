import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ThemeChooser } from './ThemeChooser'
import { THEMES } from '../hooks/theme'

describe('ThemeChooser', () => {
  beforeEach(() => {
    localStorage.clear()
    delete document.documentElement.dataset.theme
  })

  afterEach(() => {
    delete document.documentElement.dataset.theme
  })

  it('renders one labeled button per theme', () => {
    render(<ThemeChooser />)
    for (const theme of THEMES) {
      expect(screen.getByRole('button', { name: theme.label })).toBeInTheDocument()
    }
  })

  it('marks the default theme as pressed on first render', () => {
    render(<ThemeChooser />)
    expect(screen.getByRole('button', { name: 'Cocoa' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Leopard' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('applies the picked theme to the document and persists it', () => {
    render(<ThemeChooser />)
    fireEvent.click(screen.getByRole('button', { name: 'Leopard' }))

    expect(document.documentElement.dataset.theme).toBe('leopard')
    expect(screen.getByRole('button', { name: 'Leopard' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Cocoa' })).toHaveAttribute('aria-pressed', 'false')
    expect(localStorage.getItem('theme')).toBe('leopard')
  })

  it('reads a previously stored theme back on mount', () => {
    localStorage.setItem('theme', 'confetti')
    render(<ThemeChooser />)
    expect(screen.getByRole('button', { name: 'Confetti' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('falls back to the default theme when localStorage holds garbage', () => {
    localStorage.setItem('theme', 'not-a-real-theme')
    render(<ThemeChooser />)
    expect(screen.getByRole('button', { name: 'Cocoa' })).toHaveAttribute('aria-pressed', 'true')
  })
})
