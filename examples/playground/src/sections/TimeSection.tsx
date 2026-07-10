import { useState } from 'react';
import { formatJalali, toPersianDigits } from '@avan-persian/core';
import { AvanDateTimePicker, AvanTimePicker } from '@avan-persian/react/client';
import type { AvanTimeValue } from '@avan-persian/react';
import { Panel, Section } from '../components/Panel';
import { T, type PlaygroundLocale } from '../strings';

function fmt(date: Date, locale: PlaygroundLocale): string {
  const formatted = formatJalali(date, 'yyyy/MM/dd HH:mm');
  return locale === 'fa-IR' ? toPersianDigits(formatted) : formatted;
}

export function TimeSection({ locale }: { locale: PlaygroundLocale }) {
  const t = T[locale];
  const [time, setTime] = useState<AvanTimeValue | null>({ hour: 14, minute: 30, second: 0 });
  const [time12, setTime12] = useState<AvanTimeValue | null>({ hour: 9, minute: 0 });
  const [dateTime, setDateTime] = useState<Date | null>(null);

  return (
    <Section id="time" title={t.sections.time}>
      <Panel title="24h + seconds">
        <AvanTimePicker value={time} onChange={setTime} showSeconds minuteStep={5} />
      </Panel>

      <Panel title="12h (AM/PM)">
        <AvanTimePicker value={time12} onChange={setTime12} hourCycle={12} />
      </Panel>

      <Panel title="Date + time" wide>
        <AvanDateTimePicker value={dateTime} onChange={setDateTime} display="popover" />
        <div className="meta">
          <strong>{t.selectedLabel}</strong>
          {dateTime ? fmt(dateTime, locale) : t.none}
        </div>
      </Panel>
    </Section>
  );
}
