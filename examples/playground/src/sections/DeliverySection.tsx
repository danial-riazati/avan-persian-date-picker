import { useMemo, useState } from 'react';
import { formatJalali, toPersianDigits } from '@avan/core';
import { getIranHolidays, isHoliday } from '@avan/holidays';
import { AvanCalendar } from '@avan/react/client';
import type { AvanGetDayMeta } from '@avan/react';
import { Panel, Section } from '../components/Panel';
import { T, type PlaygroundLocale } from '../strings';

function startOfToday(): Date {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

function fmt(date: Date, locale: PlaygroundLocale): string {
  const formatted = formatJalali(date, 'yyyy/MM/dd');
  return locale === 'fa-IR' ? toPersianDigits(formatted) : formatted;
}

export function DeliverySection({ locale }: { locale: PlaygroundLocale }) {
  const t = T[locale];
  const [date, setDate] = useState<Date | null>(null);
  const today = useMemo(startOfToday, []);
  const holidays = useMemo(() => [...getIranHolidays(1404), ...getIranHolidays(1405)], []);

  const isDateDisabled = useMemo(
    () => (candidate: Date) =>
      candidate.getTime() < today.getTime() || isHoliday(candidate, holidays),
    [today, holidays],
  );

  const fastestDelivery = useMemo(() => {
    let cursor = new Date(today);
    for (let i = 0; i < 60; i++) {
      if (!isDateDisabled(cursor)) return cursor;
      cursor = new Date(cursor.getTime() + 86_400_000);
    }
    return null;
  }, [today, isDateDisabled]);

  const getDayMeta: AvanGetDayMeta = useMemo(
    () => (day) => {
      if (fastestDelivery && day.getTime() === fastestDelivery.getTime()) {
        return { badge: '⚡', tooltip: t.delivery.fastest, className: 'demo-day--fastest' };
      }
      return undefined;
    },
    [fastestDelivery, t.delivery.fastest],
  );

  return (
    <Section id="delivery" title={t.sections.delivery}>
      <Panel title={t.sections.delivery} description={t.delivery.description} wide>
        <AvanCalendar
          value={date}
          onChange={setDate}
          isDateDisabled={isDateDisabled}
          getDayMeta={getDayMeta}
          showTodayButton
        />
        <div className="meta">
          <strong>{t.selectedLabel}</strong>
          {date ? fmt(date, locale) : t.none}
        </div>
      </Panel>
    </Section>
  );
}
