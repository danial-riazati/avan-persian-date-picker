import { describe, it, expect } from 'vitest';
import { toPersianDigits, toWesternDigits } from '../src/digits';

describe('@avan/core digits', () => {
  it('converts Western digits to Persian', () => {
    expect(toPersianDigits('1405/01/01')).toBe('۱۴۰۵/۰۱/۰۱');
    expect(toPersianDigits(25)).toBe('۲۵');
  });

  it('converts Persian digits back to Western', () => {
    expect(toWesternDigits('۱۴۰۵/۰۱/۰۱')).toBe('1405/01/01');
  });
});
