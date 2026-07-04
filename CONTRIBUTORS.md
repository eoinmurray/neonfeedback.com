# Contributing

How the pieces fit together and the conventions to follow when adding a tool command, an experiment, or a new tool. For a user-facing overview and run instructions, see [`README.md`](README.md).

## Toolchain

- **Python**: use `uv`. Never call `python` / `python3` directly. Dependencies are pinned in the root `pyproject.toml` / `uv.lock`; run scripts with `uv run python <script>` (e.g. `uv run python tools/neuron/tool.py lif`). Run `uv sync` after pulling.
- **Publishing**: use the **`typst`** CLI (an installed prerequisite, like `go-task`). It compiles the site + PDFs (`task build` / `task dev`); the bundle build passes `--features bundle,html` (experimental, deliberately used here). No Node — demolab publishes entirely with Typst.

## The tool ↔ experiment contract

Each tool subcommand `<cmd>` writes a fixed set of files into `temp/<tool>/<cmd>/`, overwriting the previous run:

| File | Schema |
|------|--------|
| `config.json` | flat object of argparse args |
| `output.json` | flat object of metrics, command-specific field names |
| `manifest.json` | `{ headline_video?: str, headline_metrics: [str, …] }` — declares the headline metrics, plus (rendering tools only) the headline video |
| `output.log` | timestamped log lines |
| `run.sh` | executable shell script that re-invokes the tool with the same args |
| `<cmd>.csv`, … | the run's data — the numbers a figure would be drawn from |
| `<cmd>.mp4` | *rendering tools only* — the canonical video (`manifest.headline_video`) |

**Tools emit data, not plots.** A tool writes the CSV/JSON a figure is drawn *from*; drawing the figure is the experiment's job (the runner renders a PNG from the CSV, and Streamlit / the web plot from the same data). The one exception is a **rendering** — a physics video or similar (`mujoco` → `.mp4`) — which a tool *does* produce, because it isn't a plot of tabular data. `write_output` still validates a declared `headline_video` (or `headline_figure`, if a tool ever sets one) exists on disk, and that every `headline_metrics` key is in `output.json` — so a manifest can never lie about a run.

The experiment runner relies on this contract:

