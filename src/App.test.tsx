import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'
import { links } from './links'

describe('App', () => {
  it('renders one link per entry in links.ts, in order', () => {
    render(<App />)
    const rendered = screen.getAllByRole('link').map((el) => el.textContent)
    expect(rendered).toEqual(links.map((link) => link.label))
  })

  it('renders the center image with alt text and explicit dimensions', () => {
    render(<App />)
    const image = screen.getByRole('img')
    expect(image).toHaveAccessibleName()
    expect(image).toHaveAttribute('width')
    expect(image).toHaveAttribute('height')
  })

  it('staggers links so the bottom (last) link has no offset and each one above steps out further', () => {
    render(<App />)
    const rendered = screen.getAllByRole('link')
    const steps = rendered.map((el) => Number(el.style.getPropertyValue('--i')))
    // last link in visual order (closest to the image) is the last data entry, offset 0
    expect(steps[steps.length - 1]).toBe(0)
    // each link above it steps out by one increment
    for (let i = 0; i < steps.length - 1; i++) {
      expect(steps[i]).toBe(steps[i + 1] + 1)
    }
  })
})
