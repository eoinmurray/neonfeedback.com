"""Generate the Typst bundle root from writings/*.typ and compile all three targets.

One `typst compile --format bundle --features bundle,html` emits, into artifacts/site/:
  index.html            — homepage index of experiments + articles
  <id>.html             — per-entry web page (figures inline, video plays)
  <id>.mp4              — video assets
  pdfs/<id>.pdf         — per-entry individual PDF
  pdfs/book.pdf         — every entry concatenated into one PDF (book mode)

The site (artifacts/site/) is a self-contained build output (gitignored, deployed to
Pages). The PDFs are also mirrored to the committed artifacts/pdfs/ as shareable
deliverables.

Each writings/<id>.typ exposes `#let meta = (...)` and `#let body = [...]`.
Entries not yet in that convention are skipped (incremental migration).
"""
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WRITINGS = ROOT / "writings"
BUILD = ROOT / "temp" / "build"          # scratch: the generated bundle root
DECKS = BUILD / "decks"                     # scratch: compiled deck PDFs, embedded as assets
SITE = ROOT / "artifacts" / "site"         # bundle output (HTML + mp4 + pdfs/), gitignored
PDFS = ROOT / "artifacts" / "pdfs"         # committed copy of the PDFs (shareable)
TYPST = "typst"  # system CLI — needs --features bundle,html (experimental)


def discover():
    """Entry ids (exp*/ar*) that follow the meta+body convention, sorted.

    Match real top-level definitions (`#let meta` / `#let body` at line start), not
    prose or comments that merely mention them. Slide decks (`*.slide.typ`) are a
    separate category — see discover_decks — so they're skipped here."""
    ids = []
    for p in sorted(WRITINGS.glob("*.typ")):
        if p.name.endswith(".slide.typ"):
            continue
        lines = p.read_text().splitlines()
        has_meta = any(ln.startswith("#let meta") for ln in lines)
        has_body = any(ln.startswith("#let body") for ln in lines)
        if has_meta and has_body:
            ids.append(p.stem)
    return ids


def discover_decks():
    """Deck ids from `writings/<id>.slide.typ` — standalone touying slide decks, sorted.

    Touying decks are paged-only (they don't survive HTML export, see the deck header
    comment), so they aren't bundle entries. Instead they're compiled to standalone PDFs
    and linked from the homepage. Each deck declares `#let meta` (title/date) but no
    `#let body`; the meta is imported to label the link."""
    return [p.name.removesuffix(".slide.typ") for p in sorted(WRITINGS.glob("*.slide.typ"))]


def generate_main(ids: list[str], deck_ids: list[str]) -> str:
    L = ['#import "/demolab-engine/lib.typ": *', ""]
    for i in ids:
        L.append(f'#import "/writings/{i}.typ": meta as {i}_meta, body as {i}_body')
    # decks contribute only their meta (title/date) — never a rendered body.
    for d in deck_ids:
        L.append(f'#import "/writings/{d}.slide.typ": meta as {d}_meta')
    L += ["", "#let entries = ("]
    for i in ids:
        kind = "experiment" if i.startswith("exp") else "article"
        L.append(f'  (id: "{i}", kind: "{kind}", meta: {i}_meta, body: {i}_body),')
    L += [")", ""]
    L.append("#let decks = (")
    for d in deck_ids:
        L.append(f'  (id: "{d}", meta: {d}_meta),')
    L += [")", ""]
    # bundle assets: every mp4 an experiment produced, referenced by basename in the body
    for i in ids:
        for v in sorted((ROOT / "artifacts" / "data" / i).glob("*.mp4")):
            L.append(f'#asset("{v.name}", read("/artifacts/data/{i}/{v.name}", encoding: none))')
    # deck PDFs are embedded as bundle assets (at pdfs/<id>.pdf) rather than compiled as
    # bundle documents — touying is paged-only. As assets they're part of the bundle's
    # served set, so `typst watch` (dev) serves them too, not just a static file server.
    for d in deck_ids:
        L.append(f'#asset("pdfs/{d}.pdf", read("/temp/build/decks/{d}.pdf", encoding: none))')
    # site favicon (a lab-notebook mark), linked from every page's <head> by lib.typ
    L.append('#asset("favicon.svg", read("/demolab-engine/favicon.svg", encoding: none))')
    L.append("")
    # homepage
    L += ['#document("index.html", title: [neonfeedback])[#index-page(entries, decks: decks)]', ""]
    # per-entry web page (root) + individual PDF (pdfs/ subdir)
    for i in ids:
        L.append(f'#document("{i}.html", title: [#{i}_meta.title])[#entry-page({i}_meta, {i}_body)]')
        L.append(f'#document("pdfs/{i}.pdf", title: [#{i}_meta.title])[#entry-page({i}_meta, {i}_body)]')
    # book mode
    L += ["", '#document("pdfs/book.pdf", title: [neonfeedback — the book])[#book-page(entries)]']
    return "\n".join(L) + "\n"


def compile_decks(deck_ids: list[str]) -> None:
    """Compile each standalone deck to a scratch PDF (temp/build/decks/<id>.pdf).

    These are then embedded into main.typ as bundle assets (see generate_main), so both
    `task build` and `typst watch` (dev) emit + serve them at pdfs/<id>.pdf. Must run
    before generate_main so the asset `read(...)` finds the files. Decks don't
    live-reload in dev — re-run `task dev`/`task build` to pick up deck edits."""
    DECKS.mkdir(parents=True, exist_ok=True)
    for d in deck_ids:
        subprocess.run(
            [TYPST, "compile", "--root", str(ROOT),
             str(WRITINGS / f"{d}.slide.typ"), str(DECKS / f"{d}.pdf")],
            check=True,
        )


def main() -> None:
    # --generate-only writes the bundle root without compiling the bundle — used by
    # `task dev`, which then runs `typst watch` on it (its own HTTP server + live reload).
    generate_only = "--generate-only" in sys.argv
    ids = discover()
    deck_ids = discover_decks()
    if not ids:
        print("no converted writings (need `#let meta` + `#let body`)", file=sys.stderr)
        sys.exit(1)
    BUILD.mkdir(parents=True, exist_ok=True)
    # Compile decks first so their PDFs exist for the asset embeds in generate_main.
    compile_decks(deck_ids)
    main_typ = BUILD / "main.typ"
    main_typ.write_text(generate_main(ids, deck_ids))
    SITE.mkdir(parents=True, exist_ok=True)
    if generate_only:
        print(f"generated bundle root for {len(ids)} entries: {', '.join(ids)}"
              + (f" + {len(deck_ids)} decks: {', '.join(deck_ids)}" if deck_ids else ""))
        return
    subprocess.run(
        [TYPST, "compile", "--format", "bundle", "--features", "bundle,html",
         "--root", str(ROOT), str(main_typ), str(SITE) + "/"],
        check=True,
    )
    # mirror the compiled PDFs (entries, book, and decks) to the committed artifacts/pdfs/
    PDFS.mkdir(parents=True, exist_ok=True)
    for pdf in sorted((SITE / "pdfs").glob("*.pdf")):
        shutil.copy(pdf, PDFS / pdf.name)
    built = f"built {len(ids)} entries" + (f" + {len(deck_ids)} decks" if deck_ids else "")
    print(f"{built} -> {SITE}/ (pdfs mirrored -> {PDFS}/)  entries: {', '.join(ids)}"
          + (f"  decks: {', '.join(deck_ids)}" if deck_ids else ""))


if __name__ == "__main__":
    main()
