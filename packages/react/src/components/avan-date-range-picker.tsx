'use client';

import { useRef } from 'react';
import { AvanCalendar } from './avan-calendar';
import { useAvanContext } from '../context/avan-context';
import { useControllableOpen } from '../hooks/use-controllable-open';
import { useDismissibleLayer } from '../hooks/use-dismissible-layer';
import { useFocusTrap } from '../hooks/use-focus-trap';
import { resolveLocale, type AvanLocaleDefinition } from '../locale';
import type { AvanDateRangePickerProps, DateRangeValue } from '../types';
import { formatJalaliDisplay } from '../utils/format-display';

function formatRangeTriggerLabel(
  range: DateRangeValue,
  locale: AvanLocaleDefinition,
  placeholder: string,
): string {
  if (!range.from && !range.to) {
    return placeholder;
  }

  const fromText = range.from ? formatJalaliDisplay(range.from, locale) : '—';
  const toText = range.to ? formatJalaliDisplay(range.to, locale) : '—';

  return `${locale.strings.from} ${fromText} ${locale.strings.to} ${toText}`;
}

export function AvanDateRangePicker({
  value,
  defaultValue,
  onChange,
  className,
  dir: dirProp,
  locale: localeProp,
  placeholder,
  display = 'inline',
  open: openProp,
  defaultOpen,
  onOpenChange,
  closeOnSelect = true,
  numberOfMonths = 1,
  ...props
}: AvanDateRangePickerProps) {
  const context = useAvanContext();
  const locale = resolveLocale(localeProp ?? context.locale);
  const dir = dirProp ?? context.dir ?? locale.dir;
  const range = value ?? defaultValue ?? { from: null, to: null };
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

  const resolvedPlaceholder = placeholder ?? locale.strings.placeholderRange;
  const isTwoMonths = numberOfMonths >= 2;
  const hasSelection = Boolean(range.from || range.to);
  const triggerLabel = formatRangeTriggerLabel(range, locale, resolvedPlaceholder);

  function handleRangeChange(next: DateRangeValue) {
    onChange?.(next);

    if (isPopover && closeOnSelect && next.from && next.to) {
      setOpen(false);
    }
  }

  const calendar = (
    <AvanCalendar
      {...props}
      dir={dir}
      locale={locale}
      mode="range"
      numberOfMonths={numberOfMonths}
      rangeValue={value}
      defaultRangeValue={defaultValue}
      onRangeChange={handleRangeChange}
    />
  );

  const summary = (
    <div className="avan-range-picker__summary">
      <div>
        <span className="avan-range-picker__label">{locale.strings.from}</span>
        <strong>{range.from ? formatJalaliDisplay(range.from, locale) : '—'}</strong>
      </div>
      <div>
        <span className="avan-range-picker__label">{locale.strings.to}</span>
        <strong>{range.to ? formatJalaliDisplay(range.to, locale) : '—'}</strong>
      </div>
    </div>
  );

  return (
    <div
      ref={rootRef}
      className={[
        'avan-range-picker',
        isPopover ? 'avan-range-picker--popover' : 'avan-range-picker--inline',
        isTwoMonths && 'avan-range-picker--2-months',
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
              'avan-range-picker__trigger',
              !hasSelection && 'avan-range-picker__trigger--placeholder',
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
              className="avan-range-picker__popover avan-picker__popover"
              role="dialog"
              aria-modal="true"
              aria-label={resolvedPlaceholder}
            >
              {calendar}
              {summary}
            </div>
          ) : null}
        </>
      ) : (
        <>
          {calendar}
          {summary}
        </>
      )}
    </div>
  );
}
