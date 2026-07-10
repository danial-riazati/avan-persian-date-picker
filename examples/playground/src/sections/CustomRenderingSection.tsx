import { useMemo, useState } from 'react';
import { toJalali, toPersianDigits } from '@avan/core';
import { AvanCalendar } from '@avan/react/client';
import type { AvanCalendarComponents, AvanGetDayMeta } from '@avan/react';
import { Panel, Section } from '../components/Panel';
import { T, type PlaygroundLocale } from '../strings';

export function CustomRenderingSection({ locale }: { locale: PlaygroundLocale }) {
  const t = T[locale];
  const [date, setDate] = useState<Date | null>(null);

  const getDayMeta: AvanGetDayMeta = useMemo(
    () => (day) => {
      const { day: jalaliDay } = toJalali(day);
      if (jalaliDay === 1)
        return { badge: '🎉', tooltip: t.custom.startOfMonth, className: 'demo-day--event' };
      if (jalaliDay % 7 === 0) return { badge: '★', tooltip: t.custom.milestone };
      return undefined;
    },
    [t.custom.startOfMonth, t.custom.milestone],
  );

  const components: AvanCalendarComponents = useMemo(
    () => ({
      DayContent: ({ day, meta }) => (
        <>
          <span className="avan-calendar__day-number">
            {locale === 'fa-IR' ? toPersianDigits(day.date.jalali.day) : day.date.jalali.day}
          </span>
          {meta?.badge ? <span className="demo-day-badge">{meta.badge}</span> : null}
        </>
      ),
    }),
    [locale],
  );

  return (
    <Section id="custom-rendering" title={t.sections.customRendering}>
      <Panel title="getDayMeta + components.DayContent" description={t.custom.description} wide>
        <AvanCalendar
          value={date}
          onChange={setDate}
          getDayMeta={getDayMeta}
          components={components}
        />
      </Panel>
    </Section>
  );
}
