'use client';

import { useRef } from 'react';
import { AvanCalendar } from './avan-calendar';
import { useAvanContext } from '../context/avan-context';
import { useControllableOpen } from '../hooks/use-controllable-open';
import { useDismissibleLayer } from '../hooks/use-dismissible-layer';
import { useFocusTrap } from '../hooks/use-focus-trap';
import { resolveLocale } from '../locale';
import type { AvanMultiDatePickerProps } from '../types';
import { formatJalaliDisplay } from '../utils/format-display';

export function AvanMultiDatePicker({
  value,
  defaultValue,
  onChange,
  placeholder,
  className,
  dir: dirProp,
  locale: localeProp,
  display = 'inline',
  numberOfMonths = 1,
  open: openProp,
  defaultOpen,
  onOpenChange,
  closeOnSelect = false,
  ...props
}: AvanMultiDatePickerProps) {
  const context = useAvanContext();
  const locale = resolveLocale(localeProp ?? context.locale);
  const dir = dirProp ?? context.dir ?? locale.dir;
  const selected = value ?? defaultValue ?? [];
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

  const resolvedPlaceholder = placeholder ?? locale.strings.placeholderMultiple;
  const triggerLabel =
    selected.length > 0
      ? selected.map((d) => formatJalaliDisplay(d, locale)).join(', ')
      : resolvedPlaceholder;

  function handleChange(next: Date[]) {
    onChange?.(next);
    if (isPopover && closeOnSelect) setOpen(false);
  }

  const calendar = (
    <AvanCalendar
      {...props}
      locale={locale}
      dir={dir}
      mode="multiple"
      numberOfMonths={numberOfMonths}
      multipleValue={value}
      defaultMultipleValue={defaultValue}
      onMultipleChange={handleChange}
    />
  );

  return (
    <div
      ref={rootRef}
      className={[
        'avan-multi-picker',
        isPopover ? 'avan-multi-picker--popover' : 'avan-multi-picker--inline',
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
              'avan-multi-picker__trigger',
              selected.length === 0 && 'avan-multi-picker__trigger--placeholder',
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
              className="avan-multi-picker__popover avan-picker__popover"
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
          <div className="avan-multi-picker__input">{triggerLabel}</div>
          {calendar}
        </>
      )}
    </div>
  );
}
