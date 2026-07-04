# Toolchain

- **Python**: use `uv`. Never call `python` / `python3` directly. Dependencies are pinned in the root `pyproject.toml` / `uv.lock`; run scripts with `uv run python <script>` (e.g. `uv run python tools/neuron/tool.py lif`). Use `uv sync` after pulling.
- **Publishing**: use the **`typst`** CLI (an installed prerequisite, like `go-task`). It compiles the site + PDFs; the bundle build passes `--features bundle,html` (experimental, deliberately used here). There is no Node/`bun` — demolab publishes entirely with Typst.

Common commands are wrapped in a `Taskfile` — prefer `task <name>` (run `task` to list them); it calls `uv`/`typst` correctly so you never have to remember the invocations. `task doctor` checks the toolchain.

# Commits

Author every commit as the human only. **Never** record an agent as author or co-author: no `Co-Authored-By:` trailer naming Claude or any AI, no agent name in the author/committer fields, no "🤖 Generated with …" line. The commit history reads as the human's own work.

# Repo layout — the framework/content firewall

Two zones. Keep them straight:

- **Framework** (demolab itself — never deleted when clearing demo content): this file (`AGENTS.md`) and its `CLAUDE.md` pointer, `README.md`, `CONTRIBUTORS.md`, `CHANGELOG.md`, the **Typst publishing engine under `demolab-engine/`** (`build.py`, `lib.typ`, `style.css`), the `Taskfile`, and build config. The operating manual lives *here*, so onboarding survives any deletion of example content.
- **Example / user content** (100% the user's — freely deletable and replaceable): `tools/*` (tools), `experiments/*` (runners, plus `playground.py` — the interactive Streamlit demo, an app exempt from the contract), `writings/*` (`.typ` writeups), `artifacts/*` (the committed record — `data/` per-run figures + numbers.json, and `pdfs/` compiled PDFs; `artifacts/site/` is a gitignored build), `temp/*` (regenerable scratch).

The contract for `tools` ↔ `experiments` ↔ writings, the `numbers.json` schema, and how to add a tool/experiment are in `CONTRIBUTORS.md`.

**Publishing in one line:** `task build` runs `demolab-engine/build.py`, which generates a Typst *bundle* from `writings/*.typ` and compiles **three targets** in one pass — a web site (`artifacts/site/`: `index.html` + a page per entry), an individual PDF per entry, and a single `book.pdf` (all in `artifacts/site/pdfs/`, mirrored to the committed `artifacts/pdfs/`).

The four runbooks below are the source of truth for operating the system. Each fires on the trigger phrases in its heading. Drive them **interactively**: run each step's commands yourself, show the result, confirm before moving on — don't dump a whole runbook at the user at once.

# Runbook: Getting started

Triggers: **"how do I get started"**, "help me set up", "onboard me", "walk me through this repo". Goal: demo running locally, the user understands the loop, and they've published their *own* first experiment.

0. **Prereqs.** Run `task doctor` to check `uv`, `typst`, and `task` (`go-task`). If anything's missing, give the one-line install for their platform and stop (`typst` → `brew install typst`).
1. **Install.** `task install` (Python deps via `uv`).
2. **See the loop work.** `task run -- exp000` (runs the tool, stages `artifacts/data/exp000/`), then start `task dev` in the background — Typst's own server with live reload. Open the exp000 page at <http://localhost:3000> and explain in a sentence or two how the artifact became that page.
3. **Brand it.** The site name and look live in the engine: the "demolab" wordmark + book title in `demolab-engine/lib.typ` (`index-page` / `book-page`), and the web CSS in `demolab-engine/style.css`. Edit those; `task dev` hot-reloads.
4. **Scaffold their first experiment** (the point of the whole thing). Ask what they want to compute — keep it small. *You* scaffold the experiment + writing pair (`experiments/expNNN.py` + `writings/expNNN.typ`) by modeling on an existing one — a working skeleton, not a stub. Then, following `CONTRIBUTORS.md`:
   - Add the experiment's tool in its **own new** directory `tools/<their-tool>/tool.py` — *not* as a subcommand of a shipped demo tool (`neuron`/`mujoco`), because step 5 deletes those and would take the user's work with them. Model it on `tools/neuron/tool.py`: copy `setup_run_dir`/`write_output`, write `config.json`/`output.json`/the data as a CSV, pass a `manifest` with the headline metrics. **The tool emits data, not plots** — the runner renders the figure from the CSV; a *rendering* (physics video) is the one exception a tool produces itself (`headline_video`). **Add a test** `tools/<their-tool>/test_<tool>.py` and confirm `task test` passes.
   - Fill in the runner `experiments/expNNN.py` (model `exp000.py` for one tool, `exp002.py` for a mix); declare `COMMANDS`, and **render the figure(s) from the tool's CSVs** into `artifacts/data/expNNN/` (see `exp000.py`'s `plot_trace`/`plot_network`). A video tool's runner just copies the `.mp4` (see `exp002.py`).
   - Fill in the writeup `writings/expNNN.typ` as a `#let meta = (title, date, ...)` + `#let body = [ ... ]` pair, modeled on `exp000.typ`. Read the run with `#let run = json("/artifacts/data/expNNN/numbers.json")`, embed figures with `#image("/artifacts/data/expNNN/fig.png")`, and render the parameter/metric table with `#numbers-table(run.<command>, title: "…")` from `demolab-engine/lib.typ` — **do not hand-type numbers** (that defeats the "can't drift" guarantee). For a video, use `#video("<file>.mp4", caption: […])` (plays in HTML, omitted from the PDF).
   - Run it with `task run -- expNNN`, then `task build` (or the running `task dev`) and open the new page + its PDF with the user.
