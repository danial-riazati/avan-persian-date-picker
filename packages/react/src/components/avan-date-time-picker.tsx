'use client';

import { useRef } from 'react';
import { AvanCalendar } from './avan-calendar';
import { AvanTimePicker } from './avan-time-picker';
import { useAvanContext } from '../context/avan-context';
import { useControllableOpen } from '../hooks/use-controllable-open';
import { useDismissibleLayer } from '../hooks/use-dismissible-layer';
import { useFocusTrap } from '../hooks/use-focus-trap';
import { resolveLocale } from '../locale';
import type { AvanDateTimePickerProps, AvanTimeValue } from '../types';
import { formatJalaliDisplay } from '../utils/format-display';

function timeOf(date: Date): AvanTimeValue {
  return { hour: date.getHours(), minute: date.getMinutes(), second: date.getSeconds() };
}

function withTime(date: Date, time: AvanTimeValue): Date {
  const next = new Date(date);
  next.setHours(time.hour, time.minute, time.second ?? 0, 0);
  return next;
}

export function AvanDateTimePicker({
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
  hourCycle = 24,
  showSeconds = false,
  minuteStep = 1,
  ...props
}: AvanDateTimePickerProps) {
  const context = useAvanContext();
  const locale = resolveLocale(localeProp ?? context.locale);
  const dir = dirProp ?? context.dir ?? locale.dir;
  const selected = value ?? defaultValue ?? null;
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

  const resolvedPlaceholder = placeholder ?? locale.strings.placeholderDate;
  const timeFormat = hourCycle === 12 ? 'hh:mm a' : showSeconds ? 'HH:mm:ss' : 'HH:mm';
  const triggerLabel = selected
    ? `${formatJalaliDisplay(selected, locale)} ${formatJalaliDisplay(selected, locale, timeFormat)}`
    : resolvedPlaceholder;

  function handleDateChange(nextDate: Date | null) {
    if (!nextDate) {
      onChange?.(null);
      return;
    }

    const time = selected ? timeOf(selected) : { hour: 0, minute: 0, second: 0 };
    onChange?.(withTime(nextDate, time));
  }

  function handleTimeChange(time: AvanTimeValue) {
    if (!selected) {
      onChange?.(withTime(new Date(), time));
      return;
    }
    onChange?.(withTime(selected, time));
  }

  const content = (
    <div className="avan-datetime-picker__body">
      <AvanCalendar
        {...props}
        locale={locale}
        dir={dir}
        mode="single"
        numberOfMonths={numberOfMonths}
        value={selected}
        onChange={handleDateChange}
      />
      <AvanTimePicker
        locale={locale}
        dir={dir}
        hourCycle={hourCycle}
        showSeconds={showSeconds}
        minuteStep={minuteStep}
        value={selected ? timeOf(selected) : null}
        onChange={handleTimeChange}
        disabled={!selected}
      />
    </div>
  );

  return (
    <div
      ref={rootRef}
      className={[
        'avan-datetime-picker',
        isPopover ? 'avan-datetime-picker--popover' : 'avan-datetime-picker--inline',
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
              'avan-datetime-picker__trigger',
              !selected && 'avan-datetime-picker__trigger--placeholder',
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
              className="avan-datetime-picker__popover avan-picker__popover"
              role="dialog"
              aria-modal="true"
              aria-label={resolvedPlaceholder}
            >
              {content}
            </div>
          ) : null}
        </>
      ) : (
        <>
          <div className="avan-datetime-picker__input">{triggerLabel}</div>
          {content}
        </>
      )}
    </div>
  );
}
