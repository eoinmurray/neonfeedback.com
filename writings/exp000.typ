#let meta = (
  title: "How does anarchism typically die",
  date: "2026-06-21",
  status: "revising",
  collection: "essays",
)

#let run = json("/artifacts/data/exp000/numbers.json")

#let body = [
  Anarchism is often dismissed as never having been tried. It has — repeatedly, at real scale, governing millions of people. The pattern worth noticing is not that it never works, but _how_ it ends.

  The #run.n_experiments cases in the appendix below are too few for statistics, but enough for a shape. Sort them by cause of death and one bar dwarfs the rest.

  #figure(
    image("/artifacts/data/exp000/deaths.png", width: 100%),
    caption: [How the #run.n_experiments anarchist experiments ended, tallied by cause: crushed by a state dwarfs the rest, while collapse-from-within is rare.],
  )

  Of the #run.n_ended experiments that ended, only #run.n_collapsed actually _collapsed_ from within. The other #run.n_killed were killed — #run.n_crushed crushed by an enemy state, #run.n_betrayed betrayed by the authoritarian left they had fought alongside. The remaining #run.n_ongoing are still alive, and nearly all of them are small.

  That inverts the usual obituary. Anarchism is supposed to fail because it cannot scale — because without a state it dissolves into chaos. But collapse-from-within is the rarest ending on the chart. Anarchism rarely dies of its own contradictions; it gets murdered, usually by a state, and at its largest by the left. The betrayals are few, but they land on the giants: the two largest experiments ever recorded, Makhno's Free Territory and revolutionary Catalonia, were destroyed not by their declared enemies but by the Bolsheviks and Stalinists nominally on their side.

  There is a sharper catch. The big modern cases anarchists point to — Rojava, Oaxaca, Cherán — are mostly broad popular fronts or indigenous autonomies that anarchists _joined_ rather than authored. Strip those out and unmistakably anarchist self-government at scale almost vanishes from the record. The most unforgiving reading: large anarchism does not merely die young — it is rarely permitted to exist at all. Whether the small survivors represent endurance or surrender is the open question.

  == Appendix

  The full record behind the chart, sorted by peak scale.

  The *bold* phrase in _How it ended_ is the load-bearing claim each source is cited for — the manner of death (or survival) that the chart and the central argument rest on. Start there when checking a reference.

  _† Anarchist-*influenced* rather than anarchist-led — a popular front, indigenous communalism, or worker-cooperative movement that anarchists took part in or claim, rather than a card-carrying anarchist polity. Iceland is older and shakier still: it is cited mostly by anarcho-capitalists and is here only as the one pre-modern outlier._

