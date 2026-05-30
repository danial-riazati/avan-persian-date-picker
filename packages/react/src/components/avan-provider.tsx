'use client';

import type { ReactNode } from 'react';
import type { AvanTheme, AvanLocale } from '../types';

export interface AvanProviderProps {
  locale?: AvanLocale;
  dir?: 'rtl' | 'ltr';
  theme?: AvanTheme;
  children: ReactNode;
}

/** Phase 3: context for locale, dir, theme tokens */
export function AvanProvider({ children }: AvanProviderProps) {
  return <>{children}</>;
}
