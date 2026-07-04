// Shared publishing helpers for the demolab Typst bundle.
// Imported (root-relative) by the generated main.typ and by each writings/<id>.typ.
// The bundle emits three targets from one compile: web HTML, per-entry PDFs, and a book.

// --- web-styles: inject the stylesheet into HTML pages (ignored in the PDF pass) ---
#let web-styles = context {
  if target() == "html" {
    html.elem("link", attrs: (rel: "icon", type: "image/svg+xml", href: "favicon.svg"))
    html.elem("style", read("/demolab-engine/style.css"))
  }
}

// --- video: plays in HTML, omitted from PDF (a note points to the web edition) ---
// The mp4 is emitted as a bundle asset by build.py, referenced here by basename.
#let video(src, caption: none) = context {
  if target() == "html" {
    html.elem("video", attrs: (src: src, controls: "", style: "max-width:100%;width:640px"))[]
    if caption != none { text(size: 9pt, fill: gray)[#caption] }
  } else {
    text(
      size: 9pt,
      style: "italic",
      fill: gray,
    )[[ Video#if caption != none [ — #caption] · view the web edition to play. ]]
  }
}

// --- numbers-table: a parameter/metric table straight from a numbers.json entry ---
// so a writing's numbers come from the run and cannot drift.
#let numbers-table(entry, title: none) = {
  let cfg = entry.at("config", default: (:))
  let params = cfg.pairs().filter(p => not (p.at(0) in ("_provenance", "command")))
  let metrics = entry.pairs().filter(p => p.at(0) != "config")
  let rows = params + metrics
  block(breakable: false)[
    #if title != none [#strong(title)]
    #table(
      columns: (auto, auto),
      align: (left, right),
      table.header([*Parameter*], [*Value*]),
      ..rows.map(p => ([#raw(p.at(0))], [#p.at(1)])).flatten(),
    )
  ]
}

// --- provenance-footer: the git commit stamp the run wrote into numbers.json ---
#let provenance-footer(cfg) = {
  let prov = cfg.at("_provenance", default: none)
  if prov != none and prov.at("commit", default: none) != none {
    // separator: a CSS-styled <hr> on the web, a drawn rule in the PDF (v()/line()
    // are paged-only — Typst warns if they run during HTML export)
    context {
      if target() == "html" { html.elem("hr") } else {
        v(1.2em)
        line(length: 100%, stroke: 0.5pt + gray)
      }
    }
    text(size: 8pt, fill: gray)[
      Generated from commit #raw(prov.commit.slice(0, 7))#if prov.dirty [ (uncommitted changes)] · #prov.at("generated_at", default: "").slice(0, 10)
    ]
  }
}

// --- page templates (one per output document) ---

#let entry-page(meta, body) = {
  web-styles
  set text(font: "New Computer Modern", size: 11pt)
  set par(justify: true)
  // Colour links in the paged/PDF target so they read as links there too (on the
  // web, style.css already colours <a>). Clickability is native to #link in both.
  show link: it => context { if target() == "html" { it } else { text(fill: rgb("#2a5db0"), it) } }
  // outline() queries headings across the whole bundle; keep per-entry docs out of
  // the book's table of contents.
  set heading(outlined: false)
  heading(level: 1, meta.title)
  text(size: 9pt, fill: gray)[#meta.date#if meta.at("status", default: none) != none [ · #meta.status]]
  parbreak()
  body
}

// `decks` are standalone touying slide decks — paged-only, so they're linked as PDFs
// rather than rendered as HTML pages. Populated by build.py's discover_decks().
#let index-page(entries, decks: ()) = {
  web-styles
  set text(font: "New Computer Modern", size: 11pt)
  set heading(outlined: false) // keep the homepage out of the book's TOC
  heading(level: 1, "neonfeedback")
  let show-list(items) = {
    for e in items [
      - #link(e.id + ".html", e.meta.title) #text(fill: gray, size: 9pt)[· #e.meta.date] #link(
          "pdfs/" + e.id + ".pdf",
          text(size: 8pt)[[pdf]],
        )
    ]
  }
  let ars = entries.filter(e => e.kind == "article")
  let exps = entries.filter(e => e.kind == "experiment")
  if ars.len() > 0 {
    heading(level: 2, "Articles")
    show-list(ars)
  }
  if exps.len() > 0 {
    heading(level: 2, "Experiments")
    show-list(exps)
  }
  if decks.len() > 0 {
    heading(level: 2, "Talks & slides")
    for d in decks [
      - #link("pdfs/" + d.id + ".pdf", d.meta.title) #text(fill: gray, size: 9pt)[· #d.meta.date · slides (PDF)]
    ]
  }
  context { if target() != "html" { v(1em) } }  // paged-only spacing; CSS handles web margins
  text(size: 9pt, fill: gray)[Also available as a #link("pdfs/book.pdf", "single book PDF") (excludes slides).]
}

#let book-page(entries) = {
  set text(font: "New Computer Modern", size: 11pt)
  set par(justify: true)
  show link: it => context { if target() == "html" { it } else { text(fill: rgb("#2a5db0"), it) } }
  // Table of contents (page numbers auto-resolved from each entry's heading), no cover.
  outline(title: [neonfeedback — contents], depth: 1)
  for e in entries {
    pagebreak()
    heading(level: 1, e.meta.title)
    text(size: 9pt, fill: gray)[#e.meta.date]
    parbreak()
    e.body
  }
}
