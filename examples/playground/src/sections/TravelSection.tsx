import { useMemo, useState } from 'react';
import { toJalali, toPersianDigits } from '@avan-persian/core';
import { AvanDateRangePicker } from '@avan-persian/react/client';
import type { DateRangeValue } from '@avan-persian/react';
import {
  computeRangePrice,
  createPriceDayMeta,
  isRangeAvailable,
  type GetPriceForDate,
  type TravelRules,
} from '@avan-persian/travel';
import { Panel, Section } from '../components/Panel';
import { T, type PlaygroundLocale } from '../strings';

const RULES: TravelRules = { minNights: 2, maxNights: 14 };

const getPriceForDate: GetPriceForDate = (date) => {
  const { day } = toJalali(date);
  const isWeekendRate = day % 7 === 0;
  return {
    amount: isWeekendRate ? 3_200_000 : 2_400_000,
    currency: 'IRR',
    label: isWeekendRate ? '3.2M' : '2.4M',
    availability: day === 13 ? 'full' : 'available',
  };
};

function fmtCurrency(amount: number, locale: PlaygroundLocale): string {
  const formatted = amount.toLocaleString('en-US');
  return locale === 'fa-IR' ? toPersianDigits(formatted) : formatted;
}

function fmtNum(value: number, locale: PlaygroundLocale): string {
  return locale === 'fa-IR' ? toPersianDigits(value) : String(value);
}

export function TravelSection({ locale }: { locale: PlaygroundLocale }) {
  const t = T[locale];
  const [range, setRange] = useState<DateRangeValue>({ from: null, to: null });
  const getDayMeta = useMemo(() => createPriceDayMeta(getPriceForDate), []);

  const summary =
    range.from && range.to && isRangeAvailable(range.from, range.to, RULES, getPriceForDate)
      ? computeRangePrice(range.from, range.to, getPriceForDate, RULES)
      : null;

  const isInvalidRange = Boolean(range.from && range.to && !summary);

  return (
    <Section id="travel" title={t.sections.travel}>
      <Panel title={t.sections.travel} description={t.travel.description} wide>
        <AvanDateRangePicker
          value={range}
          onChange={setRange}
          numberOfMonths={2}
          getDayMeta={getDayMeta}
        />
        <div className="meta">
          {summary ? (
            <>
              <strong>
                {fmtNum(summary.nights, locale)} {t.travel.nights}
              </strong>
              {t.travel.total}: {fmtCurrency(summary.totalPrice, locale)} {summary.currency}
            </>
          ) : isInvalidRange ? (
            <strong className="meta--warning">{t.travel.unavailable}</strong>
          ) : (
            t.none
          )}
        </div>
      </Panel>
    </Section>
  );
}
