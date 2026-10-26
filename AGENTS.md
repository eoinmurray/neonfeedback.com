# Neonfeedback agent guide

Read [README.md](README.md) for the repository overview and [site/README.md](site/README.md)
for Astro development and publishing. This repository follows Pinglab's Astro/MDX
presentation structure, with Neonfeedback's own content and experiment code.

1. Active writings live in `md/writings/`; archived writings live in `md/archive/`.
2. Experiments live in `experiments/expNNN/`, with `main.py`, `report/report.mdx`,
   and tracked `artifacts/`. Execute `uv run python experiments/exp001/main.py`.
3. Reports import experiment data and figures directly. Never hand-type computed results.
4. Preserve authored dates, prose, draft status, and archive membership during housekeeping.
   New substantive revisions should update `updated_at` in UTC.
5. Generated `site/dist/`, `site/.astro/`, and dependency caches are disposable.
6. Use `bun run dev --background` from `site/` for the server on port 3002;
   manage it with `bun run astro dev status`, `logs`, and `stop`.
7. Validate site changes with `bun run build` in `site/`.
8. Commits and PRs are authored as the human only; never add agent attribution trailers.
