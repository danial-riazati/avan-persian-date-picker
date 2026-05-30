export interface AvanHoliday {
  /** Jalali ISO date YYYY-MM-DD */
  date: string;
  title: string;
  titleEn?: string;
  type: 'public' | 'religious' | 'cultural';
  tentative?: boolean;
}

/**
 * Load Iran public holidays for a Jalali year.
 * Phase 2: dynamic import from data/{year}.json
 */
export function getIranHolidays(_jalaliYear: number): AvanHoliday[] {
  throw new Error('@avan/holidays: not implemented yet — see docs/PHASES.md Phase 2');
}

export function isHoliday(_date: Date, _holidays: AvanHoliday[]): boolean {
  throw new Error('@avan/holidays: not implemented yet — see docs/PHASES.md Phase 2');
}
