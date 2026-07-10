'use client';

import { useEffect, useState, type KeyboardEvent } from 'react';
import { formatJalali, tryParseJalali } from '@avan-persian/core';
import { formatJalaliDisplay, shouldUsePersianDigits } from '../utils/format-display';
import type { AvanLocaleDefinition } from '../locale';

export interface UseDateTextInputOptions {
  value: Date | null;
  onChange: (date: Date | null) => void;
  format?: string;
  locale: AvanLocaleDefinition;
  isDateDisabled?: (date: Date) => boolean;
}

/**
 * Drives a text `<input>` that can parse/format a single Jalali date, tolerating Persian or
 * Western digits and either `/` or `-` separators (delegated to `@avan-persian/core#tryParseJalali`).
 */
export function useDateTextInput({
  value,
  onChange,
  format = 'yyyy/MM/dd',
  locale,
  isDateDisabled,
}: UseDateTextInputOptions) {
  const [text, setText] = useState(() => (value ? formatJalaliDisplay(value, locale, format) : ''));
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    setText(value ? formatJalaliDisplay(value, locale, format) : '');
    setInvalid(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value?.getTime(), format, locale.code]);

  function commit(raw: string) {
    const trimmed = raw.trim();

    if (!trimmed) {
      setInvalid(false);
      onChange(null);
      return;
    }

    const parsed = tryParseJalali(trimmed);

    if (!parsed || isDateDisabled?.(parsed.gregorian)) {
      setInvalid(true);
      return;
    }

    setInvalid(false);
    onChange(parsed.gregorian);
  }

  function handleChange(raw: string) {
    setText(raw);
    if (invalid) setInvalid(false);
  }

  function handleBlur() {
    commit(text);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      commit(text);
    }
  }

  return {
    text,
    invalid,
    handleChange,
    handleBlur,
    handleKeyDown,
    placeholderFormat: shouldUsePersianDigits(locale) ? formatJalali(new Date(), format) : format,
  };
}
