# @avan-persian/themes

Design tokens and CSS themes for [Avan Persian Date Picker](https://github.com/danial-riazati/avan-persian-date-picker)
— plain CSS custom properties, dark mode, the Estedad Persian font, and a Tailwind CSS preset. No
CSS-in-JS runtime, no build step required.

## Install

```bash
pnpm add @avan-persian/themes
```

## Usage

```ts
import '@avan-persian/themes/default.css'; // required — design tokens
import '@avan-persian/themes/dark.css'; // optional — dark palette, toggled via <AvanProvider colorScheme>
import '@avan-persian/themes/fonts.css'; // optional — bundles the Estedad variable font
```

### Tailwind CSS preset

```ts
// tailwind.config.ts
import avanPreset from '@avan-persian/themes/tailwind';

export default {
  presets: [avanPreset],
  // ...
};
```

Exposes `bg-avan-accent`, `text-avan-accent`, `border-avan-border`, `rounded-avan`, and
`w-avan-day`/`h-avan-day` utilities backed by the same `--avan-*` CSS variables used by the
calendar, so surrounding UI stays visually consistent.

## Docs

Full guide: [documentation/theming.md](https://github.com/danial-riazati/avan-persian-date-picker/blob/main/documentation/theming.md)

## License

MIT © [Danial Riazati](https://github.com/danial-riazati)
