# Framework feature catalog

A catalog of **framework features** in the demolab template. Downstream repos
don't copy these files — their coding agents reimplement the features they want,
their own way, using this repo as reference (see the **Updating the framework** runbook in `AGENTS.md`). This catalog is
the menu. It does *not* track content (notebooks, posts, tools) — that's
each repo's own.

Each `## [x.y.z]` entry is one batch of features, newest first. A downstream
agent reads the entries newer than the version it last reviewed, and the user
picks which to adopt. Describe features by intent and behavior so they can be
rebuilt from the description plus the code.

Versioning: **major** = a feature that changes a contract others may have built
on · **minor** = a new additive feature · **patch** = a small fix.

## [0.22.0] - 2026-07-03

### Changed
- **Publishing rebuilt on Typst — Astro/Node removed entirely (major).** The web
  site, per-entry PDFs, and a combined book are now compiled from one Typst *bundle*
  (`typst compile --format bundle --features bundle,html`, experimental) by
  `demolab-engine/build.py`, replacing the Astro/`bun` stack. Writings are `.typ` files
  (a `#let meta` + `#let body`) that read their run natively via `json()` / `#image()`,
  so the numbers still can't drift. `demolab-engine/lib.typ` is the shared engine
  (`numbers-table`, `video`, `provenance-footer`, the page templates + an `outline()`
  book TOC); `demolab-engine/style.css` is the web look. Three targets in one pass:
  `artifacts/site/` (HTML — index + a page per entry, inline figures, playable
  `<video>`, MathML) and `artifacts/site/pdfs/` (per-entry PDFs + `book.pdf`),
  mirrored to the committed `artifacts/pdfs/`.
- **Toolchain: `typst` CLI in, `bun`/Node out.** `task doctor` checks `uv` · `typst`
  · `task`; `task build` runs the bundle; `task dev` uses `typst watch`'s built-in
  HTTP server + live reload on `:3000`; `task slides` compiles standalone decks
  (`writings/*.typ` with no `#let meta`/`#let body`). CI (`deploy.yml`) installs
  typst, runs `demolab-engine/build.py`, and deploys `artifacts/site/` — it needs no `uv`
  (the build script is pure stdlib + the typst CLI).
- **In-browser interactivity deprecated to Streamlit.** Static Typst HTML has no
  client-side JS, so interactive exploration lives in `playground/` (`task
  playground`). The web pages still play videos and render live numbers.

### Removed
- `demolab-web/` (the Astro engine), all `.mdx` writings, the `<NumbersTable>` Astro
  component + content collections, the `typst` PyPI dependency (the CLI replaces it),
  and the Astro embed workflow template. Content dropped: `nb004` (redundant now that
  every entry compiles to a PDF) and `ar008` (the in-browser-interactivity article).
- **The `ruff` lint / import-firewall.** The `tools` ↔ `experiments` boundary is now a
  documented *convention*, not enforced tooling — no `ruff.toml`, no dev dependency —
  simpler for a non-developer audience. (There was never a type checker; the vestigial
  `.mypy_cache/` ignore is gone too.) `pytest` stays as the one quality gate.

## [0.17.0] - 2026-07-03

### Added
- **`neuron lif` CLI exposes the full membrane param set** (`--tau-m`, `--r-m`,
  `--v-rest`, `--v-reset`, `--v-thresh`) on top of `--current`/`--duration`/`--dt`.
  Defaults preserve prior behavior; notebooks can now sweep the membrane, not just
  the input.

### Changed
- **The interactive playground drives the tool CLI instead of reimplementing it.**
  `core/playground/app.py` used to carry its own copy of `simulate_lif` — a drift
  risk. It now subprocesses `neuron lif` on each slider change and reads back the
  run's `lif.csv` (trace) + `output.json` (metrics), the same mechanism notebooks
  use. One copy of the science, reached through the one CLI. The cost is a subprocess
  (~0.3 s) per slider settle vs an in-process call; accepted in exchange for a single
  code path. Pattern for downstreams: an interactive demo can be a *consumer* of a
  tool CLI, not a fork of it.

## [0.16.1] - 2026-07-02

### Added
- **`task playground`** wraps the non-obvious Streamlit launch
  (`uv run streamlit run core/playground/app.py`) so the interactive demo is
  discoverable in `task --list` instead of being folklore.

## [0.21.0] - 2026-07-03

