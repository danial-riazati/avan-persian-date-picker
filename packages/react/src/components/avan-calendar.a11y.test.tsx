import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import axe from 'axe-core';
import { AvanCalendar } from './avan-calendar';
import { AvanDatePicker } from './avan-date-picker';
import { AvanDateRangePicker } from './avan-date-range-picker';
import { AvanProvider } from '../context/avan-context';

async function expectNoA11yViolations(container: HTMLElement) {
  const results = await axe.run(container, {
    rules: {
      // jsdom has no layout engine; color-contrast checks are meaningless without real rendering.
      'color-contrast': { enabled: false },
    },
  });
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toHaveLength(0);
}

describe('accessibility', () => {
  it('single-mode calendar has no axe violations', async () => {
    const { container } = render(
      <AvanProvider dir="rtl" locale="fa-IR">
        <AvanCalendar visibleMonth={{ year: 1405, month: 1, day: 1 }} />
      </AvanProvider>,
    );
    await expectNoA11yViolations(container);
  });

  it('range-mode two-month calendar has no axe violations', async () => {
    const { container } = render(
      <AvanProvider dir="ltr" locale="en-IR">
        <AvanCalendar
          mode="range"
          numberOfMonths={2}
          visibleMonth={{ year: 1405, month: 1, day: 1 }}
        />
      </AvanProvider>,
    );
    await expectNoA11yViolations(container);
  });

  it('inline date picker has no axe violations', async () => {
    const { container } = render(
      <AvanProvider dir="ltr" locale="en-IR">
        <AvanDatePicker visibleMonth={{ year: 1405, month: 1, day: 1 }} />
      </AvanProvider>,
    );
    await expectNoA11yViolations(container);
  });

  it('inline range picker has no axe violations', async () => {
    const { container } = render(
      <AvanProvider dir="rtl" locale="fa-IR">
        <AvanDateRangePicker visibleMonth={{ year: 1405, month: 1, day: 1 }} />
      </AvanProvider>,
    );
    await expectNoA11yViolations(container);
  });
});
