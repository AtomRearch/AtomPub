<p align="center">
  <img src="journal/assets/logo.svg" width="200" height="47" alt="AtomPub" />
</p>

<p align="center">
  <strong>A journal-flavored academic blog for researchers who have something to say.</strong><br/>
  <a href="https://atomrearch.github.io/AtomPub/">atomrearch.github.io/AtomPub</a>
  &nbsp;·&nbsp;
  <a href="README.zh.md">中文版 →</a>
</p>

---

AtomPub **looks** like a journal. It is a curated academic blog — edited by [Zhengqian Jin](https://jingshengluo.github.io) (XJTU, EKL), open to contributions from peers who don't have their own platform or just want a second home for their work.

No publisher. No formal peer review. No embargo. Every article gets a permanent URL and a stable citation ID in the form `AP-YYYY-slug` — cite it like you would a preprint.

## What lives here

| Category | What it means in practice |
|---|---|
| **Op-ed** | The take you'd rather write than sit on |
| **Reading notes** | When a paper deserves more than a tweet |
| **Method write-up** | The protocol you actually used, not the boilerplate |
| **Data note** | Preliminary results that shouldn't disappear into a lab notebook |

## How to contribute

**Option A — GitHub PR (preferred)**

```bash
# 1. Fork https://github.com/AtomRearch/AtomPub
# 2. Copy the template:
cp journal/_extensions/atompub-light/template.qmd journal/articles/your-slug.qmd
# 3. Write your piece. Set `atompub-id: AP-YYYY-your-slug` in the front-matter.
# 4. Open a PR titled: "Submission: Your Article Title"
```

Optionally include `references.bib` and an OG image at `journal/assets/og/your-slug.png` (1200 × 630 px).

**Option B — Email**

Send your `.qmd` to `atomfeed@163.com` · subject: `AtomPub submission: Your Title`.

## Run locally

```bash
# Requires Quarto ≥ 1.4  →  https://quarto.org/docs/get-started/
cd journal
quarto preview      # live-reload at http://localhost:3434
```

## Quick publish (maintainer only)

Double-click **`push-article.bat`** at the repo root → paste the `.qmd` path → done.
The article goes live in ~2 minutes via GitHub Actions.

## Repo layout

```
AtomPub/
├── journal/                  ← the deployable site
│   ├── _quarto.yml
│   ├── index.qmd             home
│   ├── about.qmd
│   ├── submit.qmd
│   ├── articles/             one .qmd per article
│   ├── assets/               logo, OG images
│   └── _extensions/
│       └── atompub-light/    custom Quarto theme + partials
├── push-article.bat          one-click publish script
└── .github/workflows/        build → deploy to GitHub Pages
```

## Stack

[Quarto](https://quarto.org) · custom `atompub-light` extension · GitHub Pages · GitHub Actions.
The extension handles masthead, TOC, OG/Twitter metadata, and byline automatically from YAML front-matter.

## License

Articles: **CC-BY 4.0** · Extension + site code: **MIT**