5. **Clear the shipped demo** — *only after step 4 works*, so a real example existed as a template. Remove the shipped set by id, and nothing else: tools `tools/{neuron,mujoco}`; runners `experiments/exp00*.py` and the Streamlit app `experiments/playground.py`; writings `writings/{exp000,exp001,exp002,exp003,ar000,ar003,ar004}.typ`; the staged records `artifacts/data/*` and `artifacts/pdfs/*`; scratch `temp/*`. **Never** delete the user's new experiment or anything in the framework zone (incl. `demolab-engine/`). Then `task clean` and `task build` to confirm the site still builds with just their entry.
6. **Publish.** Enable Pages (*Settings → Pages → Source: GitHub Actions*), then commit and push `main`. `.github/workflows/deploy.yml` builds the Typst bundle and deploys `artifacts/site/` to Pages. Run `task build` first to check it compiles; confirm the Actions run succeeds. The site uses relative links, so it works under any Pages path with no base config.

Notes: provenance is automatic — each run stamps its git commit into `numbers.json` and the page/PDF footer. Commit the tool code *before* a run you intend to publish, so the footer reads clean (an uncommitted run stamps *dirty*).

# Runbook: Migrating existing code

Triggers: **"migrate my code"**, "import my repo", "bring my existing code in". Three principles: **one experiment at a time**, **wrap don't rewrite** (the new `tool.py` is a thin adapter that imports and calls their functions — never reimplement their science), and **one environment** (their deps fold into the root `pyproject.toml`). Get one experiment publishing end to end before touching the next.

