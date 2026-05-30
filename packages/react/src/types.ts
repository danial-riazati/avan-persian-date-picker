import type { ReactNode } from 'react';

export type AvanLocale = 'fa-IR' | 'en-IR';

export interface AvanTheme {
  fontFamily?: string;
  accent?: string;
  accentForeground?: string;
  muted?: string;
  radius?: string;
  daySize?: string;
}

export interface AvanCalendarProps {
  locale?: AvanLocale;
  dir?: 'rtl' | 'ltr';
  theme?: AvanTheme;
  className?: string;
  children?: ReactNode;
}

export interface DateRangeValue {
  from: Date | null;
  to: Date | null;
}

export interface AvanDateRangePickerProps extends AvanCalendarProps {
  value?: DateRangeValue;
  defaultValue?: DateRangeValue;
  onChange?: (value: DateRangeValue) => void;
}

export interface AvanDatePickerProps extends AvanCalendarProps {
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (value: Date | null) => void;
  placeholder?: string;
}
