# demolab

**A lab notebook for computational science — reproducible results, published and citable, run by a coding agent instead of a build system.**

You write a model or experiment once as a small Python program. demolab runs it, captures *everything* the run produced, stamps it with the exact code version, and publishes a clean page for it — figures, parameters, headline numbers, and real typeset mathematics. Every published result carries proof of how it was made, and the numbers on the page are read from the run, so they can't drift. You drive the whole thing by talking to a coding agent (Claude Code, Cursor, aider, …) — no web development, no build config.

It's built for people doing computational neuroscience, neuromorphic engineering, control systems — anyone who runs experiments in code and needs to share results others can actually reproduce.

**▶ See it live: [demolab.eoinmurray.info](https://demolab.eoinmurray.info/)**

> **A note on jargon.** A **tool** is a small Python program — your simulator or model. An **experiment** is a pair of files — a short runner plus a page of prose — that runs a tool and writes up the result. An **article** is a prose-only writeup. The whole repo is your **lab notebook** (not the Jupyter kind). A **coding agent** is an AI assistant that reads this repo and does the setup and wiring for you. A **static site** is plain HTML — no server to run, free to host.

---

## Contents

- [Quickstart](#quickstart)
- [Working with your coding agent](#working-with-your-coding-agent)
- [Command reference](#command-reference)
- [Why demolab](#why-demolab)
- [The loop, and the two rules](#the-loop-and-the-two-rules)
- [Repository structure](#repository-structure)
- [How it works: the contract](#how-it-works-the-contract)
- [Reproducibility & provenance](#reproducibility--provenance)
- [Publishing (web and PDF)](#publishing-web-and-pdf)
- [Adding an experiment or a tool](#adding-an-experiment-or-a-tool)
- [Making it your own](#making-it-your-own)
- [Design principles](#design-principles)
- [Reference & further reading](#reference--further-reading)
- [License](#license)

---

## Quickstart

**The easy way — let your coding agent set it up.** The only thing you install yourself is a coding agent (Claude Code, Cursor, aider, …); it handles everything else, asking approval as it goes.

1. Open your agent in a new, empty folder.
2. Tell it: *“Go to github.com/eoinmurray/demolab, read the README, and set it up here as my own project.”*
3. Approve its requests as it installs the toolchain and starts the demo — it hands you a live URL (e.g. <http://localhost:3000>) to open in your browser.
4. Tell it, in plain words, what you want to compute — it scaffolds, runs, and publishes your first experiment.

You'll end up with the demo running locally and your own first experiment published. The agent is just following the box below.

> **Agent — setup steps** (follow these, driving interactively and asking approval before installing anything):
> 1. **Make the user their own copy** from this template into the current folder, then *degit* it so it's their project — not a clone that still tracks demolab:
>    `git clone --depth 1 https://github.com/eoinmurray/demolab . && rm -rf .git && git init && git add -A && git commit -m "Start my lab from demolab"`
> 2. **Read `AGENTS.md`** and follow its **Getting started** runbook from here on — that's the source of truth.
> 3. **Prereqs** (`uv`, `typst`, `go-task`): if any are missing, *offer to install them yourself and, once approved, do it* — don't stop and hand the user commands. macOS: `brew install uv typst go-task` (or `uv` via `curl -LsSf https://astral.sh/uv/install.sh | sh`). Then confirm each is on PATH with `uv --version`, `typst --version`, `task --version`.
> 4. **Start the loop and hand back a URL.** Run `task install`, then `task run -- exp000`, then start `task dev` in the background and **report the live site URL to the user** — it serves on <http://localhost:3000>, or the next free port if 3000's taken, so read the actual URL from `task dev`'s output rather than assuming 3000. Open the exp000 page so they see a run become a page.
> 5. **Then** help the user scaffold and publish their first experiment.

### Prefer to set it up by hand?

**Prerequisites** — three command-line tools:

| Tool | For | Install |
|------|-----|---------|
| [`uv`](https://docs.astral.sh/uv/) | Python environment + dependencies | [astral.sh/uv](https://docs.astral.sh/uv/getting-started/installation/) |
| [`typst`](https://typst.app) | publishing (site + PDFs) | `brew install typst` |
| [`go-task`](https://taskfile.dev) | the `task` shortcut commands | `brew install go-task` |

Check they're present with `uv --version`, `typst --version`, `task --version`.

**Get your own copy** — demolab is a template, so start a *fresh* copy (don't plain-`git clone` it — that drags demolab's history and remote along):

- **On GitHub** *(recommended):* click **"Use this template" → Create a new repository**. Clean, owned repo; no tools needed.
- **From the terminal** (only needs `git`):

  ```sh
  git clone --depth 1 https://github.com/eoinmurray/demolab my-lab
  rm -rf my-lab/.git                 # strip demolab's history + remote
  cd my-lab
  git init && git add -A && git commit -m "Start my lab from demolab"
  ```

**See the loop work:**

```sh
task install          # install Python dependencies (uv)
task run -- exp000     # run an experiment end-to-end
task dev              # open http://localhost:3000
```

Open the exp000 post: the figure and the numbers on that page came straight out of the run you just executed. That's the whole idea.

> Under the hood it's **`uv`** for Python and the **`typst`** CLI for publishing — never `pip` directly (it'd use the wrong, unpinned versions). Prefer them raw? `uv sync`, `uv run python experiments/exp000.py`, `uv run python demolab-engine/build/build.py`.

---

## Working with your coding agent

demolab is meant to be operated by a coding agent. Open the repo in your agent and say the word — it follows the matching runbook (indexed in [`AGENTS.md`](AGENTS.md), each one a file under [`demolab-engine/runbooks/`](demolab-engine/runbooks/)), one step at a time, verifying as it goes. (`AGENTS.md` is the cross-agent standard file, so Claude Code, Cursor, aider, and others find it; a thin `CLAUDE.md` points there too, to cover Claude Code.)

| Say… | …and your agent will | Runbook |
|------|----------------------|---------|
| **"how do I get started"** | set up the toolchain, run the demo so you see the loop, help you publish your **own** first experiment, then clear the shipped demo | [getting-started](demolab-engine/runbooks/GETTING-STARTED.md) |
| **"migrate my code"** | bring an existing repo in one experiment at a time — *wrapping* your functions, not rewriting your science | [migrate-code](demolab-engine/runbooks/MIGRATE-CODE.md) |
| **"embed demolab as a docs site"** | drop it into another project as a `docs/` subfolder and publish to that repo's GitHub Pages | [embed-docs](demolab-engine/runbooks/EMBED-DOCS.md) |
| **"migrate the stack to MATLAB / Julia"** | write your tools in MATLAB, Julia, R, or Octave instead of Python — the file-based contract and Typst publishing are language-neutral | [migrate-stack](demolab-engine/runbooks/MIGRATE-STACK.md) |
| **"ground my claims"** | for each work you cite, locate the verbatim source sentences that back the claim so you can check them yourself — pointers to the source, not an automated verdict | [ground-claims](demolab-engine/runbooks/GROUND-CLAIMS.md) |
| **"update demolab"** | vendor-copy the latest engine over your `demolab-engine/build/` (a black box); your `demolab.yaml`, content, and deps stay untouched | [update](demolab-engine/runbooks/UPDATE.md) |
| **"doctor the repo"** | check the toolchain and audit the repo against the conventions (tests, import boundary, provenance, no agent authorship), reporting each violation with a `file:line` | [doctor](demolab-engine/runbooks/DOCTOR.md) |

The runbooks are the source of truth for operating the system; every one is also plain enough to follow by hand — the files above are readable start to finish.

Want newer demolab features later? Say **"update demolab"** and your agent runs the [update runbook](demolab-engine/runbooks/UPDATE.md): it vendor-copies the latest engine over the black box (`demolab-engine/build/`) and leaves your branding, content, and deps alone.

---

## Command reference

`task --list` shows these; run `task <name>`. Pass an argument after `--`.

| Command | Does |
|---------|------|
| `task install` | Install Python dependencies (`uv`) |
| `task run -- exp000` | Run an experiment runner end-to-end |
| `task new` | How to start a new experiment (points you at your coding agent) |
| `task dev` | Serve the site with hot-reload at <http://localhost:3000> |
| `task build` | Build the bundle → `artifacts/site/` (web) + `artifacts/pdfs/` (PDFs + book) |
| `task slides` | Compile standalone Typst decks (e.g. a talk) to `artifacts/pdfs/` |
| `task playground` | Launch the interactive Streamlit demo (<http://localhost:8501>) |
| `task test` | Run the Python test suite (`pytest`) |
| `task clean` | Delete regenerable build output (`temp/`, `artifacts/site/`) |

---

## Why demolab

Most computational results are shared as a Jupyter notebook with hand-typed numbers, no pinned environment, and no record of how a figure was made. demolab exists to raise that floor. Four things make it different:

**1. Reproducible and provenance-stamped by construction.** Every run drops a self-contained folder — the exact parameters, the outputs, a `run.sh` that re-invokes it, and a *validated* manifest (it can't declare a figure or metric that isn't there). Every published result records the **git commit** it was built from, whether the working tree was dirty, and when — and that stamp is rendered as a footer on the page. The numbers in your tables are read straight from the run's `numbers.json`, so prose and results can never disagree. Each tool ships tests.

**2. Publishing is a pluggable layer, not the point.** The load-bearing part is the *contract*: every run leaves machine-readable numbers and the data behind them (tools emit data, not plots — the experiment draws the figure). Anything that can read those can publish them. One **Typst bundle** compiles three publishable targets from the same source — a **static website** (→ free GitHub Pages), a **PDF per entry**, and a single **book** — with the same live numbers in all of them.

**3. Operated by a coding agent.** You never wire a website or debug a build. You open the repo in a coding agent and say what you want in plain language; it follows a runbook step by step. Seven are built in: *get started, migrate my code, embed as docs, migrate the stack to another language, ground my claims, update demolab, and doctor the repo*. It's agent-agnostic, and every runbook is plain enough to follow by hand.

**4. Yours, with no lock-in.** It's a template you copy, own, and diverge from. The output is plain files; the whole thing runs by hand. Delete every shipped example and onboarding still works — nothing the framework needs lives in deletable content.

---

## The loop, and the two rules

The whole system is one decoupled loop:

> a **tool** computes → drops **artifacts** → an **experiment** bundles them into a writeup → the **site** publishes the page

And two rules that everything follows:

1. **Tools hold *reusable* science; experiments explore.** A tool owns computation you'll run more than once — your model, your solver — behind a small CLI. An experiment runs a tool (often many times, with different parameters) and publishes what comes out. But reaching for a tool is a *choice*: a genuine one-off can compute inline in its runner and stage its own results directly, and an article uses no tool at all. Package code into a tool when it'll be **reused** — never force a tiny one-off tool just to satisfy the shape. Keep shared science in the tool; keep the storytelling in the experiment.
2. **An experiment is a paired runner (`.py`) + writeup (`.typ`).** The runner produces the results — running a tool, or computing inline for a one-off; the Typst writeup is what gets published — one source yields the web page, its PDF, and its book chapter. Same id, two files, one result.

---

## Repository structure

Everything is top-level, grouped by *what it is* — not by pipeline stage:

```
tools/         your tools — the science (models, solvers); one folder per tool
experiments/   the runners — expNNN.py produces a run's results (via a tool, or inline) and stages them;
               playground.py is the interactive Streamlit demo (not part of the pipeline)
writings/      the writeups — expNNN.typ (a Typst meta + body), paired to an experiment by id
artifacts/     the committed record of every run:
  data/        each run's figures + numbers.json
  pdfs/        compiled PDFs (per entry + book) — host + link on GitHub
  site/        the built web site (gitignored; regenerated + deployed by CI)
demolab.yaml   optional — wordmark, PDF titles + collection labels (delete to use defaults)
demolab-engine/
  build/       the Typst engine — main.typ + lib.typ + style.css + favicon.svg + build.py (a black box)
  runbooks/    the agent runbooks (one file each)
temp/          short-lived run scratch (regenerated, gitignored)
```

One experiment threads through **by id**: `experiments/exp000.py` runs it → `artifacts/data/exp000/` holds its figures + `numbers.json` → `writings/exp000.typ` writes it up. Split by *kind* — code · data · prose.

At the repo root you'll also find **`AGENTS.md`** (the thin entry point — it links to the rules + contract in `demolab-engine/guides/`), **`Taskfile.yml`**, and **`pyproject.toml`** / **`uv.lock`** (pinned Python deps).

**What's yours vs the framework.** Everything under `tools/`, `experiments/`, `writings/`, `artifacts/` (`data/` + `pdfs/`), and `temp/` is *your content* — delete and replace it freely. The *framework* (this README, `AGENTS.md`, and the `demolab-engine/` engine — its `build/` Typst code, `runbooks/`, and `guides/`) stays put, so clearing the demo never breaks setup, migrating, or publishing.

---

## How it works: the contract

The four steps of the loop stay decoupled through one small, strict contract.

**A tool run writes a fixed set of files** to `temp/<tool>/<command>/` (scratch, regenerated every run):

| File | What it is |
|------|-----------|
| `config.json` | the exact parameters (argparse args) + a `_provenance` block (see below) |
| `output.json` | the run's metrics, command-specific field names |
| `manifest.json` | declares which metrics to surface (and, for a rendering tool, the headline video) |
| `run.sh` | an executable reproducer that re-invokes the command with the same args |
| `output.log` | timestamped log lines |
| `<command>.csv` | the run's data — the numbers a figure is drawn from |
| `<command>.mp4` | *rendering tools only* — the canonical video |

**Tools emit data, not plots.** A tool writes the CSV a figure is drawn *from*; the **experiment runner** renders the `.png` from that data (and Streamlit / the web plot the same data live). A *rendering* — a physics video — is the one exception the tool produces itself.

**The manifest can't lie.** Before it's written, `write_output` validates it against the run: every declared metric must exist in `output.json`, and any declared video/figure must exist on disk — or the run fails.

**The runner then stages the durable bits** — the figure(s) it renders from the data, any video, and an aggregated `numbers.json` (each command's config + its headline metrics) — into the committed `artifacts/<id>/`. That folder is the **publisher-neutral record**: the single place every publisher reads from.

`numbers.json` looks like:

```json
{
  "lif": {
    "config": { "current": 2.5, "duration": 100.0, "dt": 0.1, "_provenance": { … } },
    "firing_rate_hz": 90.0
  }
}
```

Because CI only builds the website (it never re-runs the Python), `artifacts/` is committed — that committed record, not the ephemeral `temp/`, is what reaches the published site.

---

## Reproducibility & provenance

This is demolab's core promise: a published result can be traced back to exactly how it was made.

- **Parameters** — every run records its exact args in `config.json` → the committed `numbers.json`.
- **Environment** — `uv.lock` pins every dependency.
- **Determinism** — randomness is threaded through an explicit `--seed`, captured in the config; tests assert seeded runs reproduce.
- **Claim integrity** — the manifest is validated against the run (above), so a result can't misreport what it produced.
- **Tests** — each tool ships `tools/<tool>/test_<tool>.py` (`task test`): the science functions are checked, not just trusted.
- **Code version** — each run stamps a `_provenance` block into `config.json`: the **git commit SHA**, a **`dirty`** flag (were there uncommitted changes to `tools`/`experiments` at run time), and a **UTC timestamp**. It flows into the committed `numbers.json`.
- **Visible on the page** — every published post (web *and* PDF) renders a footer:

  > *Generated from commit `abc1234` · 2 Jul 2026*

  If a result was built from uncommitted code, the footer says so ("uncommitted changes"). Outside a git repo it degrades gracefully (`commit: null`, no footer).
- **Numbers can't drift** — writings render their parameter/metric tables from `numbers.json` (Typst's native `json()`, via the `numbers-table` helper), rather than hand-typing them. Change the run, the table changes.

The two questions a reviewer actually asks — *"does this figure match the code?"* and *"do the page's numbers come from the run?"* — are both **yes, and checkable on the page.**

---

## Publishing (one Typst bundle, three targets)

Every tool run leaves machine-readable numbers and the data behind them; the experiment (`writings/<id>.typ`) reads them natively with Typst's `json()` and `#image()`. `task build` runs `demolab-engine/build/build.py`, which globs the writings into a JSON manifest and compiles the committed `demolab-engine/build/main.typ` (which reads it) to **three targets in a single pass**:

1. **Web** — `artifacts/site/`: an `index.html` grouping entries **by collection**, an `all.html` flat index (everything, newest first), plus a clean page per entry. Figures embed inline, videos play (`<video>`), math renders as MathML, styled by `demolab-engine/build/style.css`. A bundled Action deploys it to **GitHub Pages** on every push — free hosting, a stable link, nothing to keep running.
2. **Per-entry PDFs** — one `<id>.pdf` per entry, typeset by Typst.
3. **Book** — a single `book.pdf` of every entry, with a table of contents.

The PDFs are mirrored to the committed, shareable `artifacts/pdfs/`. Because it's all Typst, the site and the PDFs share one source and one set of live numbers — change the run, everything updates. Writings support real typeset **mathematics**, matplotlib figures, MuJoCo videos (web), and Typst's native parametric drawings.

`task dev` serves the site with **live reload** (Typst's own server) at <http://localhost:3000>. Standalone Typst decks — a conference talk, say — that aren't experiment entries build with `task slides`.

---

## Adding an experiment or a tool

The full contract and step-by-step is in [`RULES.md`](demolab-engine/guides/RULES.md); in brief:

**Add an experiment** (an experiment + its writeup):

1. Put the tool in its own `tools/<tool>/tool.py` (or reuse an existing tool of yours), following the `setup_run_dir` / `write_output` pattern. It emits **data** (a CSV) + a `manifest` declaring the headline metrics — not a plot (a rendering/video tool is the exception). The runner draws the figure.
2. Create the runner `experiments/expNNN.py` (model it on an existing one — your coding agent can scaffold it). It runs the tool(s), renders the figures from the data, and stages the bundle into `artifacts/data/expNNN/`.
3. Create the writeup `writings/expNNN.typ` — a `#let meta` + `#let body`. Read the run with `json("/artifacts/data/expNNN/numbers.json")`, embed figures with `#image(...)`, and render the table with `#numbers-table(...)` from `demolab-engine/build/lib.typ` (don't hand-type numbers). That one `.typ` yields the web page, its PDF, and its book chapter.
4. `task run -- expNNN`, then `task build` (or the running `task dev`).

**Add a tool.** Each tool is a self-contained directory under `tools/` exposing a small CLI (`argparse`), and it **ships tests** (`tools/<tool>/test_<tool>.py`). Tools stay generic: an experiment reaches a tool by *running* it, never by importing it — a convention that keeps `tools` and `experiments` decoupled.

---

## Making it your own

**Brand it.** Set your site's name and PDF titles in the optional root **`demolab.yaml`** — the engine reads it and fills defaults for anything you omit, and updates never touch it (delete the file to fall back to the defaults). `task dev` hot-reloads. The web theme (`style.css`) and tab icon (`favicon.svg`) currently live *inside* the engine at `demolab-engine/build/`; you can edit them, but they're part of the black box, so a `"update demolab"` overwrites them — treat deeper theming as advanced for now.

**Clear the demo.** Once your first experiment works, your agent removes the shipped example set (the `neuron` / `mujoco` tools, the `playground` app, the `exp00*` / `ar00*` writings, and their artifacts) — leaving your work and the framework intact.

**Publish.** Enable Pages (*Settings → Pages → Source: GitHub Actions*) and push — the bundled Action builds the Typst bundle and deploys `artifacts/site/`. The site uses relative links, so it works under any Pages path with no base config.

**Embed it** in another project as a `docs/` subfolder with its own Pages deploy — see the *embed* runbook in `AGENTS.md`.

---

## Design principles

A few opinions make the rest fall into place:

- **The framework/content firewall.** Nothing the framework needs to run lives in a content directory, so you can delete every experiment and onboarding still works.
- **The import boundary.** `tools` and `experiments` (runners) don't import each other — a convention, not a lint rule. Tools stay generic and oblivious to experiment logic; they communicate only through the file contract. This keeps your reusable science clean and testable.
- **Split by kind, not stage.** Code (`tools`, `experiments`), data (`artifacts`), and prose (`writings`) each have a home, so a scientist opens the repo to their own work, not to plumbing.
- **Upstream is a menu, not law.** demolab is a reference implementation to draw ideas from, not a canonical framework to mirror. Fork it and diverge; adopt future features your own way (that's what the *update* runbook does).

---

## Reference & further reading

- [`AGENTS.md`](AGENTS.md) — the operating manual (agent-agnostic single source of truth; `CLAUDE.md` points to it): toolchain rules and the seven agent runbooks.
- [`RULES.md`](demolab-engine/guides/RULES.md) — the tool ↔ experiment contract, the `numbers.json` schema, authoring posts, provenance, and how to add tools and experiments.

## License

[MIT](LICENSE) — free to use, fork, and adapt for your own lab.

---

*Forking this for your own lab? Open your coding agent and say "how do I get started."*
