# Proof-of-Concept Demo (Content Update → Build → Publish)

This is a short, beginner-friendly demo script you can present live. It shows:

- how content is updated (single source of truth)
- how the site is rebuilt locally
- how changes are published to GitHub Pages automatically

## What to say (30 seconds)

- “This repo is a static site generator for an AI consulting landing site.”
- “All site copy lives in one file: `content/site.yaml`.”
- “HTML pages are generated into `dist/` using Nunjucks templates.”
- “On every push to `main`, GitHub Actions rebuilds and deploys `dist/` to GitHub Pages.”

## Demo Part 1 — Update content (1 minute)

1. Open `content/site.yaml`.
2. Change something obvious, for example:

- `hero.headline`
- a bullet under `services[0].bullets[]`
- `site.tagline`

Example change (recommended for a clear visual diff):
- Update `hero.headline` to something noticeably different.

## Demo Part 2 — Rebuild locally (1 minute)

In a terminal:

```bash
npm install
npm run build
npm run dev
```

Then open and refresh:
- `http://localhost:5173/`

Call out:
- “I did not edit any HTML files.”
- “The generator re-rendered the pages into `dist/`.”

Optional: show that files were generated:

```bash
ls -la dist
```

## Demo Part 3 — Publish to GitHub Pages (1–2 minutes)

1. Commit and push:

```bash
git add content/site.yaml
git commit -m "Update headline (demo)"
git push
```

2. On GitHub:

- Go to **Actions** → open the latest workflow run.
- Show that it runs `npm ci` and `npm run build`.
- Show “Deploy to GitHub Pages” succeeding.

3. Visit the live URL and confirm the change is visible.

## One-time Pages setup (for a fresh fork)

If someone forks the repo, they may need to enable Pages once:

- Repo **Settings → Pages**
- Under **Build and deployment**, select **GitHub Actions**

After that, every push to `main` deploys.

## If something goes wrong

- If the site 404s: check **Settings → Pages** is set to **GitHub Actions**.
- If a build fails: check the workflow logs and validate YAML fields in `content/site.yaml`.
