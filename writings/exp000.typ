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
    columns: (1.35fr, 0.95fr, 0.9fr, 0.55fr, 1.55fr, 1.6fr),
    align: (left + top,) * 6,
    inset: 5pt,
    stroke: 0.4pt + luma(70%),
    table.header([Experiment], [Where / when], [Scale], [Death], [How it ended], [Source]),
    [Revolutionary Catalonia & Aragon], [Spain, 1936–1939], [≈5–8 million in collectives], [Betrayed], [*Undermined by Stalinist allies*, then defeated by Franco], [#link("https://doi.org/10.1177/026569148701700402")[Julián Casanova, "Anarchism and Revolution in the Spanish Civil War: The Case of Aragon," _European History Quarterly_ (1987)]],
    [Free Territory (Makhnovshchina)], [Ukraine, 1918–1921], [Up to ≈7 million], [Betrayed], [Used then *liquidated by the Bolsheviks* once the Whites were beaten], [#link("https://doi.org/10.1080/10455752.2023.2165778")[Altınörs, "The Makhno Movement and Bolshevism," _Capitalism Nature Socialism_ 34(1) (2023)]],
    [Rojava (AANES)], [North-east Syria, 2012–present], [≈2–4 million], [Alive], [*Survives* under constant military threat from Turkey and others], [#link("https://doi.org/10.1080/21520844.2024.2314447")[Haval Ahmad, Emma MacTavish & Kenneth Christie, "The de facto Autonomous Governance and Stability in the Middle East: The Case of Kurds in Rojava," _The Journal of the Middle East and Africa_ 15, no. 1 (2024): 91–110]],
    [Hungarian workers' councils], [Hungary, 1956], [Millions, briefly], [Crushed], [*Crushed by Soviet tanks* within weeks], [#link("https://doi.org/10.1177/088832540201600208")[Johanna Granville, "From the Archives of Warsaw and Budapest: A Comparison of the Events of 1956," _East European Politics and Societies_ 16(2) (2002): 521–563]],
    [Paris Commune], [Paris, 1871], [≈2 million], [Crushed], [*Crushed by the French Army*; ≈20,000 killed in the _semaine sanglante_], [#link("https://www.routledge.com/The-Paris-Commune-1871/Tombs/p/book/9780582309036")[Tombs, _The Paris Commune 1871_ (1999)]],
    [Korean People's Association], [Manchuria, 1929–1931], [≈2 million], [Crushed], [*Caught between Japanese imperial forces and Stalinists*], [#link("https://sunypress.edu/Books/A/Anarchism-in-Korea")[Hwang, _Anarchism in Korea_ (2016)]],
    [Biennio Rosso], [Italy, 1919–1920], [≈600,000 workers], [Collapsed], [*Collapsed*; cleared the path for Fascist reaction], [#link("https://doi.org/10.1002/9781405198073.wbierp0198")[Pietro Di Paola, "Biennio Rosso (1919–1920)," _The International Encyclopedia of Revolution and Protest_, ed. Immanuel Ness (2009)]],
    [Bavarian Council Republic †], [Munich, 1919], [≈600,000], [Crushed], [*Stormed by the Freikorps*; Landauer murdered], [#link("https://doi.org/10.1163/1477285X-12341309")[Cedric Cohen-Skalli and Libera Pisano, "Farewell to Revolution! Gustav Landauer's Death and the Funerary Shaping of His Legacy," _The Journal of Jewish Thought and Philosophy_ 28, no. 2 (2020): 184–227]],
    [Bakur self-rule †], [South-east Turkey, 2015–2016], [≈400,000], [Crushed], [*Turkish army sieges*; districts levelled, trustees imposed], [#link("https://doi.org/10.1080/13608746.2023.2255017")[Reşat Bayer and Özge Kemahlıoğlu, "Democratic Backsliding, Conflict, and Partisan Mobilisation of Ethnic Groups: Local Government Control and Electoral Participation in Turkey," _South European Society and Politics_ 28, no. 1 (2023): 19–46]],
    [Zapatistas (EZLN)], [Chiapas, Mexico, 1994–present], [≈300,000], [Alive], [*Survives*, encircled and pressured by the Mexican state], [#link("https://doi.org/10.1177/0022002709341173")[María de la Luz Inclán, "Repressive Threats, Procedural Concessions, and the Zapatista Cycle of Protests, 1994–2003," _Journal of Conflict Resolution_ (2009)]],
    [Oaxaca Commune (APPO) †], [Oaxaca, Mexico, 2006], [≈200,000], [Crushed], [*Federal police retook the city centre*], [#link("https://doi.org/10.1093/acrefore/9780199366439.013.752")[Marco Estrada Saavedra, "The Popular Assembly of the Peoples of Oaxaca (APPO)," _Oxford Research Encyclopedia of Latin American History_ (2020)]],
    [Icelandic Commonwealth], [Iceland, 930–1262], [≈50,000], [Collapsed], [*Collapsed into feuding chieftains*; absorbed by Norway], [#link("https://doi.org/10.1484/J.VIATOR.2.301403")[Jesse L. Byock, "Governmental Order in Early Medieval Iceland," _Viator_ (1986)]],
    [Strandzha Commune], [Ottoman Thrace, 1903], [Tens of thousands], [Crushed], [*Crushed by the Ottoman army* after ≈20 days], [#link("https://www.dukeupress.edu/the-politics-of-terror")[Perry, _The Politics of Terror_ (1988)]],
    [Kronstadt Soviet], [Russia, 1921], [≈18,000], [Betrayed], [*Stormed by the Red Army*; rebels executed or exiled], [#link("https://doi.org/10.2307/2492031")[Daniels, "The Kronstadt Revolt of 1921: A Study in the Dynamics of Revolution," _American Slavic and East European Review_ (1951)]],
    [Cherán †], [Michoacán, Mexico, 2011–present], [≈16,000], [Alive], [*Survives*, legally recognised indigenous autonomy], [#link("https://journals.sagepub.com/doi/full/10.1177/0094582X20975004")[Gasparello, "Communal Responses … in Cherán" (2021)]],
    [Recovered factories †], [Argentina, 2001–present], [≈16,000 workers], [Alive], [*Survives*, pressured under the Milei government], [#link("https://doi.org/10.1177/0143831X261438626")[Gürler, "Winning the right to work through solidarity: The Argentine workers' self-management movement," _Economic and Industrial Democracy_ (2026)]],
    [Alcoy insurrection], [Alcoy, Spain, 1873], [≈10,000], [Crushed], [*Retaken by the federal army* within days], [#link("https://doi.org/10.4000/rh19.7784")[Moisand, "« Cantonards » et « communeux ». La révolution cantonale espagnole dans l'ombre de la Commune (1873)," _Revue d'histoire du XIXe siècle_ (2021)]],
    [Exarcheia], [Athens, 1970s–present], [Thousands], [Alive], [*Survives*, under ongoing police eviction pressure], [#link("https://doi.org/10.1111/anti.13099")[Apostolopoulou and Liodaki, "Austerity Infrastructure, Gentrification, and Spatial Violence: A Ceaseless Battle over Urban Space in Exarcheia Neighbourhood," _Antipode_ 57(1) (2025): 5-30]],
    [Magonista Baja California], [Mexico, 1911], [Thousands], [Crushed], [*Defeated by federal troops*; the PLM suppressed], [#link("https://sandiegohistory.org/journal/1999/january/magonista/")[Lawrence D. Taylor, "The Magonista Revolt in Baja California: Capitalist Conspiracy or Rebelion de los Pobres?," _The Journal of San Diego History_ (1999)]],
    [Alt Llobregat rising], [Catalonia, Spain, 1932], [≈3,000], [Crushed], [*Retaken by army and Civil Guard*; militants deported], [#link("https://doi.org/10.4000/framespa.4436")[Ángel Herrerín López, "El movimiento de enero de 1932: ¿insurrección cenetista o asalto anarquista al poder sindical?," _Les Cahiers de Framespa_ 25 (2017)]],
    [CHAZ / CHOP], [Seattle, USA, 2020], [A few thousand], [Collapsed], [*Collapsed in ≈3 weeks*; cleared by police], [#link("https://www.seattle.gov/documents/departments/oig/sentinel%20event%20review/wave3reportfinal.pdf")[Seattle Office of Inspector General, _Sentinel Event Review: CHOP_ (2021)]],
    [Marinaleda], [Spain, 1979–present], [≈2,700], [Alive], [*Survives* as a functioning cooperative], [#link("https://doi.org/10.14288/acme.v19i3.1998")[Candón-Mena and Domínguez-Jaime, "La Autoconstrucción de Viviendas en Marinaleda desde la Perspectiva del Gobierno de los Bienes Comunes de Ostrom," _ACME: An International Journal for Critical Geographies_ (2020)]],
    [Christiania Freetown], [Copenhagen, 1971–present], [≈1,000], [Alive], [*Survives*, semi-legalised, under constant property pressure], [#link("https://doi.org/10.1177/0042098014532852")[Coppola and Vanolo, "Normalising Autonomous Spaces: Ongoing Transformations in Christiania, Copenhagen," _Urban Studies_ (2015)]],
  )
]
]
