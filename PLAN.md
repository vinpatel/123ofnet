# 123ofnet.com — Revival Plan

> First built in 1999 by Vin Patel. Domain re-acquired October 2026.
> Goal: bring it back **looking exactly like 1999**, but **useful in the AI era**.

---

## 1. The big idea

In 1999 the web was small, human, and hand-made. You found things through
directories, webrings, guestbooks and friends' link pages. In 2026 most of the
web is AI-generated sludge, search results are summarised by models, and people
miss the feeling of a **real person's homepage**.

**123ofnet.com comes back as two things at once:**

1. **A time capsule.** The original 1999 site, restored pixel-for-pixel
   (frames/tables, GIFs, marquee, hit counter, "best viewed in 800x600").
2. **A living "small web" hub for the AI age.** Same retro skin, but the content
   and features solve 2026 problems:
   - **The 1-2-3 of the Net:** a human-curated directory of genuinely good,
     human-made sites and tools (Yahoo-1999 style categories), the antidote to
     AI search spam. Every link is hand-checked. Badge: "Human-picked ✋".
   - **AI "Webmaster" in a 1999 skin:** a chat helper that looks like an old
     AIM/ICQ window or a talking Clippy-style paperclip. It answers questions
     about the directory, recommends sites, and explains the web's history.
   - **Guestbook that comes back alive:** sign the guestbook like 1999.
     Optional AI-written "reply from the webmaster" (clearly labelled).
   - **Webring 2.0:** join the 123ofnet.com ring. Each member site gets a
     prev/next/random bar and gets listed in the directory.
   - **Machine-readable for AI agents:** `llms.txt`, JSON feed of the directory,
     and later an MCP endpoint, so AI assistants can cite and recommend
     123ofnet.com links. Ties directly into AEO (answer-engine optimisation) work at
     aeorank.dev — this site becomes a live showcase of AEO done right.

**Positioning line:** *"The web, before it got weird. Rebuilt for after."*

---

## 2. Why it can succeed now

| Trend (2026) | How 123ofnet.com rides it |
|---|---|
| Nostalgia for Web 1.0 / "small web", neocities, indieweb | Authentic 1999 site with a real 1999 origin story (not a pastiche) |
| Distrust of AI-generated content | Human-curated, every link verified by a person |
| AI assistants are the new search | `llms.txt` + structured data so ChatGPT/Claude/Perplexity cite it |
| Short-form social loves "look at this old site" | Shareable moments: hit counter, guestbook, "page under construction" GIFs |
| Builders want backlinks & discovery | Webring + directory listing = free discovery for indie makers |

**Growth plan (cheap, organic):**
- Launch post: "I bought back the domain of the first website I made in 1999"
  on Hacker News (Show HN), r/webdev, r/nostalgia, X/Bluesky, LinkedIn.
- Before/after: Wayback screenshot vs revived site.
- Invite indie makers to submit sites → each one shares their "I'm on the
  123ofnet.com ring" badge → backlinks and traffic loop.
- Monthly "Top 10 of the Net" email/RSS (yes, RSS — very on-brand).

**Possible revenue (optional, later):** "Featured site of the week" slots,
retro badge/88x31 button generator, sponsorship from privacy-friendly tools.
No banner-ad spam — that kills the vibe.

---

## 3. Tech decision

**GitHub Pages: YES for the site. NO for the AI/dynamic parts.**

| Piece | Host | Why |
|---|---|---|
| Static site (all pages, directory, archive) | **GitHub Pages** + custom domain `123ofnet.com` | Free, HTTPS, git history = site history |
| Build | **Eleventy (11ty)** via GitHub Actions | Outputs plain hand-written-style HTML; content lives in Markdown/JSON |
| AI webmaster chat, guestbook, hit counter, webring API | **Cloudflare Worker** + D1 (SQLite) + KV at `api.123ofnet.com` | GitHub Pages can't hold secrets or store data; Worker free tier is plenty |
| AI model | Claude API (`claude-haiku-5-5` for chat — cheap and fast) | Key lives only in the Worker as a secret |
| Spam protection | Cloudflare Turnstile on guestbook/submit forms | Guestbooks were spam magnets in 1999 too |

The site **must work 100% without the Worker** (pure static fallback): counter
shows a static number, chat window shows "Webmaster is AFK", guestbook shows
archived entries.

---

## 4. Phases

### Phase 0 — Recover the original (blocked on Wayback Machine being up)
- [ ] Confirm exact original URL(s) (`123ofnet.com`, `www.123ofnet.com`, any old host)
- [ ] Run `scripts/fetch-wayback.sh` to pull every 1999–2005 snapshot
- [ ] Save raw captures into `archive/raw/` (untouched, never edited)
- [ ] Screenshot each original page into `archive/screenshots/`
- [ ] Fill in the "Original site inventory" section of `DESIGN.md`
- [ ] Look for personal backups (old drives, email attachments, CD-ROMs)

### Phase 1 — Faithful restoration (`/1999/`)
- [ ] Rebuild every original page as static HTML under `site/1999/`
- [ ] Strip Wayback toolbar/rewrites, restore original asset paths
- [ ] Keep original GIFs, colours, fonts, table layouts exactly
- [ ] Add a small, dismissible "You are viewing 123ofnet.com as it was in 1999" banner

### Phase 2 — Modern site, retro skin (`/`)
- [ ] Set up repo `vinpatel/123ofnet`, Eleventy, GitHub Actions → Pages
- [ ] `CNAME` = `123ofnet.com`, DNS A/AAAA records → GitHub Pages, enforce HTTPS
- [ ] Homepage in the 1999 look with new sections: Directory, Webring,
      Guestbook, Webmaster chat, "The 1999 site"
- [ ] Directory data in `src/_data/directory.json` (human-curated)
- [ ] Mobile: same look, but it must not break on a phone (see DESIGN.md)
- [ ] `llms.txt`, `sitemap.xml`, `robots.txt`, `feed.xml`, JSON-LD

### Phase 3 — Living features (Cloudflare Worker)
- [ ] Hit counter (real, persistent, retro digit GIFs)
- [ ] Guestbook (D1 + Turnstile + moderation queue)
- [ ] AI Webmaster chat (Claude API, grounded on directory data, rate-limited)
- [ ] Webring join/next/prev/random endpoints + 88x31 badge
- [ ] "Submit a site" form → moderation queue

### Phase 4 — Launch & grow
- [ ] Launch post + Show HN + socials
- [ ] Monthly "Top 10 of the Net" RSS/email
- [ ] MCP endpoint so AI agents can query the directory
- [ ] Track AEO results (are AI assistants citing 123ofnet.com?) via aeorank.dev

---

## 5. Open questions for Vin
1. What was the 1999 site about? (personal homepage, links directory, tips, fan site?)
2. Any original files on old backups?
3. Exact original URL — was it always `123ofnet.com`, or hosted elsewhere first?
4. OK to use Cloudflare for DNS + Worker? (recommended)
5. Should the AI webmaster speak "as Vin, 1999 edition" or as a separate character?
