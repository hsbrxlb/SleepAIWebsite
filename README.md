# SleepAIWebsite

Static marketing site for SleepAI / Pufflo.

## What lives here

- `index.html`: homepage
- `assets/`: shared CSS, JS, and image assets
- `ai-sleep-tracking/`, `ai-sleep-stories/`, `pufflo-ai-companion/`, `pufflo-vs-other-sleep-apps/`: core feature pages
- `blog/`: blog hub and article pages
- `how-pufflo-understands-you/`, `personalized-sleep-stories-by-pufflo/`: supporting SEO pages

## Local source of truth

This folder is the publishable site output.

The site is generated from:

- `/Users/oliver/Downloads/SleepAI/build_sleepai_seo_site_exact.py`

Internal docs and original crawl archives are intentionally kept outside this repo, in sibling local folders, so the GitHub repo stays clean and public-safe.

## Maintenance

- Rebuild the site from the generator before publishing major content or layout changes.
- Keep public repo contents limited to the deployable website.
- Do not add internal planning docs, archived captures, or raw reference files here.
