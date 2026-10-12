# BUSINESS.md: How 123ofnet.com makes money

> 2001: **"123ofnet.com: An easy solution to the Net !!!"**, a site by three enterprising students.
> 2026: **"123ofnet.com: An easy solution to AI !!!"**

The goal is **revenue, not nostalgia**. The retro look is the hook that makes people
click, share and remember the site. The business underneath is plain and proven.

---

## 1. The thesis

In 2001, normal people needed help getting onto the Internet, and 123ofnet.com gave
them a single page with email, webspace, news, chat and a directory.

In 2026, normal people and small businesses need help **getting things done with AI**.
There are thousands of AI tools, and most people don't know which one to use or how.
123ofnet.com becomes that single page again: **a portal that picks the right AI tool for
you, plus free AI mini-tools that do the job right there.**

Two kinds of customers pay:

| Who pays | What they buy | Why they pay |
|---|---|---|
| **AI tool makers** (thousands of new launches every month) | Directory listings, featured slots, newsletter sponsorships | Traffic, backlinks, and getting recommended by AI assistants |
| **Regular users & small businesses** | 123ofnet Pro ($9/mo) for unlimited AI tools | Saves time on emails, resumes, websites and greeting cards |

Plus affiliate commissions from both.

---

## 2. Revenue streams (in launch order)

### A. Paid directory listings: launches in week 1, needs no backend
Every AI founder wants listings and backlinks. Comparable AI directories charge
$49–$499 per listing.

| Plan | Price | What they get |
|---|---|---|
| Free | $0 | Listed after human review (queue: about 4–6 weeks) |
| **Fast Track** | **$49 one-time** | Reviewed and listed within 48h + "Listed on 123ofnet" retro badge |
| **Featured** | **$149 / month** | Top of its category + homepage "What's NEW" box + one newsletter mention |

- Payment uses **Stripe Payment Links** with custom fields (tool name, URL, email).
  No server needed, so it can earn money on day 1.
- **The retro 88x31 badge** ("As seen on 123ofnet.com") is the growth loop: makers put
  it on their sites, and every badge is a backlink plus a curious click.

### B. Affiliate commissions: week 1
Many AI SaaS products pay 20–30% recurring commission. Directory and tool pages use
affiliate links where a program exists, marked with a small "(aff)" for honesty.

### C. Free AI tools → 123ofnet Pro ($9/mo): month 2
Each section of the 2001 portal comes back as a free AI tool. Free = 5 uses a day.
**Pro = unlimited + saved history + no ads, $9/mo or $79/yr.**

| 2001 section | 2026 AI tool | Search demand / intent |
|---|---|---|
| Email | **AI Email Writer**: polite reply, complaint, follow-up | Very high |
| Career | **Resume & Cover Letter Fixer**, interview practice | Very high, people pay |
| eGreetings | **AI Greeting Card Writer**: birthday, wedding, sympathy | High, seasonal spikes |
| Business | **Business Name + Domain Finder** | High, affiliate (domain registrars) |
| "Make A Website For Free Today" / "20 MEGS FREE WEBSPACE" | **AI Homepage in 60 seconds** at `yourname.123ofnet.com`. Pro: custom domain | High, recurring revenue |
| Humor / Horoscope | AI joke / daily horoscope | Pure traffic and sharing |

Cost: the Claude Haiku model costs a fraction of a cent per use. Each tool has a free daily
limit, IP rate limits and Turnstile to stop bots.

### D. "123ofnet Weekly" newsletter sponsorships: month 3+
The 2001 site had a newsletter box, so it comes back. Five new AI tools that actually work,
every week. Once the list passes about 5k subscribers, sell one sponsor slot per issue.
Featured listings already include a mention.

### E. Done-for-you AI setup: anytime, highest margin
"We'll set up AI for your small business": $499 one-time, plus an **AI-visibility audit**
via aeorank.dev (are ChatGPT/Claude/Perplexity recommending you?). This uses Vin's existing
AEO expertise and is the fastest cash.

---

## 3. Traffic plan

1. **Launch story** (the free spike): *"In 2000, three students built a web portal.
   26 years later I bought the domain back and rebuilt it for AI."* Post it as Show HN,
   on r/InternetIsBeautiful, r/webdev, X/Bluesky and LinkedIn. Include before/after screenshots.
2. **Product Hunt** launch for the free AI tools.
3. **SEO + AEO**: category pages ("Best AI tools for resumes"), tool pages, `llms.txt`,
   schema.org `ItemList`/`SoftwareApplication`. The goal is that AI assistants cite 123ofnet.
4. **Badge loop**: every listed maker gets a retro badge, and many will display it.
5. **Newsletter**: every page has the 2001-style "Join the mailing list" box.

---

## 4. Targets (goals, not forecasts)

| By | Goal |
|---|---|
| Day 14 | Live directory with 100+ hand-checked tools, payment links working, launch post out |
| Day 45 | 10+ paid listings, 1,000 newsletter subscribers. **If fewer than 5 paid listings: change focus to the tools and Pro** |
| Month 3 | 3 AI tools live, Pro launched, about $2–3k/month combined |
| Month 6 | AI Homepage builder live, newsletter sponsors, $5–10k/month |

## 5. Costs
- Domain ~$15/yr, GitHub Pages $0, Cloudflare Workers/D1 $0–5/mo
- Claude API: pay per use, capped by rate limits (budget $50/mo to start)
- Stripe ~3% per payment; Buttondown (newsletter) $0 → $9+/mo

## 6. What Vin needs to set up
1. **Stripe**: create 3 Payment Links (Fast Track $49, Featured $149/mo, Pro $9/mo) with
   custom fields: *Tool name*, *Tool URL*. Paste the URLs into `src/_data/site.json`.
2. **Buttondown** (or similar) newsletter account: paste the form action into `site.json`.
3. **Cloudflare** account (for the AI tools API in month 2) and an **Anthropic API key**.
4. Affiliate sign-ups for the tools in the directory that offer programs.

## 7. What we will NOT do
- Banner-ad clutter (the 2001 site had CNET/BitMagic banners, and that's exactly what to avoid)
- Auto-generated AI spam pages. Every directory entry is human-checked.
- Fake reviews, fake counters or fake urgency
