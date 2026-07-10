import { describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AvanMonthPicker } from './avan-month-picker';
import { AvanYearPicker } from './avan-year-picker';
import { AvanWeekPicker } from './avan-week-picker';
import { AvanMultiDatePicker } from './avan-multi-date-picker';
import { AvanDateTimePicker } from './avan-date-time-picker';
import { AvanProvider } from '../context/avan-context';

const VISIBLE_MONTH = { year: 1405, month: 1, day: 1 };

describe('AvanMonthPicker', () => {
  it('renders inline and selects a month', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <AvanProvider dir="ltr" locale="en-IR">
        <AvanMonthPicker visibleMonth={VISIBLE_MONTH} onChange={onChange} />
      </AvanProvider>,
    );

    await user.click(screen.getByRole('option', { name: 'Farvardin' }));
    expect(onChange).toHaveBeenCalledWith({ year: 1405, month: 1, day: 1 });
  });

  it('opens a popover with a trigger and dialog', async () => {
    const user = userEvent.setup();

    render(
      <AvanProvider dir="ltr" locale="en-IR">
        <AvanMonthPicker display="popover" visibleMonth={VISIBLE_MONTH} />
      </AvanProvider>,
    );

    const trigger = screen.getByRole('button', { name: 'Select a month' });
    await user.click(trigger);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});

describe('AvanYearPicker', () => {
  it('renders inline and selects a year', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <AvanProvider dir="ltr" locale="en-IR">
        <AvanYearPicker visibleMonth={VISIBLE_MONTH} onChange={onChange} />
      </AvanProvider>,
    );

    const year = screen.getAllByRole('option', { name: /^1405$/ })[0]!;
    await user.click(year);
    expect(onChange).toHaveBeenCalledWith(1405);
  });
});

describe('AvanWeekPicker', () => {
  it('selects a full week when a day is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <AvanProvider dir="ltr" locale="en-IR">
        <AvanWeekPicker visibleMonth={VISIBLE_MONTH} onChange={onChange} />
      </AvanProvider>,
    );

    const grid = screen.getByRole('grid');
    const day = within(grid).getAllByRole('gridcell')[10]!;
    await user.click(day);

    expect(onChange).toHaveBeenCalled();
    const arg = onChange.mock.calls[0]![0];
    expect(arg.from).toBeInstanceOf(Date);
    expect(arg.to).toBeInstanceOf(Date);
  });
});

describe('AvanMultiDatePicker', () => {
  it('accumulates multiple selected dates', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <AvanProvider dir="ltr" locale="en-IR">
        <AvanMultiDatePicker visibleMonth={VISIBLE_MONTH} onChange={onChange} />
      </AvanProvider>,
    );

    const grid = screen.getByRole('grid');
    const cells = within(grid).getAllByRole('gridcell');
    await user.click(cells[5]!);
    await user.click(cells[8]!);

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange.mock.calls[1]![0]).toHaveLength(2);
  });
});

describe('AvanDateTimePicker', () => {
  it('combines a selected date with a selected time', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <AvanProvider dir="ltr" locale="en-IR">
        <AvanDateTimePicker visibleMonth={VISIBLE_MONTH} onChange={onChange} />
      </AvanProvider>,
    );

    const grid = screen.getByRole('grid');
    const cells = within(grid).getAllByRole('gridcell');
    await user.click(cells[5]!);

    expect(onChange).toHaveBeenCalled();
    expect(onChange.mock.calls[0]![0]).toBeInstanceOf(Date);
  });

  it('renders a placeholder trigger in popover display', async () => {
    render(
      <AvanProvider dir="ltr" locale="en-IR">
        <AvanDateTimePicker display="popover" visibleMonth={VISIBLE_MONTH} />
      </AvanProvider>,
    );

    expect(screen.getByRole('button', { name: 'Select a date' })).toBeInTheDocument();
  });
});
