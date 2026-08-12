import { useTheme } from '../hooks/useTheme'
import { THEMES } from '../hooks/theme'

export function ThemeChooser() {
  const [theme, setTheme] = useTheme()

  return (
    <div className="theme-chooser" role="group" aria-label="Page theme">
      {THEMES.map((t) => {
        const style =
          t.swatch.kind === 'color'
            ? ({ '--swatch': t.swatch.value } as React.CSSProperties)
            : ({ '--swatch-image': `url(${t.swatch.url})` } as React.CSSProperties)

        return (
          <button
            key={t.id}
            type="button"
            className="theme-chooser__swatch"
            data-swatch={t.swatch.kind}
            data-theme-option={t.id}
            aria-label={t.label}
            aria-pressed={theme === t.id}
            style={style}
            onClick={() => setTheme(t.id)}
          />
        )
      })}
    </div>
  )
}
