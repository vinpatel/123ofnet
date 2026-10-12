# AGENTS.md — instructions for AI coding agents

This repo revives **123ofnet.com**, a personal website first built in 1999.
Read `PLAN.md` (what & why) and `DESIGN.md` (how it must look) before changing anything.

## Project layout

```
archive/raw/          Raw Wayback captures. READ-ONLY. Never edit or reformat.
archive/screenshots/  Screenshots of original pages (the visual spec).
site/1999/            Faithful restoration of the original site (static HTML).
src/                  Eleventy source for the modern-but-retro site.
  _data/directory.json  Human-curated link directory (the core content).
  _includes/            Layouts and partials.
  assets/retro/         GIFs, buttons, counter digits.
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

1. **It must look like 1999.** Follow `DESIGN.md`. No modern UI styling
   (rounded cards, shadows, hero sections, Tailwind look-alike design).
2. **Never modify `archive/raw/`.** `site/1999/` changes only to remove Wayback
   artefacts or fix broken asset paths, and must stay faithful to the original.
3. **Static first.** Every page must work with the Worker down and with JS off.
   Dynamic features progressively enhance.
4. **No secrets in this repo.** The Claude API key and Turnstile secret live in
   Worker secrets (`wrangler secret put`). GitHub Pages is public.
5. **No frameworks on the frontend.** Vanilla JS only; no React/Vue/Tailwind.
6. **Directory entries are human-curated.** Agents may propose entries in a PR,
   but never auto-add links, and never invent URLs. Every URL must be verified
   to resolve.
7. **Label AI output.** Anything model-generated shown to visitors is marked as such.
8. **Accessibility & mobile** rules in `DESIGN.md` §4 are required, not optional.

## AI features (worker/)

- Model: `claude-haiku-5-5` for the Webmaster chat (cheap, fast). Upgrade only
  if quality requires it.
- Ground the chat on `directory.json` and the site's pages. It must not claim
  to browse the web or make up links.
- Rate-limit per IP, cap `max_tokens`, and use Turnstile on write endpoints.
- Persona: the friendly 1999 webmaster of 123ofnet.com. Plain, warm, a bit nostalgic,
  and honest that it is a bot.

## Git

- Author: `vinpatel` / bhavin500@yahoo.com (personal project, NOT the
  mindtrades identity).
- Small, focused commits. Deploys happen on push to `main` via GitHub Actions.

## Definition of done for any page

- [ ] Matches the original/1999 look (compare with `archive/screenshots/`)
- [ ] Works on a 375px-wide phone and at 800x600
- [ ] Works with JS disabled
- [ ] Passes HTML validation, alt text present, contrast AA
- [ ] Included in sitemap/llms.txt if public
