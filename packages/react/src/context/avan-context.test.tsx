import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AvanProvider } from './avan-context';

describe('AvanProvider', () => {
  it('defaults to rtl + fa-IR', () => {
    render(
      <AvanProvider>
        <span>content</span>
      </AvanProvider>,
    );

    const root = screen.getByText('content').parentElement;
    expect(root).toHaveAttribute('dir', 'rtl');
    expect(root).toHaveAttribute('data-color-scheme', 'light');
  });

  it('applies an explicit dir override and dark color scheme', () => {
    render(
      <AvanProvider dir="ltr" locale="en-IR" colorScheme="dark">
        <span>content</span>
      </AvanProvider>,
    );

    const root = screen.getByText('content').parentElement;
    expect(root).toHaveAttribute('dir', 'ltr');
    expect(root).toHaveAttribute('data-theme', 'dark');
    expect(root).toHaveAttribute('data-color-scheme', 'dark');
  });

  it('applies theme tokens as CSS custom properties', () => {
    render(
      <AvanProvider theme={{ accent: '#ff0000', radius: '8px', extra: { '--avan-custom': '1' } }}>
        <span>content</span>
      </AvanProvider>,
    );

    const root = screen.getByText('content').parentElement as HTMLElement;
    expect(root.style.getPropertyValue('--avan-accent')).toBe('#ff0000');
    expect(root.style.getPropertyValue('--avan-day-radius')).toBe('8px');
    expect(root.style.getPropertyValue('--avan-custom')).toBe('1');
  });
});
