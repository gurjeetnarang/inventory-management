---
name: vue-sidebar-redesign
description: Redesign a Vue 3 app's top nav bar into a modern SaaS-style left sidebar layout with design tokens, collapsible icon+label nav, and consistent spacing. Use when asked to modernize/redesign the app's navigation or overall layout into a sidebar.
---

# Vue Sidebar Redesign

Convert a Vue 3 app's horizontal top nav bar into a modern SaaS-style left vertical sidebar: collapsible, icon + label nav items, a design-token system, and consistent spacing. This skill drives the redesign end-to-end — it does not just produce guidance. Work through the six phases below in order.

This skill is written to be generic across any Vue 3 app. Every phase starts with **Discover**, then **Apply** — always inspect the target app's actual code before generating anything; never assume a shape that hasn't been confirmed by reading the files.

## Phase 1 — Discovery

Build a "target profile" before writing any code. This is read-only.

1. **Root component.** `Glob **/App.vue`. If not found, read `main.js`/`main.ts` for `createApp(...).mount(...)` and follow the imported root component.
2. **Router.** Grep the root component and `main.js`/`main.ts`/`router/index.js` for `createRouter`/`routes:`. Extract each route's `path`, `component`, and label source (an i18n key like `t('nav.x')`, or a literal string). Handle both an inline router (defined directly in `main.js`) and a separate router file.
3. **Current nav markup.** Grep the root component's template for `<nav`, `router-link`, and classes like `nav-tabs`/`navbar`/`top-nav`. Determine exactly how the active route is highlighted — a literal comparison like `:class="{ active: $route.path === '/x' }"` per link, or Vue Router's built-in `router-link-active`/`exact-active-class`. Do not assume the built-in class is in use; check.
4. **Sticky siblings coupled to header height.** Grep the whole source tree for `position:\s*sticky` and note each `top:` value. If a sticky element's `top` numerically matches the current header's height, it is coupled to the header and will break once the header is removed — flag it for Phase 4.
5. **Design tokens.** Grep for `:root` and `--[a-z-]+:` across all `.vue`/CSS files.
   - If tokens exist, reuse their names and values as the base palette.
   - If none exist, check the project's own docs (README, CLAUDE.md) for a documented palette first. If nothing is documented either, harvest hex literals from the root component's `<style>` block and group them by apparent role (background / border / text / accent / status colors) by frequency.
6. **View-wrapper convention.** Read 2-3 files in the views directory. Determine whether they rely on global classes defined once in the root component's `<style>` block (e.g. `.page-header`, `.card`, `.stats-grid`, table styles) versus each view scoping its own copies. If it's the former, the redesign can likely stay confined to the root component plus the new sidebar, without editing every view.
7. **Responsive handling.** Grep for `@media`. If none exist, the sidebar's responsive behavior (Phase 3) is being introduced from scratch, not adapted from an existing pattern.
8. **Icon library.** Check `package.json` dependencies for an icon package (`@heroicons/vue`, `lucide-vue-next`, `font-awesome`, etc.). If none is present, plan to author inline SVG icons — never add a new npm dependency for this.

## Phase 2 — Design tokens

