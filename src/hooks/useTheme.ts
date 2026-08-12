import { useEffect, useState } from 'react'
import { DEFAULT_THEME, isThemeId, type ThemeId } from './theme'

const STORAGE_KEY = 'theme'

function readStoredTheme(): ThemeId {
  const stored = localStorage.getItem(STORAGE_KEY)
  return isThemeId(stored) ? stored : DEFAULT_THEME
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeId>(() => readStoredTheme())

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  return [theme, setTheme] as const
}
