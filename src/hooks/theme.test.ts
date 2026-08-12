import { describe, expect, it } from 'vitest'
import { DEFAULT_THEME, isThemeId, THEMES } from './theme'

describe('isThemeId', () => {
  it('accepts every id actually listed in THEMES', () => {
    for (const theme of THEMES) {
      expect(isThemeId(theme.id)).toBe(true)
    }
  })

  it('rejects unknown strings, non-strings, and empty values', () => {
    expect(isThemeId('sunset')).toBe(false)
    expect(isThemeId('')).toBe(false)
    expect(isThemeId(null)).toBe(false)
    expect(isThemeId(undefined)).toBe(false)
    expect(isThemeId(42)).toBe(false)
  })
})

describe('DEFAULT_THEME', () => {
  it('is one of the listed themes', () => {
    expect(THEMES.some((t) => t.id === DEFAULT_THEME)).toBe(true)
  })
})
