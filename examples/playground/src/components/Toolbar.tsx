import type { PlaygroundLocale } from '../strings';
import { T } from '../strings';

export type ColorScheme = 'light' | 'dark' | 'system';

interface ToolbarProps {
  locale: PlaygroundLocale;
  onLocaleChange: (locale: PlaygroundLocale) => void;
  dir: 'rtl' | 'ltr';
  onDirChange: (dir: 'rtl' | 'ltr') => void;
  colorScheme: ColorScheme;
  onColorSchemeChange: (scheme: ColorScheme) => void;
}

export function Toolbar({
  locale,
  onLocaleChange,
  dir,
  onDirChange,
  colorScheme,
  onColorSchemeChange,
}: ToolbarProps) {
  const t = T[locale];

  return (
    <div className="toolbar" role="toolbar" aria-label="Playground settings">
      <div className="toolbar__group">
        <span className="toolbar__label">{t.localeLabel}</span>
        <div className="toolbar__segment">
          {(['fa-IR', 'en-IR'] as const).map((value) => (
            <button
              key={value}
              type="button"
              className={`toolbar__option ${locale === value ? 'toolbar__option--active' : ''}`}
              aria-pressed={locale === value}
              onClick={() => onLocaleChange(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div className="toolbar__group">
        <span className="toolbar__label">{t.dirLabel}</span>
        <div className="toolbar__segment">
          <button
            type="button"
            className={`toolbar__option ${dir === 'rtl' ? 'toolbar__option--active' : ''}`}
            aria-pressed={dir === 'rtl'}
            onClick={() => onDirChange('rtl')}
          >
            {t.dirRtl}
          </button>
          <button
            type="button"
            className={`toolbar__option ${dir === 'ltr' ? 'toolbar__option--active' : ''}`}
            aria-pressed={dir === 'ltr'}
            onClick={() => onDirChange('ltr')}
          >
            {t.dirLtr}
          </button>
        </div>
      </div>

      <div className="toolbar__group">
        <span className="toolbar__label">{t.themeLabel}</span>
        <div className="toolbar__segment">
          {(
            [
              ['light', t.themeLight],
              ['dark', t.themeDark],
              ['system', t.themeSystem],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={`toolbar__option ${colorScheme === value ? 'toolbar__option--active' : ''}`}
              aria-pressed={colorScheme === value}
              onClick={() => onColorSchemeChange(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
