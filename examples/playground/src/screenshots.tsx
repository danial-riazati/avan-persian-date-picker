import { parseJalali, type JalaliDate } from '@avan/core';
import {
  AvanCalendar,
  AvanDatePicker,
  AvanDateRangePicker,
  AvanProvider,
  type DateRangeValue,
} from '@avan/react/client';

const VISIBLE_MONTH: JalaliDate = { year: 1404, month: 1, day: 1 };

const singleDate = parseJalali('1404/01/01').gregorian;
const rangeValue: DateRangeValue = {
  from: parseJalali('1404/01/15').gregorian,
  to: parseJalali('1404/01/22').gregorian,
};
const ltrDate = parseJalali('1404/01/05').gregorian;

export default function Screenshots() {
  return (
    <AvanProvider
      dir="rtl"
      locale="fa-IR"
      theme={{ fontFamily: "'Estedad', system-ui, sans-serif" }}
    >
      <div className="screenshots-page">
        <section className="shot" data-screenshot="single-calendar">
          <AvanCalendar
            value={singleDate}
            visibleMonth={VISIBLE_MONTH}
            onChange={() => undefined}
          />
        </section>

        <section className="shot" data-screenshot="inline-picker">
          <AvanDatePicker
            value={singleDate}
            visibleMonth={VISIBLE_MONTH}
            display="inline"
            placeholder="یک تاریخ انتخاب کنید"
            onChange={() => undefined}
          />
        </section>

        <section className="shot shot--wide" data-screenshot="popover-picker">
          <AvanDatePicker
            value={singleDate}
            visibleMonth={VISIBLE_MONTH}
            display="popover"
            defaultOpen
            numberOfMonths={2}
            closeOnSelect={false}
            placeholder="یک تاریخ انتخاب کنید"
            onChange={() => undefined}
          />
        </section>

        <section className="shot shot--wide" data-screenshot="two-month-range">
          <AvanDateRangePicker
            value={rangeValue}
            visibleMonth={VISIBLE_MONTH}
            numberOfMonths={2}
            display="inline"
            onChange={() => undefined}
          />
        </section>

        <section className="shot" data-screenshot="range-inline">
          <AvanDateRangePicker
            value={rangeValue}
            visibleMonth={VISIBLE_MONTH}
            display="inline"
            onChange={() => undefined}
          />
        </section>

        <section className="shot" data-screenshot="ltr-calendar">
          <AvanCalendar
            dir="ltr"
            locale="en-IR"
            value={ltrDate}
            visibleMonth={VISIBLE_MONTH}
            onChange={() => undefined}
          />
        </section>
      </div>
    </AvanProvider>
  );
}
