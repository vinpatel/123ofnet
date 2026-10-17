# AGENTS.md — instructions for AI coding agents

This repo revives **123ofnet.com**, a web portal first built in 2000 and now rebuilt as a money-making AI tools portal.
Read `BUSINESS.md` (how it makes money), `PLAN.md` (build checklist) and `DESIGN.md` (how it must look) before changing anything.

## Project layout

```
archive/raw/          Raw Wayback captures. READ-ONLY. Never edit or reformat.
archive/screenshots/  Screenshots of original pages (the visual spec).
src/                  Eleventy source for the modern-but-retro site.
  _data/directory.js    Loads data/directory.json via lib/catalog.js (adds tool slugs).
  _data/tools.js        Flat tool list for /tool/<slug>/ pages (slug, site description, alternatives).
  _data/site.json       Prices, Stripe Payment Links, newsletter form, contact email.
  _data/museum.js       Lists archived screenshots for the /1999/ page.
  _includes/            Layouts and partials.
  assets/retro/         GIFs, buttons, counter digits.
data/directory.json   THE tool directory (source of truth; edit this, or use scripts/merge-tools.py).
lib/catalog.js        Shared loader: slugs, website descriptions from archive/research/, alternatives.
archive/research/     Verifier reports (what each tool's website said when checked).
worker/               Cloudflare Worker (api.123ofnet.com): counter, guestbook, chat, webring.
scripts/              Utility scripts (e.g. fetch-wayback.sh).
```

## Commands

```bash
npm install
npm run dev        # eleventy --serve, http://localhost:8080
npm run build      # outputs to _site/
cd worker && npx wrangler dev      # local Worker
cd worker && npx wrangler deploy   # deploy Worker (ask first)
```

## Hard rules

1. **It must look like the 2001 site.** Follow `DESIGN.md`. No modern UI styling
   (rounded cards, shadows, hero sections, Tailwind look-alike design).
2. **Never modify `archive/raw/` or `archive/screenshots/`.** They are the historical record.
3. **Static first.** Every page must work with the Worker down and with JS off.
   Dynamic features progressively enhance.
4. **No secrets in this repo.** The Claude API key and Turnstile secret live in
   Worker secrets (`wrangler secret put`). GitHub Pages is public.
5. **No frameworks on the frontend.** Vanilla JS only; no React/Vue/Tailwind.
6. **Directory entries must be verified.** Never invent URLs. Every new entry must pass
   `python3 -I scripts/verify-tools.py candidates.json out.json` with status `ok`, `moved`
   (use the final URL) or `blocked`. Quick picks in `guides.json` are chosen by a person.
7. **Label AI output.** Anything model-generated shown to visitors is marked as such.
8. **Accessibility & mobile** rules in `DESIGN.md` §4 are required, not optional.

## AI features (worker/)

- Model: `claude-haiku-5-5` for the Webmaster chat (cheap, fast). Upgrade only
  if quality requires it.
- Ground the chat on `directory.json` and the site's pages. It must not claim
  to browse the web or make up links.
- Rate-limit per IP, cap `max_tokens`, and use Turnstile on write endpoints.
- Persona: the friendly 2001 webmaster of 123ofnet.com. Plain, warm, a bit nostalgic,
  and honest that it is a bot.

## Git

- Author: `vinpatel` / bhavin500@yahoo.com (personal project, NOT the
  mindtrades identity).
- Small, focused commits. Deploys happen on push to `main` via GitHub Actions.

## Definition of done for any page

- [ ] Matches the 2001 look (compare with `archive/screenshots/`)
- [ ] Works on a 375px-wide phone and at 800x600
- [ ] Works with JS disabled
- [ ] Passes HTML validation, alt text present, contrast AA
- [ ] Has a unique `title` (≤ 60 chars incl. " - 123ofnet.com") and `description` (70–160 chars) in front matter
- [ ] Has `crumbs` front matter (breadcrumbs JSON-LD); use `noindex: true` for pages that shouldn't be indexed
- [ ] When directory.json or guides.json change, bump `dataUpdated` and `lastUpdated` in site.json (sitemap lastmod)
- [ ] Shows up in sitemap.xml and llms.txt if public (paginated templates need `addAllPagesToCollections: true`)
