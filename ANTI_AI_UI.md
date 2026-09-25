# Anti-AI-UI — Diliman Labs house style

Adapted from [Anti-AI-UI](https://github.com/Vanszs/Anti-AI-UI) to this codebase's actual
tokens (`src/styles/tokens.css`), components (`src/components/ui/*`) and brand (Diliman
Labs — ink `#141618` + signature yellow `#f7ec30`, Roboto). This is not a general design
philosophy doc — every rule below names the token, component or file that enforces it, so
a reviewer can check a PR against it mechanically.

If a rule here conflicts with a comment already in the code, the code comment wins — this
doc is a summary of decisions the tokens and components already encode, not a new spec
layered on top.

## 1. Non-negotiables

These are gates, not preferences. A PR that violates one of these doesn't ship regardless
of how it looks.

### Semantic HTML and accessible by default

- Every interactive element is a real `<button>`, `<a>`, `<input>`, `<select>` — never a
  `<div onClick>`. Check `src/components/ui/*.tsx`: every one wraps a native control.
- Every form control has a `<label>` (via the `label` prop on `Input`/`Select`/`Switch`/
  `Checkbox`) or an explicit `aria-label` when a visible label doesn't fit (see
  `SearchBar aria-label="Search the ledger"` in `_sections/transactions.tsx`).
- Icon-only buttons always carry `aria-label` (`styles.iconButton` in
  `dashboard/page.tsx` — refresh, notifications, account menu).
- Status and count changes that aren't user-initiated announce via `aria-live="polite"`
  (filter result counts in `_sections/merchants.tsx`, `_sections/channels.tsx`) or
  `role="status"` / `role="alert"` (`Alert`, `Toast`).
- Decorative elements (icons next to text, the brand rule `<span>`, the grain overlay) are
  `aria-hidden="true"`. A screen reader should never announce a bullet glyph or a swatch.

### Focus-visible rings

- `--focus-ring-color` (`tokens.css:126`) is set to `--accent-text`, never raw `--accent`
  — the reasoning is in the token file itself: a focus ring is a thin stroke, and raw
  yellow on a light surface is ~1.3:1, well under the 3:1 WCAG floor for a non-text UI
  indicator. `--accent-text` is the same hue darkened to clear that bar in light mode, and
  resolves back to pure yellow in dark mode where the contrast problem doesn't exist.
- Never author `outline: none` without also authoring a `:focus-visible` replacement.
  Every interactive component in `src/components/ui` gets its ring from the shared
  `--focus-ring-width` / `--focus-ring-offset` / `--focus-ring-color` triad — don't hand-roll
  a new one per component.

### `prefers-reduced-motion` gates every spatial animation

- `src/app/globals.css:201` already collapses every `animation-duration` and
  `transition-duration` to `0.01ms` under `@media (prefers-reduced-motion: reduce)`. This
  is a blanket gate — any new transition or animation added anywhere in the app inherits
  it automatically. **Do not** add a component-local transition that bypasses this (e.g. a
  raw CSS `@keyframes` driven by JS `requestAnimationFrame` timing rather than the
  `animation`/`transition` properties) without adding its own reduced-motion branch.
- "Spatial" means anything that moves, scales, rotates or slides a layout-affecting
  property. Opacity-only crossfades are lower-risk but still covered by the same gate for
  consistency.

### Radius follows the scale

- Five tokens, nothing else: `--radius-sm` (0.25rem), `--radius-md` (0.5rem), `--radius-lg`
  (0.75rem), `--radius-xl` (1rem), `--radius-full` (9999px) — `tokens.css:104-108`.
- No arbitrary Tailwind radius (`rounded-[10px]`), no hardcoded `border-radius: 14px` in a
  CSS module. Every radius in this codebase currently resolves through one of the five
  tokens (verified by audit below) — keep it that way.
- Match the radius to the element's weight, not to habit: `--radius-full` for pills/badges/
  avatars, `--radius-md` for buttons and inputs, `--radius-lg`/`--radius-xl` for cards and
  panels. Don't reach for `--radius-xl` on a 24px icon chip because it "looks softer."

### WCAG AA contrast — `--accent-text` / `--accent-edge` exist because of this

Raw `--accent` (the signature yellow, `#f7ec30`) is a **fill** color, not a text or stroke
color. Every contrast failure this kit hit during tokenization was the same shape: someone
put yellow where a computed contrast ratio mattered.

