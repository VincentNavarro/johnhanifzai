import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { FocusIntentModal } from './FocusIntentModal'

describe('FocusIntentModal', () => {
  it('renders nothing when closed', () => {
    render(<FocusIntentModal open={false} href="https://example.com" onClose={() => {}} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('moves focus to the close button on open', () => {
    const { container } = render(<FocusIntentModal open href="https://example.com" onClose={() => {}} />)
    // the backdrop is also a button labeled "Close" (clicking outside the
    // card closes it too) - .lightbox__close is the actual X in the corner
    expect(container.querySelector('.lightbox__close')).toHaveFocus()
  })

  it('calls onClose when the close button, backdrop, or Escape is used', () => {
    const closeButton = vi.fn()
    const { container, rerender } = render(
      <FocusIntentModal open href="https://example.com" onClose={closeButton} />,
    )
    fireEvent.click(container.querySelector('.lightbox__close')!)
    expect(closeButton).toHaveBeenCalledTimes(1)

    const backdrop = vi.fn()
    rerender(<FocusIntentModal open href="https://example.com" onClose={backdrop} />)
    fireEvent.click(container.querySelector('.lightbox__backdrop')!)
    expect(backdrop).toHaveBeenCalledTimes(1)

    const escape = vi.fn()
    rerender(<FocusIntentModal open href="https://example.com" onClose={escape} />)
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(escape).toHaveBeenCalledTimes(1)
  })

  it('pages through screenshots with the arrow buttons and arrow keys', () => {
    render(<FocusIntentModal open href="https://example.com" onClose={() => {}} />)
    const image = () => screen.getByRole('img')

    const first = image().getAttribute('src')
    fireEvent.click(screen.getByRole('button', { name: 'Next screenshot' }))
    const second = image().getAttribute('src')
    expect(second).not.toBe(first)

    fireEvent.keyDown(document, { key: 'ArrowRight' })
    const third = image().getAttribute('src')
    expect(third).not.toBe(second)

    // wraps back to the first screenshot after the last
    fireEvent.keyDown(document, { key: 'ArrowRight' })
    expect(image().getAttribute('src')).toBe(first)
  })

  it('links "Try Focus Intent" to the given href', () => {
    render(<FocusIntentModal open href="https://real-destination.example" onClose={() => {}} />)
    const link = screen.getByRole('link', { name: /try focus intent/i })
    expect(link).toHaveAttribute('href', 'https://real-destination.example')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