1. **Inventory.** Read their repo (local path or clone). List candidate experiments — each script/function that ends in a figure or a few numbers. With the user, pick the single simplest first.
2. **Bring their code in.** Installable package → `uv add <name>` (PyPI, or git/local-path dep) + `uv sync`, then `import` it. Loose scripts → copy only the modules the experiment needs next to `tool.py` or into a shared package under `tools/`.
3. **Merge deps.** `uv add` only what the chosen experiment needs (never `pip install`); surface version conflicts and resolve with the user.
4. **Wrap as a tool command.** Create `tools/<tool>/tool.py` modeled on `neuron/tool.py`: copy `setup_run_dir`/`write_output` verbatim (adjust `TEMP_DIR` + logger), add an `argparse` subcommand for the experiment's params, and in the handler call `setup_run_dir` → **their function** → write the data (CSV) → `write_output` with a manifest (headline metrics; the runner draws the figure, so the tool emits no plot — a rendering/video is the exception). Keep it thin; if you're porting their math, stop and import instead. The tool must stay generic — it must **not** import runner code (`experiments/`), and a runner reaches it by *running* it, never importing (a `tools` ↔ `experiments` import boundary kept by convention). Add a test (`task test`). Verify `temp/<tool>/<cmd>/` has the full set.
5. **Runner + writing.** As in Getting started step 4. Confirm the published figure and numbers match their original code's output.
6. **Repeat** for the next experiment; stop when the ones that matter are done.

Notes: thread a `--seed` through anything random (see `neuron`'s `net` command); bring and run their relevant tests with `uv run`.

# Runbook: Embedding as a docs subfolder

Triggers: **"embed demolab as a docs site"**, "use this as a wiki subfolder", "drop this into my project as docs". The tree is path-portable — every tool/writing resolves paths relative to the repo root (`typst --root`), and the built site uses **relative links**, so it works under any URL path with no base config.

1. **Place it.** Copy demolab degitted (no `.git`) into the host project, e.g. `docs/`. Delete the copy's bundled `.github/workflows/deploy.yml` (it assumes demolab is the repo root).
2. **Run from inside the subfolder** so `uv`/`typst`/`task` resolve demolab's manifests: `cd docs && task install && task build` (or `task dev`). Output lands in `docs/artifacts/site/`.
3. **Deploy from the HOST repo.** Add a Pages workflow to the *host* repo that installs `typst`, runs `python3 docs/demolab-engine/build.py`, and uploads `docs/artifacts/site/` — model it on demolab's own `.github/workflows/deploy.yml`. Enable Pages on the host (*Settings → Pages → Source: GitHub Actions*).

Notes: one Pages site per repo — if the host already uses Pages, deploy the docs from a dedicated repo.

# Runbook: Updating the framework

Triggers: **"update demolab"**, "update from upstream", "pull the latest demolab features". Updating is **not** a file copy. Upstream demolab is a **menu of ideas and a reference implementation**, not a canonical framework to mirror — adopt, adapt, or skip each feature, one at a time, reimplemented *in this repo's own conventions*. Never overwrite the user's work.

1. **Find where you last looked.** Read a last-reviewed marker if present (e.g. `.demolab-upstream`); otherwise treat the whole catalog as new.
2. **Fetch upstream read-only** (never touches the working tree): `git fetch "${DEMOLAB_UPSTREAM:-https://github.com/eoinmurray/demolab.git}" main`. Read its catalog with `git show FETCH_HEAD:CHANGELOG.md`, and any reference file the same way (e.g. `git show FETCH_HEAD:demolab-engine/lib.typ`).
3. **Present the menu.** List changelog entries newer than the last-reviewed version, summarize each in plain terms, and ask which the user wants.
4. **Adopt each chosen feature, this repo's way.** Study the upstream code as *reference* (intent, not diff), implement the equivalent in this repo's conventions/naming, reuse what's already here. If this repo already has its own take, reconcile or skip — never clobber without asking. Verify (`task build` / the relevant tool).
5. **Record.** Update the last-reviewed marker, commit describing which features were adopted and how they differ, and leave skipped ones on the menu.

Where upstream features tend to live (for reference, not copying): `demolab-engine/` (the Typst engine), `CONTRIBUTORS.md` (contracts), `tools/*/tool.py` (the `setup_run_dir`/`write_output` plumbing), `.github/workflows/` (CI). Purely the user's, never sourced upstream: `experiments/`, `writings/`, `temp/`, `artifacts/`, and their own tools.
