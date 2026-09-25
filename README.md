# Diliman Labs Payments

Payments monitoring and management. Forked from a brandless design kit, with the
Diliman Labs brand applied through tokens.

The dashboard lives at `/dashboard`. `/docs` is the inherited component
documentation, kept as a working reference for what's available to build with.

## Brand

| Element     | Value                                                                    |
| ----------- | ------------------------------------------------------------------------ |
| Accent      | `#f7ec30` — filled surfaces only; needs ink text on top                  |
| Ink         | `#141618` — `--gray-950`, the base for dark surfaces                     |
| Accent text | Darkened accent in light mode, pure yellow in dark — see `--accent-text` |
| Type        | Roboto 300/400/500/600/700/900, Roboto Mono for code                     |
| Logo        | `public/brand/` — ink variant plus a white variant for dark surfaces     |
| Imagery     | Dark, high-contrast, grainy; yellow as blocking, never a tint            |

Yellow is bright enough that it can't carry text or thin strokes on a light
surface (~1.3:1 against white). So `--accent` is for filled backgrounds, and
`--accent-text` is the token for anything drawn as text, an icon, a focus ring,
or a hairline — it darkens the same hue in light mode and resolves back to pure
yellow in dark mode.

## Auth (prototype)

`/dashboard` is gated by a hand-rolled, prototype-grade session — no auth library, no
database. `src/proxy.ts` (Next 16's renamed `middleware.ts`) redirects unauthenticated
requests to `/login` and signed-in requests away from `/login`, reading a session cookie
signed with HMAC-SHA256 (`src/lib/auth/session.ts`, Node's built-in `crypto`). This is
enough to demonstrate real route protection; it is not a production auth system (single
hardcoded demo user, no password hashing, no revocation).

**Demo login:**

| Field    | Value                                                    |
| -------- | --------------------------------------------------------- |
| Email    | `demo@dilimanlabs.ph`                                      |
| Password | `DilimanLabs!2026`                                         |

Override both via `DEMO_USER_EMAIL` / `DEMO_USER_PASSWORD` env vars in any shared
environment. Set `SESSION_SECRET` too — without it, `src/lib/auth/session.ts` falls back
to a clearly-marked dev-only secret and logs a warning on every server start; that fallback
is fine for `next dev` on a laptop and not fine anywhere else.

## Run it

```bash
npm install
npm run dev         # documentation site at localhost:3000
npm run storybook   # component workbench at localhost:6006
```

The documentation site is the primary reference — live examples, copyable
snippets, and props tables for every component. Storybook is the workbench for
building components in isolation.

## Structure

```
src/
  styles/tokens.css       # every design token — the single source of truth
  app/
    globals.css           # Tailwind aliases + glass / mesh / grain utilities
    page.tsx              # landing page
    docs/                 # the documentation site
  components/
    ui/                   # the component library
    docs/                 # the shell the docs pages are built from
    theme-provider.tsx    # next-themes wrapper
brand/
  README.md               # how to layer branding on top
  BRAND_VOICE.md          # tone, copy standards, terminology (TBD)
  logos/, fonts/          # brand assets go here when defined
```

## The one rule

Never hardcode a value. Reference a token, and if none fits, add a step to the
scale rather than writing a one-off. Theming, dark mode, and the brand swap all
work through that indirection — the moment a component hardcodes a color or a
pixel value, all three silently break for that component only.

## Tokens

Three layers, in `src/styles/tokens.css`:

1. **Primitives** — raw values, no meaning (`--gray-0`…`--gray-1000`, `--accent-300`…`--accent-600`)
2. **Semantic** — meaning attached, theme-aware (`--surface`, `--text-primary`, `--accent`)
3. **Tailwind aliases** — the semantic layer as utilities, via `@theme inline` in `globals.css`

Components only ever reference layers 2 and 3.

## Adding a brand color

```css
:root {
  --accent-500: #6955ed;  /* light mode base — must clear white text */
  --accent-600: #5843d1;  /* light mode hover, one step darker */
  --accent-400: #8c7cf7;  /* dark mode base — must clear dark text */
  --accent-300: #a79bfa;  /* dark mode hover, one step lighter */
}
```

Buttons, focus rings, links, selected states and chart series all follow. See
`/docs/theming` for the full guide, and `brand/README.md` for fonts, logos and
voice.

## What's settled and what isn't

**Settled:** token architecture, spacing and radius scales, motion rules, the
component set, accessibility patterns.

**Open:** brand color, typeface, logo, voice. All placeholders. The kit is
structured so these land as token and asset swaps rather than a rewrite — but
nothing here should be read as final brand identity.

## Dependencies

Two beyond the framework: `next-themes` for theme persistence and
`@phosphor-icons/react` for icons. Charts are hand-rolled SVG rather than a
charting library.
