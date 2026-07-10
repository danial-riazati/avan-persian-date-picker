import { useState } from 'react';
import { formatJalali, toPersianDigits } from '@avan/core';
import {
  AvanCalendar,
  AvanDatePicker,
  AvanDateRangePicker,
  AvanMonthPicker,
  AvanMultiDatePicker,
  AvanWeekPicker,
  AvanYearPicker,
  type DateRangeValue,
} from '@avan/react/client';
import type { JalaliDate } from '@avan/core';
import { Panel, Section } from '../components/Panel';
import { T, type PlaygroundLocale } from '../strings';

function fmt(date: Date, locale: PlaygroundLocale): string {
  const formatted = formatJalali(date, 'yyyy/MM/dd');
  return locale === 'fa-IR' ? toPersianDigits(formatted) : formatted;
}

function fmtNum(value: number, locale: PlaygroundLocale): string {
  return locale === 'fa-IR' ? toPersianDigits(value) : String(value);
}

export function SelectionModesSection({ locale }: { locale: PlaygroundLocale }) {
  const t = T[locale];

  const [single, setSingle] = useState<Date | null>(null);
  const [range, setRange] = useState<DateRangeValue>({ from: null, to: null });
  const [multiple, setMultiple] = useState<Date[]>([]);
  const [multiRange, setMultiRange] = useState<DateRangeValue[]>([]);
  const [week, setWeek] = useState<DateRangeValue>({ from: null, to: null });
  const [month, setMonth] = useState<JalaliDate | null>(null);
  const [year, setYear] = useState<number | null>(null);

  return (
    <Section id="modes" title={t.sections.modes}>
      <Panel title={t.modes.single}>
        <AvanDatePicker value={single} onChange={setSingle} display="popover" allowTextInput />
        <div className="meta">
          <strong>{t.selectedLabel}</strong>
          {single ? fmt(single, locale) : t.none}
        </div>
      </Panel>

      <Panel title={t.modes.range} wide>
        <AvanDateRangePicker value={range} onChange={setRange} numberOfMonths={2} />
        <div className="meta">
          <strong>{t.selectedLabel}</strong>
          {t.fromLabel} {range.from ? fmt(range.from, locale) : t.none} · {t.toLabel}{' '}
          {range.to ? fmt(range.to, locale) : t.none}
        </div>
      </Panel>

      <Panel title={t.modes.multiple}>
        <AvanMultiDatePicker value={multiple} onChange={setMultiple} />
        <div className="meta">
          <strong>{t.selectedLabel}</strong>
          {multiple.length > 0 ? multiple.map((d) => fmt(d, locale)).join(', ') : t.none}
        </div>
      </Panel>

      <Panel title={t.modes.week}>
        <AvanWeekPicker value={week} onChange={setWeek} />
        <div className="meta">
          <strong>{t.selectedLabel}</strong>
          {week.from && week.to ? `${fmt(week.from, locale)} – ${fmt(week.to, locale)}` : t.none}
        </div>
      </Panel>

      <Panel title={t.modes.month}>
        <AvanMonthPicker value={month} onChange={setMonth} />
        <div className="meta">
          <strong>{t.selectedLabel}</strong>
          {month ? `${fmtNum(month.year, locale)}/${fmtNum(month.month, locale)}` : t.none}
        </div>
      </Panel>

      <Panel title={t.modes.year}>
        <AvanYearPicker value={year} onChange={setYear} />
        <div className="meta">
          <strong>{t.selectedLabel}</strong>
          {year ? fmtNum(year, locale) : t.none}
        </div>
      </Panel>

      <Panel title={t.modes.multiRange} wide>
        <AvanCalendar
          mode="multiRange"
          multiRangeValue={multiRange}
          onMultiRangeChange={setMultiRange}
          maxRangeCount={3}
          numberOfMonths={2}
        />
        <div className="meta">
          <strong>{t.selectedLabel}</strong>
          {multiRange.length > 0
            ? multiRange
                .map((r) =>
                  r.from && r.to ? `${fmt(r.from, locale)} – ${fmt(r.to, locale)}` : t.none,
                )
                .join(' | ')
            : t.none}
        </div>
      </Panel>
    </Section>
  );
}
