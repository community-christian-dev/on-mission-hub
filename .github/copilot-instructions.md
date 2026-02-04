### Repo overview

- This is a small Next.js (App Router) UI focused on an "orbit / concentric rings" visualization.
- Key UI entry: [app/page.tsx](app/page.tsx) which mounts the `ConcentricRings` component.
- Visualization components live in [app/components](app/components) and static configuration/data live in [app/data](app/data).

### Big-picture architecture

- Presentation-first single-page UI. State is mostly local to `ConcentricRings` (`selectedRing`) and flows down via props.
- Data-driven layout: rings are configured in [app/data/RingData.ts](app/data/RingData.ts); items come from [app/data/MockItems.ts](app/data/MockItems.ts).
- Components:
  - `ConcentricRings` (app/components/ConcentricRings.tsx): orchestration, maps `RingData` -> `Ring` components and renders `OrbitItem`s.
  - `Ring` (app/components/Ring.tsx): measures viewport, computes sizes, uses `framer-motion` for animations.
  - `OrbitItem` (app/components/OrbitItem.tsx): computes polar positions and renders clickable items.
  - `RingSelection` (app/components/RingSelection.tsx): bottom controls that map to `RingData` entries.

Why this structure: the app separates visual config (radius, colors, startAngle) from rendering logic so new rings or items are added by editing data files instead of component code.

### Project-specific conventions & patterns

- File locations: UI components under `app/components`, static config under `app/data`. Prefer adding new visual types in `components` and new data entries in `data`.
- Client components: components that use state, effects, or browser APIs start with the string `"use client"` at top (see `Ring`, `RingSelection`, `ConcentricRings`). Keep server components minimal.
- Animation: `framer-motion` is used consistently for enter/animate transitions. Follow existing `initial` / `animate` / `transition` shapes.
- Styling: Tailwind classes in JSX; color tokens come from `RingData.itemColor`, `RingData.bgColor`, and `RingSelection`'s `colorMap`.
- Position math: `OrbitItem` computes positions with polar coordinates; when adding items, follow its `getPosition` signature (startAngle, index, total, radius).

### Common change patterns (examples)

- Add a new ring: update [app/data/RingData.ts](app/data/RingData.ts) with a new entry (id, radius, colors, startAngle, name). `RingSelection` and rendering automatically pick it up.
- Add mock items: append to [app/data/MockItems.ts](app/data/MockItems.ts). Items must include `id`, `ring` (matching a `RingData.id`), and `name`.
- Change selection behavior: `selectedRing` lives in `ConcentricRings` and is passed to `Ring` as `selectedRing` prop; update there to change expansion behavior.

### Build, run, and lint

- Development: `npm run dev` (maps to `next dev`).
- Build & serve: `npm run build` then `npm run start`.
- Lint: `npm run lint` (uses `eslint`).

### External dependencies and integration points

- `framer-motion` for animation (see imports in `Ring`, `OrbitItem`, `RingSelection`).
- `next` v16 App Router; components use the app directory pattern and `next/font` in layout.
- Tailwind CSS v4 for styling; global styles in [app/globals.css](app/globals.css).

### What to watch for / gotchas

- Many components are client components and access `window`. Tests or server-side rendering changes should keep `"use client"` presence in mind.
- Color class strings are concatenated into className; keep Tailwind class composition predictable to avoid purge issues.
- `ConcentricRings` currently uses a placeholder `getOrbitItemPosition` (static x/y) and renders a hard-coded orbit item; when adding dynamic items, ensure `indexInRing` and `itemsInThisRing.length` are used to compute live positions.

### Useful code pointers (quick links)

- `ConcentricRings`: [app/components/ConcentricRings.tsx](app/components/ConcentricRings.tsx)
- Rings config: [app/data/RingData.ts](app/data/RingData.ts)
- Mock data: [app/data/MockItems.ts](app/data/MockItems.ts)
- Ring rendering: [app/components/Ring.tsx](app/components/Ring.tsx)
- Orbit items: [app/components/OrbitItem.tsx](app/components/OrbitItem.tsx)

If anything here is unclear or you want more examples (e.g., how to compute dynamic orbit positions or add persistence), tell me which area to expand and I will update this file.
