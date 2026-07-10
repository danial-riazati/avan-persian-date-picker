import type { CSSProperties, ReactNode } from 'react';
import { createContext, useContext, useMemo } from 'react';
import type { AvanHoliday } from '@avan/holidays';
import type { AvanLocale, AvanTheme, DateRangeValue } from '../types';

export interface AvanContextValue {
  locale: AvanLocale;
  dir: 'rtl' | 'ltr';
  theme?: AvanTheme;
}

const AvanContext = createContext<AvanContextValue>({
  locale: 'fa-IR',
  dir: 'rtl',
});

export function useAvanContext(): AvanContextValue {
  return useContext(AvanContext);
}

function themeToStyle(theme?: AvanTheme): CSSProperties | undefined {
  if (!theme) {
    return undefined;
  }

  return {
    ...(theme.fontFamily ? { ['--avan-font-family' as string]: theme.fontFamily } : {}),
    ...(theme.accent ? { ['--avan-accent' as string]: theme.accent } : {}),
    ...(theme.accentForeground
      ? { ['--avan-accent-foreground' as string]: theme.accentForeground }
      : {}),
    ...(theme.muted ? { ['--avan-muted' as string]: theme.muted } : {}),
    ...(theme.radius ? { ['--avan-day-radius' as string]: theme.radius } : {}),
    ...(theme.daySize ? { ['--avan-day-size' as string]: theme.daySize } : {}),
    ...theme.extra,
  };
}

export interface AvanProviderProps {
  locale?: AvanLocale;
  dir?: 'rtl' | 'ltr';
  theme?: AvanTheme;
  /** `light`, `dark`, or `system` (follows `prefers-color-scheme`). Default: `light`. */
  colorScheme?: 'light' | 'dark' | 'system';
  children: ReactNode;
}

export function AvanProvider({
  locale = 'fa-IR',
  dir,
  theme,
  colorScheme = 'light',
  children,
}: AvanProviderProps) {
  const resolvedDir =
    dir ?? (typeof locale === 'object' && 'dir' in locale ? locale.dir : undefined) ?? 'rtl';
  const value = useMemo(() => ({ locale, dir: resolvedDir, theme }), [locale, resolvedDir, theme]);

  return (
    <AvanContext.Provider value={value}>
      <div
        className="avan-root"
        dir={resolvedDir}
        data-theme={
          colorScheme === 'system' ? undefined : colorScheme === 'dark' ? 'dark' : undefined
        }
        data-color-scheme={colorScheme}
        style={themeToStyle(theme)}
      >
        {children}
      </div>
    </AvanContext.Provider>
  );
}

export type { AvanHoliday, DateRangeValue };
