# Design Language — Printables-inspired

Reference screenshots reviewed (local, not shipped):

- `image_6.png` — home: utility bar, main nav, hero, featured cards, explore CTA.
- `image_7.png` — browse: left filter rail, sort tabs, 4-up model grid.
- `image_8.png` — model detail: gallery, sidebar, tabs, description, tags.
- `image_9.png` — fullscreen 3D viewer: orange model, control pad, file bar, thumbnails.

What we adopt: the **structure, density, type scale, color hierarchy, and interaction patterns**.
What we do **not** copy: the Printables name/logo, Atlas Grotesk / TT Hoves font files, Font Awesome Pro,
proprietary icons, images, copy, or CSS. We use open fonts and an original wordmark, and default the site
name to **MyPrintables** (configurable).

---

## 1. Overall feel

- White/light-gray canvas, dense but airy, flat surfaces, near-square corners.
- Orange is the action color; almost-black is the information color; gray is secondary.
- Thin 1px borders instead of shadows. Cards feel like printed index cards.
- Bold, tight headings; small, quiet metadata; strong iconography.
- Content width is generous on desktop (4 columns), but the detail page is a focused two-column layout.
- No gradients except the hero image overlay; no glassmorphism; no colorful cards.

### Brand mark

<img src="../web/public/brand/cube-mark.svg" alt="MyPrintables cube mark" width="72">

Original isometric cube: three orange faces, two subtle print-layer lines, and a transparent bore/hole.
It reads at 16px and works on white, canvas, and dark surfaces.

- Canonical mark: `web/public/brand/cube-mark.svg`
- Favicon: `web/public/favicon.svg`
- Lockup: mark at 24–28px + **MyPrintables** in `Archivo` 800, 22px, tracking `-0.03em`, 10px gap.
- Minimum size: 16px. Clear space: 25% of the mark on all sides.
- Do not rotate, recolor, outline, add shadows, or fill the transparent hole.
- On dark backgrounds keep the orange mark and set the wordmark white; the bore shows the background.
- The mark is a cube, not a letter; never stretch it non-uniformly.

---

## 2. Color tokens

Use CSS variables in Tailwind v4 `@theme`; do not hardcode hex in components.

| Token | Value | Use |
|---|---|---|
| `--color-brand` | `#FA6831` | Hero/CTA fills, active accents, category badges, 3D material |
| `--color-brand-hover` | `#E05D2D` | Hover for large brand surfaces |
| `--color-brand-pressed` | `#C94E20` | Active/pressed |
| `--color-brand-strong` | `#D0440F` | Buttons/links with white 14–16px text (AA contrast) |
| `--color-brand-strong-hover` | `#B93A0B` | Hover for strong orange |
| `--color-brand-soft` | `#FFF1EA` | Selected nav/filter background, subtle highlight |
| `--color-support` | `#A21CAF` | "Members only"/support-style outline accents (sparingly) |
| `--color-ink` | `#1F2124` | Headings, primary text, active underline |
| `--color-text` | `#3F4143` | Body text |
| `--color-muted` | `#6B6B6B` | Metadata, category labels, helper text |
| `--color-faint` | `#9A9A9A` | Disabled/placeholder |
| `--color-line` | `#E0E0E0` | Card borders, dividers, inputs |
| `--color-line-strong` | `#B3B3B3` | Hover borders, strong dividers |
| `--color-canvas` | `#F5F5F5` | Page background, utility bar, image placeholders |
| `--color-surface` | `#FFFFFF` | Header, cards, panels |
| `--color-surface-alt` | `#FAFAFA` | Alternating sections |
| `--color-success` | `#65C900` | Success badges |
| `--color-danger` | `#CB2C2C` | Errors, destructive actions |
| `--color-warning` | `#FFE047` | Warnings |
| `--color-star` | `#8A8A8A` | Filled rating star; active hover/own rating uses `--color-brand` |
| `--color-overlay` | `rgba(0,0,0,.55)` | Modal/lightbox scrim |

Accessibility notes:

- White text on `#FA6831` is ~3:1 (large/bold only). For normal-size button/link text use
  `--color-brand-strong` `#D0440F` (~4.6:1 on white) or ink text.
