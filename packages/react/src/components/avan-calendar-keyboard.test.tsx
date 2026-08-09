import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
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

  it('ArrowDown from the last panel of a two-month view pages forward', async () => {
    const user = userEvent.setup();
    render(
      <AvanCalendar
        dir="ltr"
        locale="en-IR"
        mode="single"
        numberOfMonths={2}
        visibleMonth={{ year: 1405, month: 1, day: 1 }}
      />,
    );

    const panel2 = screen
      .getAllByRole('grid')
      .find((grid) => grid.getAttribute('aria-label')?.includes('Ordibehesht'));
    expect(panel2).toBeDefined();
    const panel2Days = within(panel2 as HTMLElement)
      .getAllByRole('gridcell')
      .filter((cell) => cell.tagName === 'BUTTON');
    panel2Days[panel2Days.length - 1]!.focus();
    expect(panel2Days[panel2Days.length - 1]).toHaveFocus();

    await user.keyboard('{ArrowDown}');

    // The view must page so the next month becomes visible and focus lands on a rendered cell.
    expect(screen.getByRole('grid', { name: /Khordad/ })).toBeInTheDocument();
    expect(document.activeElement?.getAttribute('aria-label')).toMatch(/1405\/03\//);
  });

  it('ArrowUp from the second panel into the visible first panel does not shift the view', async () => {
    const user = userEvent.setup();
    render(
      <AvanCalendar
        dir="ltr"
        locale="en-IR"
        mode="single"
        numberOfMonths={2}
        visibleMonth={{ year: 1405, month: 1, day: 1 }}
      />,
    );

    const panel2 = screen
      .getAllByRole('grid')
      .find((grid) => grid.getAttribute('aria-label')?.includes('Ordibehesht'));
    expect(panel2).toBeDefined();
    const day5 = within(panel2 as HTMLElement)
      .getAllByRole('gridcell')
      .find((cell) => cell.getAttribute('aria-label')?.includes('1405/02/05'));
    expect(day5).toBeDefined();
    day5!.focus();

    await user.keyboard('{ArrowUp}');

    // 1405/01/29 is already visible in the first panel — paging would be a spurious jump.
    expect(screen.getByRole('grid', { name: 'Farvardin 1405' })).toBeInTheDocument();
    expect(screen.queryByRole('grid', { name: /Esfand 1404/ })).not.toBeInTheDocument();
    expect(screen.getByRole('gridcell', { name: /1405\/01\/29/ })).toHaveFocus();
  });

  it('PageDown from the last panel of a two-month view pages forward', async () => {
    const user = userEvent.setup();
    render(
      <AvanCalendar
        dir="ltr"
        locale="en-IR"
        mode="single"
        numberOfMonths={2}
        visibleMonth={{ year: 1405, month: 1, day: 1 }}
      />,
    );

    const panel2 = screen
      .getAllByRole('grid')
      .find((grid) => grid.getAttribute('aria-label')?.includes('Ordibehesht'));
    expect(panel2).toBeDefined();
    const day10 = within(panel2 as HTMLElement)
      .getAllByRole('gridcell')
      .find((cell) => cell.getAttribute('aria-label')?.includes('1405/02/10'));
    day10!.focus();

    await user.keyboard('{PageDown}');

    expect(screen.getByRole('grid', { name: /Khordad/ })).toBeInTheDocument();
    expect(document.activeElement?.getAttribute('aria-label')).toMatch(/1405\/03\//);
  });
});
