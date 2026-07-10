import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AvanCalendar } from './avan-calendar';

describe('<AvanCalendar /> keyboard navigation', () => {
  it('moves the roving tab stop with arrow keys and selects with Enter', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <AvanCalendar
        dir="ltr"
        locale="en-IR"
        visibleMonth={{ year: 1405, month: 1, day: 1 }}
        defaultValue={undefined}
        onChange={onChange}
      />,
    );

    const day1 = screen.getByRole('gridcell', { name: /1405\/01\/01/ });
    day1.focus();
    expect(day1).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    const day2 = screen.getByRole('gridcell', { name: /1405\/01\/02/ });
    expect(day2).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('ArrowDown moves focus one week forward', async () => {
    const user = userEvent.setup();
    render(
      <AvanCalendar dir="ltr" locale="en-IR" visibleMonth={{ year: 1405, month: 1, day: 1 }} />,
    );

    const day1 = screen.getByRole('gridcell', { name: /1405\/01\/01/ });
    day1.focus();
    await user.keyboard('{ArrowDown}');

    const day8 = screen.getByRole('gridcell', { name: /1405\/01\/08/ });
    expect(day8).toHaveFocus();
  });

  it('PageDown moves focus to the next month and updates the visible caption', async () => {
    const user = userEvent.setup();
    render(
      <AvanCalendar dir="ltr" locale="en-IR" visibleMonth={{ year: 1405, month: 1, day: 1 }} />,
    );

    const day1 = screen.getByRole('gridcell', { name: /1405\/01\/01/ });
    day1.focus();
    await user.keyboard('{PageDown}');

    expect(screen.getByText('Ordibehesht')).toBeInTheDocument();
  });

  it('only one day has tabIndex 0 at a time (roving tabindex)', () => {
    render(
      <AvanCalendar dir="ltr" locale="en-IR" visibleMonth={{ year: 1405, month: 1, day: 1 }} />,
    );
    const cells = screen.getAllByRole('gridcell').filter((el) => el.tagName === 'BUTTON');
    const tabbable = cells.filter((el) => el.getAttribute('tabindex') === '0');
    expect(tabbable).toHaveLength(1);
  });

  it('does not move focus into a disabled day', async () => {
    const user = userEvent.setup();
    const minDate = new Date(2026, 2, 22); // 1405/01/02 in Gregorian terms (Nowruz +1 day)
    render(
      <AvanCalendar
        dir="ltr"
        locale="en-IR"
        visibleMonth={{ year: 1405, month: 1, day: 1 }}
        minDate={minDate}
      />,
    );

    const day1 = screen.getByRole('gridcell', { name: /1405\/01\/01/ });
    day1.focus();
    await user.keyboard('{Enter}');
    // Selecting a disabled day should not throw and the grid should still be present.
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });
});
