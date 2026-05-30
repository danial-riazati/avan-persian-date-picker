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

export interface AvanProviderProps {
  locale?: AvanLocale;
  dir?: 'rtl' | 'ltr';
  theme?: AvanTheme;
  children: ReactNode;
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
  };
}

export function AvanProvider({
  locale = 'fa-IR',
  dir = 'rtl',
  theme,
  children,
}: AvanProviderProps) {
  const value = useMemo(() => ({ locale, dir, theme }), [locale, dir, theme]);

  return (
    <AvanContext.Provider value={value}>
      <div className="avan-root" dir={dir} style={themeToStyle(theme)}>
        {children}
      </div>
    </AvanContext.Provider>
  );
}

export type { AvanHoliday, DateRangeValue };
