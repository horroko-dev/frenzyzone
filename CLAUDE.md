# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FrenzyZone is a static site — a Diablo II Resurrected duo leveling guide (Frenzy Barbarian + Javazon). Built with Eleventy (v3) using Nunjucks templates, deployed to GitHub Pages via GitHub Actions on push to `master`.

## Commands

- **Dev server:** `npm run serve` (runs `eleventy --serve`)
- **Build:** `npm run build` (runs `eleventy`, outputs to `_site/`)
- **Install deps:** `npm ci`

No tests or linter configured.

## Architecture

- **Static site generator:** Eleventy 3.x with Nunjucks templating
- **Config:** `eleventy.config.js` — input from `src/`, output to `_site/`, passthrough copies `src/css` and `src/js`
- **Path prefix:** Controlled via `ELEVENTY_PATH_PREFIX` env var (defaults to `/`)

### Source structure (`src/`)

- `index.njk` — Single-page app, all sections (synergy, leveling, gear, attributes, mercs, charms, farming, tips)
- `_includes/base.njk` — HTML layout (nav, footer, particle canvas, Google Fonts)
- `_includes/components/` — Reusable Nunjucks partials for each section type (build-card, timeline-phase, gear-column, stat-block, merc-card, charm-card, farm-card, tip-card, icons, section-header)
- `_data/` — JSON files driving all content (leveling.json, gear.json, synergy.json, farming.json, attributes.json, mercs.json, charms.json, tips.json). Eleventy auto-loads these as template globals by filename.
- `css/style.css` — All styles in one file
- `js/main.js` — Client-side JS (gear tabs, farm filters, particle effects, scroll behavior)

### Deployment

GitHub Actions workflow (`.github/workflows/pages.yml`) deploys `_site/` to GitHub Pages on push to `master`. Uses Node 22.