- If Phase 1 found existing tokens, extend them: add only what a sidebar needs (`--sidebar-width-expanded`, `--sidebar-width-collapsed`, `--sidebar-bg`) using the existing naming style.
- If none exist, derive a `:root` block from the harvested/documented palette. Starting point (adapt the actual values to what Phase 1 found — do not paste this verbatim if the target app's colors differ):
  ```css
  :root {
    --color-bg: #f8fafc;
    --color-surface: #ffffff;
    --color-border: #e2e8f0;
    --color-text-primary: #0f172a;
    --color-text-secondary: #64748b;
    --color-text-tertiary: #475569;
    --color-accent: #2563eb;
    --color-accent-bg: #eff6ff;
    --color-success: #059669;
    --color-warning: #ea580c;
    --color-danger: #dc2626;
    --radius-sm: 6px;
    --radius-md: 10px;
    --space-1: 0.25rem; --space-2: 0.5rem; --space-3: 0.75rem;
    --space-4: 1rem; --space-5: 1.25rem; --space-6: 1.5rem;
    --sidebar-width-expanded: 240px;
    --sidebar-width-collapsed: 64px;
  }
  ```
- Place this block at the top of the root component's global (unscoped) `<style>` block, and progressively replace repeated hex literals in that same file with `var(--token)`. Do not require rewriting every view file's own inline literals in this pass — that's out of scope; mention it as a possible follow-up if asked.

## Phase 3 — Sidebar component spec

Design a new component, e.g. `AppSidebar.vue`, placed alongside the app's other shared components (wherever `FilterBar`/`ProfileMenu`-equivalent components live).

- Fixed-width column: `var(--sidebar-width-expanded)` expanded / `var(--sidebar-width-collapsed)` collapsed. `background: var(--color-surface)`. `border-right: 1px solid var(--color-border)`.
- Top: brand/logo block reusing whatever the discovered nav had (title + optional subtitle). Subtitle hides and title shrinks to an icon/initial when collapsed.
- One row per discovered route: an inline SVG icon (24×24 viewBox, `stroke="currentColor"`, `fill="none"`, stroke-width 2) plus a label span. Label gets `display:none` when collapsed (icon-only, centered).
- Active-state per item: replicate exactly whatever pattern Phase 1 found (string comparison vs. built-in active class) — don't switch mechanisms.
- A collapse-toggle button (chevron or hamburger) near the top or bottom of the sidebar, toggling a local `collapsed` ref.
- Responsive behavior (introduce even if nothing existed before):
  - `@media (max-width: 1024px)`: auto-set `collapsed = true`.
  - `@media (max-width: 768px)`: sidebar becomes an off-canvas drawer — `position: fixed; transform: translateX(-100%)` by default, toggled open by a hamburger button placed in the content column's top bar, with a dimmed overlay backdrop behind it.
- Only include routes that are actually registered in the router from Phase 1. Do not add sidebar entries for components that exist on disk but aren't routed — that's a separate concern from a layout redesign.

## Phase 4 — Integration

Restructure the root component's top-level layout:

- Change the root wrapper from a vertical flex column to a horizontal one: `display: flex; flex-direction: row`.
- The sidebar becomes a fixed-width flex child. Everything else (the routed content, plus anything the old header held besides the nav itself) becomes a new flex-column child, e.g. `.app-main { display: flex; flex-direction: column; flex: 1; min-width: 0 }`.
- The old full-width top header/nav bar is removed as a horizontal bar. Any elements it held that are *not* the nav itself (a language switcher, profile menu, notification icon, etc.) must be relocated into a new slim top bar inside the content column (e.g. `.content-topbar`, roughly 56px tall) — don't leave them orphaned just because the nav moved to the sidebar.
- Fix any sticky sibling flagged in Phase 1: if its `top` value matched the old header's height, recompute it to match the new content-topbar's height (or `0` if no topbar remains above it in the content column).
- Global classes that views depend on (identified in Phase 1.6) must stay defined with the same selectors and semantics in the same place — only swap their color literals for tokens. This keeps every view working without needing per-view edits.

## Phase 5 — Delegate the file edits

Do not Write or Edit any `.vue` file yourself. Hand the whole change to the `vue-expert` subagent as one self-contained task, including:

1. The derived `:root` token block from Phase 2, verbatim.
2. The new sidebar component's full path, markup/CSS spec, and its route table (path, label source, icon) from Phase 3.
3. The integration diff from Phase 4: the flex-direction change, where the relocated header elements and any sticky sibling move to, and the corrected sticky offset.
4. An explicit instruction to author icons as inline SVG — no new npm dependency.
5. A note that vue-expert should still use its own judgment (matching hover/transition timing, etc.) for anything not explicitly specified here.

Because this task changes the visual system rather than extending it, give vue-expert the new tokens and spec explicitly — don't rely on its default "match existing style" instinct alone, since the existing style is what's being replaced.

## Phase 6 — Verify

Use the Playwright MCP tools against the running dev server (start it first per the project's own quick-start instructions if it isn't already running):

1. Navigate to the app root; confirm the sidebar renders with every route found in Phase 1.
2. Click through each nav item; confirm the URL changes and the correct item highlights as active.
3. Click the collapse toggle; confirm both the expanded and collapsed states look correct.
4. Resize the viewport below 768px; confirm the off-canvas/hamburger behavior works.
5. Check the browser console for errors — expect none.
6. Open one data-heavy view and confirm cards/tables/stat-grids still render correctly after the token swap.

## Notes

- Preserve whatever label source (i18n key vs. literal string) each nav item currently uses — don't "fix" i18n gaps as a side effect of this redesign.
- If a view exists on disk but isn't registered in the router, leave it out of the sidebar. Wiring up new routes is a different task.
- Keep the scope to navigation/layout and the design tokens it depends on. Don't refactor unrelated view-level code while you're in there.