### Changed
- **Renamed `core/` → `tools/`.** The directory holds *tools* (data-in/data-out
  CLIs), and the system's own vocabulary already calls them that — but "core"
  misleadingly connoted framework-essential internals when it's actually the
  opposite: deletable demo science, the first thing cleared when a user starts
  their own lab. Every other content dir says what it holds; this aligns the last
  one. The rename touched more than paths: the importable Python package (tests now
  `from tools.<x>.tool import …`), `pytest` `testpaths`, the ruff import-firewall
  keys (`tools` ↔ `experiments`, in `tools/ruff.toml` + `experiments/ruff.toml`),
  the provenance dirty scope (`:/tools :/experiments`), the runner `TOOL` paths, the
  Streamlit app, and docs.

## [0.20.0] - 2026-07-03

### Changed
- **Reverted the web publisher back to `demolab-web/`** (undoing `[0.19.0]`'s move
  to `demolab-engine/web/`). The `demolab-engine/` wrapper only ever held `web/`,
  and nothing else could join it: the rest of the root — `ruff.toml`,
  `pyproject.toml`, `Taskfile.yml`, `.github/`, the `AGENTS`/`README`/etc. docs — is
  discovered *at the repo root* by uv/task/ruff/git/agents (they walk up the tree,
  not sideways into a sibling dir). So the nesting was a single-child container
  adding a directory level to every relative path for no grouping benefit.
  Depth-sensitive paths restored (`../writings`, `fs.allow: ['..']`, and the
  `[...id].astro` numbers.json read).

## [0.19.0] - 2026-07-03

### Changed
- **Web publisher moved from `demolab-web/` to `demolab-engine/web/`.** Namespaces
  the framework engine under `demolab-engine/`, leaving room for other engine pieces
  beside the Astro `web/` publisher. Because it drops a directory level deeper, the
  depth-sensitive paths were adjusted: the content glob `base` (`../../writings`),
  vite `fs.allow` (`../..`), and the notebook page's `numbers.json` read (one more
  `../`); plus the CI `working-directory`/upload path, the `writings/*.mdx` component
  imports, and the Taskfile `dir:`. Downstream: if you adopt the nesting, remember it
  changes every relative path the Astro app uses to reach the repo-root content dirs.

## [0.18.0] - 2026-07-03

### Changed
- **Streamlit playground moved out of `core/` to a top-level `playground/`.** `core/`
  is for **tools** — data-in/data-out CLIs that follow the manifest contract and
  ship tests. The Streamlit app follows none of that (no manifest, no artifacts,
  exempt from testing); sitting inside `core/` alongside `neuron`/`mujoco` made it
  read like a third tool. It's an *app*, so it now lives beside `demolab-web/` as a
  top-level sibling. `core/` is homogeneous again: everything in it is a tool. Only
  the launch path changed (`task playground` → `playground/app.py`); the app still
  drives the `neuron lif` CLI, unchanged.

## [0.17.0] - 2026-07-03

### Changed
- **Tools emit data, not plots (contract change).** A tool now writes the CSV a
  figure is drawn *from* and declares only `headline_metrics`; it no longer
  renders matplotlib PNGs. Drawing the figure moved to the **notebook runner**
  (`experiments/nbNNN.py` reads the tool's CSV and renders the `.png` into
  `artifacts/`), so Streamlit, the web, and the PDF all plot the *same* data and
  the tool stays a generic data-in/data-out primitive. The **one exception is a
  rendering** — a physics video (`mujoco` → `.mp4`) — which a tool still produces,
  since it isn't a plot of tabular data. `write_output` is now identical across
  tools (metrics required; a declared `headline_video`/`headline_figure` must
  exist); data tools declare no asset. Reference: the `plot_trace`/`plot_network`
  helpers in `experiments/nb000.py`, and `core/neuron/tool.py` (now plot-free).
  Downstream: move any plotting out of your tools into the runner; keep video
  rendering in the tool.

### Fixed
- **Provenance `dirty` flag never actually detected a dirty tree.** `_run_provenance`
  ran `git status --porcelain -- core experiments` with `cwd` set to the tool's
  own dir (`core/<tool>/`), so the pathspecs resolved relative to *there*
  (`core/<tool>/core`, …), matched nothing, and `dirty` was **always `False`** —
  every published result silently claimed a clean tree. Fixed with the repo-top
  magic pathspec `:/core :/experiments`, which is correct regardless of cwd.

## [0.16.0] - 2026-07-02

