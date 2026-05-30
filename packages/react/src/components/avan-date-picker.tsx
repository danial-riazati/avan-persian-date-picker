'use client';

import { useRef } from 'react';
import { AvanCalendar } from './avan-calendar';
import { useAvanContext } from '../context/avan-context';
import { useControllableOpen } from '../hooks/use-controllable-open';
import { useDismissibleLayer } from '../hooks/use-dismissible-layer';
import type { AvanDatePickerProps } from '../types';
import { formatJalaliDisplay } from '../utils/format-display';

export function AvanDatePicker({
  value,
  defaultValue,
  onChange,
  placeholder = 'انتخاب تاریخ',
  className,
  dir: dirProp,
  display = 'inline',
  numberOfMonths = 1,
  open: openProp,
  defaultOpen,
  onOpenChange,
  closeOnSelect = true,
  ...props
}: AvanDatePickerProps) {
  const context = useAvanContext();
  const dir = dirProp ?? context.dir;
  const selected = value ?? defaultValue ?? null;
  const rootRef = useRef<HTMLDivElement>(null);
  const { open, setOpen, toggleOpen } = useControllableOpen({
    open: openProp,
    defaultOpen,
    onOpenChange,
  });

  useDismissibleLayer(display === 'popover' && open, setOpen, rootRef);

  const triggerLabel = selected ? formatJalaliDisplay(selected, dir) : placeholder;
  const isPopover = display === 'popover';
  const isTwoMonths = numberOfMonths === 2;

  function handleChange(next: Date | null) {
    onChange?.(next);

    if (isPopover && closeOnSelect && next) {
      setOpen(false);
    }
  }

  const calendar = (
    <AvanCalendar
      {...props}
      dir={dir}
      mode="single"
      numberOfMonths={numberOfMonths}
      value={value}
      defaultValue={defaultValue}
      onChange={handleChange}
    />
  );

  return (
    <div
      ref={rootRef}
      className={[
        'avan-date-picker',
        isPopover ? 'avan-date-picker--popover' : 'avan-date-picker--inline',
        isTwoMonths && 'avan-date-picker--2-months',
        open && 'avan-picker--open',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {isPopover ? (
        <>
          <button
            type="button"
            className={[
              'avan-date-picker__trigger',
              !selected && 'avan-date-picker__trigger--placeholder',
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
            <div className="avan-date-picker__popover avan-picker__popover">{calendar}</div>
          ) : null}
        </>
      ) : (
        <>
          <div
            className={[
              'avan-date-picker__input',
              !selected && 'avan-date-picker__input--placeholder',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {triggerLabel}
          </div>
          {calendar}
        </>
      )}
    </div>
  );
}
