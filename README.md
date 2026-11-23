# 123ofnet.com

> Est. 1999. Back online in 2026.

The first website Vin Patel ever built, revived with its original 1999 look
and rebuilt for the AI era: a human-curated directory of the good web, a
guestbook, a webring, and an AI webmaster who still thinks 800x600 is a big
screen.

- **Roadmap:** [PLAN.md](PLAN.md)
- **Look & feel:** [DESIGN.md](DESIGN.md)
- **For AI agents/contributors:** [AGENTS.md](AGENTS.md)
- **The directory as an open list:** [vinpatel/awesome-ai-tools](https://github.com/vinpatel/awesome-ai-tools) (built weekly by `scripts/build-awesome.mjs`; removed tools with reasons go in `data/removed.json`)

## Stack
- Static site: Eleventy → GitHub Pages (`123ofnet.com`)
- Dynamic bits: Cloudflare Worker (`api.123ofnet.com`) + D1 + Claude API

## Recover the original
```bash
./scripts/fetch-wayback.sh 123ofnet.com
```

*Best viewed in Netscape Navigator 4.0 at 800x600.* 🚧