- `--color-muted` is chosen for 4.5:1 on white and `#F5F5F5`; never use `#B3B3B3` for body text.
- Focus ring: 2px `--color-brand` with 2px white offset; visible on both light and image backgrounds.
- Never convey visibility/status by color alone: pair with an icon and text.

Dark mode is **not** in v1. Tokens are structured so a `.dark` scope can be added later.

---

## 3. Typography

Reference uses Atlas Grotesk (body) + TT Hoves (headings), both proprietary. Open substitutes:

- **UI/body**: `Inter` variable (self-hosted woff2, 400/500/600/700).
- **Display/headings/wordmark**: `Archivo` variable (600/700/800), slightly tighter tracking.
- **Mono** (file sizes, dimensions, code): `JetBrains Mono` 400/500.

| Style | Size / line | Weight | Notes |
|---|---|---|---|
| Display / hero title | 40–56 / 1.05 | 800 | Tight `-0.02em`, white on hero |
| H1 page title | 32 / 1.15 | 700 | Browse "3D Models", detail title 28 |
| H2 section | 24 / 1.25 | 700 | "Featured Models" |
| H3 card/panel | 18 / 1.3 | 600 | |
| Card title | 16 / 1.35 | 600 | 2-line clamp |
| Body | 14 / 1.5 | 400 | Base `--input-font-size: 14px` |
| Body large | 16 / 1.55 | 400 | Descriptions on detail |
| Meta | 12 / 1.4 | 400/500 | Category, dates, helper |
| Stat | 11 / 1.2 | 500 | Card stats row |
| Button | 14 / 1 | 600 | Uppercase 0.04em for section CTAs |
| Nav | 14 / 1 | 600 | Active underline |

Rules:

- Headings are `--color-ink`, body is `--color-text`, metadata `--color-muted`.
- Avoid more than three weights on one screen.
- Numeric counters use tabular numbers (`font-variant-numeric: tabular-nums`).

---

## 4. Spacing, radius, borders, elevation

- Base spacing unit: 4px. Use 8/12/16/24/32/48/64.
- Page gutters: 16px desktop, 8px small mobile. Content max width: **1506px**; detail content width:
  **1154px**; readable text column: **740px**.
- Radii: **2px** on buttons, inputs, cards, images. Avatars and icon buttons are circular. No 12px+ radii.
- Borders: 1px `--color-line`. Cards have no shadow by default. Hover may darken border to
  `--color-line-strong`; do not add large drop shadows.
- Modals/lightbox: white surface, 1px border, 8px radius max; overlay scrim.
- Focus: 2px orange ring, 2px offset. Never remove outlines without a replacement.

---

## 5. Header

### Utility bar (desktop, 40px, `--color-canvas`, bottom 1px line)
- Left: language/site label (v1: site name or "English" removed; use version/status or nothing).
- Center: search pill, max-width 560px, height 40px, white background, 1px line, 2px radius,
  magnifier icon 18px, placeholder "Search models, tags, creators".
- Right: upload shortcut icon, admin bell (optional), user menu/avatar; 20px icons; 8px gap.
- On mobile: hide the utility bar; search becomes an icon that expands a full-width bar.

### Main nav (64px desktop, 56px mobile, white, bottom 1px line, sticky)
- Left: cube mark from `web/public/brand/cube-mark.svg` (24–28px) + wordmark (`Archivo` 800, 22px,
  `-0.03em`) + optional version chip.
- Center/left links: 3D Models, Collections, Tags, Upload. 14px/600, 12px gap, 16px padding.
  Active: 2px black underline flush with the header bottom (Printables pattern).
- Right: `+ Create` outlined button (1px ink, 2px radius, 36px height, 14px/600) or primary orange
  "Upload" on small screens; avatar menu with My models, Settings, Admin, Log out.
- Hover: text to ink; no background pill.
- Mobile: logo + search + hamburger; drawer with links, account, admin; body scroll locked.

### Search behavior
- Debounced 250ms suggestions grouped: Models, Tags, Creators.
- Enter → `/models?q=…`; Esc clears; recent searches in localStorage (optional).
- Loading spinner inside the pill; no layout shift.

---

## 6. Buttons & controls

