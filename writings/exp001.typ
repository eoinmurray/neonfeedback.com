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
    [Free Territory (Makhnovshchina)], [Ukraine, 1918–1921], [Up to ≈7 million], [Betrayed], [Used then *liquidated by the Bolsheviks* once the Whites were beaten], [#link("https://theanarchistlibrary.org/library/peter-arshinov-history-of-the-makhnovist-movement-1918-1921")[source]],
    [Rojava (AANES)], [North-east Syria, 2012–present], [≈2–4 million], [Alive], [*Survives* under constant military threat from Turkey and others], [#link("https://doi.org/10.1080/21520844.2024.2314447")[source]],
    [Hungarian workers' councils], [Hungary, 1956], [Millions, briefly], [Crushed], [*Crushed by Soviet tanks* within weeks], [#link("https://doi.org/10.1177/088832540201600208")[source]],
    [Paris Commune], [Paris, 1871], [≈2 million], [Crushed], [*Crushed by the French Army*; ≈20,000 killed in the _semaine sanglante_], [#link("https://www.routledge.com/The-Paris-Commune-1871/Tombs/p/book/9780582309036")[source]],
    [Korean People's Association], [Manchuria, 1929–1931], [≈2 million], [Crushed], [*Caught between Japanese imperial forces and Stalinists*], [#link("https://theanarchistlibrary.org/library/francesco-dalessandro-the-forgotten-anarchist-commune-in-manchuria")[source]],
    [Biennio Rosso], [Italy, 1919–1920], [≈600,000 workers], [Collapsed], [*Collapsed*; cleared the path for Fascist reaction], [#link("https://libcom.org/article/1918-1921-italian-factory-occupations-and-biennio-rosso")[source]],
    [Bavarian Council Republic †], [Munich, 1919], [≈600,000], [Crushed], [*Stormed by the Freikorps*; Landauer murdered], [#link("https://doi.org/10.1163/1477285X-12341309")[source]],
    [Bakur self-rule †], [South-east Turkey, 2015–2016], [≈400,000], [Crushed], [*Turkish military operations*; districts destroyed, trustees imposed], [#link("https://doi.org/10.1080/13608746.2023.2255017")[source]],
    [Zapatistas (EZLN)], [Chiapas, Mexico, 1994–present], [≈300,000], [Alive], [*Survives*, encircled and pressured by the Mexican state], [#link("https://doi.org/10.1177/0022002709341173")[source]],
    [Oaxaca Commune (APPO) †], [Oaxaca, Mexico, 2006], [≈200,000], [Crushed], [*Federal police (PFP) crushed the Commune*], [#link("https://doi.org/10.1093/acrefore/9780199366439.013.752")[source]],
    [Icelandic Commonwealth], [Iceland, 930–1262], [≈50,000], [Collapsed], [*Collapsed into feuding chieftains*; absorbed by Norway], [#link("https://doi.org/10.1484/J.VIATOR.2.301403")[source]],
    [Strandzha Commune], [Ottoman Thrace, 1903], [Tens of thousands], [Crushed], [*Crushed by the Ottoman army* after ≈20 days], [#link("https://theanarchistlibrary.org/library/georgi-khadzhiev-down-with-the-sultan-long-live-the-balkan-federation")[source]],
    [Kronstadt Soviet], [Russia, 1921], [≈18,000], [Betrayed], [*Stormed by the Red Army*; rebels executed or exiled], [#link("https://doi.org/10.2307/2492031")[source]],
    [Cherán †], [Michoacán, Mexico, 2011–present], [≈16,000], [Alive], [*Survives*, legally recognised indigenous autonomy], [#link("https://journals.sagepub.com/doi/full/10.1177/0094582X20975004")[source]],
    [Recovered factories †], [Argentina, 2001–present], [≈16,000 workers], [Alive], [*Survives*, worker self-management under renewed pressure], [#link("https://doi.org/10.1177/0143831X261438626")[source]],
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

  === Julián Casanova (1987) — Anarchism and Revolution in the Spanish Civil War: The Case of Aragon

  #link("https://doi.org/10.1177/026569148701700402")[European History Quarterly 17(4) (1987)]

  *Summary.* A study of the roughly 450 CNT/anarcho-syndicalist agrarian collectives set up in Republican Aragón after July 1936. Casanova argues the experiment was destroyed not by Franco but from within the Republican camp — dissolved by decree in August 1937 and broken by the Communist-led XI Division under Líster.

  *Claim it supports.* _"Undermined by Stalinist allies, then defeated by Franco"_ (Revolutionary Catalonia & Aragon).

  *Quotes.*
  - _"The preparation of a Republican offensive on the Aragon front justified the deployment there of the XI Division, commanded by the Communist Enrique Lister."_ (p. 443) — the Communist military instrument turned on the anarchist Council of Aragon.
  - _"On 11 August 1937, the Gaceta de la República published the decree dissolving the Council and relieving of their posts the Government Delegate in Aragon, Joaquin Ascaso, and the remaining members of the Council."_ (p. 443) — the Republican government's formal dissolution of the collectives' governing body.
  - _"similar methods were used to dismantle the new organization being tried out by the anarchists. In both cases, armed groups from outside - first the Catalan militias and then Lister's XI Division burst violently into Aragon."_ (p. 446) — the armed dismantling of the collectives before Franco's victory.

  === Peter Arshinov (1921) — History of the Makhnovist Movement, 1918–1921

  #link("https://theanarchistlibrary.org/library/peter-arshinov-history-of-the-makhnovist-movement-1918-1921")[theanarchistlibrary.org · Arshinov (1921)]

  *Summary.* A participant history by Peter Arshinov, himself a Makhnovist, of Makhno's anarchist insurgency in Ukraine. It documents the October 1920 military-political pact with the Soviet government against Wrangel, the Whites' November defeat, and the Bolsheviks' 26 November surprise attack that destroyed the Makhnovists once they were no longer needed. #text(fill: gray, size: 8pt)[(A committed partisan source — it asserts Bolshevik bad faith throughout — used because the neutral scholarly article was paywalled and unavailable.)]

  *Claim it supports.* _"Used then liquidated by the Bolsheviks once the Whites were beaten"_ (Free Territory (Makhnovshchina)).

  *Quotes.*
  - _"This was said on November 16, and on November 26th the Bolsheviks treacherously attacked the Makhnovist staff and troops in the Crimea and in Gulyai-Polye"_ (p. 105) — the Bolshevik surprise attack, days after Wrangel's rout.
  - _"For the Bolsheviks this agreement was nothing more than a military and strategic step calculated to last at most a month or two — the time needed to defeat Wrangel. Once this was accomplished, they were determined to resume slandering the Makhnovists as bandits and counter-revolutionaries, and under this pretext to make war on them."_ (p. 106) — the "used" half: a cynical alliance meant only to last until Wrangel fell.
  - _"Thus the agreement between the Makhnovists and the Bolsheviks was doomed from the very beginning and could not have lasted after the defeat of Wrangel."_ (p. 106) — ties the betrayal directly to the Whites' defeat.

  === Ahmad, MacTavish & Christie (2024) — The de facto Autonomous Governance and Stability in the Middle East: The Case of Kurds in Rojava

  #link("https://doi.org/10.1080/21520844.2024.2314447")[Journal of the Middle East and Africa 15(1) (2024)]

  *Summary.* Argues the Kurdish-led de facto autonomous region of Rojava, established after ISIS created a power vacuum in north-east Syria, offers a comparatively stable, multicultural model of governance — while cataloguing the risks that threaten it: foreign intervention (especially Turkish incursions), isolation, and detention-camp crises.

  *Claim it supports.* _"Survives under constant military threat from Turkey and others"_ (Rojava (AANES)).

  *Quotes.*
  - _"Although Rojava Self-Administration was declared in 2013, one of the region's biggest obstacles, as noted by Saleh Moslem, is being under constant threat from foreign intervention."_ (p. 104) — constant external threat as the chief obstacle to the surviving administration.
  - _"the Turkish incursion after the withdrawal of a majority of US support emboldened Turkish-backed armed groups such as Suleiman Shah Brigade and Hamza Division"_ (p. 104) — Turkish incursion and Turkish-backed forces specifically.
  - _"Open border points are also subject to closures due to pressures from other foreign actors, such as Turkey and Russian forces, on behalf of the Syrian regime."_ (p. 105) — threats from Turkey "and others".

  === Johanna Granville (2002) — From the Archives of Warsaw and Budapest: A Comparison of the Events of 1956

  #link("https://doi.org/10.1177/088832540201600208")[East European Politics and Societies 16(2) (2002)]

  *Summary.* Uses declassified archives to compare the 1956 crises and explain why the USSR intervened militarily in Hungary but not Poland, tracing events between 23 October and the second Soviet invasion of 4 November 1956. (This source was a scanned PDF; the quote below is OCR-transcribed.)

  *Claim it supports.* _"Crushed by Soviet tanks within weeks"_ (Hungarian workers' councils).

  *Quotes.*
  - _"the final crackdown of 4 November"_ (OCR-transcribed — verify against the scan) — names the 4 November 1956 second Soviet intervention that ended the revolution, weeks after the 23 October uprising.

  === Cohen-Skalli & Pisano (2020) — Farewell to Revolution! Gustav Landauer's Death and the Funerary Shaping of His Legacy

  #link("https://doi.org/10.1163/1477285X-12341309")[The Journal of Jewish Thought and Philosophy 28(2) (2020)]

  *Summary.* Centres on the violent death of the anarchist Gustav Landauer in May 1919 at the collapse of Munich's Räterepublik, and how his friends reshaped the killing into martyrdom, read against his anarchist theory of revolution.

  *Claim it supports.* _"Stormed by the Freikorps; Landauer murdered"_ (Bavarian Council Republic).

  *Quotes.*
  - _"The execution of Landauer by the Freikorps rendered vivid the disparity between the expectations of Landauer as he threw himself into the Munich Revolution in late 1918, and the conflicted reactions of his close companions"_ (p. 185) — names the Freikorps as his killers.
  - _"They shot and beat Landauer to death."_ (p. 185) — the murder itself, from an eyewitness account.

  === Reşat Bayer and Özge Kemahlıoğlu (2023) — Democratic Backsliding, Conflict, and Partisan Mobilisation of Ethnic Groups

  #link("https://doi.org/10.1080/13608746.2023.2255017")[South European Society and Politics 28(1) (2023)]

  *Summary.* Studies how democratic backsliding and renewed PKK conflict in 2015–2018 curtailed the pro-Kurdish party's control of south-eastern municipalities: after local self-governance declarations, the state answered with military operations, destruction, and the replacement of elected mayors by appointed trustees (kayyum).

  *Claim it supports.* _"Turkish military operations; districts destroyed, trustees imposed"_ (Bakur self-rule).

  *Quotes.*
  - _"The state responded with military operations. In addition to fatalities including civilians, urban armed conflict caused civilian dislocation and physical destruction."_ (pp. 27–28) — the state's military response, causing destruction and displacement.
  - _"mayors from the pro-Kurdish parties were replaced by government-appointed trustees"_ (p. 28) — elected mayors replaced by imposed trustees.
  - _"Executive decree \#674 of September 2016 granted the central government the right to appoint non-elected trustees in the case of mayors' removal due to terrorism-related reasons."_ (p. 32) — the legal mechanism for imposing trustees.

  === María de la Luz Inclán (2009) — Repressive Threats, Procedural Concessions, and the Zapatista Cycle of Protests, 1994–2003

  #link("https://doi.org/10.1177/0022002709341173")[Journal of Conflict Resolution (2009)]

  *Summary.* Models how repressive threats and procedural concessions shaped the 1994–2003 Zapatista protest cycle. After the 1994 uprising and ceasefire, the Mexican state kept a military siege while alternating concessions and repressive threats against the EZLN and Zapatista communities.

  *Claim it supports.* _"Survives, encircled and pressured by the Mexican state"_ (Zapatistas (EZLN)).

  *Quotes.*
  - _"it kept a military siege around Zapatista headquarters in the Lacandon Jungle"_ (p. 2) — ongoing military encirclement by the state.
  - _"the Mexican government granted procedural concessions and applied repressive threats to the EZLN and the Zapatista communities"_ (p. 2) — sustained state pressure. #text(fill: gray, size: 8pt)[(The article's window is 1994–2003; "survives" to the present is beyond what it quotes — the encirclement and pressure are directly supported.)]

  === Estrada Saavedra (2020) — The Popular Assembly of the Peoples of Oaxaca (APPO)

  #link("https://doi.org/10.1093/acrefore/9780199366439.013.752")[Oxford Research Encyclopedia of Latin American History (2020)]

  *Summary.* In 2006 a teachers' union dispute in Oaxaca escalated into the APPO, which took territorial control of the state capital through barricades, seized media, and a self-managed popular government (the Oaxaca Commune). After failed negotiations, the federal government deployed the Federal Preventive Police (PFP); the experience ended in violent repression.

  *Claim it supports.* _"Federal police (PFP) crushed the Commune"_ (Oaxaca Commune (APPO)).

  *Quotes.*
  - _"the federal government decided to send in the PFP to pacify the state, with assistance from the army and navy"_ (p. 8) — the federal Preventive Police deployed to end the uprising.
  - _"On November 25, one week before the swearing-in of the new President, the police operation began that would come to a bloody end with the Oaxaca Commune"_ (p. 8) — the police operation that violently terminated the Commune.

  === Daniels (1951) — The Kronstadt Revolt of 1921: A Study in the Dynamics of Revolution

  #link("https://doi.org/10.2307/2492031")[American Slavic and East European Review (1951)]

  *Summary.* Analyses the March 1921 Kronstadt rising as a left-wing revolt against Communist rule, growing out of Petrograd strikes and fleet discontent; the regime denounced it as a White plot and crushed it by armed assault, pushing Lenin toward the NEP.

  *Claim it supports.* _"Stormed by the Red Army; rebels executed or exiled"_ (Kronstadt Soviet).

  *Quotes.*
  - _"a resolution appearing in the last number of the Izvestija published before Kronstadt was stormed and captured on March 17"_ (p. 248) — dates the storming and capture.
  - _"The main body of troops employed were kursanty ('officer cadets') from Red Army training schools, and Cheka men: the assault on Kronstadt was officered by the top officialdom of the Communist Party"_ (p. 248) — the attacking force: Red Army cadets and Cheka.
  - _"From an interview with Kozlovskij after his escape to Finland"_ (p. 245, n. 18) — the rebel commander's flight into exile. #text(fill: gray, size: 8pt)[(This political analysis anchors the storming and the exile; the mass executions of the sailors — standard in the wider historiography — are not tabulated here.)]

  === Gasparello (2021) — Communal Responses to Structural Violence and Dispossession in Cherán, Mexico

  #link("https://doi.org/10.1177/0094582X20975004")[Latin American Perspectives (2021)]

  *Summary.* After illegal logging and criminal violence, the Purépecha community of Cherán rose up in 2011 and rebuilt its government around communal self-organization — abolishing political parties and, through a legal process, instituting a council-and-assembly structure governing by usos y costumbres.

  *Claim it supports.* _"Survives, legally recognised indigenous autonomy"_ (Cherán).

  *Quotes.*
  - _"After a legal process in November 2011, the indigenous people of Cherán were able to appoint their authorities according to their usos y costumbres: the party system of local politics disappeared, and a council structure was promoted in its stead"_ (p. 12) — the court-won right to self-govern by customary law.
  - _"Cherán currently has a capillary structure for discussion and decisions that guides and controls the Communal Government"_ (p. 12) — the ongoing assembly-based communal government.

  === Gürler (2026) — Winning the right to work through solidarity: The Argentine workers' self-management movement

  #link("https://doi.org/10.1177/0143831X261438626")[Economic and Industrial Democracy (2026)]

  *Summary.* From 2024–2025 fieldwork in six worker-recovered enterprises (Empresas Recuperadas por sus Trabajadores) around Buenos Aires, Gürler examines how Argentine workers reconstruct the right to work through factory occupation, solidarity, and self-management — a living practice rooted in the 2001 crisis.

  *Claim it supports.* _"Survives, worker self-management under renewed pressure"_ (Recovered factories).

  *Quotes.*
  - _"Today, this historical continuity can be observed in Argentina's worker-recovered enterprises that emerged after the 2001 economic crisis"_ (p. 6) — the movement persists to the present as worker self-management. #text(fill: gray, size: 8pt)[(The fieldwork dates to the Milei presidency and notes a "stronger defence of private property" by authorities, but the article does not name Milei — so the row no longer attributes the pressure to his government specifically.)]

  === Moisand (2021) — « Cantonards » et « communeux ». La révolution cantonale espagnole dans l'ombre de la Commune (1873)

  #link("https://doi.org/10.4000/rh19.7784")[Revue d'histoire du XIXe siècle (2021)]

  *Summary.* Reads Spain's 1873 cantonal revolution against the shadow of the Paris Commune: dozens of towns declared autonomous "cantons" and monarchist generals of the regular army crushed them within weeks (bar Cartagena). The FRE-AIT judged only Alcoy (revolt of 9–13 July 1873) a genuinely social movement.

  *Claim it supports.* _"Retaken by the federal army within days"_ (Alcoy insurrection).

  *Quotes.*
  - _"Ces derniers abattent les Républiques cantonales en quelques semaines, mais ne parviennent à défaire celle de Carthagène, où se sont réfugiés les insurgés d'autres villes, qu'après six mois de résistance."_ (p. 58) — the army crushed the cantonal republics within a few weeks (only Cartagena held out).
  - _"seul le canton d'Alcoy (une ville textile dont les ouvriers s'étaient révoltés entre le 9 et le 13 juillet 1873) pouvait être interprété comme un mouvement social."_ (p. 60) — dates the Alcoy rising to a four-day span (9–13 July). #text(fill: gray, size: 8pt)[(The article centres on Cartagena; it dates and situates Alcoy's brief rising but has no sentence narrating its specific recapture.)]

  === Apostolopoulou & Liodaki (2025) — Austerity Infrastructure, Gentrification, and Spatial Violence: A Ceaseless Battle over Urban Space in Exarcheia

  #link("https://doi.org/10.1111/anti.13099")[Antipode 57(1) (2025)]

  *Summary.* Examines Athens' Exarcheia, where austerity-era neglect meets profit-driven regeneration (a new metro station, Strefi Hill). From participatory action research, it documents heavy securitisation, continuous policing, and eviction pressure as tools of gentrification — a "ceaseless battle" in which residents persist.

  *Claim it supports.* _"Survives, under ongoing police eviction pressure"_ (Exarcheia).

  *Quotes.*
  - _"the Square is not merely a construction area but can be likened to a battleground, primarily due to the presence of metal barriers and the continuous police presence in the neighbourhood's core."_ (p. 18) — ongoing police pressure at Exarcheia's centre.
  - _"control and policing strategies leading to eviction and displacement under the guise of urban revitalisation"_ (p. 22) — policing as eviction pressure.
  - _"Facing increasing authoritarianism, they persist in resisting, collaborating, and striving within social movements and legal battles"_ (p. 24) — residents endure and continue the fight.

  === Coppola & Vanolo (2015) — Normalising Autonomous Spaces: Ongoing Transformations in Christiania, Copenhagen

  #link("https://doi.org/10.1177/0042098014532852")[Urban Studies (2015)]

  *Summary.* Christiania, squatted in 1971 in central Copenhagen, reached a 2011 agreement letting inhabitants collectively buy most of their land while regulating previously self-governed domains. The authors read this "normalisation" as a hybrid of autonomy and neoliberalism that secures survival while eroding autonomy under market and legal pressure.

  *Claim it supports.* _"Survives, semi-legalised, under constant property pressure"_ (Christiania Freetown).

  *Quotes.*
  - _"If on the one hand the agreement apparently guarantees the survival of Christiania, on the other hand it regulates various domains that used to be self-regulated by the community, and therefore limits Christiania's autonomy."_ (p. 1152) — survival secured only by accepting external regulation.
  - _"the Danish government concluded an agreement enabling inhabitants of Christiania to buy collectively most of the land on which they live at the price of about 76 million kroner (14 million euro)"_ (p. 1158) — the community persists by buying its land under financial pressure.

  === Francesco D'Alessandro (2020) — The Forgotten Anarchist Commune in Manchuria

  #link("https://theanarchistlibrary.org/library/francesco-dalessandro-the-forgotten-anarchist-commune-in-manchuria")[theanarchistlibrary.org · D'Alessandro (2020)]

  *Summary.* After Japan's 1910 annexation of Korea, exiled Korean anarchists built autonomous self-governing districts in Manchuria (the Shinmin district among them), defended by the Army of the North under Kim Jwa-jin. This Manchurian commune of the late 1920s was destroyed by the early 1930s under combined assault from Japanese imperial troops and Moscow-directed Korean communists who assassinated its leaders. #text(fill: gray, size: 8pt)[(A movement-sympathetic source. It says "communists directed from Moscow" (≈ Stalinists) and also names Chinese troops, so the row's "between Japanese and Stalinists" simplifies a fuller multi-party account.)]

  *Claim it supports.* _"Caught between Japanese imperial forces and Stalinists"_ (Korean People's Association).

  *Quotes.*
  - _"The Japanese government sent 35,000 imperial troops into Manchuria and installed a puppet government, the Manchukuo in 1931."_ (§ "by the beginning of the 1930s") — the Japanese imperial-forces pressure.
  - _"At the same time, the Korean Communist Party, directed from Moscow, began infiltrating the Commune and systematically assassinating its anarchist leaders. Kim Jwa-jin was murdered in January 1930."_ — the communist / Stalinist pressure.
  - _"Together, the Japanese Army, the North Korean Communist Army, and the Communist Party infiltrators, along with some Chinese troops surrounded the Commune from the outside and inside and eventually destroyed it."_ — the two-front destruction.

  === libcom.org — 1918–1921: The Italian factory occupations and the Biennio Rosso

  #link("https://libcom.org/article/1918-1921-italian-factory-occupations-and-biennio-rosso")[libcom.org · Italian factory occupations and the Biennio Rosso]

  *Summary.* In 1919–1920 a rank-and-file council movement swept Italy, culminating in September 1920 when roughly half a million workers occupied and self-managed their factories. After a month the reformist CGL and Socialist Party negotiated a return to work in exchange for promised (never-delivered) legal workers' control. With the movement broken, big business turned to the fascist movement to crush the working class.

  *Claim it supports.* _"Collapsed; cleared the path for Fascist reaction"_ (Biennio Rosso).

  *Quotes.*
  - _"But after over a month, the workers were once again betrayed by the PSI and the CGL. They opposed the movement and promised the state a return to 'normality' in exchange for legalised workers' control alongside the bosses. Of course, the workers' control never materialised."_ (§ September 1920) — the negotiated collapse of the occupation wave.
  - _"With workers' militancy dampened, big businesses turned en masse to the fascist movement to comprehensively crush the powerful working class, which they did temporarily, but not without meeting stiff resistance."_ (final paragraph) — the defeat opening the way to the fascist reaction.

  === Georgi Khadzhiev (1992) — Down with the Sultan, Long Live the Balkan Federation

  #link("https://theanarchistlibrary.org/library/georgi-khadzhiev-down-with-the-sultan-long-live-the-balkan-federation")[theanarchistlibrary.org · Khadzhiev (1992)]

  *Summary.* A partisan anarchist history of the Macedonian and Thracian liberation movement, recounting the 1903 Preobrazhenie (Transfiguration) Uprising in Ottoman Thrace and framing the short-lived "Strandzha Commune" as a spontaneous experiment in libertarian communism, led in part by anarchists like Gerdzhikov. #text(fill: gray, size: 8pt)[(A celebratory, ideological account, not neutral scholarship.)]

  *Claim it supports.* _"Crushed by the Ottoman army after ≈20 days"_ (Strandzha Commune).

  *Quotes.*
  - _"The Strandzha Commune lived and pulsated for more than 20 days in conditions of true communism"_ (§ The Transfiguration Uprising and the "Strandzha Commune") — the roughly-20-day duration.
  - _"This reign of free communism was set up on the first day of the uprising and continued through until 21st August 1903, in some places until the end of the month, until it was crushed militarily by a 40,000-strong Ottoman army of infantry, cavalry and artillery"_ — crushed militarily by the Ottoman army.

  === Not yet grounded

  Three rows still await a usable source.

  - *Source not machine-readable:* Iceland (Byock, _Viking Age Iceland_) — the scanned excerpt provided is truncated (missing the 1262–4 Norway chapter) and OCR-garbles the Old Norse, so its quotes fail verbatim; a clean, text-based ebook is needed.
  - *Provided PDF incomplete:* Alt Llobregat (Herrerín López, _Les Cahiers de Framespa_, 2017) — the OpenEdition print keeps truncating after the intro; the full-text export is needed.
  - *No usable source yet:* Paris Commune — the ≈20,000 figure is contested (Tombs 2012 revises it down), so grounding needs the 1999 book pages, or a rewording of the row.
]
