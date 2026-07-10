'use client';

import { useId } from 'react';
import { toPersianDigits } from '@avan/core';
import { useAvanContext } from '../context/avan-context';
import { resolveLocale, type AvanLocaleDefinition } from '../locale';
import type { AvanTimePickerProps, AvanTimeValue } from '../types';
import { formatNumberDisplay, shouldUsePersianDigits } from '../utils/format-display';
import '../styles/time-picker.css';

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

function formatPadded(value: number, locale: AvanLocaleDefinition): string {
  const padded = pad2(value);
  return shouldUsePersianDigits(locale) ? toPersianDigits(padded) : padded;
}

function range(start: number, end: number, step = 1): number[] {
  const values: number[] = [];
  for (let value = start; value <= end; value += step) values.push(value);
  return values;
}

function to12Hour(hour: number): { hour12: number; isPm: boolean } {
  const isPm = hour >= 12;
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return { hour12, isPm };
}

function from12Hour(hour12: number, isPm: boolean): number {
  const base = hour12 % 12;
  return isPm ? base + 12 : base;
}

function clampTime(value: AvanTimeValue, min?: AvanTimeValue, max?: AvanTimeValue): AvanTimeValue {
  const toMinutes = (t: AvanTimeValue) => t.hour * 3600 + t.minute * 60 + (t.second ?? 0);
  const total = toMinutes(value);

  if (min && total < toMinutes(min)) return { ...min };
  if (max && total > toMinutes(max)) return { ...max };
  return value;
}

export function AvanTimePicker({
  value,
  defaultValue,
  onChange,
  hourCycle = 24,
  showSeconds = false,
  minuteStep = 1,
  minTime,
  maxTime,
  locale: localeProp,
  dir: dirProp,
  className,
  disabled = false,
}: AvanTimePickerProps) {
  const context = useAvanContext();
  const locale = resolveLocale(localeProp ?? context.locale);
  const dir = dirProp ?? context.dir ?? locale.dir;
  const current: AvanTimeValue = value ?? defaultValue ?? { hour: 0, minute: 0, second: 0 };
  const idPrefix = useId();

  function emit(next: AvanTimeValue) {
    onChange?.(clampTime(next, minTime, maxTime));
  }

  const { hour12, isPm } = to12Hour(current.hour);
  const hourOptions = hourCycle === 12 ? range(1, 12) : range(0, 23);
  const minuteOptions = range(0, 59, minuteStep);
  const secondOptions = range(0, 59);

  function handleHourChange(nextValue: number) {
    const hour = hourCycle === 12 ? from12Hour(nextValue, isPm) : nextValue;
    emit({ ...current, hour });
  }

  function handleMeridiemChange(nextIsPm: boolean) {
    emit({ ...current, hour: from12Hour(hour12, nextIsPm) });
  }

  return (
    <div className={['avan-time-picker', className].filter(Boolean).join(' ')} dir={dir}>
      <div className="avan-time-picker__field">
        <label className="avan-time-picker__label" htmlFor={`${idPrefix}-hour`}>
          {locale.strings.hour}
        </label>
        <select
          id={`${idPrefix}-hour`}
          className="avan-time-picker__select"
          disabled={disabled}
          value={hourCycle === 12 ? hour12 : current.hour}
          onChange={(event) => handleHourChange(Number(event.target.value))}
        >
          {hourOptions.map((h) => (
            <option key={h} value={h}>
              {formatNumberDisplay(h, locale)}
            </option>
          ))}
        </select>
      </div>

      <span className="avan-time-picker__separator" aria-hidden="true">
        :
      </span>

      <div className="avan-time-picker__field">
        <label className="avan-time-picker__label" htmlFor={`${idPrefix}-minute`}>
          {locale.strings.minute}
        </label>
        <select
          id={`${idPrefix}-minute`}
          className="avan-time-picker__select"
          disabled={disabled}
          value={current.minute}
          onChange={(event) => emit({ ...current, minute: Number(event.target.value) })}
        >
          {minuteOptions.map((m) => (
            <option key={m} value={m}>
              {formatPadded(m, locale)}
            </option>
          ))}
        </select>
      </div>

      {showSeconds ? (
        <>
          <span className="avan-time-picker__separator" aria-hidden="true">
            :
          </span>
          <div className="avan-time-picker__field">
            <label className="avan-time-picker__label" htmlFor={`${idPrefix}-second`}>
              {locale.strings.second}
            </label>
            <select
              id={`${idPrefix}-second`}
              className="avan-time-picker__select"
              disabled={disabled}
              value={current.second ?? 0}
              onChange={(event) => emit({ ...current, second: Number(event.target.value) })}
            >
              {secondOptions.map((s) => (
                <option key={s} value={s}>
                  {formatPadded(s, locale)}
                </option>
              ))}
            </select>
          </div>
        </>
      ) : null}

      {hourCycle === 12 ? (
        <div className="avan-time-picker__meridiem" role="group" aria-label="AM/PM">
          <button
            type="button"
            className={[
              'avan-time-picker__meridiem-btn',
              !isPm && 'avan-time-picker__meridiem-btn--active',
            ]
              .filter(Boolean)
              .join(' ')}
            disabled={disabled}
            aria-pressed={!isPm}
            onClick={() => handleMeridiemChange(false)}
          >
            {locale.strings.am}
          </button>
          <button
            type="button"
            className={[
              'avan-time-picker__meridiem-btn',
              isPm && 'avan-time-picker__meridiem-btn--active',
            ]
              .filter(Boolean)
              .join(' ')}
            disabled={disabled}
            aria-pressed={isPm}
            onClick={() => handleMeridiemChange(true)}
          >
            {locale.strings.pm}
          </button>
        </div>
      ) : null}
    </div>
  );
}