| Variant | Spec |
|---|---|
| Primary | Orange `brand-strong` bg, white text, 48px height (44 mobile), 14–16px/700, 2px radius, uppercase for section CTAs |
| Brand | `brand` bg with white text only for large/bold text; use `brand-strong` otherwise |
| Secondary | White bg, 1px line, ink text; hover border ink |
| Outline | Transparent, 1px ink, ink text; used for `+ Create`, Follow-style actions |
| Ghost | No border, ink/muted text; hover `brand-soft` or canvas |
| Support/members | Transparent, 1px `--color-support`, magenta text, small 14px/600 |
| Destructive | White bg, 1px danger, danger text; filled danger only in confirm dialog |
| Icon button | 36×36 or 40×40, 1px border or borderless, 18–20px icon, circular or 2px radius |
| Link | `brand-strong`, underline on hover; body links inherit ink and underline |

States: default / hover / active / focus-visible / disabled (40% opacity, no pointer) / loading
(spinner + label, width preserved). Minimum target 44×44px on touch.

Inputs: 40px height, 1px `--color-line`, 2px radius, white, 14px text, 12px horizontal padding.
Focus: border `--color-brand`, 1px inner ring. Error: danger border + 12px message below. Labels 13px/700,
10px bottom margin. Checkboxes/radios 20px, accent orange. Textareas 120px min, resize vertical.

---

## 7. Model card (the core component)

Reference: 326px wide at 1440, image 4:3, flat white, 1px border, no radius.

```
┌──────────────────────────────┐
│ creator avatar  name ✓       │ 28px row, 12px padding
│                 @handle      │
├──────────────────────────────┤
│ [category badge]             │ image 4:3, object-fit cover
│                              │ dots if multiple images
│                              │
├──────────────────────────────┤
│ Title (2 lines max, 16/600)  │ 12px padding
│ Category > Subcategory (12)  │
├──────────────────────────────┤
│ ♥ 643   ★ 5   ↓ 1.6K     🔖  │ 36px, top border, 11px meta
└──────────────────────────────┘
```

- Creator row: 24px avatar, display name 12px/600, handle 11px muted; an admin role badge is optional. Do
  not display a fake verification check.
- Image: `aspect-ratio: 4/3`; skeleton `--color-canvas`; hover image scale 1.02 (150ms) inside overflow
  hidden; category badge: 24px orange square, 2px radius, white 14px icon, top-left 8px.
- Carousel dots: 4px white dots with shadow, bottom center; arrows on hover/focus (desktop).
- Title: ink, 2-line clamp; on hover underline (not color change) to keep orange for actions.
- Stats: 16px icons, 11px tabular numbers, muted; heart turns orange when liked, star is filled for an
  average rating, bookmark filled when saved; hover text ink. Separate with 12px gaps, bookmark pushed
  right. Show the rating number (e.g. `4.8`) and a small count in the tooltip.
- Whole card is a link; inner like/bookmark buttons stop propagation and have aria-pressed.
- Grid: 4 columns ≥1154px, 3 ≥820px, 2 ≥520px, 1 below; gap 24px (16 mobile). Equal heights; stats row
  pinned to bottom.
- Skeleton: same dimensions; shimmer using canvas/white gradient; no layout shift.

---

## 8. Home page

1. **Hero** (inside max width, 16:5.5 desktop / 16:9 mobile, dark image with gradient overlay):
   - 48–56px white 800 title, 1–2 line description, orange CTA "Explore models", optional secondary ghost.
   - Carousel dots bottom-center; arrows on hover; admin-selected featured models.
   - On mobile, text below/overlay with 32px title; crop image to focus.
2. **Featured Models**: 24px/700 heading, 4 cards, "EXPLORE MODELS" orange uppercase CTA centered below.
3. **Featured collections**: horizontal row of 3–4 collection cards (mosaic cover, name, owner, count).
4. **Latest uploads**: 4 cards + "View all" text link; maybe 8 cards in two rows.
5. **Browse by category**: 6–12 tiles, 1px border, icon + name + count, hover border ink; 4/3 cols.
6. **Top creators**: horizontal row of avatar cards (avatar 72px, name, model count, follow not in v1).
7. **Library stats**: thin band on canvas: models, files, downloads, storage used.
8. **Footer**: 4 columns (Explore, Collections, Tags, Account) + bottom line with site name, version,
   "Self-hosted" note. White or ink background; keep low contrast.

