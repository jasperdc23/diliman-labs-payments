# Design principles — EP Design Kit

This repo is a UI design kit, not a typical app — read/write here is almost
entirely UI/UX work. These rules exist to keep that work from drifting into
generic, ungoverned "AI slop" UI: interfaces that look plausible in a
screenshot but don't actually serve the person using them. Apply these
before generating any screen, component, or example page, alongside (never
instead of) `.ai/company/` and `.ai/department/`.

Full write-up for humans: `/docs/principles` in the running app. This file
is the enforceable version for AI-assisted work in this repo specifically.

## The rules

1. **Visual hierarchy is not optional.** Every screen has exactly one thing
   it most wants the viewer to see or do. Type scale, weight, spacing, and
   color must make that thing obvious at a glance — not applied uniformly
   because a heading token exists. If two elements compete for attention,
   that's a bug, not a style choice.

2. **Never a dead end.** Every state a screen can be in — empty, error,
   loading, "no results," a confirmation — offers a way back or a next
   step. `EmptyState` (`src/components/ui/empty-state.tsx`) enforces this
   at the type level; anything that renders an end state without one is
   wrong, full stop, not a judgment call.

3. **Effects support hierarchy, they never substitute for it.** `.glass`,
   `.grain`, `.mesh`, shadows, motion — all of it exists to reinforce
   structure the layout already has. If removing every visual effect from
   a screen makes it confusing rather than merely less pretty, the
   hierarchy was missing to begin with and no effect will fix that.

4. **Copy states what happens, never decorates.** A button says the action
   ("Delete payout method," not "Confirm"). A heading says what the
   section is, not a tagline. No lorem ipsum, no placeholder copy left in
   anything presented as finished. If real copy isn't known yet, write
   copy that is honestly a placeholder-shaped question, not filler that
   reads as intentional.

5. **Motion communicates state, never personality.** Follows `/docs/motion`
   exactly: transform/opacity/color only, nothing on page load, one
   micro-interaction per element. Motion added because it looks impressive
   rather than because it answers "what just happened here" is the
   single most common AI-slop tell — don't add it.

6. **Reuse before inventing.** Check `src/components/ui/` and the existing
   `/docs` and `/examples` pages before creating a new pattern. A new card
   variant, a new spacing value, or a new interaction pattern per screen is
   how a kit stops being a kit. If an existing component is close but not
   quite right, extend it or ask — don't fork silently.

7. **Judge the flow, not the frame.** A screen that looks resolved in
   isolation but doesn't connect to what comes before or after it (no back
   path, an orphaned success state, a form with no way to see what you
   just submitted) is a failure even if every individual screen is
   polished. Check the screen before and after, not just the one being
   built.

8. **Delight comes from clarity, not decoration.** The goal is an interface
   that feels considerate — sensible defaults, empty states that suggest
   the next action, errors that explain what to do about them — not one
   that looks striking in a static screenshot. If a choice trades
   understandability for visual novelty, don't make it.

## Before shipping any new screen or component, check

- Can a first-time viewer tell what this screen wants them to do, in
  under two seconds?
- Does every possible state (empty/error/loading/success) lead somewhere?
- Would this still work with every glass/grain/shadow effect stripped out?
- Does every label say the specific thing it does, with no filler?
- Is anything animating that doesn't need to?
- Does this reuse an existing component/pattern, or is it inventing one
  that already has a near-equivalent elsewhere in the kit?
