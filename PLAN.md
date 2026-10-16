# 123ofnet.com: Revival Plan

> 2000: "123ofnet.com: An easy solution to the Net !!!", a portal by three students in Baroda.
> 2026: "123ofnet.com: An easy solution to AI !!!" Domain re-acquired; site rebuilt to make money.

**Why and how it earns money: see [BUSINESS.md](BUSINESS.md).** This file is the build checklist.

---

## What we found in the archive
- 291 captures of 123ofnet.com from **Oct 2000 to 2005** (list: `archive/cdx-123ofnet.com.txt`).
  2013–2016 captures belong to a spam shop that took the lapsed domain, so ignore them.
- The original was a full portal: Email, Chat/IRC, Forums, eGreetings, Developer, Classifieds,
  News by topic (Computers, Business, Medicine, Electronics, Career), Movies, Music, Humor,
  Horoscope, Weather, Polls, Matchmaking, Newsletter, 20 MEGS free webspace, Editor program,
  and a DMOZ-style category directory. Sister site: MAILBARODA.COM.
- Team (from the 2000 Credits page): Bhavin D. Patel (Webmaster), plus two partners
  (programmer, marketing). Only Vin is named on the new site until the partners agree.
- 123ofnet.hypermart.net: 224 captures (2001–2004), the free-host site before the .com launch on 1 Nov 2000.
- 123ofnet.net: 113 captures (2001–2002), the free webspace service (members, signup, user sites). Not downloaded yet.
- 123ofcomputers.com: no captures and not registered. Waiting on Vin for the exact name or address.

## Phase 0: Recover the original
- [x] Find captures (domain is **123ofnet.com**, not 123of.net)
- [~] Download raw HTML/images → `archive/raw/123ofnet.com/` (in progress, archive is slow)
- [~] Screenshot every page → `archive/screenshots/123ofnet.com/` (in progress)
- [x] 123ofnet.hypermart.net: 126 files + 16 screenshots, shown on /1999/
- [ ] 123ofcomputers.com: confirm the address with Vin
- [ ] Recover original logo GIFs if any were archived

## Phase 1: Money site v1 (static, GitHub Pages)
- [x] 2001 look rebuilt: blue top bar, link strip, orange tagline strip, colour-coded boxes, 3 columns
- [x] AI Directory: 45 hand-checked tools in 10 categories, search filter, page per category
- [x] Get Listed page: Free / Fast Track $49 / Featured $149/mo, plus an 88x31 badge
- [x] Free AI Tools page (coming soon + newsletter capture), Advertise, About (2000 story), FAQ, Privacy
- [x] /1999/ museum page that shows the archived screenshots
- [x] llms.txt, sitemap, robots, JSON-LD (WebSite + SearchAction, ItemList per category)
- [ ] **Vin:** Stripe Payment Links → `src/_data/site.json` → `stripe.*`
- [ ] **Vin:** newsletter (Buttondown) form action → `site.json` → `newsletter.action`
- [ ] **Vin:** email for hello@123ofnet.com (GoDaddy email forwarding to your inbox)
- [x] Grow the directory past 100 tools; how-to-choose guides on every category
- [~] Grow to 200+ tools per category before launch (research agents + scripts/verify-tools.py + scripts/merge-tools.py)
- [ ] Add affiliate links where programs exist
- [ ] Launch post (Show HN, Reddit, X, LinkedIn) with before/after screenshots

## Phase 2: Free AI tools + Pro (Cloudflare Worker)
- [ ] `worker/`: Cloudflare Worker + D1 + Claude API (`claude-haiku-5-5`) + Turnstile
- [ ] AI Email Writer → Resume Fixer → eGreetings → Business Name Finder
- [ ] Free = 5 uses a day; Pro $9/mo via Stripe Checkout + webhook → D1
- [ ] Move DNS to Cloudflare (needed for `api.123ofnet.com`)

## Phase 3: "Make A Website For Free Today"
- [ ] AI homepage builder → `yourname.123ofnet.com`; Pro unlocks custom domains
- [ ] Newsletter sponsorships once the list reaches 5k
