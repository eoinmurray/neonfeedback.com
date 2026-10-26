# Neonfeedback

Essays, poetry, stories, and computational notebooks by Eoin Murray, published at
[neonfeedback.com](https://neonfeedback.com). The Astro/MDX site uses Pinglab's
Distill article layout, collection browser, theme controls, and figure lightbox.

## Development

```sh
uv sync
cd site
bun install --frozen-lockfile
bun run dev --background         # http://localhost:3002
bun run astro dev status
bun run astro dev stop
bun run test
bun run build                    # public site in site/dist/; excludes drafts and archive
```

From the repository root:

```sh
uv run python experiments/exp001/main.py  # regenerate the experiment's tracked outputs
```

## Structure

1. `md/writings/`: active MDX writings, including drafts, with short title-based filenames.
2. `md/archive/`: archived MDX essays, available only during local development.
3. `experiments/exp001/main.py`: original dataset and analysis; `artifacts/` holds its
   generated figure and JSON; `report/report.mdx` imports them directly. The report
   remains archived, matching its previous placement.
4. `site/`: Astro application, shared components, styles, static vendor files, and Bun lockfile.

Article filenames use short title slugs; explicit `id` frontmatter preserves
existing URLs (for example, `doubtbound.mdx` remains at `/ar001`). Writings and Essays
are merged under Essays. `ar007` belongs to Essays and Drafts. Drafts and archived
articles, their collections and imported assets are available only in the local
Astro dev server; production and PR builds exclude them. The source files remain
in this public repository. Authored dates remain unchanged.

## Publishing

GitHub Actions builds the site and deploys `site/dist/` to the existing `gh-pages`
branch. Pages keeps its existing **Deploy from a branch** setting and custom domain
`neonfeedback.com`. PR previews remain under `pr-preview/pr-<number>/`; production
deployments preserve them. The committed experiment outputs let CI publish without
rerunning Python. Local static previews use `cd site && bun run preview --port 3002`.

See [site/README.md](site/README.md) for content authoring and local server commands.