- **`--accent-text`** (`tokens.css:168`): the accent hue darkened via `color-mix` to
  `45%` accent / `55%` `--gray-1000` in light mode (5.00:1 against white — AA for 14px
  text), and the pure accent again in dark mode (yellow-on-near-black already clears AA).
  Use it for: accent-colored text, accent-colored icons on a light card, the focus ring,
  chart series-3 (the *one* legal way brand yellow enters a line chart — see
  `tokens.css:218-220`).
- **`--accent-edge`** (`tokens.css:174`): `--gray-950` in light mode, `transparent` in dark
  mode. A solid yellow fill's own boundary against white measures **1.24:1** — invisible.
  Every solid-yellow chip, badge or button in this kit (`QuickChip` in
  `_sections/transactions.tsx`, the `StatCard` icon chip, the sidebar's ink numeral) draws
  a 1px `--accent-edge` border so the shape reads on a light surface. On dark surfaces the
  yellow already clears 14.9:1 against `--gray-950`, so the edge collapses to nothing —
  don't force it back on.
- **Rule of thumb:** if yellow is the *fill*, it needs `--accent-edge`. If yellow is the
  *ink* (text, icon, thin stroke), it must be `--accent-text`, never raw `--accent`. Raw
  `--accent` is for fills only.
- This isn't theoretical: `--text-tertiary` itself was bumped from `--gray-600` (3.32:1,
  a live AA failure) to `--gray-700` (8.2:1) during tokenization — see the comment at
  `tokens.css:141`. Don't reintroduate a similar failure by hand-picking a gray.

## 2. Instant-death signatures — never reintroduce these

