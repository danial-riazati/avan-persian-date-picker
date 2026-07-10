import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AvanDatePicker } from './avan-date-picker';

describe('<AvanDatePicker />', () => {
  it('renders inline by default with a static preview and visible calendar', () => {
    render(<AvanDatePicker dir="ltr" locale="en-IR" />);
    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  it('opens a dialog popover on trigger click and closes on Escape', async () => {
    const user = userEvent.setup();
    render(<AvanDatePicker dir="ltr" locale="en-IR" display="popover" />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /select a date/i }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('closes the popover after selecting a date when closeOnSelect is true', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <AvanDatePicker
        dir="ltr"
        locale="en-IR"
        display="popover"
        visibleMonth={{ year: 1405, month: 1, day: 1 }}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: /select a date/i }));
    await user.click(screen.getByRole('gridcell', { name: /1405\/01\/05/ }));

    expect(onChange).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  });

  it('traps focus within the popover while open', async () => {
    const user = userEvent.setup();
    render(
      <AvanDatePicker
        dir="ltr"
        locale="en-IR"
        display="popover"
        visibleMonth={{ year: 1405, month: 1, day: 1 }}
      />,
    );

    await user.click(screen.getByRole('button', { name: /select a date/i }));
    const dialog = screen.getByRole('dialog');
    expect(dialog.contains(document.activeElement)).toBe(true);
  });

  it('supports typed text input when allowTextInput is enabled', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(
      <AvanDatePicker
        dir="ltr"
        locale="en-IR"
        display="popover"
        allowTextInput
        onChange={onChange}
      />,
    );

    const input = screen.getByPlaceholderText(/yyyy\/MM\/dd/);
    await user.type(input, '1405/02/10');
    await user.keyboard('{Enter}');

    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
