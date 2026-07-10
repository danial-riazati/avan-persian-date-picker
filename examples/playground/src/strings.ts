export type PlaygroundLocale = 'fa-IR' | 'en-IR';

export const T = {
  'fa-IR': {
    title: 'تقویم و انتخابگر تاریخ آوان',
    subtitle:
      'دموی تعاملی برای Avan Persian Date Picker — تقویم جلالی، اعداد فارسی در حالت راست‌به‌چپ، و تعطیلات رسمی ایران در همه‌ی تقویم‌ها.',
    themeLabel: 'پوسته',
    themeLight: 'روشن',
    themeDark: 'تاریک',
    themeSystem: 'سیستم',
    localeLabel: 'زبان',
    dirLabel: 'جهت',
    dirRtl: 'راست‌به‌چپ',
    dirLtr: 'چپ‌به‌راست',
    selectedLabel: 'انتخاب‌شده',
    fromLabel: 'از',
    toLabel: 'تا',
    none: '—',
    sections: {
      modes: 'حالت‌های انتخاب',
      time: 'انتخاب زمان',
      constraints: 'محدودیت‌ها',
      customRendering: 'رندر سفارشی',
      travel: 'رزرو سفر و قیمت‌گذاری',
      delivery: 'زمان‌بندی تحویل',
      holidays: 'تعطیلات رسمی ۱۴۰۴ تا ۱۴۰۶',
    },
    modes: {
      single: 'تک تاریخ',
      range: 'بازه تاریخ',
      multiple: 'چند تاریخ',
      multiRange: 'چند بازه',
      week: 'هفته',
      month: 'ماه',
      year: 'سال',
    },
    travel: {
      description:
        'قیمت هر شب و ظرفیت باقی‌مانده با getDayMeta روی تقویم نمایش داده می‌شود؛ قوانین رزرو (حداقل/حداکثر شب، روزهای کاری) با @avan-persian/travel اعتبارسنجی می‌شود.',
      nights: 'شب',
      total: 'جمع',
      unavailable: 'این بازه در دسترس نیست یا قوانین رزرو را نقض می‌کند.',
    },
    custom: {
      description:
        'با getDayMeta و components.DayContent می‌توانید نشان‌ها و محتوای دلخواه به هر روز اضافه کنید.',
      startOfMonth: 'شروع ماه',
      milestone: 'روز نمادین',
    },
    delivery: {
      description: 'روزهای گذشته و تعطیلات رسمی غیرفعال است؛ سریع‌ترین زمان تحویل نشانه‌گذاری شده.',
      fastest: '⚡ سریع‌ترین',
    },
    holidaysIntro: (count: string) =>
      `مجموعه داده‌های تعبیه‌شده (${count} تاریخ). تقویم‌ها این‌ها را خودکار بار می‌کنند — بدون نیاز به prop مربوط به holidays.`,
    officialDays: (count: string) => `${count} روز رسمی (تعطیلات رسمی)`,
  },
  'en-IR': {
    title: 'Avan Persian Date Picker',
    subtitle:
      'Interactive demo for Avan Persian Date Picker — the Jalali calendar, Persian digits in RTL, and Iran official holidays built into every calendar.',
    themeLabel: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'System',
    localeLabel: 'Language',
    dirLabel: 'Direction',
    dirRtl: 'RTL',
    dirLtr: 'LTR',
    selectedLabel: 'Selected',
    fromLabel: 'From',
    toLabel: 'To',
    none: '—',
    sections: {
      modes: 'Selection modes',
      time: 'Time selection',
      constraints: 'Constraints',
      customRendering: 'Custom rendering',
      travel: 'Travel booking & pricing',
      delivery: 'Delivery slot scheduling',
      holidays: 'Official holidays 1404–1406',
    },
    modes: {
      single: 'Single date',
      range: 'Date range',
      multiple: 'Multiple dates',
      multiRange: 'Multiple ranges',
      week: 'Week',
      month: 'Month',
      year: 'Year',
    },
    travel: {
      description:
        'Nightly price & remaining capacity are shown on the calendar via getDayMeta; booking rules (min/max nights, business-days-only) are validated with @avan-persian/travel.',
      nights: 'nights',
      total: 'Total',
      unavailable: 'This range is unavailable or violates a booking rule.',
    },
    custom: {
      description:
        'Use getDayMeta and components.DayContent to attach badges and custom content to any day.',
      startOfMonth: 'Start of month',
      milestone: 'Milestone day',
    },
    delivery: {
      description:
        'Past days and official holidays are disabled; the fastest delivery day is badged.',
      fastest: '⚡ Fastest',
    },
    holidaysIntro: (count: string) =>
      `Bundled datasets (${count} dates). Calendars load these automatically — no "holidays" prop required.`,
    officialDays: (count: string) => `${count} official day(s)`,
  },
} as const;
