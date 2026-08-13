export type ThemeId = 'cocoa' | 'hieroglyphs' | 'leopard' | 'cats'

export type ThemeSwatch = { kind: 'color'; value: string } | { kind: 'pattern'; url: string }

export type ThemeMeta = {
  id: ThemeId
  label: string
  swatch: ThemeSwatch
}

export const THEMES: ThemeMeta[] = [
  { id: 'cocoa', label: 'Cocoa', swatch: { kind: 'color', value: '#6d5336' } },
  { id: 'hieroglyphs', label: 'Hieroglyphs', swatch: { kind: 'pattern', url: '/hieroglyphs-tile.webp' } },
  { id: 'leopard', label: 'Leopard', swatch: { kind: 'pattern', url: '/leopard-tile.webp' } },
  { id: 'cats', label: 'Cats', swatch: { kind: 'pattern', url: '/cat-tile.webp' } },
]

export const DEFAULT_THEME: ThemeId = 'cocoa'

const THEME_IDS = new Set<string>(THEMES.map((t) => t.id))

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === 'string' && THEME_IDS.has(value)
}