#text(size: 8.5pt)[
  #table(
    columns: (1.4fr, 1fr, 0.95fr, 0.6fr, 1.9fr, 0.5fr),
    align: (left + top,) * 6,
    inset: 5pt,
    stroke: 0.4pt + luma(70%),
    table.header([Experiment], [Where / when], [Scale], [Death], [How it ended], [Source]),
    [Revolutionary Catalonia & Aragon], [Spain, 1936–1939], [≈5–8 million in collectives], [Betrayed], [*Undermined by Stalinist allies*, then defeated by Franco], [#link("https://doi.org/10.1177/026569148701700402")[source]],
    [Free Territory (Makhnovshchina)], [Ukraine, 1918–1921], [Up to ≈7 million], [Betrayed], [Used then *liquidated by the Bolsheviks* once the Whites were beaten], [#link("https://doi.org/10.1080/10455752.2023.2165778")[source]],
    [Rojava (AANES)], [North-east Syria, 2012–present], [≈2–4 million], [Alive], [*Survives* under constant military threat from Turkey and others], [#link("https://doi.org/10.1080/21520844.2024.2314447")[source]],
    [Hungarian workers' councils], [Hungary, 1956], [Millions, briefly], [Crushed], [*Crushed by Soviet tanks* within weeks], [#link("https://doi.org/10.1177/088832540201600208")[source]],
    [Paris Commune], [Paris, 1871], [≈2 million], [Crushed], [*Crushed by the French Army*; ≈20,000 killed in the _semaine sanglante_], [#link("https://www.routledge.com/The-Paris-Commune-1871/Tombs/p/book/9780582309036")[source]],
    [Korean People's Association], [Manchuria, 1929–1931], [≈2 million], [Crushed], [*Caught between Japanese imperial forces and Stalinists*], [#link("https://sunypress.edu/Books/A/Anarchism-in-Korea")[source]],
    [Biennio Rosso], [Italy, 1919–1920], [≈600,000 workers], [Collapsed], [*Collapsed*; cleared the path for Fascist reaction], [#link("https://doi.org/10.1002/9781405198073.wbierp0198")[source]],
    [Bavarian Council Republic †], [Munich, 1919], [≈600,000], [Crushed], [*Stormed by the Freikorps*; Landauer murdered], [#link("https://doi.org/10.1163/1477285X-12341309")[source]],
    [Bakur self-rule †], [South-east Turkey, 2015–2016], [≈400,000], [Crushed], [*Turkish army sieges*; districts levelled, trustees imposed], [#link("https://doi.org/10.1080/13608746.2023.2255017")[source]],
    [Zapatistas (EZLN)], [Chiapas, Mexico, 1994–present], [≈300,000], [Alive], [*Survives*, encircled and pressured by the Mexican state], [#link("https://doi.org/10.1177/0022002709341173")[source]],
    [Oaxaca Commune (APPO) †], [Oaxaca, Mexico, 2006], [≈200,000], [Crushed], [*Federal police retook the city centre*], [#link("https://doi.org/10.1093/acrefore/9780199366439.013.752")[source]],
    [Icelandic Commonwealth], [Iceland, 930–1262], [≈50,000], [Collapsed], [*Collapsed into feuding chieftains*; absorbed by Norway], [#link("https://doi.org/10.1484/J.VIATOR.2.301403")[source]],
    [Strandzha Commune], [Ottoman Thrace, 1903], [Tens of thousands], [Crushed], [*Crushed by the Ottoman army* after ≈20 days], [#link("https://www.dukeupress.edu/the-politics-of-terror")[source]],
    [Kronstadt Soviet], [Russia, 1921], [≈18,000], [Betrayed], [*Stormed by the Red Army*; rebels executed or exiled], [#link("https://doi.org/10.2307/2492031")[source]],
    [Cherán †], [Michoacán, Mexico, 2011–present], [≈16,000], [Alive], [*Survives*, legally recognised indigenous autonomy], [#link("https://journals.sagepub.com/doi/full/10.1177/0094582X20975004")[source]],
    [Recovered factories †], [Argentina, 2001–present], [≈16,000 workers], [Alive], [*Survives*, pressured under the Milei government], [#link("https://doi.org/10.1177/0143831X261438626")[source]],
    [Alcoy insurrection], [Alcoy, Spain, 1873], [≈10,000], [Crushed], [*Retaken by the federal army* within days], [#link("https://doi.org/10.4000/rh19.7784")[source]],
    [Exarcheia], [Athens, 1970s–present], [Thousands], [Alive], [*Survives*, under ongoing police eviction pressure], [#link("https://doi.org/10.1111/anti.13099")[source]],
    [Magonista Baja California], [Mexico, 1911], [Thousands], [Crushed], [*Defeated by federal troops*; the PLM suppressed], [#link("https://sandiegohistory.org/journal/1999/january/magonista/")[source]],
    [Alt Llobregat rising], [Catalonia, Spain, 1932], [≈3,000], [Crushed], [*Retaken by army and Civil Guard*; militants deported], [#link("https://doi.org/10.4000/framespa.4436")[source]],
    [CHAZ / CHOP], [Seattle, USA, 2020], [A few thousand], [Collapsed], [*Collapsed in ≈3 weeks*; cleared by police], [#link("https://www.seattle.gov/documents/departments/oig/sentinel%20event%20review/wave3reportfinal.pdf")[source]],
    [Marinaleda], [Spain, 1979–present], [≈2,700], [Alive], [*Survives* as a functioning cooperative], [#link("https://doi.org/10.14288/acme.v19i3.1998")[source]],
    [Christiania Freetown], [Copenhagen, 1971–present], [≈1,000], [Alive], [*Survives*, semi-legalised, under constant property pressure], [#link("https://doi.org/10.1177/0042098014532852")[source]],
  )
]
]
