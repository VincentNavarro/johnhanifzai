import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SiteHeader } from './SiteHeader'

describe('SiteHeader', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('exposes "John Hanifzai" as the accessible heading name', () => {
    render(<SiteHeader />)
    expect(screen.getByRole('heading', { name: 'John Hanifzai' })).toBeInTheDocument()
  })

  it('types the name out one character at a time', async () => {
    render(<SiteHeader />)
    const heading = screen.getByRole('heading', { name: 'John Hanifzai' })

    expect(heading.textContent).toBe('')

    await act(() => vi.advanceTimersByTimeAsync(110))
    expect(heading.textContent).toBe('J')

    await act(() => vi.advanceTimersByTimeAsync(110))
    expect(heading.textContent).toBe('Jo')
  })

  it('renders a blinking cursor while animating', () => {
    render(<SiteHeader />)
    expect(document.querySelector('.site-header__cursor')).toBeInTheDocument()
  })

  it('deletes back to empty after typing fully and pausing', async () => {
    render(<SiteHeader />)
    const heading = screen.getByRole('heading', { name: 'John Hanifzai' })

    // type out all 13 characters of "John Hanifzai", one hop per act() call
    // (each chained setTimeout -> setState -> effect handoff needs its own
    // flush, so a single large advance can't be trusted to walk the chain)
    for (let i = 0; i < 13; i++) {
      await act(() => vi.advanceTimersByTimeAsync(110))
    }
    expect(heading.textContent).toBe('John Hanifzai')

    // one more hop: typing -> pausing (text unchanged, just arms the 5s timer)
    await act(() => vi.advanceTimersByTimeAsync(110))
    expect(heading.textContent).toBe('John Hanifzai')

    // hold through the 5s pause: a single hop (pausing's own timer firing)
    await act(() => vi.advanceTimersByTimeAsync(5000))
    expect(heading.textContent).toBe('John Hanifzai')

    // delete back to empty, one character per hop. The pure reducer in
    // typewriter.test.ts already pins the exact transition count; this just
    // proves the component wiring carries it through to the DOM.
    for (let i = 0; i < 20 && heading.textContent !== ''; i++) {
      await act(() => vi.advanceTimersByTimeAsync(60))
    }
    expect(heading.textContent).toBe('')
  })

  it('shows the full name immediately with no cursor under reduced motion', () => {
    const originalMatchMedia = window.matchMedia
    window.matchMedia = (query: string) =>
      ({
        matches: true,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList

    render(<SiteHeader />)
    const heading = screen.getByRole('heading', { name: 'John Hanifzai' })
    expect(heading.textContent).toBe('John Hanifzai')
    expect(document.querySelector('.site-header__cursor')).not.toBeInTheDocument()

    window.matchMedia = originalMatchMedia
  })
})
