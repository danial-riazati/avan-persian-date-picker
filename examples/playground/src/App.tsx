import { useState } from 'react';
import { AvanProvider } from '@avan/react/client';
import { Toolbar, type ColorScheme } from './components/Toolbar';
import { SelectionModesSection } from './sections/SelectionModesSection';
import { TimeSection } from './sections/TimeSection';
import { ConstraintsSection } from './sections/ConstraintsSection';
import { CustomRenderingSection } from './sections/CustomRenderingSection';
import { TravelSection } from './sections/TravelSection';
import { DeliverySection } from './sections/DeliverySection';
import { HolidaysSection } from './sections/HolidaysSection';
import { T, type PlaygroundLocale } from './strings';

const NAV_SECTIONS = [
  ['modes', 'modes'],
  ['time', 'time'],
  ['constraints', 'constraints'],
  ['custom-rendering', 'customRendering'],
  ['travel', 'travel'],
  ['delivery', 'delivery'],
  ['holidays', 'holidays'],
] as const;

export default function App() {
  const [locale, setLocale] = useState<PlaygroundLocale>('fa-IR');
  const [dir, setDir] = useState<'rtl' | 'ltr'>('rtl');
  const [colorScheme, setColorScheme] = useState<ColorScheme>('light');

  const t = T[locale];

  return (
    <AvanProvider
      dir={dir}
      locale={locale}
      colorScheme={colorScheme}
      theme={{ fontFamily: "'Estedad', system-ui, sans-serif" }}
    >
      <main className="page" dir={dir}>
        <Toolbar
          locale={locale}
          onLocaleChange={setLocale}
          dir={dir}
          onDirChange={setDir}
          colorScheme={colorScheme}
          onColorSchemeChange={setColorScheme}
        />

        <section className="hero">
          <span className="badge">Avan Playground</span>
          <h1>{t.title}</h1>
          <p>{t.subtitle}</p>
          <nav className="hero__nav" aria-label="Sections">
            {NAV_SECTIONS.map(([id, key]) => (
              <a key={id} href={`#${id}`}>
                {t.sections[key]}
              </a>
            ))}
          </nav>
        </section>

        <SelectionModesSection locale={locale} />
        <TimeSection locale={locale} />
        <ConstraintsSection locale={locale} />
        <CustomRenderingSection locale={locale} />
        <TravelSection locale={locale} />
        <DeliverySection locale={locale} />
        <HolidaysSection locale={locale} />
      </main>
    </AvanProvider>
  );
}
