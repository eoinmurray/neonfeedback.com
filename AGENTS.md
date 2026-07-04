# AGENTS.md

Demolab — an agent-operated lab notebook for computational science. This file is the
thin entry point; the substance lives in the engine so it updates cleanly (_"update
demolab"_). **Read the rules before working here.**

**Rules, contract & how-tos** → [`demolab-engine/guides/RULES.md`](demolab-engine/guides/RULES.md) — the single conventions doc: toolchain, the framework/content firewall, commits, the tool ↔ experiment contract + schemas, and how to add a tool / experiment / writing. Unfamiliar with a term (tool, experiment, deck, collection, provenance…)? → [`demolab-engine/guides/GLOSSARY.md`](demolab-engine/guides/GLOSSARY.md). Authoring a writing? → [`demolab-engine/guides/HOUSE-STYLE.md`](demolab-engine/guides/HOUSE-STYLE.md) for prose/math/figure style.

Two rules important enough to state here too:

- **Toolchain:** use `uv` (Python) and `typst` (publishing) via `task` (go-task). Never call `pip` / `python` / `python3` directly.
- **Commits:** author every commit as the human only — never a `Co-Authored-By:` / agent trailer, never an agent in the author/committer fields.

## Runbooks

Say the trigger phrase; open the matching file in [`demolab-engine/runbooks/`](demolab-engine/runbooks/) and drive it **interactively** (run each step, show the result, confirm before moving on — don't dump the whole runbook at once).

| Trigger                                 | Runbook                                                          |
| --------------------------------------- | ---------------------------------------------------------------- |
| _"how do I get started"_                | [GETTING-STARTED.md](demolab-engine/runbooks/GETTING-STARTED.md) |
| _"migrate my code"_                     | [MIGRATE-CODE.md](demolab-engine/runbooks/MIGRATE-CODE.md)       |
| _"embed demolab as a docs site"_        | [EMBED-DOCS.md](demolab-engine/runbooks/EMBED-DOCS.md)           |
| _"migrate the stack to MATLAB / Julia"_ | [MIGRATE-STACK.md](demolab-engine/runbooks/MIGRATE-STACK.md)     |
| _"ground my claims"_                    | [GROUND-CLAIMS.md](demolab-engine/runbooks/GROUND-CLAIMS.md)     |
| _"update demolab"_                      | [UPDATE.md](demolab-engine/runbooks/UPDATE.md)                   |
| _"doctor the repo"_                     | [DOCTOR.md](demolab-engine/runbooks/DOCTOR.md)                   |