Sections alternate white / `--color-surface-alt` with generous 64px vertical padding (40 mobile).

---

## 9. Browse page

- Two columns: left **272px filter rail**, right fluid content; 32px gap. Sticky rail under header.
- Breadcrumb: `< 3D Models` chip at top of content; H1 "3D Models" 32px/700.
- Sort row: tabs "Trending / New uploads / Downloads / Likes / Views / Rating / Random", 14px/700;
  active orange underline 2px; right: time range select (Past 30 days) and sort direction.
- Grid: 4-up; 24px gap; padding below 64px.
- Filter rail:
  - Library summary strip (total models / files / storage) above categories.
  - "All Categories" heading 13px/700 uppercase; rows 40px with chevron, hover canvas.
  - "Show only models" checkboxes (featured, with makes, with contest award, exclude AI, exclude political)
    — adapt to NAS: "Featured", "Has preview", "Recently updated", "Most downloaded".
  - Published date select; License select; File types checkboxes (STL, 3MF, OBJ, PLY, GLB, GLTF, GCODE).
  - Tag chips (top tags) and an active tag filter; tag pages are also linkable from model detail.
  - Apply immediately (URL-synced), "Clear all" text button; mobile: "Filters" button opens drawer with
    count badge; active filters as removable chips above the grid.
- Empty state: cube illustration, "No models match these filters", clear-filters button.
- Pagination: "Load more" button (infinite) + numbered pages fallback for accessibility; URL `?page=`.

---

## 10. Model detail page

Reference: 1154px container, 2 columns (left ~58%, right ~42%), 32px gap. Header is the same sticky nav.

### Left column
- Breadcrumbs: `‹ 3D Models / ‹ Category / ‹ Subcategory` as small chips (12px, canvas bg).
- Main gallery: 4:3, white/canvas, 1:1 border; image `object-fit: contain` with blurred backdrop for
  non-matching aspect ratios (Printables does a subtle blur).
- Arrows on hover, dots, fullscreen icon; thumbnail strip 160×120, 6px gap, active orange 2px inset outline;
  video badge reserved.
- Tabs below gallery (full width across both columns, 1px bottom border): Details, Files (n), Comments (n),
  Related, Collections (n). 14px/700; active orange 2px bottom border; counts 11px muted.
- Detail content: max-width 740px, 40px top padding. "Description" 18px/700; Markdown body 16px/1.6;
  headings 20–24px; lists with 1.5 spacing; images full-width, 2px radius; code blocks canvas.
- Tags: "Tags" 18px/700; chips 28px height, canvas bg, 1px line, 11–12px, hover ink border; "+ more".
- Model origin / remix section reserved; license block with icon and link.

### Right sidebar (sticky, top 88px)
- Title 28px/700, 2-line clamp; bookmark/kebab at right.
- Rating row: interactive 5-star control (signed-in only), average `4.8` + `(24 ratings)`; show "Rate this
  model" for signed-in users, "Sign in to rate" for anonymous, and "No ratings yet" when empty. The user's
  own score is highlighted; clicking the same score again removes it (or use a small "Remove" link).
- Creator row: 40px avatar, name 14px/700, handle 12px muted, Follow (outline) and "Members only" chip if
  applicable. Follow is post-v1; replace with "View profile" text link.
- Short description 14px/1.5 muted; optional "read more".
- **Download** primary button: full width, 48px, orange `brand-strong`, download icon + "Download" 16px/700.
  If multiple files: split button — main downloads default, chevron opens file list.
- Action bar: 3 equal cells in a 1px-border grid: Like ♥ count, Bookmark 🔖, Share ↗. 14px/600; hover
  canvas; keyboard focus; counts tabular.
- Stats row: likes, downloads, views, updated date in 12px muted; views/watchers optional.
- Visibility/status chip (Public / Members / Private / Draft) with lock/globe icon; owner/admin sees
  "Edit model" secondary button and visibility quick-toggle.
- Files summary: "3 files · STL, 3MF · 84 MB" with link to Files tab.
- License: "CC BY-NC 4.0" + info tooltip.

