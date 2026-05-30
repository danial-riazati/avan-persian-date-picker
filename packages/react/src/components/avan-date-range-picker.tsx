'use client';

import { useRef } from 'react';
import { AvanCalendar } from './avan-calendar';
import { useAvanContext } from '../context/avan-context';
import { useControllableOpen } from '../hooks/use-controllable-open';
import { useDismissibleLayer } from '../hooks/use-dismissible-layer';
import type { AvanDateRangePickerProps } from '../types';
import { formatJalaliDisplay } from '../utils/format-display';

function formatRangeTriggerLabel(
  range: { from: Date | null; to: Date | null },
  dir: 'rtl' | 'ltr',
  placeholder: string,
): string {
  if (!range.from && !range.to) {
    return placeholder;
  }

  const fromLabel = dir === 'rtl' ? 'از' : 'From';
  const toLabel = dir === 'rtl' ? 'تا' : 'To';
  const fromText = range.from ? formatJalaliDisplay(range.from, dir) : '—';
  const toText = range.to ? formatJalaliDisplay(range.to, dir) : '—';

  return `${fromLabel} ${fromText} ${toLabel} ${toText}`;
}

export function AvanDateRangePicker({
  value,
  defaultValue,
  onChange,
  className,
  dir: dirProp,
  locale: localeProp,
  placeholder = 'انتخاب بازه تاریخ',
  display = 'inline',
  open: openProp,
  defaultOpen,
  onOpenChange,
  closeOnSelect = true,
  numberOfMonths = 1,
  ...props
}: AvanDateRangePickerProps) {
  const context = useAvanContext();
  const dir = dirProp ?? context.dir;
  const locale = localeProp ?? context.locale;
  const range = value ?? defaultValue ?? { from: null, to: null };
  const rootRef = useRef<HTMLDivElement>(null);
  const { open, setOpen, toggleOpen } = useControllableOpen({
    open: openProp,
    defaultOpen,
    onOpenChange,
  });

  useDismissibleLayer(display === 'popover' && open, setOpen, rootRef);

  const fromLabel = dir === 'rtl' ? 'از' : 'From';
  const toLabel = dir === 'rtl' ? 'تا' : 'To';
  const isPopover = display === 'popover';
  const isTwoMonths = numberOfMonths === 2;
  const hasSelection = Boolean(range.from || range.to);
  const triggerLabel = formatRangeTriggerLabel(range, dir, placeholder);

  function handleRangeChange(next: { from: Date | null; to: Date | null }) {
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
        <span className="avan-range-picker__label">{fromLabel}</span>
        <strong>{range.from ? formatJalaliDisplay(range.from, dir) : '—'}</strong>
      </div>
      <div>
        <span className="avan-range-picker__label">{toLabel}</span>
        <strong>{range.to ? formatJalaliDisplay(range.to, dir) : '—'}</strong>
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
            <div className="avan-range-picker__popover avan-picker__popover">
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