### Changed
- **`task new` is now a signpost, not a scaffolder.** It used to stamp out a stub
  `.py` (a docstring + a `# TODO`, no `COMMANDS`, nothing runnable) and a
  placeholder `.mdx` from a brittle YAML heredoc — too thin to be a usable
  template. It now just prints a one-screen hint telling the user to have their
  coding agent scaffold a *working* skeleton by modeling on an existing runner
  (real `COMMANDS`, the figure import, a `<NumbersTable>`), which the
  Getting-started runbook directs. The command survives only to catch muscle
  memory and redirect, instead of erroring with "task not found."

## [0.15.0] - 2026-07-02

### Changed
- **Content directories renamed for a scientist-reader: `scripts/` → `experiments/`
  and `entries/` → `writings/`.** The two halves of a notebook now read as what
  they are — an *experiment* (the runner that produces results) and a *writing*
  (the prose that presents them), paired by id. This is a naming convention, but
  it touches framework wiring a downstream agent should mirror if it adopts the
  names: the Astro content loader's glob `base` (`../writings`), the Typst `task
  pdf`/`pdf-one` globs, `task run` paths, the ruff import-firewall keys
  (`core/ruff.toml` bans importing `experiments`; `experiments/ruff.toml` bans
  `core`), and the provenance `dirty` scope in each `tool.py`
  (`git status -- core experiments`). The internal Astro collection keeps its
  generic name `entries` (items-in-a-collection); only the folder is `writings/`.

## [0.14.0] - 2026-07-02

### Changed
- **Runbooks (`AGENTS.md`) brought in line with the current system.** They now
  drive with the `task` commands (`install`/`dev`/`run`/`build`/`test`/`doctor`/
  `new`/`pdf-one`); tell the agent to render post tables with `<NumbersTable>`
  from `numbers.json` instead of hand-typing them (was actively wrong — it
  defeated the no-drift guarantee); require a test for each new or wrapped tool;
  note the `core` ↔ `scripts` import firewall in the migrate flow; cover the
  Typst PDF path; and explain the automatic provenance stamp (commit code before
  a run you'll publish, so the footer reads clean).

## [0.13.0] - 2026-07-02

### Changed
- **Operating manual moved to `AGENTS.md`** (the agent-agnostic standard file),
  with a thin `CLAUDE.md` that points to it — so any coding agent, not just
  Claude Code, discovers the runbooks. All docs now reference `AGENTS.md`.

## [0.12.0] - 2026-07-02

### Added
- **Web posts read `numbers.json` — no more drift.** A `<NumbersTable>` component
  (`demolab-web/src/components/`) renders a post's parameter/metric table straight
  from the committed `numbers.json`, and the demo posts import it instead of
  hand-typing tables — so the numbers on the page come from the run, provably.
  The Typst example (`nb004`) now shows the same provenance footer as the web
  posts.

### Fixed
- The provenance `dirty` flag now reflects uncommitted **code** (`core`/`scripts`)
  only, not regenerated outputs — so batch-regenerating artifacts no longer marks
  a run dirty.

## [0.11.0] - 2026-07-02

### Added
- **Run provenance.** Each tool run stamps a `_provenance` block into
  `config.json` (git commit SHA, a `dirty` flag for uncommitted changes at run
  time, and a UTC timestamp), which flows into the committed `numbers.json`. So
  every published result records exactly which code produced it — and honestly
  flags results built from a dirty tree. The web engine renders it as a footer
  on each notebook post ("Generated from commit `abc1234` · <date>"). Degrades
  gracefully outside a git repo (`commit: null`).

## [0.10.1] - 2026-07-02

### Added
- **Typst PDF build tasks** — `task pdf` compiles all `entries/*.typ`, `task
  pdf-one -- nb004` compiles one, both from existing artifacts (no tool re-run).
  The print-side counterpart to `task build` (which publishes the website).
- **Compiled PDFs live in a committed top-level `pdfs/`** — not in `temp/` (raw
  scratch). They're committed (unlike the website's gitignored `dist/`) because
  there's no CI pipeline compiling them, so committing is how you host and link
  a PDF on GitHub. Same rationale as the committed `artifacts/` record.

## [0.10.0] - 2026-07-02

### Changed
- **Web engine uses one `entries` collection** instead of separate `notebooks`
  and `articles` globs over the same dir; kind is derived from the id prefix
  (`nb*` / `ar*`) in `lib/entries.ts`. The site now builds cleanly with no
  content — clearing the demo (notebooks but no articles) no longer spews
  "collection is empty" warnings. The homepage shows a friendly empty state when
  there are no entries, and the clear-the-demo runbook step runs `task clean` so
  a stale content cache can't error the next build.
- **Getting-started fix:** a first experiment now goes in its *own* new
  `core/<tool>/` — never as a subcommand of a shipped demo tool, which step 5
  deletes (that would take the user's work with it).

### Added
- **`task doctor`** (checks the uv/bun toolchain) and **`task new -- nbNNN`**
  (scaffolds a runner + entry pair). `demolab-web/.env.example` documents the
  serve/branding env vars.

## [0.9.3] - 2026-07-01

### Changed
- **mujoco tool: extracted pure physics primitives.** `simulate_cartpole` and
  `simulate_double_pendulum` are now standalone data-in/data-out functions; the
  command handlers call them with an `on_frame` hook that renders live. mujoco
  now follows the same "generic primitive" shape as neuron, and its tests
  exercise the real functions instead of re-stepping the model. Behavior-
  preserving: nb002/nb003 metrics and mp4 output are byte-identical.

## [0.9.2] - 2026-07-01

### Added
- **Each tool in `core` ships tests** (`core/<tool>/test_<tool>.py`, run via
  `task test` / `uv run pytest`). `core` is now an importable package
  (`__init__.py` added) so tests import the science directly. `neuron` unit-tests
  its `simulate_*` primitives (shapes, spiking properties, seed determinism) and
  the `write_output` manifest contract; `mujoco` steps its MJCF models headlessly
  (no Renderer) to check the physics (pole falls, double pendulum diverges). Adds
  `pytest` as a dev dependency. The Streamlit playground is exempt.

## [0.9.1] - 2026-07-01

### Added
- **`core` ↔ `scripts` import firewall (ruff).** Scoped `core/ruff.toml` and
  `scripts/ruff.toml` ban imports across the boundary in both directions
  (`TID251`): `scripts` may not import `core`, and `core` may not import
  `scripts`. Runners reach tools through the file contract (subprocess a tool
  CLI), keeping tools generic and oblivious to experiment logic. Adds `ruff` as
  a dev dependency.

## [0.9.0] - 2026-07-01

### Changed
- **Flat, user-facing repo layout — grouped by *kind*, not pipeline stage.**
  Dropped the `src/` wrapper and reorganized so a scientist opens the repo to
  their own work:
  - `core/` — the tools (the science); one scoped folder per tool (was `src/tools/`).
  - `scripts/` — the runners (was `src/notebooks/`).
  - `entries/` — the writeups, paired to a runner by id: `.mdx` (web) or `.typ`
    (PDF). Web posts and articles moved here from the site's content dir.
  - `artifacts/` — the committed, kept record: each run's figures + `numbers.json`
    (was `src/results/`).
  - `temp/` — short-lived, gitignored run scratch (was `src/artifacts/`).
  - `demolab-web/` — the web publisher engine (was `src/docs/`).
  The web engine globs entries from `../entries` (split by `nb*`/`ar*` filename)
  and imports figures from `../artifacts`; `vite.server.fs.allow` permits reading
  the sibling dirs. Deploy workflow, `.gitignore`, and all docs updated to match.
- **Added `Taskfile.yml`** wrapping the toolchain (`task run -- nb000`, `task dev`,
  `task build`, `task install`, …) so common commands don't require remembering the
  `uv` / `bun` invocations.

## [0.8.0] - 2026-07-01

### Added
- **Pluggable publishers, with a Typst example.** Publishing is now a swappable
  layer on top of the tool → artifacts contract, not baked into Astro. A runner
  stages its durable outputs (headline figure + `numbers.json`) into a new
  **publisher-neutral results layer, `src/results/<id>/`** (committed); any
  publisher reads from there. Ships a Typst PDF example (`src/notebooks/nb004.py`
  + `nb004.typ`) that reuses the same tool and bundle as the web notebook
  `nb000` — it reads `numbers.json` natively and compiles a PDF via the `typst`
  package. LaTeX is documented as a further option. Reference: `README.md`
  (“How publishing works”), `CONTRIBUTORS.md` (“Publishing”).

### Changed
- **Result bundles moved out of Astro's `public/` into top-level `src/results/`.**
  Astro posts now *import* their figures from `src/results/` (fingerprinted,
  base-path-correct) instead of referencing `public/notebooks/` via hand-built
  `BASE_URL` strings; `vite.server.fs.allow` is set so the dev server can read
  the sibling directory. `public/` now holds only framework assets (CNAME,
  favicon).

## [0.7.0] - 2026-07-01

### Changed
- **"tool" replaces "CLI" throughout**, for a non-developer (academic) audience.
  The per-experiment programs are "tools", not "CLIs": `src/clis/` → `src/tools/`,
  each `cli.py` → `tool.py`, and per-tool dirs dropped the `_cli` suffix
  (`neuron`, `mujoco`, `playground`). The interactive demo dir is `playground`,
  **not** `streamlit`, to avoid shadowing `import streamlit` when it lands on
  `sys.path`. Reference: `src/tools/*/tool.py`, `CONTRIBUTORS.md`.
- **Framework/content firewall; runbooks live in `CLAUDE.md`.** The
  getting-started / migrate / embed / update runbooks moved out of the published
  `documentation` collection and back into `CLAUDE.md` as the single operating
  manual — so clearing demo content can no longer break onboarding. Nothing the
  framework needs lives under `src/docs/content/`, `src/tools/`, `src/notebooks/`,
  or `src/artifacts/` anymore; those are 100% user content. `README.md` carries
  the human map and points at `CLAUDE.md`. The embed Pages workflow ships as
  `.github/workflows/deploy-wiki.yml.example`; the SVG authoring technique folded
  into `CONTRIBUTORS.md`.

### Removed
- The `documentation` article collection (intro, the SVG how-to, and the four
  guide articles). Their operational content now lives in `CLAUDE.md`,
  `README.md`, and `CONTRIBUTORS.md`.

## [0.6.0] - 2026-06-20

### Changed
- **Docs are now dogfooded on the site.** The getting-started / migrating /
  embedding / updating runbooks moved from the `guides/` folder into the
  `documentation` collection as site articles
  (`src/docs/content/articles/*.md`), so they're browsable on the published
  site under Documentation. `CLAUDE.md` triggers and the README point at the
  new locations. They're still plain markdown an agent or human can follow.

## [0.5.0] - 2026-06-20

### Added
- **Embed mode** (`src/docs/content/articles/ar006.md`): drop demolab into another project as a `wiki/`
  docs subfolder and publish to that repo's GitHub Pages. The tree was already
  path-portable; serve config and branding are now env-driven
  (`PUBLIC_SITE_URL`, `PUBLIC_BASE_PATH`, `PUBLIC_SITE_NAME`, `PUBLIC_SITE_REPO_URL`)
  with demolab defaults, so embedding needs no source edits.
- **Onboarding runbooks**: `src/docs/content/articles/ar004.md` (interactive, agent-driven setup
  + scaffold your first notebook) and `src/docs/content/articles/ar005.md` (import an existing repo,
  wrapping experiments one at a time).

## [0.4.0] - 2026-06-16

### Changed
- Reframed updates as **feature adoption** rather than a file sync. `src/docs/content/articles/ar007.md`
  is now a runbook for an agent to review this catalog and reimplement the
  features the user picks — adapted to the repo's own conventions, using upstream
  only as reference. Nothing is copied or overwritten, so a repo can diverge
  freely and still cherry-pick later ideas.

## [0.3.0] - 2026-06-16

### Added
- `src/docs/content/articles/ar007.md` — a tool-agnostic runbook for one-way sync of framework files from
  upstream, leaving your content untouched. Any coding agent or a human can run it.
- `CHANGELOG.md` + framework versioning, so updates are diffable.
- "Staying up to date" section in `README.md`.

## [0.2.0] - 2026-06-16

### Added
- Notebook lifecycle **`status`** field (`draft → building → revising → final`),
  rendered as a badge on the listing pages and the post header.
  - `src/docs/src/config/status.ts` — single source of truth for the values.
  - `src/docs/src/components/StatusBadge.astro` — the badge.
  - `status` added to the collection schema in `content.config.ts`; threaded
    through `lib/entries.ts`, `EntryList.astro`, and `Post.astro`.

### Manual step
- `status` is optional and absent renders no badge — no action required for
  existing notebooks. Set `status:` in a notebook's frontmatter to opt in.

## [0.1.0] - 2026-06-09

### Added
- Initial framework: the tool ↔ notebook manifest contract (`config.json`,
  `output.json`, `manifest.json`, `run.sh`), the Astro publishing engine
  (`src/docs/src/`), and the contracts doc `CONTRIBUTORS.md`.
