import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AvanTimePicker } from './avan-time-picker';

describe('<AvanTimePicker />', () => {
  it('renders hour/minute selects in 24h mode by default', () => {
    render(<AvanTimePicker dir="ltr" locale="en-IR" value={{ hour: 13, minute: 30 }} />);
    expect(screen.getByLabelText('Hour')).toHaveValue('13');
    expect(screen.getByLabelText('Minute')).toHaveValue('30');
    expect(screen.queryByText('AM')).not.toBeInTheDocument();
  });

  it('shows AM/PM controls in 12h mode and converts correctly', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <AvanTimePicker
        dir="ltr"
        locale="en-IR"
        hourCycle={12}
        value={{ hour: 14, minute: 0 }}
        onChange={onChange}
      />,
    );

    expect(screen.getByLabelText('Hour')).toHaveValue('2');
    await user.click(screen.getByRole('button', { name: 'AM' }));
    expect(onChange).toHaveBeenCalledWith({ hour: 2, minute: 0 });
  });

  it('renders a seconds column when showSeconds is true', () => {
    render(
      <AvanTimePicker
        dir="ltr"
        locale="en-IR"
        showSeconds
        value={{ hour: 1, minute: 2, second: 3 }}
      />,
    );
    expect(screen.getByLabelText('Second')).toHaveValue('3');
  });

  it('clamps changes to minTime/maxTime', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <AvanTimePicker
        dir="ltr"
        locale="en-IR"
        value={{ hour: 10, minute: 0 }}
        minTime={{ hour: 9, minute: 0 }}
        maxTime={{ hour: 17, minute: 0 }}
        onChange={onChange}
      />,
    );

    await user.selectOptions(screen.getByLabelText('Hour'), '20');
    expect(onChange).toHaveBeenCalledWith({ hour: 17, minute: 0 });
  });
});
