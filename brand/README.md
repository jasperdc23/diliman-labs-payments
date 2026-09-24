# Brand assets

This folder is where your actual brand gets layered on top of the
brandless foundation in `src/styles/tokens.css`.

| Folder / file      | Purpose                                                    |
| ------------------ | ----------------------------------------------------------- |
| `logos/`            | Logo lockups, wordmark, icon, favicon source files          |
| `fonts/`             | Licensed brand font files (woff2) and their `next/font` setup |
| `BRAND_VOICE.md`    | Tone, copy standards, terminology                            |

## How to apply branding once defined

1. **Colors** — replace the primitive and accent values in
   `src/styles/tokens.css`. Keep the semantic layer (`--surface`,
   `--text-primary`, etc.) pointing at primitives; don't hardcode brand
   colors anywhere else.
2. **Fonts** — drop licensed font files in `brand/fonts/`, load them via
   `next/font/local` in `src/app/layout.tsx`, and point `--font-sans` /
   `--font-mono` at the new font variables.
3. **Logos** — drop SVG/PNG lockups in `brand/logos/`, reference from
   `public/` as needed for favicons and the app header.
4. **Voice & copy** — fill in `BRAND_VOICE.md`.

Nothing in `src/components` or `src/app` should need to change structurally
when branding lands — only token values and font/logo references.
