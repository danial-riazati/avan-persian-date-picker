'use client';

import { useId, useRef } from 'react';
import { AvanCalendar } from './avan-calendar';
import { useAvanContext } from '../context/avan-context';
import { useControllableOpen } from '../hooks/use-controllable-open';
import { useDismissibleLayer } from '../hooks/use-dismissible-layer';
import { useFocusTrap } from '../hooks/use-focus-trap';
import { useDateTextInput } from '../hooks/use-date-text-input';
import { resolveLocale } from '../locale';
import type { AvanDatePickerProps } from '../types';
import { formatJalaliDisplay } from '../utils/format-display';

export function AvanDatePicker({
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
  allowTextInput = false,
  inputFormat = 'yyyy/MM/dd',
  isDateDisabled,
  ...props
}: AvanDatePickerProps) {
  const context = useAvanContext();
  const locale = resolveLocale(localeProp ?? context.locale);
  const dir = dirProp ?? context.dir ?? locale.dir;
  const selected = value ?? defaultValue ?? null;
  const rootRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const popoverId = useId();
  const { open, setOpen, toggleOpen } = useControllableOpen({
    open: openProp,
    defaultOpen,
    onOpenChange,
  });

  const isPopover = display === 'popover';
  useDismissibleLayer(isPopover && open, setOpen, rootRef);
  useFocusTrap(isPopover && open && !allowTextInput, popoverRef);

  const resolvedPlaceholder = placeholder ?? locale.strings.placeholderDate;
  const triggerLabel = selected ? formatJalaliDisplay(selected, locale) : resolvedPlaceholder;
  const isTwoMonths = numberOfMonths >= 2;

  function handleChange(next: Date | null) {
    onChange?.(next);

    if (isPopover && closeOnSelect && next) {
      setOpen(false);
    }
  }

  const textInput = useDateTextInput({
    value: selected,
    onChange: handleChange,
    format: inputFormat,
    locale,
    isDateDisabled,
  });

  const calendar = (
    <AvanCalendar
      {...props}
      locale={locale}
      dir={dir}
      mode="single"
      numberOfMonths={numberOfMonths}
      value={value}
      defaultValue={defaultValue}
      isDateDisabled={isDateDisabled}
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
      dir={dir}
    >
      {isPopover ? (
        <>
          {allowTextInput ? (
            <input
              type="text"
              className={[
                'avan-date-picker__text-input',
                textInput.invalid && 'avan-date-picker__text-input--invalid',
              ]
                .filter(Boolean)
                .join(' ')}
              value={textInput.text}
              placeholder={textInput.placeholderFormat}
              inputMode="numeric"
              role="combobox"
              aria-invalid={textInput.invalid || undefined}
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-controls={open ? popoverId : undefined}
              onFocus={() => setOpen(true)}
              onChange={(event) => textInput.handleChange(event.target.value)}
              onBlur={textInput.handleBlur}
              onKeyDown={textInput.handleKeyDown}
            />
          ) : (
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
          )}
          {open ? (
            <div
              ref={popoverRef}
              id={popoverId}
              tabIndex={-1}
              className="avan-date-picker__popover avan-picker__popover"
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
