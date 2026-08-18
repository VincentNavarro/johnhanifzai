import { describe, expect, it } from 'vitest'
import { pickRandomSound, SOUND_URLS } from './sounds'

describe('pickRandomSound', () => {
  // a fixed 3-item stub, independent of however many real sounds exist -
  // these tests pin index math, not the current size of SOUND_URLS
  const stub = ['a', 'b', 'c']

  it('picks the first url when random() returns 0', () => {
    expect(pickRandomSound(stub, () => 0)).toBe('a')
  })

  it('picks the last url when random() returns just under 1', () => {
    expect(pickRandomSound(stub, () => 0.9999)).toBe('c')
  })

  it('picks the middle url for a middling random value', () => {
    expect(pickRandomSound(stub, () => 0.5)).toBe('b')
  })

  it('only ever returns a url from the given list', () => {
    for (let i = 0; i < 50; i++) {
      expect(SOUND_URLS).toContain(pickRandomSound(SOUND_URLS, Math.random))
    }
  })
})
