import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toGregorian } from '@avan-persian/core';
import { AvanCalendar } from './avan-calendar';

const NOWRUZ_1405 = toGregorian({ year: 1405, month: 1, day: 1 });

describe('<AvanCalendar /> single mode', () => {
  it('renders a 7x6 day grid with weekday headers', () => {
    render(<AvanCalendar visibleMonth={{ year: 1405, month: 1, day: 1 }} />);
    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getAllByRole('gridcell').length).toBeGreaterThanOrEqual(35);
  });

  it('calls onChange when a day is clicked', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<AvanCalendar visibleMonth={{ year: 1405, month: 1, day: 1 }} onChange={onChange} />);

    const day1 = screen.getByRole('gridcell', { name: /1405\/01\/01|۱۴۰۵\/۰۱\/۰۱/ });
    await user.click(day1);

    expect(onChange).toHaveBeenCalledTimes(1);
    const called = onChange.mock.calls[0]![0] as Date;
    expect(called.getTime()).toBe(NOWRUZ_1405.getTime());
  });

  it('marks the selected day with aria-selected', () => {
    render(<AvanCalendar visibleMonth={{ year: 1405, month: 1, day: 1 }} value={NOWRUZ_1405} />);
    const selected = screen
      .getAllByRole('gridcell')
      .find((el) => el.getAttribute('aria-selected') === 'true');
    expect(selected).toBeDefined();
  });

  it('disables days before minDate', () => {
    const minDate = toGregorian({ year: 1405, month: 1, day: 10 });
    render(<AvanCalendar visibleMonth={{ year: 1405, month: 1, day: 1 }} minDate={minDate} />);
    const day1 = screen.getByRole('gridcell', { name: /1405\/01\/01|۱۴۰۵\/۰۱\/۰۱/ });
    expect(day1).toBeDisabled();
  });

  it('disables specific weekdays via disabledWeekdays', () => {
    render(<AvanCalendar visibleMonth={{ year: 1405, month: 1, day: 1 }} disabledWeekdays={[5]} />);
    // 1405/01/07 is a Friday.
    const friday = screen.getByRole('gridcell', { name: /1405\/01\/07|۱۴۰۵\/۰۱\/۰۷/ });
    expect(friday).toBeDisabled();
  });

  it('respects getDayMeta disabled override', () => {
    render(
      <AvanCalendar
        visibleMonth={{ year: 1405, month: 1, day: 1 }}
        getDayMeta={(date) =>
          date.getTime() === NOWRUZ_1405.getTime() ? { disabled: true } : undefined
        }
      />,
    );
    const day1 = screen.getByRole('gridcell', { name: /1405\/01\/01|۱۴۰۵\/۰۱\/۰۱/ });
    expect(day1).toBeDisabled();
  });
});

describe('<AvanCalendar /> range mode', () => {
  it('selects a from/to range across two clicks', async () => {
    const onRangeChange = vi.fn();
    const user = userEvent.setup();
    render(
      <AvanCalendar
        mode="range"
        visibleMonth={{ year: 1405, month: 1, day: 1 }}
        onRangeChange={onRangeChange}
      />,
    );

    await user.click(screen.getByRole('gridcell', { name: /1405\/01\/05|۱۴۰۵\/۰۱\/۰۵/ }));
    await user.click(screen.getByRole('gridcell', { name: /1405\/01\/10|۱۴۰۵\/۰۱\/۱۰/ }));

    expect(onRangeChange).toHaveBeenCalledTimes(2);
    const finalCall = onRangeChange.mock.calls[1]![0];
    expect(finalCall.from.getDate()).toBeDefined();
    expect(finalCall.to).not.toBeNull();
  });
});

describe('<AvanCalendar /> multiple mode', () => {
  it('toggles days in and out of the selection', async () => {
    const onMultipleChange = vi.fn();
    const user = userEvent.setup();
    const { rerender } = render(
      <AvanCalendar
        mode="multiple"
        visibleMonth={{ year: 1405, month: 1, day: 1 }}
        multipleValue={[]}
        onMultipleChange={onMultipleChange}
      />,
    );

    await user.click(screen.getByRole('gridcell', { name: /1405\/01\/03|۱۴۰۵\/۰۱\/۰۳/ }));
    expect(onMultipleChange).toHaveBeenCalledTimes(1);
    const firstSelection: Date[] = onMultipleChange.mock.calls[0]![0];
    expect(firstSelection).toHaveLength(1);

    rerender(
      <AvanCalendar
        mode="multiple"
        visibleMonth={{ year: 1405, month: 1, day: 1 }}
        multipleValue={firstSelection}
        onMultipleChange={onMultipleChange}
      />,
    );

    await user.click(screen.getByRole('gridcell', { name: /1405\/01\/03|۱۴۰۵\/۰۱\/۰۳/ }));
    const secondSelection: Date[] = onMultipleChange.mock.calls[1]![0];
    expect(secondSelection).toHaveLength(0);
  });
});

describe('<AvanCalendar /> week mode', () => {
  it('selects the entire week containing the clicked day', async () => {
    const onWeekChange = vi.fn();
    const user = userEvent.setup();
    render(
      <AvanCalendar
        mode="week"
        visibleMonth={{ year: 1405, month: 1, day: 1 }}
        onWeekChange={onWeekChange}
      />,
    );

    await user.click(screen.getByRole('gridcell', { name: /1405\/01\/05|۱۴۰۵\/۰۱\/۰۵/ }));

    expect(onWeekChange).toHaveBeenCalledTimes(1);
    const week = onWeekChange.mock.calls[0]![0];
    expect(week.from).not.toBeNull();
    expect(week.to).not.toBeNull();
    const nights = (week.to.getTime() - week.from.getTime()) / 86_400_000;
    expect(nights).toBe(6);
  });
});

describe('<AvanCalendar /> month & year modes', () => {
  it('selects a month without rendering a day grid', async () => {
    const onMonthChange = vi.fn();
    const user = userEvent.setup();
    render(
      <AvanCalendar
        mode="month"
        visibleMonth={{ year: 1405, month: 1, day: 1 }}
        onMonthChange={onMonthChange}
      />,
    );

    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    await user.click(screen.getByRole('option', { name: 'تیر' }));
    expect(onMonthChange).toHaveBeenCalledWith({ year: 1405, month: 4, day: 1 });
  });

  it('selects a year without rendering a day grid', async () => {
    const onYearChange = vi.fn();
    const user = userEvent.setup();
    render(
      <AvanCalendar
        mode="year"
        visibleMonth={{ year: 1405, month: 1, day: 1 }}
        onYearChange={onYearChange}
      />,
    );

    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    const options = screen.getAllByRole('option');
    await user.click(options[0]!);
    expect(onYearChange).toHaveBeenCalled();
  });
});

describe('<AvanCalendar /> localization', () => {
  it('renders English month names and Western digits with en-IR', () => {
    render(
      <AvanCalendar locale="en-IR" dir="ltr" visibleMonth={{ year: 1405, month: 1, day: 1 }} />,
    );
    expect(screen.getByText('Farvardin')).toBeInTheDocument();
  });

  it('supports a fully custom locale override', () => {
    render(
      <AvanCalendar
        visibleMonth={{ year: 1405, month: 1, day: 1 }}
        locale={{ extends: 'en-IR', strings: { months: ['Custom1', ...Array(11).fill('X')] } }}
      />,
    );
    expect(screen.getByText('Custom1')).toBeInTheDocument();
  });
});