### Ratings

- 1–5 stars, one per user per model; clicking a star submits immediately with an optimistic update.
- Aggregate row appears on cards (star + number), in the sidebar, and in sort (`Rating`).
- No written reviews in v1; comments are separate. Ratings are public as aggregates only.
- Signed-out users see the control disabled with a "Sign in to rate" tooltip.

### Comments tab

- Header: "Comments (n)", sort select (Newest / Oldest), composer at top.
- Composer: avatar, plain-text textarea (max 5000 chars, char counter), "Post comment" primary button;
  anonymous users see a sign-in prompt instead.
- Comment item: avatar 32px, name, relative time, body with preserved line breaks, actions Reply / Edit /
  Delete (own) or Delete (model owner/admin). Edited comments show "edited".
- Replies: one level only, indented 32px, with "Reply to @name"; no nested reply box.
- Pagination 20 per page; loading skeletons; empty state "Be the first to comment".
- Deletes are soft and render as "[deleted]" when replies exist.

### Collections tab

- Shows visible collections that contain this model: collection cover, name, owner, count; "View" link.
- Empty: "Not in any collections yet".

### Viewer entry
- Every previewable image with a 3D file shows a "View 3D" hover overlay and a cube badge in the thumbnail;
  clicking opens the fullscreen viewer. A "View in 3D" secondary button also appears near Download.

---

## 11. Fullscreen 3D viewer

Reference: white canvas, orange model, minimal chrome, control pad top-left, close top-right.

- **Canvas**: full viewport, white default background; optional light-gray/dark; no visible hard edges.
- **Model**: brand orange, soft studio lighting, subtle ambient occlusion feel via lighting; fits view with
  12% margin; ground grid toggle (default off), contact shadow subtle.
- **Top-left control pad**: white 1px-border panel, 3×3 icon grid (44px cells): home/reset, rotate left,
  zoom in/out, grid, wireframe, background, screenshot, fullscreen. Tooltips on hover; active state orange
  soft; keyboard focus.
- **Top-right**: close X (48px hit area), plus kebab for "Download file", "Open file in new tab",
  "Copy link".
- **Sides**: prev/next model-file arrows; hidden if one file; also keyboard ←/→.
- **Bottom-left**: thumbnail strip of model images/files, 80×60, active 2px orange outline; scrolls
  horizontally; each has a 3D cube badge when it maps to a file.
- **Bottom-right**: file selector (filename + size + chevron), "Download" icon, "PREV/NEXT" file buttons.
  Truncate filename with middle ellipsis; show format + size in 12px muted.
- **Loading**: centered spinner over a skeleton, percentage if available; "Cancel".
- **Error**: centered panel "Preview unavailable" + reason + Download button + "Try another file".
- **Mobile**: control pad collapses to a floating button; bottom bar stacks; pinch zoom/pan; double-tap reset.
- **A11y**: dialog role, focus trap, Esc closes, controls are buttons with labels, reduced-motion respected,
  no autoplay rotation by default.
- **Persistence**: material color, grid, wireframe, background, autorotate saved in localStorage via Jotai.

---

## 12. Upload flow

Wizard with a left step list (desktop) / top progress (mobile); white panel, 1px border, 2px radius.

1. **Files**: large dashed dropzone (canvas bg, 1px dashed line, cube icon), "Drop STL, 3MF, OBJ, PLY, GLB, GLTF, or
   GCODE" + file picker. Files list with format badge, size, remove; progress bar per file. Mark one file as
   default preview. STEP/STP is not offered in v1; if dropped, show "STEP import is coming later" and do
   not upload.
2. **Images**: grid of image tiles; drag to reorder; set cover; upload; auto-generated 3D cover shown with a
   "Generated" badge and "Regenerate" action; recommended 4:3, min 1200px.
3. **Details**: title (required, 3–120 chars), description Markdown editor with preview tabs, category
   select, tags input (max 15, autocomplete), license select, source/remix URL (optional).
4. **Visibility & publish**: radio cards:
   - **Public** — anyone with the link (default).
   - **Members** — only signed-in users.
   - **Private** — only you and admins.
   - Save as draft / Publish. Summary card on the right shows cover, title, visibility, file count.
   - On publish, redirect to the model page with a success toast.

