'use client';

import { useRef } from 'react';
import { AvanCalendar } from './avan-calendar';
import { useAvanContext } from '../context/avan-context';
import { useControllableOpen } from '../hooks/use-controllable-open';
import { useDismissibleLayer } from '../hooks/use-dismissible-layer';
import { useFocusTrap } from '../hooks/use-focus-trap';
import { resolveLocale } from '../locale';
import type { AvanMonthPickerProps } from '../types';
import { formatNumberDisplay } from '../utils/format-display';

export function AvanMonthPicker({
  value,
  defaultValue,
  onChange,
  placeholder,
  className,
  dir: dirProp,
  locale: localeProp,
  display = 'inline',
  open: openProp,
  defaultOpen,
  onOpenChange,
  closeOnSelect = true,
  ...props
}: AvanMonthPickerProps) {
  const context = useAvanContext();
  const locale = resolveLocale(localeProp ?? context.locale);
  const dir = dirProp ?? context.dir ?? locale.dir;
  const monthValue = value ?? defaultValue ?? null;
  const rootRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const { open, setOpen, toggleOpen } = useControllableOpen({
    open: openProp,
    defaultOpen,
    onOpenChange,
  });
  const isPopover = display === 'popover';

  useDismissibleLayer(isPopover && open, setOpen, rootRef);
  useFocusTrap(isPopover && open, popoverRef);

  const resolvedPlaceholder = placeholder ?? locale.strings.placeholderMonth;
  const triggerLabel = monthValue
    ? `${locale.strings.months[monthValue.month - 1]} ${formatNumberDisplay(monthValue.year, locale)}`
    : resolvedPlaceholder;

  function handleChange(next: typeof monthValue) {
    onChange?.(next);
    if (isPopover && closeOnSelect && next) setOpen(false);
  }

  const calendar = (
    <AvanCalendar
      {...props}
      locale={locale}
      dir={dir}
      mode="month"
      monthValue={value}
      defaultMonthValue={defaultValue}
      onMonthChange={handleChange}
    />
  );

  return (
    <div
      ref={rootRef}
      className={[
        'avan-month-picker',
        isPopover ? 'avan-month-picker--popover' : 'avan-month-picker--inline',
        open && 'avan-picker--open',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      dir={dir}
    >
      {isPopover ? (
        <>
          <button
            type="button"
            className={[
              'avan-month-picker__trigger',
              !monthValue && 'avan-month-picker__trigger--placeholder',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-haspopup="dialog"
            aria-expanded={open}
            onClick={toggleOpen}
          >
            {triggerLabel}
          </button>
          {open ? (
            <div
              ref={popoverRef}
              tabIndex={-1}
              className="avan-month-picker__popover avan-picker__popover"
              role="dialog"
              aria-modal="true"
              aria-label={resolvedPlaceholder}
            >
              {calendar}
            </div>
          ) : null}
        </>
      ) : (
        <>
          <div className="avan-month-picker__input">{triggerLabel}</div>
          {calendar}
        </>
      )}
    </div>
  );
}
