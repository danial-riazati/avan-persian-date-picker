const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'] as const;

/** Convert Western digits (0-9) to Persian digits (۰-۹). */
export function toPersianDigits(input: string | number): string {
  return String(input).replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)]!);
}

/** Convert Persian digits back to Western digits. */
export function toWesternDigits(input: string): string {
  return input.replace(/[۰-۹]/g, (digit) =>
    String(PERSIAN_DIGITS.indexOf(digit as (typeof PERSIAN_DIGITS)[number])),
  );
}
