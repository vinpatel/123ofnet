# DESIGN.md — 123ofnet.com

The rule: **it must look like 1999.** Modern only where the visitor can't see it
(performance, accessibility, security, machine-readability).

---

## 1. Source of truth

The original site (Wayback Machine captures in `archive/raw/` and screenshots in
`archive/screenshots/`) is the design spec. When this file and the original
disagree, **the original wins**. Update this file once Phase 0 is done.

### Original site inventory (fill in after Phase 0)
| Page | Original URL | Capture date | Notes (colours, GIFs, layout) |
|---|---|---|---|
| Home | | | |
| | | | |

### Original palette (fill in from captures)
| Use | Hex | Notes |
|---|---|---|
| Page background | `TBD` | (bgcolor / tiled background image?) |
| Text | `TBD` | |
| Link | `TBD` | 1999 default was `#0000EE` |
| Visited link | `TBD` | 1999 default was `#551A8B` |
| Active link | `TBD` | |

Until captures exist, use the **1999 defaults** below as placeholders.

---

## 2. The 1999 look (placeholder defaults)

- **Layout:** `<table>`-style layout, fixed ~760px wide centred (fits 800x600),
  left nav column ~150px, content column. (Use CSS grid that *looks* like
  tables; see section 4.)
- **Fonts:** `Times New Roman` body, `Arial`/`Verdana` for nav,
  `Comic Sans MS` only if the original used it. Headings via `<font size>`
  look: big, bold, sometimes coloured.
- **Colours:** web-safe palette (multiples of `#33`). Default links
  `#0000EE` / visited `#551A8B`, underlined.
- **Graphics:** animated GIFs (under construction, email envelope, NEW!),
  `<hr>` with bevel, 88x31 buttons, tiled background, hit counter with
  odometer digits.
- **Furniture:** "Best viewed in Netscape Navigator 4 at 800x600", "Last
  updated:", webring bar, guestbook link, "Sign my guestbook!", marquee
  (sparingly).
- **No:** rounded corners, drop shadows, gradients-from-2020, hero images,
  sans-serif minimalism, cookie banners, modal popups, dark mode by default.

## 3. Modern features in a retro skin

| Feature | 1999 disguise |
|---|---|
| AI Webmaster chat | Grey Win98-style window titled "Chat with the Webmaster", or an ICQ/AIM buddy window. Typing shows "Webmaster is typing..." |
| Guestbook | Classic guestbook table: Name / Homepage / Comments / Date |
| Directory | Yahoo-1999 category lists: **Bold Category** (count) then sub-links |
| Webring | Bar at page bottom: `[<< Prev] [Random] [List] [Next >>]` |
| Hit counter | Odometer digit images, real count from the Worker |
| "Human-picked" badge | 88x31 pixel button |
| Submit a site | Plain `<form>` with grey bevelled inputs |

Label anything AI-generated clearly, e.g. "🤖 Webmaster-bot says:".

## 4. Invisible modern rules (do not skip)

- **Semantic HTML underneath.** Use real `<nav>`, `<main>`, `<h1>`; don't use
  layout tables or `<font>`. Copy the *look* with CSS. The only exception is
  `/1999/`, which keeps the original markup untouched.
- **Mobile:** below 800px the side nav stacks on top and nothing scrolls
  sideways. It should still feel retro, just not broken.
- **Accessibility:** WCAG AA contrast (adjust the palette slightly if the
  original fails), alt text on every GIF, honour `prefers-reduced-motion`
  (stop marquee/blink/GIF animation), keyboard-usable chat.
- **Performance:** no JS framework. Vanilla JS, loaded only where needed (chat,
  counter, guestbook). Target <100KB per page excluding GIFs.
- **Privacy:** no third-party trackers. Count hits server-side only.
- **AI/SEO readability:** `llms.txt`, JSON-LD (`WebSite`, `ItemList` for the
  directory), sitemap, RSS, descriptive `<title>`/meta.

## 5. Assets

- Original assets: `site/1999/` (never modified) and copies reused in
  `src/assets/retro/`.
- New retro assets must match 1999 constraints: GIF/PNG-8, web-safe colours,
  pixel fonts, no anti-aliased gradients.
- Fonts: system fonts only (they existed in 1999 too).
