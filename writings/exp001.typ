#let meta = (
  title: "How does anarchism typically die",
  date: "2026-06-21",
  status: "revising",
  collection: "essays",
)

#let run = json("/artifacts/data/exp001/numbers.json")

#let body = [
  Anarchism is often dismissed as never having been tried. It has — repeatedly, at real scale, governing millions of people. The pattern worth noticing is not that it never works, but _how_ it ends.

  The #run.n_experiments cases in the appendix below are too few for statistics, but enough for a shape. Sort them by cause of death and one bar dwarfs the rest.

  #figure(
    image("/artifacts/data/exp001/deaths.png", width: 100%),
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

  == Grounding the sources

  A claim-verification companion built with the demolab _ground-claims_ runbook: for each cited source I could retrieve, the verbatim sentence(s) that back that row's manner-of-death claim. Quotes are agent-located pointers, self-checked for verbatim match but *not* independently verified — confirm against the source before citing.

  === Lawrence D. Taylor (1999) — The Magonista Revolt in Baja California

  #link("https://sandiegohistory.org/journal/1999/january/magonista/")[Journal of San Diego History (1999)]

  *Summary.* A narrative history of the 1911 PLM ("Magonista") armed incursion into Baja California — the Liberal columns' capture of Mexicali and Tijuana, the movement's internal fragmentation, and its military defeat by Mexican federal forces. Taylor weighs and rejects the "filibuster / capitalist conspiracy" reading, treating it as a genuine if disorganised revolutionary episode.

  *Claim it supports.* _"Defeated by federal troops; the PLM suppressed"_ (Magonista Baja California).

  *Quotes.*
  - _"After a three-hour combat, the small Liberal force, outnumbered and outmaneuvered by the federals, was routed."_ (§ the June 1911 defeat at Tijuana) — the federal military defeat the claim names.
  - _"With the defeat of the Second Division, the formal Magonista campaign in Baja California came to an end, even though armed Liberal parties continued to stage cross-border raids into the territory up until early 1914."_ (§ end of the campaign) — the suppression of the PLM campaign.

  === Seattle Office of Inspector General (2021) — Sentinel Event Review, Wave 3

  #link("https://www.seattle.gov/documents/departments/oig/sentinel%20event%20review/wave3reportfinal.pdf")[seattle.gov · OIG Sentinel Event Review, Wave 3 (PDF)]

  *Summary.* The report reviews the Seattle Police Department's response to protests from 8 June to 1 July 2020, when SPD vacated the East Precinct and the Capitol Hill Organized Protest (CHOP) — originally the Capitol Hill Autonomous Zone (CHAZ) — was established. The zone persisted 23 days until the Mayor ordered police to clear it following several shootings.

  *Claim it supports.* _"Collapsed in ≈3 weeks; cleared by police"_ (CHAZ / CHOP).

  *Quotes.*
  - _"The CHOP existed for the next 23 days."_ (p. 11) — the ≈3-week (23-day) duration.
  - _"The CHOP existed until July 1, 2020, during which time several shootings occurred, prompting the Mayor to order SPD to clear the area."_ (p. 6) — the end date and the police clearing.

  === Candón-Mena & Domínguez-Jaime (2020) — La Autoconstrucción de Viviendas en Marinaleda

  #link("https://doi.org/10.14288/acme.v19i3.1998")[ACME: An International Journal for Critical Geographies (2020)]

  *Summary.* Analyses Marinaleda's (Andalusia) self-built housing programme through Ostrom's commons-governance framework, as a case of the Social Production of Habitat built on self-management, mutual aid, and collective property. From long-term fieldwork, it argues the scheme functions as a self-governed common good sustained by an organised community. (Quotes are in the original Spanish.)

  *Claim it supports.* _"Survives as a functioning cooperative"_ (Marinaleda).

  *Quotes.*
  - _"el pueblo se ha caracterizado por mantener durante años una intensa movilización que se ha materializado en grandes logros sociales, sobre todo en materia de empleo (Cooperativa El Humoso, Escuela Taller) y de vivienda (autoconstrucción)"_ (p. 690) — years of sustained mobilisation yielding lasting cooperative achievements in work and housing.
  - _"el papel preponderante de las formas de autogestión (asamblea del pueblo y de beneficiarios); el principio de ayuda mutua (recursos públicos cedidos por el Ayuntamiento y trabajo voluntario de la comunidad); y la propiedad colectiva"_ (p. 698) — the case is defined by ongoing self-management, mutual aid, and collective property.

  === Not yet grounded

  The runbook never invents quotes, so these rows await their source text. Provide the file (or clear the bot-wall in a browser) and each can be completed.

  - *Open access, but behind a browser bot-wall* (retrievable in a browser, not by automated fetch): Alcoy (Moisand, _Revue d'histoire du XIXe siècle_, 2021); Alt Llobregat (Herrerín López, _Les Cahiers de Framespa_, 2017); Cherán (Gasparello, _Latin American Perspectives_, 2021); Exarcheia (Apostolopoulou & Liodaki, _Antipode_, 2025).
  - *Paywalled — provide the PDF:* Catalonia (Casanova, _European History Quarterly_, 1987); Makhno (Altınörs, _Capitalism Nature Socialism_, 2023); Rojava (Ahmad, MacTavish & Christie, _Journal of the Middle East and Africa_, 2024); Hungary (Granville, _East European Politics and Societies_, 2002); Biennio Rosso (Di Paola, _Encyclopedia of Revolution and Protest_, 2009); Bavaria (Cohen-Skalli & Pisano, _Journal of Jewish Thought and Philosophy_, 2020); Bakur (Bayer & Kemahlıoğlu, _South European Society and Politics_, 2023); Zapatistas (Inclán, _Journal of Conflict Resolution_, 2009); Oaxaca (Estrada Saavedra, _Oxford Research Encyclopedia_, 2020); Iceland (Byock, _Viator_, 1986); Kronstadt (Daniels, _American Slavic and East European Review_, 1951); Recovered factories (Gürler, _Economic and Industrial Democracy_, 2026); Christiania (Coppola & Vanolo, _Urban Studies_, 2015).
  - *Books — provide scans of the cited pages:* Paris Commune (Tombs, _The Paris Commune 1871_, 1999); Korea (Hwang, _Anarchism in Korea_, 2016); Strandzha (Perry, _The Politics of Terror_, 1988).
]
