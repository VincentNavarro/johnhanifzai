import { describe, expect, it } from 'vitest'
import { links } from './links'

describe('links', () => {
  it('has 3-5 entries, per the staircase spec', () => {
    expect(links.length).toBeGreaterThanOrEqual(3)
    expect(links.length).toBeLessThanOrEqual(5)
  })

  it('has unique hrefs (used as the React list key)', () => {
    const hrefs = links.map((link) => link.href)
    expect(new Set(hrefs).size).toBe(hrefs.length)
  })
})
