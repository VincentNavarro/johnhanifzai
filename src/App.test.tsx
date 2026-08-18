import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from './App'
import { links } from './links'
import { SOUND_URLS } from './hooks/sounds'

describe('App', () => {
  it('renders one link per entry in links.ts, in order', () => {
    render(<App />)
    const rendered = screen.getAllByRole('link').map((el) => el.textContent)
    expect(rendered).toEqual(links.map((link) => link.label))
  })

  it('renders the center image with explicit dimensions', () => {
    // the image itself is decorative (alt="") - it sits inside a button that
    // carries the accessible name, see the test below - so it isn't queried
    // by role here, just present with the sizing that prevents layout shift
    const { container } = render(<App />)
    const image = container.querySelector('img.page__image')
    expect(image).toHaveAttribute('width')
    expect(image).toHaveAttribute('height')
  })

  it('exposes the portrait as a labeled, clickable button', () => {
    render(<App />)
    const button = screen.getByRole('button', { name: /play a random sound/i })
    expect(button).toContainElement(document.querySelector('img.page__image'))
  })

  it('plays one of the known sounds when the portrait is clicked', () => {
    // jsdom doesn't implement real media playback - play() throws
    // "not implemented" unless stubbed
    const playSpy = vi.spyOn(window.HTMLMediaElement.prototype, 'play').mockResolvedValue()
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /play a random sound/i }))

    expect(playSpy).toHaveBeenCalledOnce()
    const audio = playSpy.mock.contexts[0] as HTMLAudioElement
    expect(SOUND_URLS.some((url) => audio.src.endsWith(url))).toBe(true)

    playSpy.mockRestore()
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
