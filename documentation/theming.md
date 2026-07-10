# Theming

Avan ships plain CSS with design tokens as CSS custom properties — no CSS-in-JS runtime, no
build step required, and no lock-in to a particular styling library.

## 1. Import a base theme

```ts
import '@avan/themes/default.css';
```

This sets every `--avan-*` variable on the `.avan-root` class rendered by `<AvanProvider>`
(colors, spacing, radii, font, shadows, breakpoints).

## 2. Dark mode

Import the dark stylesheet alongside the default one:

```ts
import '@avan/themes/default.css';
import '@avan/themes/dark.css';
```

Then control which palette is active via `<AvanProvider colorScheme>`:

```tsx
<AvanProvider colorScheme="light">  {/* always light */}
<AvanProvider colorScheme="dark">   {/* always dark */}
<AvanProvider colorScheme="system"> {/* follows prefers-color-scheme automatically */}
```

`colorScheme="dark"` sets `data-theme="dark"` on the root element (matched by `dark.css`);
`colorScheme="system"` sets `data-color-scheme="system"` and relies on an
`@media (prefers-color-scheme: dark)` rule inside `dark.css`, so it updates live if the OS theme
changes — no JavaScript listener needed.

## 3. Override individual tokens

All tokens are just CSS variables — override them anywhere `.avan-root` cascades, e.g. in your
global stylesheet:

```css
.avan-root {
  --avan-accent: #16a34a;
  --avan-accent-foreground: #ffffff;
  --avan-day-radius: 999px; /* fully round day cells */
  --avan-day-size: 2.75rem;
}
```

Or per-instance via the `theme` prop on `<AvanProvider>` or any individual component:

```tsx
<AvanProvider
  theme={{
    accent: '#16a34a',
    accentForeground: '#ffffff',
    radius: '999px',
    daySize: '2.75rem',
    fontFamily: "'Vazirmatn', sans-serif",
    extra: { '--avan-shadow': 'none', '--avan-holiday-dot': '#f97316' },
  }}
>
  {children}
</AvanProvider>
```

`theme.extra` accepts **any** `--avan-*` variable (or arbitrary custom properties), so every
token listed below is themeable even without a dedicated `AvanTheme` field.

### Full token reference

| Variable                                         | Default (light)    | Purpose                                     |
| ------------------------------------------------ | ------------------ | ------------------------------------------- |
| `--avan-font-family`                             | Estedad, system-ui | Base font stack                             |
| `--avan-accent`                                  | `hsl(210 90% 50%)` | Selected day, focus rings, primary actions  |
| `--avan-accent-foreground`                       | `hsl(0 0% 100%)`   | Text on top of `--avan-accent`              |
| `--avan-muted`                                   | `hsl(210 20% 96%)` | Weekend/secondary backgrounds               |
| `--avan-muted-foreground`                        | `hsl(210 10% 40%)` | Secondary text                              |
| `--avan-border`                                  | `hsl(210 16% 90%)` | Dividers, input borders                     |
| `--avan-background` / `--avan-foreground`        | white / near-black | Root background & text                      |
| `--avan-day-radius`                              | `0.5rem`           | Day cell corner radius                      |
| `--avan-day-size`                                | `2.5rem`           | Day cell width/height                       |
| `--avan-calendar-max-width`                      | `24rem`            | Single-month width cap                      |
| `--avan-calendar-2-max-width` / `-4-max-width`   | `42rem` / `62rem`  | 2- and 4-month width caps                   |
| `--avan-calendar-padding`                        | `1rem`             | Outer padding                               |
| `--avan-calendar-grid-gap`                       | `0.35rem`          | Gap between day cells                       |
| `--avan-calendar-nav-size`                       | `2rem`             | Prev/next button size                       |
| `--avan-holiday-dot` / `--avan-holiday-dot-size` | red / `0.35rem`    | Holiday indicator dot                       |
| `--avan-weekend-muted`                           | `hsl(210 15% 94%)` | Weekend cell background                     |
| `--avan-range-middle`                            | `hsl(210 90% 95%)` | Background for days between range start/end |
| `--avan-disabled-opacity`                        | `0.4`              | Opacity applied to disabled days            |
| `--avan-shadow`                                  | soft drop shadow   | Popover elevation                           |
| `--avan-popover-z-index`                         | `1000`             | Popover stacking order                      |

The stylesheet also defines responsive overrides for these tokens at tablet/mobile breakpoints
— override the variables in a more specific media query if you need different responsive
behavior.

## 4. Tailwind CSS

A small Tailwind v4 preset maps a few tokens into Tailwind's theme so you can use them with
utility classes elsewhere in your app:

```ts
// tailwind.config.ts
import avanPreset from '@avan/themes/tailwind';

export default {
  presets: [avanPreset],
  // ...
};
```

This exposes `bg-avan-accent`, `text-avan-accent`, `border-avan-border`, `rounded-avan`, and
`w-avan-day`/`h-avan-day` utilities backed by the same CSS variables, so custom surrounding UI
(labels, buttons, cards) stays visually consistent with the calendar without duplicating colors.

## 5. Fully custom stylesheet

`@avan/themes/default.css` and `dark.css` only set variables — the structural CSS (layout, grid,
animations) lives in a separate stylesheet, `@avan/react/client.css`, which you must import
explicitly (it is **not** injected automatically just by importing components):

```ts
import '@avan/react/client.css';
```

You never need to import `@avan/themes` at all if you'd rather define every `--avan-*` variable
yourself; just make sure your own stylesheet is loaded after `@avan/react/client.css` so your
overrides win.

## 6. Reduced motion & high contrast

Animations respect `prefers-reduced-motion: reduce` automatically. Set
`disableAnimation` on `AvanCalendar`/any picker to force-disable transitions regardless of the
OS setting. High-contrast/forced-colors mode (`forced-colors: active`, e.g. Windows High
Contrast) is also handled out of the box with borders/outlines that don't rely on color alone.
