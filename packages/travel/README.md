# @avan-persian/travel

![Avan Persian Date Picker](https://raw.githubusercontent.com/danial-riazati/avan-persian-date-picker/main/assets/avan-banner-fa.jpg)

Pricing, availability, and booking-rule helpers for travel/hotel/e-commerce date-selection UIs,
built to plug straight into [`@avan-persian/react`](https://www.npmjs.com/package/@avan-persian/react)'s
`AvanCalendar#getDayMeta`.

## Install

```bash
pnpm add @avan-persian/travel
```

## Quick example

```ts
import { createPriceDayMeta, computeRangePrice, isRangeAvailable } from '@avan-persian/travel';
import { AvanDateRangePicker } from '@avan-persian/react/client';

const getPriceForDate = (date: Date) => ({
  amount: date.getDay() === 5 ? 3_200_000 : 2_400_000,
  currency: 'IRR',
});

const rules = { minNights: 2, maxNights: 14 };

<AvanDateRangePicker getDayMeta={createPriceDayMeta(getPriceForDate)} />;

isRangeAvailable(checkIn, checkOut, rules, getPriceForDate); // boolean
computeRangePrice(checkIn, checkOut, getPriceForDate, rules); // { nights, totalPrice, ... }
```

`validateTravelRange` throws a descriptive `TravelRangeError` for invalid bookings (too short/long,
disabled night, wrong check-in weekday, no availability) — useful for form validation messages.

## Docs

Full recipe: [documentation/recipes.md](https://github.com/danial-riazati/avan-persian-date-picker/blob/main/documentation/recipes.md#travel--hotel-booking-calendar)

## License

MIT © [Danial Riazati](https://github.com/danial-riazati)
