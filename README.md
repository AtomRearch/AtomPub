<p align="center">
  <img src="journal/assets/logo.svg" width="200" height="47" alt="AtomPub" />
</p>

<p align="center">
  <strong>A journal-styled academic writing platform — op-eds, reading notes, method write-ups, and research observations.</strong><br/>
  <a href="https://atomrearch.github.io/AtomPub/">atomrearch.github.io/AtomPub</a>
  &nbsp;·&nbsp;
  <a href="README.zh.md">中文版 →</a>
</p>

---

AtomPub is an independent academic publication edited by [Zhengqian Jin](https://jingshengluo.github.io). Contributions from peers are welcome.

Every article gets a permanent URL and a stable citation ID in the form `AP-YYYY-slug`.

## What lives here

| Category | What it means in practice |
|---|---|
| **Op-ed** | The take worth writing down |
| **Reading notes** | When a paper deserves more than a tweet |
| **Method write-up** | The protocol actually used, not the boilerplate |
| **Data note** | Preliminary results that shouldn't disappear into a lab notebook |

## How to contribute

**Option A — GitHub PR (preferred)**

```bash
# 1. Fork https://github.com/AtomRearch/AtomPub
# 2. Copy the template:
cp journal/_extensions/atompub-light/template.qmd journal/articles/your-slug.qmd
# 3. Write the piece. Set `atompub-id: AP-YYYY-your-slug` in the front-matter.
# 4. Open a PR titled: "Submission: Your Article Title"
```

Optionally include `references.bib` and an OG image at `journal/assets/og/your-slug.png` (1200 × 630 px).

**Option B — Email**

Send the manuscript in any format (`.qmd`, Word, plain text) to `atomfeed@163.com`.
Subject: `AtomPub submission: Title`. Formatting will be handled on our end.

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
