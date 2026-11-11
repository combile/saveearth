# Design: 한밭대학교 탄소중립 포털

The locked system. Every Hallmark run reads this first and screens share it. Change it on purpose; the file is the rule.

## System
- Genre: modern-minimal
- Shape: app screen (17 routes inside the existing sidebar shell, `src/layouts/DashboardLayout.tsx`)
- Theme: brand (night sidebar + one lime signal + deep greens, Pretendard). Chosen by the project, kept.
- Posture: restrained. Lime marks only the current selection, the primary action and live state.

## Tokens
`src/theme.ts` is the source of truth (Emotion, no CSS files). Roles:
- Paper `bg #f4f5f4` · surface `#ffffff` · ink `#141615` · ink-2 `sub #6b706d` · muted `mute #a3a7a3` · rules `line` / `lineSoft`
- Dark panel `night` / `nightSoft`, text on it `nightInk` / `nightSub`, rules `nightLine`, hover `nightHover`
- Data greens `brand900 … brand100` (charts, figures); signal `lime` (+ `limeHover`); state `danger` / `warn` / `good` (+ `*Soft`)
- Comparison series `seriesBlue`, `seriesOrange`, `indigo`; seasons `theme.season`
- `theme.onDark(a)`, `theme.scrim(a)` for alpha white / photo scrim; `theme.shadow.pop` only on floating lists
- Font: `theme.font.sans` everywhere; `theme.font.mono` only for machine values (topics, raw payloads, ids)
- Radius: `sm 6` controls · `md 10` inner · `lg 14` cards · `pill`
- Control height: `theme.control` (36px)

No literal colour or font-family outside `theme.ts`.

## Type (fixed scale, ~1.17)
12 caption/label · 13 body-dense, table · 14 body · 16 card emphasis · 19 section · 22 page title. Figures: `bigNumber` (tabular, -0.03em). Labels sentence case, untracked, never caps, never mono.

## Surfaces
- One card recipe: `Card` from `src/components/ui.tsx` (white, radius lg, no border, no shadow).
- Never a box inside a card: inside a card use rows split by `lineSoft` hairlines, `<dl>` stat rows, or tables.
- Tables before card grids. Tables: sentence-case heads, horizontal rules only, no outer border, tabular numerals, right-aligned numbers.
- One dark `night` panel per screen at most, for the screen's signature object.

## Controls
- Primary: `Button` lime fill, night ink, radius sm, 36px. One per screen.
- Secondary: `Button variant="outline"` (lineSoft fill) or a text link. Same radius and height.
- Filters: `SelectBox`, `Segmented`, `UnderlineTabs` from ui.tsx. No new control kinds.

## Motion
- Still. No reveal, count-up or orchestration on load. Only state motion (menu open, tab change, hover colour) at 0.15–0.25s, `transform`/`opacity`/colour only.

## States
Every region that loads data shows what it has logic for (loading, empty, error, full); mock-data screens draw full and list the rest for the owner.

## Exports
`src/theme.ts` in this project.
