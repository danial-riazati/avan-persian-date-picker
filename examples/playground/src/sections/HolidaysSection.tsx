import { useMemo } from 'react';
import { toPersianDigits } from '@avan-persian/core';
import { getIranHolidays } from '@avan-persian/holidays';
import { AvanCalendar } from '@avan-persian/react/client';
import { Panel, Section } from '../components/Panel';
import { T, type PlaygroundLocale } from '../strings';

function fmtNum(value: number, locale: PlaygroundLocale): string {
  return locale === 'fa-IR' ? toPersianDigits(value) : String(value);
}

export function HolidaysSection({ locale }: { locale: PlaygroundLocale }) {
  const t = T[locale];
  const holidays1404 = useMemo(() => getIranHolidays(1404), []);
  const holidays1405 = useMemo(() => getIranHolidays(1405), []);
  const holidays1406 = useMemo(() => getIranHolidays(1406), []);
  const total = holidays1404.length + holidays1405.length + holidays1406.length;

  return (
    <Section id="holidays" title={t.sections.holidays}>
      <Panel title={t.sections.holidays} description={t.holidaysIntro(fmtNum(total, locale))} wide>
        <AvanCalendar visibleMonth={{ year: 1404, month: 12, day: 1 }} />
        <ul className="holiday-list">
          {holidays1405.slice(0, 6).map((holiday) => (
            <li key={holiday.date}>
              <code>{locale === 'fa-IR' ? toPersianDigits(holiday.date) : holiday.date}</code>
              <span>{locale === 'fa-IR' ? holiday.title : (holiday.titleEn ?? holiday.title)}</span>
            </li>
          ))}
        </ul>
        <div className="meta">{t.officialDays(fmtNum(holidays1405.length, locale))}</div>
      </Panel>
    </Section>
  );
}
