# Neonfeedback Astro site

This is the adapted Pinglab presentation layer: self-hosted Distill v2 styles and
runtime, article layout, collection browser,
theme controls and figure lightbox. Content and generated evidence
belong to Neonfeedback; no Pinglab datasets or remote storage are required.

```sh
bun install --frozen-lockfile
bun run dev --background             # port 3002
bun run astro dev status
bun run astro dev logs
bun run astro dev stop
bun run test
bun run test:render                 # render every local article, including drafts/archive
bun run build                      # public content only, with publication checks
bun run preview --port 3002
```

## Content

1. Write MDX in `../md/writings/`, `../md/drafts/`, or `../md/archive/`, using short title-based
   filenames such as `doubtbound.mdx` and `programmer-and-priest.mdx`.
2. Experiment reports use `../experiments/expNNN/report/report.mdx`; import data and
   images from the experiment's `artifacts/` directory.
3. Required frontmatter: `title`, `author`, `created_at`, `updated_at`, and `collection`.
   Optional fields include `description`, `abstract`, `status`, and `archived`.
   Experiment reports also require `id`; `tags` defaults to an empty array.
4. Dates use quoted UTC datetimes (`2026-10-26T12:00:00Z`); historical date-only
   entries remain supported for both dates. Preserve historical dates during format-only migrations.
5. Public article IDs must be unique across writings, drafts, archive, and experiments.
   Optional `id` frontmatter preserves an existing URL independently of the
   filename; without it, the filename determines the ID. Existing article URLs
   remain at the root (`/ar001`, `/exp001`).
6. Writings and Essays share the Essays collection (`essays`). Files in `md/drafts/`
   always belong to Drafts and remain local-only. Drafts use `drafts`;
   `status: draft` also adds that membership automatically. Archive membership follows
   `md/archive/`, `archived: true`, or an explicit `archive` collection.
   Drafts and archived content appear only in local development, including their
   article URLs. Both are excluded from All Articles and remain available through
   their local collection lists. Production and PR builds exclude their MDX and imported assets
   before compilation; the build checks verify that they were not emitted.
   Local collections are `/collections/drafts` and `/collections/archive`; the old
   `/archive` URL redirects locally. Authored dates and prose remain unchanged.
7. Use native Markdown math (`$...$`, `$$...$$`) for KaTeX. Use Markdown tables,
   headings, links, and lists; import Astro components for richer content.
8. Article lists use descending article numbers. Dates sit beneath the title,
   without collection badges or article statistics. Article pages show the created
   date directly below the title, without a table of contents. The homepage includes the
   collection sidebar; the top navbar spans the wider page layout.
   Theme cycles through system, light, and dark.

Astro builds file-style HTML with extensionless canonical URLs on
`https://neonfeedback.com`. Use Astro preview when checking the static output;
Python's basic HTTP server does not resolve those routes. Development and production
use separate Vite and content caches so public builds do not change the local
view of drafts or archived content. `bun run build` uses `production/` as its Astro
root to isolate generated MDX import maps too; changing only `cacheDir` does not
isolate those maps. Title-based filename URLs redirect to the stable article IDs.

Set `SITE_BASE_PATH=/pr-preview/pr-123` when building a PR preview. Links,
public assets, and compiled assets include that prefix; canonical article URLs
continue to identify the production article.

This controls the published website, not repository access: source files remain
in the public GitHub repository.

Distill licensing and authorship are preserved in `public/vendor/distill/`.
