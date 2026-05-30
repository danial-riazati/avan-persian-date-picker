import { useMemo, useState } from 'react';
import { formatJalali, toPersianDigits } from '@avan/core';
import { getIranHolidays } from '@avan/holidays';
import {
  AvanCalendar,
  AvanDatePicker,
  AvanDateRangePicker,
  AvanProvider,
  type DateRangeValue,
} from '@avan/react/client';

const HOLIDAY_YEARS = [1404, 1405, 1406] as const;

function formatRtlDate(date: Date): string {
  return toPersianDigits(formatJalali(date, 'yyyy/MM/dd'));
}

export default function App() {
  const [singleDate, setSingleDate] = useState<Date | null>(null);
  const [pickerDate, setPickerDate] = useState<Date | null>(null);
  const [popoverDate, setPopoverDate] = useState<Date | null>(null);
  const [range, setRange] = useState<DateRangeValue>({ from: null, to: null });
  const [popoverRange, setPopoverRange] = useState<DateRangeValue>({ from: null, to: null });
  const [popoverTwoMonthRange, setPopoverTwoMonthRange] = useState<DateRangeValue>({
    from: null,
    to: null,
  });

  const holidaysByYear = useMemo(
    () =>
      HOLIDAY_YEARS.map((year) => ({
        year,
        holidays: getIranHolidays(year),
      })),
    [],
  );

  const totalHolidayCount = holidaysByYear.reduce(
    (count, entry) => count + entry.holidays.length,
    0,
  );

  return (
    <AvanProvider
      dir="rtl"
      locale="fa-IR"
      theme={{ fontFamily: "'Estedad', system-ui, sans-serif" }}
    >
      <main className="page">
        <section className="hero">
          <span className="badge">Avan Playground</span>
          <h1>تقویم و انتخابگر تاریخ آوان</h1>
          <p>
            Interactive demo for the Avan Persian Date Picker. Persian digits in RTL mode, with Iran
            official holidays built into every calendar (1404–1406 datasets plus the visible year).
          </p>
        </section>

        <section className="grid">
          <article className="panel">
            <h2>Single calendar</h2>
            <p>Click a day to select one Jalali date.</p>
            <AvanCalendar value={singleDate} onChange={setSingleDate} />
            <div className="meta">
              <strong>Selected</strong>
              {singleDate ? formatRtlDate(singleDate) : '—'}
            </div>
          </article>

          <article className="panel">
            <h2>Date picker (inline)</h2>
            <p>Calendar always visible below the input preview.</p>
            <AvanDatePicker
              value={pickerDate}
              onChange={setPickerDate}
              display="inline"
              placeholder="یک تاریخ انتخاب کنید"
            />
          </article>

          <article className="panel">
            <h2>Date picker (popover)</h2>
            <p>Click the input to open the calendar — `display=&quot;popover&quot;`.</p>
            <AvanDatePicker
              value={popoverDate}
              onChange={setPopoverDate}
              display="popover"
              placeholder="یک تاریخ انتخاب کنید"
              numberOfMonths={2}
            />
            <div className="meta">
              <strong>Selected</strong>
              {popoverDate ? formatRtlDate(popoverDate) : '—'}
            </div>
          </article>

          <article className="panel panel--wide">
            <h2>Two-month range (inline)</h2>
            <p>Side-by-side months for booking flows — `numberOfMonths={2}`.</p>
            <AvanDateRangePicker value={range} onChange={setRange} numberOfMonths={2} />
          </article>

          <article className="panel panel--wide">
            <h2>Two-month range (popover)</h2>
            <p>Popover with two months — common for travel date selection.</p>
            <AvanDateRangePicker
              value={popoverTwoMonthRange}
              onChange={setPopoverTwoMonthRange}
              display="popover"
              numberOfMonths={2}
              placeholder="انتخاب بازه تاریخ"
            />
          </article>

          <article className="panel">
            <h2>Range picker (inline)</h2>
            <p>Select check-in and check-out dates for travel booking flows.</p>
            <AvanDateRangePicker value={range} onChange={setRange} display="inline" />
            <div className="meta">
              <strong>Range metadata</strong>
              {range.from ? `از ${formatRtlDate(range.from)}` : 'از —'}
              <br />
              {range.to ? `تا ${formatRtlDate(range.to)}` : 'تا —'}
            </div>
          </article>

          <article className="panel">
            <h2>Range picker (popover)</h2>
            <p>Opens on click; closes after both dates are selected.</p>
            <AvanDateRangePicker
              value={popoverRange}
              onChange={setPopoverRange}
              display="popover"
              placeholder="انتخاب بازه تاریخ"
            />
          </article>

          <article className="panel">
            <h2>English / LTR</h2>
            <p>Western digits (0-9) when direction is LTR.</p>
            <AvanCalendar dir="ltr" locale="en-IR" defaultValue={new Date()} />
          </article>
        </section>

        <section className="holiday-years" style={{ marginTop: '1.5rem' }}>
          <h2 className="holiday-years__title">Official holidays — 1404 to 1406</h2>
          <p className="holiday-years__intro">
            Bundled datasets ({toPersianDigits(totalHolidayCount)} dates). Calendars load these
            automatically — no `holidays` prop required.
          </p>
          <div className="holiday-years__grid">
            {holidaysByYear.map(({ year, holidays: yearHolidays }) => (
              <article key={year} className="panel">
                <h3>{toPersianDigits(year)}</h3>
                <p>
                  {toPersianDigits(yearHolidays.length)} official days (تعطیلات رسمی)
                </p>
                <ul className="holiday-list">
                  {yearHolidays.map((holiday) => (
                    <li key={holiday.date}>
                      <span className="holiday-list__date">
                        {toPersianDigits(holiday.date.replace(/-/g, '/'))}
                      </span>
                      <span className="holiday-list__title">{holiday.title}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      </main>
    </AvanProvider>
  );
}
