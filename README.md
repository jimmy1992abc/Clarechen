# Clarechen.com.au

Personal homepage for Clare Chen. Built with **Jekyll** and hosted on **GitHub Pages** with a custom domain.

Live: <https://clarechen.com.au>

---

## How it works

GitHub Pages runs Jekyll automatically on every push to `main`. Markdown files in `_events/` and `_writing/` are compiled into real HTML pages at build time — no client-side fetching, no build tool to install locally.

**To add a new event or article: drop a `.md` file into the matching collection folder and push.** The listing pages and homepage update automatically.

---

## Folder structure

```text
Clarechen.com.au/
├── _config.yml              # Jekyll config: collections, plugins, site vars
├── Gemfile                  # Ruby deps (only needed for local preview)
│
├── _layouts/
│   ├── default.html         # Shared shell: <head>, header, main, footer
│   ├── event.html           # Event detail page (hero, meta, RSVP iframe)
│   └── writing.html         # Article page (title, lead, body)
│
├── _includes/
│   ├── head.html            # <head> contents + jekyll-seo-tag
│   ├── header.html          # Nav bar (with active-link highlighting)
│   └── footer.html          # Footer
│
├── _events/                 # One .md per event → /event/<slug>/
│   ├── welcome-to-the-world-party.md
│   └── design-workshop.md
│
├── _writing/                # One .md per article → /writing/<slug>/
│   ├── calm-systems-beat-heroic-effort.md
│   └── designing-a-homepage-that-feels-premium.md
│
├── event/
│   ├── index.html           # Event listing (loops site.events, filters upcoming)
│   └── thank-you.html       # RSVP confirmation + .ics calendar download
│
├── writing/
│   └── index.html           # Writing listing (loops site.writing)
│
├── assets/
│   ├── css/                 # site.css, timer.css
│   ├── js/                  # site.js (nav, intro, scrollbar), timer.js
│   └── img/                 # hero.jpg, halo.svg, noise.svg
│
├── .well-known/
│   └── security.txt
│
├── index.html               # Homepage (hero, upcoming events, recent writing, contact form)
├── robots.txt
├── CNAME                    # GitHub Pages custom domain
└── README.md
```

---

## Adding a new event

1. Create `_events/my-event-slug.md`:

   ```markdown
   ---
   title: "My Event Title"
   tags: [Party]
   date: 2026-06-15
   time: "3:00 PM"
   location: "Sydney"
   jotformId: "260778160100853"   # optional — omit or leave "" to hide the RSVP form
   description: "Short summary shown on cards and in SEO previews."
   ---

   ## About This Event

   Body content in markdown. Headings, lists, links all work.
   ```

2. Commit and push. Jekyll builds `/event/my-event-slug/index.html` automatically.

The event appears on the homepage (if upcoming, sorted nearest-first, top 2) and the `/event/` listing page. Past events are hidden automatically from both places — no manual cleanup.

---

## Adding a new article

1. Create `_writing/my-article-slug.md`:

   ```markdown
   ---
   title: "My Article Title"
   date: 2026-06-15
   readTime: "5 min read"
   description: "Short summary used for cards and OG previews."
   ---

   Body content in markdown.
   ```

2. Commit and push. `/writing/my-article-slug/` is built automatically.

---

## Front-matter reference

### Events (`_events/*.md`)

| Key           | Required | Notes                                                |
| ------------- | -------- | ---------------------------------------------------- |
| `title`       | yes      | Shown in hero, cards, `<title>`, OG.                 |
| `date`        | yes      | `YYYY-MM-DD` (unquoted). Used for sorting/filtering. |
| `tags`        | no       | `[Tag1, Tag2]`. First tag styled primary.            |
| `time`        | no       | Free text, e.g. `"11:00 AM"`.                        |
| `location`    | no       | Free text.                                           |
| `description` | no       | Card summary + OG description.                       |
| `jotformId`   | no       | JotForm ID. Omit or leave `""` to skip the embed.    |

### Writing (`_writing/*.md`)

| Key           | Required | Notes                      |
| ------------- | -------- | -------------------------- |
| `title`       | yes      |                            |
| `date`        | yes      | `YYYY-MM-DD` (unquoted).   |
| `description` | no       | Card summary + OG.         |
| `readTime`    | no       | Free text, e.g. `"5 min"`. |

---

## Plugins (all GitHub Pages whitelisted)

- **jekyll-seo-tag** — auto-generates `<title>`, meta description, OG, Twitter, canonical from front-matter.
- **jekyll-sitemap** — generates `/sitemap.xml` from all pages and collections.
- **jekyll-feed** — generates `/feed.xml` (RSS) from collections.

No custom plugins, no GitHub Actions needed — GH Pages handles the build.

---

## Local preview (optional)

You don't need this to ship — just pushing works. But if you want to preview locally:

```bash
bundle install
bundle exec jekyll serve
```

Site runs at <http://localhost:4000>. Requires Ruby 3.x.

---

## Styling

Single source of truth: [`assets/css/site.css`](assets/css/site.css). Design tokens live in `:root` at the top (colors, fonts, radius, shadows). Change a token and every component updates.

Page-specific styles (event detail, writing article, thank-you) live inline inside their respective layouts/pages — kept there because they only apply to one template.

---

## Contact form

Homepage contact form posts to JotForm and uses hCaptcha for spam protection. The captcha reveals on first submit attempt. No server needed.

---

## Notes on migration

This site was migrated from a client-side-rendered static site to Jekyll. The old pattern fetched markdown from `raw.githubusercontent.com` at runtime and parsed it in the browser, which caused SEO issues (crawlers saw empty pages), broke when the repo was renamed, and required copy-pasting HTML templates per event. Jekyll fixes all three by building real HTML at push time.