| Signature | Status here | Why it's banned |
|---|---|---|
| Purple/indigo/violet accents | N/A — brand is ink `#141618` + yellow `#f7ec30`. If you ever see a purple gradient in a PR against this repo, it's a copy-pasted AI default, not a design decision. | Purple-on-white gradient buttons are the single most recognizable "an LLM designed this" tell. |
| Inter-everywhere | N/A — this kit ships Roboto (`--font-sans`, `layout.tsx` loads `Roboto`/`Roboto_Mono` from `next/font/google`). Don't add Inter, Geist, or any other "safe default" typeface alongside it. | Inter is the other instant tell. Two fonts on a page (headline in one, body in another) with no rationale is worse than either alone. |
| Gradient `bg-clip-text` headlines | Banned outright. Every headline in this kit sets a solid `color: var(--text-primary)` (or scopes to `data-surface="accent"`/`"ink"` for a solid block, e.g. the yellow hero band in `dashboard/page.tsx`'s Transactions/Settings accent frame). | A gradient headline is decoration standing in for a hierarchy decision. This kit makes hierarchy with size, weight (`--weight-black` at `--text-4xl`/`--text-5xl`) and one full-bleed accent block per screen — not gradients. |
| Glassmorphism / `backdrop-blur` nav overuse | The kit *has* `--glass-bg`/`--glass-border`/`--glass-blur` and a `GlassPanel` component, but it is not used in the dashboard nav or topbar (`styles.topbar` in `ops.module.css` is an opaque surface). Reserve glass for a floating panel that must visually separate from scrollable content behind it (a command palette, a toast stack) — never for a persistent nav bar, where opacity costs nothing and blur costs a compositor pass on every scroll frame. | Every nav in every AI-generated SaaS demo is `backdrop-blur-md bg-white/70`. It's expensive, and on a payments console it makes numbers under the nav genuinely harder to read at a glance. |
| Uniform `rounded-2xl` everywhere | `rounded-2xl` doesn't exist in this codebase's radius scale (`--radius-xl` = 1rem is the largest token) — see the audit below, zero hits outside `node_modules`. Every element picks a radius from the 5-step scale (§1) matched to its weight. | Uniform large radii on every card/button/input flattens hierarchy — a search input and a hero stat card end up reading as the same "weight" of object. |
| `hover:scale-105` on cards | Zero hits on interactive cards. `StatCard`/`Card` use `interactive` prop for a border/shadow change, not a scale transform (`card.tsx`). The one scale transform in the kit (`media-card.tsx`'s `group-hover:scale-[1.04]`) is on the *photo* inside a media card, not the card shell, is gated by the global reduced-motion rule, and the component isn't used on the dashboard or home page — left as-is (see audit). | Scaling an entire card on hover is layout-affecting, motion-sick-inducing at scale, and communicates nothing that a border/shadow/color change doesn't already say more cheaply. |
| Emoji icons | Zero hits in shipped surfaces. This kit uses `@phosphor-icons/react/ssr` exclusively — every icon in `dashboard/page.tsx`, every section, every UI component imports from `@phosphor-icons/react/ssr`, sized and weighted explicitly (`size={16} weight="regular"`). | Emoji render inconsistently across OS/browser, can't inherit `currentColor`, can't be sized to a token, and read as placeholder content in a financial product. |
| Hype copy ("Supercharge," "Unlock," "Seamless," "Revolutionize") | Zero hits across `src/app/page.tsx` and the dashboard. Copy in this kit is plain and specific: "Reset preferences," "Retry payment," "60 payments in the sample, 21–27 Aug 2026." | A payments operator reading "Supercharge your reconciliation workflow" over a table of failed transfers is being sold to, not informed. Say what the control does. |

## 3. Anti-monotony rules

Applied to a payments dashboard, "vary the rhythm" means specific, checkable things:

- **Not every panel is a bordered card of the same size.** The Ops Console's accent band
  (`styles.accentBand` in `ops.module.css`, used by Transactions/Settings/Channels) is a
  full-bleed `data-surface="accent"` strip with no card border — it's visually distinct
  from the `Card`-wrapped filter row and table below it precisely so the screen doesn't
  read as a stack of identical boxes.
- **One dominant element per section.** Each section has exactly one full-bleed yellow
  block (`data-surface="accent"`) — never two. The chooser page's hero comment says it
  directly: *"THE one full-bleed yellow block on this screen. A second would flatten the
  hierarchy rather than double the brand."* Apply the same discipline to every new section:
  before adding a second accent block, ask what it's competing with.
- **One hero metric reads larger than its neighbors.** `StatCard`'s value renders at
  `--text-4xl` with `--weight-black` — heavier than any other text on the page. Don't add
  a second stat row at the same size competing for the same "most important number" slot;
  if a section needs two headline figures, size them differently (see the Transactions
  accent band, where "Gross volume" and "Success rate" sit at the same size *inside one
  strip* rather than as two competing hero cards).
- **Asymmetric moments, deliberately placed.** The ink sidebar (`data-surface="ink"`) is
  the single largest black block on the screen — an intentional asymmetry against the
  light canvas, not a symmetric two-tone split. When adding a new full-width section,
  resist making it the same padding/width as its neighbor by default; check whether it's
  actually competing for the same attention level.
- **Section padding and max-width vary by content, not by a fixed template.** The Ops
  Console's `SectionFrame` gives every section the same *header* shape (eyebrow, title,
  description, actions) but the *content* is free to break that rhythm — the Transactions
  accent band spans full width, the Settings tabs constrain to the card width, the
  Channels table sits `padded={false}` so the table's own padding controls the edge.

## 4. Dashboard-specific patterns (Ops Console)

- **App shell with a persistent sidebar.** `dashboard/page.tsx`'s `<aside data-surface="ink">`
  is present on every section, never remounted per-route (this is a single client
  component with section state, not per-section pages) — nav state, the "Needs review"
  summary, and the command palette trigger stay put as the operator moves between
  sections.
- **KPI cards with delta inversion.** `StatCard` (`src/components/ui/stat-card.tsx`) maps
  `direction: "up"` to `var(--success)` and `direction: "down"` to `var(--danger)`
  unconditionally — there is no metric-specific override inside the component. That's
  correct for volume/count/net (a rise is good) but would be **backwards** for a metric
  where a rise is bad news, e.g. "failed transactions." The caller owns polarity: the
  Overview section's "Failed transfers" card (`_sections/overview.tsx`) explicitly passes
  `direction="flat"` for this exact reason — the inline comment there says it plainly:
  *"StatCard paints 'up' green and 'down' red, which inverts for a failure count — a drop
  is good news. Rather than paint a fall red or fake a rise, the delta stays uncolored and
  the caption carries the reading."* That's the house pattern: for an inverted metric,
  don't fight the component by forcing the opposite color (which risks reading as a
  literal, wrong direction arrow) — go neutral and let the caption state the actual
  reading in words. Follow the same rule for any new inverted metric (chargeback rate,
  dispute count, churn).
- **Filters above data tables.** Every table-bearing section (Transactions, Merchants,
  Channels, Settlements) puts its filter row in a `Card` immediately above the table, never
  beside or below it. Filters use the existing simple primitives — `NativeSelect`,
  `SearchBar`, `ToggleGroup` — never a custom filter panel per section.
- **Sortable, paginated tables.** `Table` (`src/components/ui/table.tsx`) takes
  `sortValue`/`sortable` per column; `LedgerTable` and the Merchants/Channels tables all
  use it rather than re-sorting in a `useMemo` with bespoke comparator UI. Transactions is
  the one section large enough (60 rows) to need real pagination (`Pagination` component);
  don't add pagination to a 12-row Channels table where it would just add clicks for no
  reason — a full unpaginated table is the right choice below roughly 20-30 rows.