Validation inline; errors focus the first invalid field; unsaved-changes guard; upload progress survives
navigation warning.

---

## 13. Auth pages

- Centered card max-width 420px on canvas; white surface, 1px border, 2px radius; cube mark above.
- H1 28px/700; subtitle 14px muted.
- Inputs full width; inline errors; primary button full width 48px.
- Login: email, password, "Forgot password?" → helper text "Ask an admin to reset it" in v1.
- Register: email, username, display name (optional), password + strength hint; link to login. Open by
  default. When email verification is enabled, show "We'll email you a verification link" and a success
  state instead of logging in.
- Setup: first-run card with a short "Create the administrator account" note and a warning that the setup
  page closes after creation.
- Verify email: `/verify-email?token=…` shows Verifying → Success (auto-login) / Expired or invalid with a
  resend form. A persistent banner appears for unverified accounts, with "Resend email" and a generic
  success message.
- Footer below card: "Self-hosted" + version; no third-party auth buttons.

---

## 13.1 Collections & tags

### Collections index (`/collections`)
- H1 "Collections" + short description; right: "New collection" primary button (signed-in).
- Tabs: Public / Mine (Mine only when signed in); sort Newest / Most models.
- Grid 4-up (3/2/1 responsive); collection card = 4:3 mosaic of the first four model covers (empty tiles
  canvas), name 16/600, owner/handle, "12 models", visibility chip (Private/Members).
- Create dialog: name (required), description, visibility radio (Public default/Members/Private).
- Empty state: "No collections yet" + create CTA.

### Collection detail (`/collections/:id/:slug`)
- Header: cover mosaic strip or single cover, name 32/700, owner row, visibility chip, description, model
  count; owner sees Edit / Delete, others see "Add to collection" on each model page.
- Model grid 4-up; filter by title; if empty, "This collection is empty".
- Private/members collections are gated by the same auth rules as models; a public collection only lists
  models the viewer can access.

### Add to collection
- A dialog from the model card/detail: searchable list of the user's collections, checkbox toggles,
  "Create new collection" inline; optimistic add/remove with toast.

### Tags (`/tags`, `/tags/:slug`)
- Tag index: A–Z list/grid of tag chips with counts; search field; no pagination for small libraries.
- Tag page: breadcrumb, H1 `#tag`, count, model grid, sort tabs; "Clear tag" link.
- Tag chips on model detail link here; upload accepts max 15 normalized tags.

---

## 14. Admin

- Left sidebar 240px, white or canvas, 1px right border; sections: Dashboard, Models, Users, Comments,
  Collections, Categories, Storage, Audit, Settings. Active item orange-soft bg + orange 3px left bar;
  14px/600.
- Content: page H1 28px + description; cards with 1px border, 16px padding; tables with 12px text, 44px
  rows, sticky header, zebra hover canvas.
- Stat tiles: 24px number (`Archivo` 700) + 12px label + optional delta; 4-up.
- Storage bar: stacked segments (`--color-brand`, ink, line) with legend; free disk shown.
- Destructive actions: danger outline + confirm dialog with typed name for user deletion.
- Settings form grouped in sections; "Save changes" sticky bottom bar with dirty-state indicator.
- Email card: verification enabled toggle, SMTP configured/from status (env values masked), "Send test
  email", last error; enabling verification without SMTP is disabled with an explanatory note.
- Moderation tables for comments (hide/delete), ratings (remove), and collections (force private/delete).
- Audit: relative time + absolute tooltip; actor, action chip, target link, IP hash prefix.
- Admin uses the same visual language, not a separate theme; no rounded dashboard cards or gradients.

---

## 15. Responsive behavior

| Breakpoint | Layout |
|---|---|
| `< 520px` | 1-col cards (or 2-col for browse if width ≥ 420), stacked detail, search icon expands, filter drawer, sticky download bar, viewer simplified |
| `520–819px` | 2-col grid, 2-col category tiles, hamburger nav, detail stacked, filter drawer |
| `820–1153px` | 3-col grid, filter rail 240px, detail 55/45 split, nav links may collapse |
| `≥ 1154px` | 4-col grid, 272px filter rail, full nav, detail 58/42, sticky sidebar |
| `≥ 1506px` | content max 1506px, 4-col cards with more whitespace, hero 16:5.5 |

