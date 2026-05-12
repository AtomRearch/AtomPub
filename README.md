# AtomPub

> **Journal of Multiscale Energy Materials** — Quarto-native, bench-anchored, open access.

AtomPub is a working scientific journal. It ships as a single GitHub repository:
articles are `.qmd` files, the journal site is a Quarto project, the visual
system is packaged as a Quarto extension, and every push to `main` re-renders
the site and deploys it to GitHub Pages.

---

## What's in this repo

```
AtomPub/
├── AtomPub.html              # Hi-fi React prototype (Bloomberg dashboard + nav + dark/light)
├── styles.css                # Prototype's dark theme
├── theme-light.css           # Prototype's light theme overlay
├── atoms.jsx home.jsx …      # Prototype source
│
├── journal/                  # ← The real, deployable journal
│   ├── _quarto.yml
│   ├── index.qmd             # Home
│   ├── about.qmd
│   ├── bench.qmd             # Links into the prototype's dashboard
│   ├── sprints.qmd
│   ├── submit.qmd
│   ├── articles/
│   │   ├── index.qmd         # Listing page
│   │   └── evaporating-moat.qmd
│   ├── assets/
│   │   ├── logo.svg
│   │   └── og/               # 1200×630 social cards per article
│   └── _extensions/
│       └── atompub-light/    # The Quarto extension (theme + partials + template)
│           ├── _extension.yml
│           ├── theme.scss
│           ├── article-layout.css
│           ├── partials/     # title-block, toc, in-header, before/after-body
│           ├── pdf/          # LaTeX header for the matching PDF
│           └── template.qmd  # Starter for new articles
│
└── .github/workflows/publish.yml   # Build & deploy to GitHub Pages
```

---

## Run it locally

```bash
# 1 · install Quarto    https://quarto.org/docs/get-started/
brew install --cask quarto

# 2 · render & preview
cd journal
quarto preview          # live-reload at http://localhost:3434
```

For PDF output you'll also need a LaTeX toolchain (`quarto install tinytex`
covers it).

---

## Write a new article

```bash
cd journal/articles
cp ../_extensions/atompub-light/template.qmd my-paper.qmd
# … edit front-matter and prose …
quarto render my-paper.qmd
```

Drop a 1200×630 social card into `journal/assets/og/my-paper.png` and
reference it as `og-image: /og/my-paper.png` in the front-matter. Everything
else — masthead, TOC, action buttons, byline, Open Graph + Twitter +
`citation_*` meta tags — is generated automatically from the YAML.

---

## Deploy

This repo ships with a GitHub Actions workflow at
`.github/workflows/publish.yml` that, on every push to `main`:

1. Installs Quarto and TinyTeX
2. Runs `quarto render` inside `journal/`
3. Copies the React prototype's static files alongside the rendered site
4. Publishes everything to GitHub Pages

**One-time setup:**

1. Push this repo to `github.com/<you>/AtomPub`.
2. Go to **Settings → Pages → Source → GitHub Actions**.
3. Push to `main`. Wait ~3 minutes. The journal is live at
   `https://<you>.github.io/AtomPub/`.

That's the whole deployment story. See `DEPLOY.md` for a longer walkthrough
including custom-domain (CNAME) setup.

---

## License

- **Articles** — CC-BY 4.0 unless otherwise noted.
- **Extension + site code** — MIT.
- **ISSN** — 3027-1188 (placeholder; replace with the real allocation).
