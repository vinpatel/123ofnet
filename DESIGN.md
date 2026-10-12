# DESIGN.md: 123ofnet.com

The rule: **it must look like the 2001 site.** Modern only where the visitor can't see it
(performance, accessibility, security, machine-readability).

---

## 1. Source of truth

The original site (Wayback Machine captures in `archive/raw/` and screenshots in
`archive/screenshots/`) is the design spec. When this file and the original
disagree, **the original wins**. Update this file once Phase 0 is done.

### The real 2001 design (from archive/raw/123ofnet.com, Feb 2001)
- **Top bar** `#3366FF` with the logo and the search box ("Search WWW / Search 123ofnet.com")
- **Link strip** in light blue: `Home | News | Horoscope | Career | Medicine | ...`
- **Tagline strip** `#FF9900`: "123ofnet.com - An easy solution to the Net !!! ... A site by three enterprising students"
- **3 columns**: left = What's NEW + topic boxes, centre = News + DMOZ-style Categories grid, right = Email login, Newsletter, Polls, Career, "Our Other SITES"
- **Box title bars** (bold blue Verdana text, centred) in pastel colours:
  `#FFCC99` peach, `#CCFFCC` mint, `#CCCCFF` lilac, `#FF99FF` pink, `#FFFF99` lemon, `#99CCFF` sky, `#FFFFCC` cream.
  Strong bars with yellow text: `#FF6633` (News), `#0099FF` (Categories), `#66CC99` (Quotes), `#FF6699` (Weather)
- **Headings** in Impact-style blue with a pink accent ("The TEAM @ 123ofnet.com")
- **Footer**: orange bar `ADVERTISE | ABOUT US | SERVICES | SUPPORT | FAQ's | PRIVACY POLICY`
- **Fonts**: Verdana/Arial for UI, Times for article text, Impact for big headings

These are implemented in `src/assets/retro.css` as CSS variables.

---

## 2. The look in one sentence
A 2001 Indian web portal: busy but organised, pastel title bars, blue underlined links, everything one click away.
Keep that **energy and layout**, but make it **easy to use** in 2026: big search box first, clear prices, works on phones.

## 3. Modern features in the 2001 skin

| Feature | 2001 disguise |
|---|---|
| AI tool search | The 2001 top-bar search box, now the main entry point |
| AI Directory | DMOZ-style "Categories" grid: **Bold Category** (count) then sub-links |
| Featured listings | Lemon box with an orange border and a pink FEATURED tag |
| Pricing | Bevelled table with blue headers and big Impact prices |
| Free AI tools (Phase 2) | Pastel title-bar boxes, like the 2001 Email / eGreetings boxes |
| Badge for listed tools | 88x31 button in the 123ofnet colours |

Label anything AI-generated, paid ("FEATURED") or affiliate ("(aff)") clearly.

## 4. Invisible modern rules (do not skip)

- **Semantic HTML underneath.** Use real `<nav>`, `<main>`, `<h1>`; don't use
  layout tables or `<font>`. Copy the *look* with CSS. The only exception is
  original archive files, which are never edited.
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

- Original assets: `archive/raw/` (never modified); copies to reuse go in `src/assets/retro/`.
- New retro assets must match 2001 constraints: GIF/PNG-8, web-safe colours,
  pixel fonts, no anti-aliased gradients.
- Fonts: system fonts only (they existed in 2001 too).