Mobile details:

- Header 56px; hide utility bar; logo 20px; search icon.
- Model detail: gallery → title/actions → tabs; Download becomes a sticky bottom bar (safe-area padded).
- Viewer: controls in a bottom sheet; thumbnails 64×48; file bar compact.
- Tables become stacked cards with labels (admin).
- No horizontal scroll except tab strips/thumbnails (with momentum).

---

## 16. Motion

- 150–200ms ease-out for hover/active; 250ms for drawers/dialogs; no bounce.
- Card image scale 1.02 on hover; border color transition; no card lift (no shadow).
- Skeletons shimmer 1.6s; respect `prefers-reduced-motion` (disable shimmer, autorotate, zoom transitions).
- Viewer: autorotate off by default; load with a 300ms opacity fade; no camera fly-in longer than 400ms.
- Page transitions: none or 100ms fade; scroll restoration on back.

---

## 17. Accessibility checklist

- Semantic landmarks (`header`, `nav`, `main`, `aside`, `footer`), skip link.
- One H1 per page; logical heading order.
- All icon-only buttons have `aria-label`; toggles use `aria-pressed`; tabs follow ARIA tabs pattern.
- Dialog focus trap + return focus; Esc closes; scroll lock.
- Form labels tied to inputs; errors via `aria-describedby`, `aria-invalid`; error summary.
- Contrast: body ≥4.5:1, large text ≥3:1; test orange button variants; never color-only status.
- Keyboard: cards focusable with visible ring; Enter opens; like/bookmark/rating reachable; rating stars are
  a labeled radio group with arrow-key support; grid tab order logical.
- Images: meaningful alt from title/caption; decorative images empty alt; 3D canvas has text alternative
  (model title, formats, dimensions) and download link.
- Motion: honor reduced motion; no infinite animations except loading.
- Touch targets ≥44×44px; mobile menu, rating stars, and viewer controls usable one-handed.
- Test with axe on home, browse, detail, collections, tags, login, verify, upload, admin.

---

## 18. Content & tone

- Short, functional labels: "Download", "View 3D", "Members only", "No models yet".
- Empty states explain the next action ("Upload your first model").
- Errors: what happened + how to fix; never a raw stack trace or Go error.
- Dates: relative for recent ("2h ago"), absolute with tooltip; file sizes binary (KiB/MiB/GiB).
- Dimensions in mm, with a note "units assumed from file" for STL.

---

## 19. Component inventory (build order)

1. Tokens, fonts, base styles, focus ring, containers.
2. Button, IconButton, Input, Textarea, Select, Checkbox, Radio, Switch, Badge, Chip, Tooltip.
3. Header/UtilityBar/Nav/SearchPill/Footer.
4. ModelCard + skeleton + grid; StatBar; Like/Bookmark buttons; StarRating.
5. Tabs, Pagination, EmptyState, Toasts, Dialog.
6. Gallery, ImageLightbox, DownloadButton, ActionBar, TagChips.
7. CommentList/CommentForm/CommentItem; RatingInput; CollectionCard/CollectionPicker/CollectionFormDialog.
8. ModelViewer + controls + file bar + thumbnails (lazy).
9. UploadDropzone, FileList, ImageManager, CoverPicker, TagInput, VisibilityRadio.
10. Admin tables (users/comments/collections), stat tiles, storage bar, audit table, settings/email form.
11. Page compositions: Home, Browse, Detail, Collections, Tag, Upload, Auth, Verify Email, Profile, Admin,
    404/500.

---

## 20. Fidelity guardrails

- Keep corners at 2px; if a screen starts to look like a rounded SaaS dashboard, it is off-spec.
- Orange only for action/active/preview model; don't use it for large backgrounds except hero accents/CTA.
- Use 1px borders and whitespace for hierarchy, not shadows.
- Keep cards dense: creator row, image, title, category, stats — no long descriptions.
- Detail page: gallery and action sidebar first; description second; tabs persistent.
- Viewer: chrome recedes; the model is the hero; white background by default.
- Review side-by-side with `image_6`–`image_9` at M5 and adjust spacing/type, not just colors.
