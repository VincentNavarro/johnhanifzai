# CLAUDE.md

Instructions for Claude Code when working in this repo.

## What this is

A single-page site: one image centered on the screen, with a small set of links
arranged around it. That's the whole app. There is no router, no backend, no
database, no auth, and no second page.

Treat "keep it small" as a hard requirement. If a change adds a dependency or a
layer of abstraction, it's probably wrong.

## Principles

- **No guessing — check.** Don't assume how a package, browser API, or piece
  of this code behaves. Verify against the real code, a real browser, or the
  docs before asserting it, and before saying a change is done.
- **Accessibility-driven.** Build to WCAG 2.1 AA as a baseline, not a pass at
  the end. The focus, tap-target, and alt-text rules in Quality floor below
  are the concrete floor this implies, not the whole of it.
- **Responsive on all devices.** Think phone through ultrawide, not just the
  one viewport you happen to be looking at. Actually check the breakpoints in
  Quality floor, don't eyeball it.

## Stack

- Vite
- React + TypeScript
- Tailwind CSS v4 (via `@tailwindcss/vite`, imported with `@import "tailwindcss"`)
- Deployed on Vercel

Do not add a state library, a UI component library, a CSS-in-JS runtime, or an
animation library. Plain CSS transitions are enough.

## Commands

```bash
npm run dev       # local dev server
npm run build     # production build -> dist/
npm run preview   # serve the built output locally
```

Always run `npm run build` before saying a change is done — a type error that
only shows up at build time still breaks the Vercel deploy.

## Structure

```
public/            # static assets served as-is (favicon, og image)
  fonts/           # web font files actually shipped to the site (.woff2)
src/
  main.tsx         # entry, mounts App
  App.tsx          # the whole page
  index.css        # tailwind import + any custom properties
  links.ts         # the link data, edited by hand
  assets/          # the center image, imported by src/
  hooks/           # small DOM-effect hooks (e.g. the image's mouse repel)
index.html         # title, meta, og tags live here
fonts-original/    # source .otf/.ttf as given, not shipped — kept in case a
                   # non-web format is ever needed again; public/fonts/ is
                   # the lossless woff2 conversion of these, used by the site
```

File names in `public/fonts/` and `fonts-original/` are kebab-case
(`family-name-weight.ext`), matching the font's own internal family/style
name — check the name table rather than guessing at word breaks when adding
a new one:

```bash
fonttools ttx -t name -o - path/to/font.otf | grep -A1 'nameID="1"'
```

Links live in `src/links.ts` as a typed array so adding or removing one is a
one-line data edit, never a JSX edit:

```ts
export type Link = { label: string; href: string }
export const links: Link[] = [ /* ... */ ]
```

Array order is visual order, top to bottom. Links are text labels only — no
icons, no icon library.

`App.tsx` maps over that array. If `App.tsx` grows past ~150 lines, pull the
link element into `src/components/LinkItem.tsx` and stop there.

## Layout

Desktop (≥768px), full viewport height, two zones side by side:

```
|<-- 20% -->|                                                 |
|           |                                    LINK FIVE    |
|           |                            LINK FOUR            |
|           [ IMAGE ]                LINK THREE                |
|           |                    LINK TWO                      |
|           |            LINK ONE                              |
```

- **Image**: vertically centered in the viewport, sitting in the left zone with
  roughly 20% of the viewport width as left padding. Sized in relative units,
  with a max-width so it never dominates on ultrawide screens.
- **Links**: to the right of the image, as a vertical group, also vertically
  centered so the group's midline matches the image's.
- **The staircase**: 3–5 links, each one stepped further right than the one
  below it. The *bottom* link is closest to the image; each link *above* moves
  right by one increment. Left-aligned text, so the label's starting edge is
  what forms the diagonal.

Implement the stagger from the array index rather than hardcoding per-link
values, so adding or removing a link doesn't break the diagonal:

```tsx
style={{ marginLeft: `calc(${links.length - 1 - i} * var(--step))` }}
```

Define `--step` once in `index.css` as a viewport-relative unit so the diagonal's
angle holds as the window resizes. `4vw` is the tested default; below ~2.5vw the
offsets stop reading as intentional and start looking like a mistake. The
rightmost link must never overflow the viewport at 1280px wide — clamp `--step`
if needed.

**No connector lines.** Do not draw hairlines, rules, risers, treads, brackets,
or any other graphic tracing the diagonal between links. The offset alone is the
whole device. Nothing decorative sits between the image and the links either.

Mobile (<768px): the staircase is dropped entirely. Do not attempt a
scaled-down diagonal — it reads as broken alignment on a narrow screen.
Image on top, links below it stacked full-width, one per row, with a fixed
10px gap between them. Bubble tails are hidden at this width: "points at
the portrait" stops making sense once a link is no longer sitting next to
it.

- The page fits in one viewport at common desktop sizes. No scrolling if it can
  be avoided.
- External links get `target="_blank"` and `rel="noopener noreferrer"`.

## Quality floor

Non-negotiable on every change:

- Responsive down to 375px wide.
- Visible keyboard focus on every link. Never `outline: none` without a
  replacement focus style.
- Tap targets at least 44x44px.
- The image has real `alt` text, explicit `width`/`height` to prevent layout
  shift, and is compressed (WebP preferred).
- `prefers-reduced-motion` respected by any transition.

## Deployment

Vercel autodetects Vite. Framework preset "Vite", build command `npm run build`,
output directory `dist`. No serverless functions, no `vercel.json` unless a
redirect is actually needed. No environment variables — nothing here is secret,
and anything in a Vite client bundle is public regardless.

## Working style

- Edit the existing files rather than creating parallel versions.
- Don't scaffold a fresh project on top of this one.
- Don't add a README, tests, CI, linting config, or a component library unless
  I ask.
- If a request is ambiguous, ask before building.

## TODO — decisions not made yet

- [ ] The image itself (file, subject, shape — circle vs square vs freeform)
- [ ] The 3–5 link labels and their destinations
- [ ] Visual direction: palette, typeface, light or dark
- [ ] Hover treatment for the links
- [ ] Domain name
