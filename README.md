# Redistributable AI Consultant Website Generator (GitHub Pages)

A lightweight static site generator for an AI consultant website.

- **Single source of truth:** `content/site.yaml`
- **Templates:** `templates/*.njk` (Nunjucks)
- **Build output:** `dist/` (deploy this to GitHub Pages)
- **Hosting:** GitHub Pages (via GitHub Actions)

## Prerequisites

- Node.js **20+**

## Quick start (local)

```bash
npm install
npm run build
npm run dev
```

Then open: `http://localhost:5173`

## Update content

1. Edit `content/site.yaml` (this is the ONLY place you edit copy)
2. Rebuild:

```bash
npm run build
```

No manual HTML edits required.

## Pages generated

The build generates a small multi-page site (flat files):

- `dist/index.html`
- `dist/about.html`
- `dist/services.html`
- `dist/process.html`
- `dist/contact.html`

Navigation links are driven by `ui.navigation` in `content/site.yaml`.

## Content schema (what you edit)

The build expects these top-level keys in `content/site.yaml`:

- `site`: name/title/tagline/description
- `ui`: navigation + labels (no hardcoded text in templates)
- `hero`: headline/subheadline + CTA labels/links
- `about`: headline/bio
- `services`: array of services (`id`, `title`, `summary`, `details`, optional `bullets[]`)
- `process`: headline + `steps[]`
- `contact`: headline/intro/email/linkedin/linkedin_label/call_to_action
- `footer`: copyright

Notes:

- The site can be configured to **not display your email address** on the page (to reduce scraping) while still providing an **Email** button/link via `mailto:`.
- The primary hero CTA (`hero.primary_cta`) currently routes to the Contact page by default.

## Deliverable: Live URL

After deploying, paste your GitHub Pages URL here:

- Live site: (add URL)

## Proof-of-concept demo (what to show)

Use the step-by-step demo script here:

- [DEMO.md](DEMO.md)

Quick checklist:

1. Edit `content/site.yaml` (change `hero.headline` or a service bullet)
2. Run `npm run build` and `npm run dev` (refresh `http://localhost:5173`)
3. Commit + push
4. Show the GitHub Actions run + the updated GitHub Pages site

## Project structure

```
content/
  site.yaml            # single source of truth
templates/
  layout.njk           # base template
  index.njk            # home page
  about.njk            # about page
  services.njk         # services page
  process.njk          # process page
  contact.njk          # contact page
assets/
  style.css            # static CSS
scripts/
  build.mjs            # build script
  clean.mjs            # remove dist/
dist/                  # generated output (do not edit)
.github/workflows/
  deploy.yml           # GitHub Pages deployment
```

## Deploy to GitHub Pages (recommended)

This repo includes an Action that:

- builds the site on push to `main`
- publishes `dist/` to GitHub Pages

### One-time GitHub setup

1. Push this repo to GitHub.
2. In GitHub, go to **Settings → Pages**.
3. Under **Build and deployment**, select **GitHub Actions**.

After that, every push to `main` deploys.

## Acceptance test (fresh fork)

From a brand new clone:

```bash
npm install
npm run build
```

If `npm run build` succeeds, GitHub Actions will also succeed.

## Troubleshooting

- **Build fails with validation errors**: check required fields in `content/site.yaml` like `site.name`, `site.description`, `services`, `contact.email`.
- **GitHub Pages shows a 404**: confirm Pages is set to **GitHub Actions** and the workflow ran successfully.
- **Styles missing**: ensure `assets/style.css` exists and the build copied it into `dist/assets/style.css`.

## Optional AI copy generation (not required)

You can add an optional script later to generate draft copy into `content/site.yaml` using a token-billed API.
Deployment must remain independent of any AI key.
