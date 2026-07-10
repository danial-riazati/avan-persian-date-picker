import { useMemo, useState } from 'react';
import { formatJalali, toGregorian, toPersianDigits } from '@avan/core';
import { AvanCalendar, AvanDatePicker } from '@avan/react/client';
import { Panel, Section } from '../components/Panel';
import { T, type PlaygroundLocale } from '../strings';

function fmt(date: Date, locale: PlaygroundLocale): string {
  const formatted = formatJalali(date, 'yyyy/MM/dd');
  return locale === 'fa-IR' ? toPersianDigits(formatted) : formatted;
}

export function ConstraintsSection({ locale }: { locale: PlaygroundLocale }) {
  const t = T[locale];
  const [minMaxDate, setMinMaxDate] = useState<Date | null>(null);
  const [noWeekendDate, setNoWeekendDate] = useState<Date | null>(null);

  const minDate = useMemo(() => new Date(), []);
  const maxDate = useMemo(() => toGregorian({ year: 1405, month: 6, day: 31 }), []);
  const disabledRanges = useMemo(
    () => [
      {
        from: toGregorian({ year: 1405, month: 1, day: 10 }),
        to: toGregorian({ year: 1405, month: 1, day: 15 }),
      },
    ],
    [],
  );

  return (
    <Section id="constraints" title={t.sections.constraints}>
      <Panel title="minDate / maxDate + disabledRanges">
        <AvanDatePicker
          value={minMaxDate}
          onChange={setMinMaxDate}
          minDate={minDate}
          maxDate={maxDate}
          disabledRanges={disabledRanges}
        />
        <div className="meta">
          <strong>{t.selectedLabel}</strong>
          {minMaxDate ? fmt(minMaxDate, locale) : t.none}
        </div>
      </Panel>

      <Panel title="disabledWeekdays (Fridays)">
        <AvanCalendar value={noWeekendDate} onChange={setNoWeekendDate} disabledWeekdays={[5]} />
        <div className="meta">
          <strong>{t.selectedLabel}</strong>
          {noWeekendDate ? fmt(noWeekendDate, locale) : t.none}
        </div>
      </Panel>
    </Section>
  );
}