- **Every interactive state is documented, not implied.** Loading (`SectionFrame`'s
  skeleton), failed (`SectionFrame`'s `CloudWarning` empty state with retry), empty-filtered
  (`EmptyState` with a "clear filters" action), and empty-by-construction (`EmptyState` with
  a "refresh" action) are all distinct, explicit states per section — never a bare blank
  `<div>` when a table has zero rows.

## 5. Do this / Don't that

| Do | Don't |
|---|---|
| Use `--accent-text` for yellow text, icons, and the focus ring | Set `color: var(--accent)` on text — it's a fill token, not a text-safe token |
| Give a solid-yellow fill a `--accent-edge` border when it sits on a light surface | Leave a yellow chip/badge edgeless on white — 1.24:1 contrast |
| Pick radius from the 5-token scale by element weight | Reach for `--radius-xl` on everything because it "looks nice" |
| One full-bleed accent block per section | Two accent blocks competing for attention on one screen |
| Size the one hero metric at `--text-4xl`/`--weight-black` | Give every stat card the same visual weight |
| Border/shadow change on `Card interactive` hover | `hover:scale-105`/`scale-[1.04]` on a whole card |
| Import icons from `@phosphor-icons/react/ssr`, sized and weighted explicitly | Drop in an emoji as a stand-in icon |
| Write copy that names the action ("Retry payment," "Reset preferences") | Write copy that sells the action ("Seamlessly supercharge your workflow") |
| Gate every transition through the existing `prefers-reduced-motion` block | Add a component-local animation that bypasses the global gate |
| Pass `direction="flat"` on a `StatCard` for an inverted metric and state the reading in the caption | Force `direction="down"`/`"up"` against an inverted metric just to get a color, or trust the auto-inferred `+`/`-` sign blindly |
| Filters in a `Card` directly above the table they filter | A bespoke filter sidebar or floating filter panel per section |
| Keep the sidebar and topbar persistent across every dashboard section | Remount chrome per-route, losing nav/scroll state on every click |

## 6. Audit performed against this doc

Ran at the time this doc was written, against `src/` (excluding `node_modules`):

- `rounded-2xl` — **0 hits.** Radius scale tops out at `--radius-xl` (1rem); nothing in the
  codebase reaches for a larger arbitrary radius.
- `hover:scale` — **2 hits**, both reviewed:
  - `nav.tsx`: `group-hover:scale-x-100` on a 1px underline indicator (`origin-left`,
    horizontal-only) — not a card scale, this is the standard "grow an underline from the
    left" nav treatment. Not a violation.
  - `media-card.tsx`: `group-hover:scale-[1.04]` on the photo *inside* a media card, gated
    by the global reduced-motion rule. `MediaCard` is a kit component not currently used by
    `src/app/page.tsx` or any file under `src/app/dashboard` — left as-is rather than
    rewritten, per the scope of this pass (kit library components not in the shipped
    dashboard/home surface). Flagging here so it isn't missed if `MediaCard` is adopted
    later — if it ships on the dashboard or home page, swap the scale for a border/overlay
    treatment consistent with `StatCard`/`Card`.
- `backdrop-blur` — **0 hits.** `--glass-*` tokens and `GlassPanel` exist but are unused
  outside their own docs/story page; the dashboard nav and topbar are opaque surfaces.
- `bg-clip-text` — **0 hits.**
- Hype copy (`Supercharge`/`Unlock`/`Seamless`/`Revolutionize`, case-insensitive) —
  **0 hits** in `src/app/page.tsx` or `src/app/dashboard/**`.
- Emoji characters — **0 hits** in `src/app/page.tsx`, `src/components/ui/*.tsx`, or
  `src/app/dashboard/**`. Icons are `@phosphor-icons/react/ssr` throughout.
- `StatCard` delta inversion — verified `src/components/ui/stat-card.tsx` maps
  `down → var(--danger)` / `up → var(--success)` unconditionally (no metric-specific
  override needed at the component level; callers own polarity via the `direction` prop —
  see §4).

No violations required a code fix in the shipped dashboard/home surface at the time of
this audit. The one flagged item (`media-card.tsx`'s hover scale) is a kit-library
component outside the currently-shipped dashboard/home surface, documented above rather
than modified, consistent with this project's instruction to prioritize the product
surface over the ~90-page component doc/story library under `src/app/docs/*`.
