# neonfeedback

A [demolab](https://github.com/eoinmurray/demolab) presentation site: essays, poetry, and
computational notebooks, published at [neonfeedback.com](https://neonfeedback.com).
Python experiments produce per-run artifacts; Typst publishes them as a website,
per-entry PDFs, and a book.

## Working here

```sh
uv sync                                # install the locked dependencies
uv run demolab dev                     # live preview (prints its local URL)
uv run python experiments/exp001.py     # regenerate the experiment's data and figure
uv run demolab build                   # build the site + PDFs into .demolab/
```

Run `uv run demolab --help` for the command list and `uv run demolab docs` for the
authoring guides. Coding agents start with [AGENTS.md](AGENTS.md). Demolab publishes
content; experiment execution and validation belong to this project.

## Layout

1. `experiments/` — runners that write `.artifacts/<id>/` (figures + numbers).
2. `writings/` — Typst pages, published by `uv run demolab build`.
3. `.artifacts/` — tracked publication evidence read by the writings.
4. `.demolab/site/` and `.demolab/pdfs/` — generated website, entry PDFs, and book.
5. `artifacts/pdfs/` — preserved legacy PDFs; new builds do not update these copies.
6. `demolab.yaml` — branding, collections, and the project-root marker.

The engine ships in the `demolab-cli` package — nothing to vendor or maintain here.
Updating: `uv lock --upgrade-package demolab-cli && uv sync`.
After an upgrade, check `uv run demolab version`, read `uv run demolab docs CHANGELOG
--print`, and run `uv run demolab build`. Refresh the opted-in GitHub Pages workflows
with `uv run demolab deploy-setup` and review their diff; they publish `.demolab/site/`.
