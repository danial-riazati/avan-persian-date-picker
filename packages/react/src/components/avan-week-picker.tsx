'use client';

import { useRef } from 'react';
import { AvanCalendar } from './avan-calendar';
import { useAvanContext } from '../context/avan-context';
import { useControllableOpen } from '../hooks/use-controllable-open';
import { useDismissibleLayer } from '../hooks/use-dismissible-layer';
import { useFocusTrap } from '../hooks/use-focus-trap';
import { resolveLocale } from '../locale';
import type { AvanWeekPickerProps, DateRangeValue } from '../types';
import { formatJalaliDisplay } from '../utils/format-display';

export function AvanWeekPicker({
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
  closeOnSelect = true,
  ...props
}: AvanWeekPickerProps) {
  const context = useAvanContext();
  const locale = resolveLocale(localeProp ?? context.locale);
  const dir = dirProp ?? context.dir ?? locale.dir;
  const week: DateRangeValue = value ?? defaultValue ?? { from: null, to: null };
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

  const resolvedPlaceholder = placeholder ?? locale.strings.placeholderWeek;
  const triggerLabel =
    week.from && week.to
      ? `${formatJalaliDisplay(week.from, locale)} – ${formatJalaliDisplay(week.to, locale)}`
      : resolvedPlaceholder;

  function handleChange(next: DateRangeValue) {
    onChange?.(next);
    if (isPopover && closeOnSelect && next.from && next.to) setOpen(false);
  }

  const calendar = (
    <AvanCalendar
      {...props}
      locale={locale}
      dir={dir}
      mode="week"
      numberOfMonths={numberOfMonths}
      weekValue={value}
      defaultWeekValue={defaultValue}
      onWeekChange={handleChange}
    />
  );

  return (
    <div
      ref={rootRef}
      className={[
        'avan-week-picker',
        isPopover ? 'avan-week-picker--popover' : 'avan-week-picker--inline',
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
              'avan-week-picker__trigger',
              !week.from && 'avan-week-picker__trigger--placeholder',
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
              className="avan-week-picker__popover avan-picker__popover"
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
          <div className="avan-week-picker__input">{triggerLabel}</div>
          {calendar}
        </>
      )}
    </div>
  );
}