- Subcommand name maps 1:1 to the directory name under `temp/<tool>/`.
- The runner reads `manifest.json` to discover the headline metrics (and a headline video, if any) — it does **not** hardcode metric field names. Adding a new surfaced metric is a one-file change in `tool.py` (extend the command's `headline_metrics` list). The runner *renders* the figures itself from the tool's CSV data.
- The runner only chooses *which commands* an experiment bundles (`COMMANDS` in the `expNNN.py` runner).

`tools` and `experiments` keep a strict **import boundary** *by convention*: a runner reaches a tool by *running its CLI* (subprocess), never by `import`ing it, and tools never import runner code. They communicate only through the files above — so tools stay generic and every result carries its `config.json` / `manifest.json` / `run.sh` provenance.

### `numbers.json` aggregation

The runner aggregates each command's `config.json` + its headline metric fields into a single `numbers.json` in `artifacts/data/expNNN/`:

```json
{
  "lif": {
    "config": { "current": 2.5, "duration": 100.0, "dt": 0.1, ... },
    "firing_rate_hz": 90.0
  },
  "net": {
    "config": { "n": 200, "duration": 500.0, ... },
    "mean_firing_rate_hz": 104.2,
    "min_firing_rate_hz": 56.0,
    "max_firing_rate_hz": 148.0
  }
}
```

A publisher then reads `numbers.json` (and the staged figure) to render prose, figures, and parameter tables.

`setup_run_dir` also stamps a `_provenance` block into `config.json` — the git commit SHA, a `dirty` flag (uncommitted changes at run time), and a UTC timestamp — which flows into the committed `numbers.json`. So every published result records exactly which code produced it; the publisher surfaces it as a footer on each page and PDF. It degrades gracefully outside a git repo (`commit: null`).

## Publishing (the results layer + the Typst bundle)

`temp/<tool>/<cmd>/` is scratch — gitignored, overwritten every run. The runner renders the figure(s) from the tool's CSVs and writes them, plus the aggregated `numbers.json` (and any video the tool produced), into **`artifacts/data/<id>/`**, which *is* committed. That folder is the **publisher-neutral record**: the single place the publisher reads from.

**Typst is the publisher.** `task build` runs `demolab-engine/build.py`, which scans `writings/*.typ`, generates a Typst *bundle* root, and compiles **three targets in one pass** (`typst compile --format bundle --features bundle,html`):

- **Web** — `artifacts/site/`: `index.html` (an index of experiments + articles) plus an HTML page per entry. Figures embed inline (base64), videos play (`<video>`), math renders as MathML, styled by `demolab-engine/style.css`.
- **Per-entry PDFs** — `artifacts/site/pdfs/<id>.pdf`, one per entry.
- **Book** — `artifacts/site/pdfs/book.pdf`: every entry, with a table of contents.

The PDFs are mirrored to the committed, shareable **`artifacts/pdfs/`**. `artifacts/site/` is a gitignored build output (CI regenerates it and deploys it to Pages). CI does **not** run the experiments, so `artifacts/data/` must be committed — that committed record, not the ephemeral `temp/`, is what reaches the site.

Each `writings/<id>.typ` reads its own bundle natively — `json("/artifacts/data/<id>/numbers.json")`, `#image("/artifacts/data/<id>/fig.png")` (compiled with `--root` at the repo root) — so the numbers and figures come straight from the run and can't drift.

## Authoring writings

A writing is `writings/<id>.typ`: a `#let meta = (title, date, description?, collection?, status?)` block and a `#let body = [ … ]` block. `build.py` imports both (it discovers entries by those two top-level definitions). Model a new one on `exp000.typ`.

Helpers in `demolab-engine/lib.typ` (import with `#import "/demolab-engine/lib.typ": …`):

- `numbers-table(entry, title: "…")` — renders a parameter/metric table straight from a `numbers.json` command entry (config minus provenance, then the headline metrics). Use it so numbers come from the run and can't drift; never hand-type them.
- `video("<file>.mp4", caption: […])` — plays as an HTML `<video>` on the web, omitted from the PDF (a note points to the web edition). `build.py` auto-emits every mp4 in the entry's artifacts as a bundle asset.
- `provenance-footer(run.<cmd>.config)` — the git-commit footer.

Figures: a data figure is a tool-rendered PNG staged by the runner — embed it with `#image("/artifacts/data/<id>/fig.png", width: 100%)`. A *drawing* (a schematic, not a simulation result) can be drawn directly in Typst — its native graphics are parametric and scale crisply, no image file. For something a reader should *explore* interactively, point them at the Streamlit playground (`task playground`); in-browser interactivity is deliberately not part of the static site.

## Adding a new experiment

1. Add a tool subcommand (or reuse existing ones) in the relevant `tools/<tool>/tool.py`. Pass a `manifest` to `write_output` declaring the headline metrics (and a video, for a rendering tool).
2. Create `experiments/expNNN.py` modeled on an existing runner. Declare `COMMANDS`; the runner reads each command's `manifest.json`, then renders the figure(s) from the CSV data into `artifacts/data/expNNN/`.
   - A single-tool runner (e.g. `exp000.py`) uses bare command strings: `COMMANDS = ("lif", "net")`.
   - A multi-tool runner (e.g. `exp002.py`) uses `(tool, command)` pairs: `COMMANDS = (("mujoco", "cartpole"),)`, so one experiment can drive an arbitrary mix of tools.
3. Create `writings/expNNN.typ` as a `#let meta` + `#let body` pair (see `exp000.typ`). `meta` needs `title` + `date` (optional `description`/`collection`/`status`). In `body`, read the run with `json("/artifacts/data/expNNN/numbers.json")`, embed figures with `#image(...)`, and render tables with `#numbers-table(...)` — don't hand-type numbers.
4. Run `uv run python experiments/expNNN.py`, then `task build` (or the running `task dev`).

### The `status` field

`status` is an optional `meta` field noting where an experiment sits in its lifecycle — `draft → building → revising → final`, and back freely (a `final` entry can be reopened). It renders as text next to the date on the entry's page and in the book. It's free-form; pick a convention and stick to it.

## Adding a new tool

Each tool lives in its own directory under `tools/` and writes its run artifacts under `temp/<tool>/<cmd>/`. The manifest contract is the same for all tools; a new tool writes `config.json`, `output.json`, `manifest.json`, `output.log`, `run.sh`, and its **data** (`<cmd>.csv`, …). A *rendering* tool also writes its video and declares `headline_video`. It does **not** write plots — the experiment renders those from the data.

Reuse the established pattern in an existing `tool.py`:

- `setup_run_dir(command, args)` creates the run directory, configures a per-command logger that writes both to `output.log` and stdout, dumps `config.json` (all argparse args except `func`), and writes an executable `run.sh` reproducer.
- `write_output(run_dir, metrics, manifest)` performs the manifest validation and writes `output.json` + `manifest.json` last.
- Subcommands are wired through `argparse` with `set_defaults(func=...)`; `main()` calls `args.func(args)`.

`write_output` is the same in every tool: `headline_metrics` is required and validated against `output.json`; any declared `headline_video`/`headline_figure` must exist on disk. Since data tools declare no asset, their manifest is just `{"headline_metrics": [...]}`; a rendering tool adds `headline_video`.

**Every tool ships tests.** Put them in `tools/<tool>/test_<tool>.py` (run with `task test` / `uv run pytest`). This is exactly what the "generic data-in/data-out" shape buys you: unit-test the science functions directly — shapes, known properties (e.g. suprathreshold input spikes, subthreshold is silent), and determinism (seeded functions reproduce). Also test the manifest contract (`write_output` rejects a metric absent from `output.json` or a missing figure). Keep tests off the filesystem where possible — call the sim functions, not the CLI. (The Streamlit playground is exempt — see below.)

> The Streamlit playground (`experiments/playground.py` — an interactive app, not an `exp*` runner) is a demo. It doesn't author its own committed artifacts and isn't part of the experiment pipeline, so it's exempt from *producing* a manifest — but it still **runs the `neuron lif` CLI** (the very command the experiments run) on each slider change and reads back `temp/neuron/lif/lif.csv` (the trace) + `output.json` (the metrics), rather than reimplementing the simulation. Same mechanism as an experiment, same single copy of the science. The demo itself isn't unit-tested, but the CLI it drives is. **Don't duplicate the science** — reach the tool through its CLI.

## The feature catalog (upstream maintainers)

This repo is the upstream **reference** that downstream repos draw ideas from. They don't copy your files — their agents reimplement the features they want, their own way, using this repo as reference (see the **Updating the framework** runbook in [`AGENTS.md`](AGENTS.md)). So [`CHANGELOG.md`](CHANGELOG.md) is a **feature catalog**, and each entry has one job: describe a feature well enough that someone else's agent can rebuild it from the description plus your code.

Whenever you add or change a reusable **framework capability** (the Typst engine under `demolab-engine/`, the contracts, the tool plumbing, CI), catalog it:

1. **Bump the version** with a new top entry in `CHANGELOG.md`. Use **major** for a feature that changes a contract others may have built on, **minor** for a new additive feature, **patch** for a small fix.
2. **Describe the feature by intent and behavior** — what it does, why, and where the reference implementation lives — not just which files moved. That's what a downstream agent reads to rebuild it natively.

Changes to **content** (experiments, posts, tools, artifacts) aren't reusable features and don't belong in the catalog. If a change spans both, catalog only the reusable part.
