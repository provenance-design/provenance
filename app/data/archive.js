// =============================================================================
// PROVENANCE ARCHIVE DATA
// =============================================================================
// This file contains all archive entries. To add new entries:
// 1. Run the pipeline: python pipeline.py export
// 2. Paste the generated entries at the bottom of the ARCHIVE array
// 3. Deploy: git add . && git commit -m "add entries" && git push
// =============================================================================

export const DISCIPLINES = ["All", "Product", "Graphic", "Furniture", "Architecture", "Typography", "Lighting"];

export const PALETTE = {
  Product: "#C45B28", Graphic: "#2B5EA7", Furniture: "#6B7C5E",
  Architecture: "#8C6E54", Typography: "#7B5B8D", Lighting: "#C4963C",
};

export const CONN_TYPES = {
  argument: { label: "Argument", color: "#C45B28", icon: "⟷", description: "Objects in direct dialogue or contradiction" },
  lineage: { label: "Lineage", color: "#7B5B8D", icon: "→", description: "Direct influence or descent" },
  material: { label: "Material Thread", color: "#8C6E54", icon: "◆", description: "Connected through shared materials or processes" },
  sameProblem: { label: "Same Problem", color: "#2B5EA7", icon: "◎", description: "Different answers to the same design question" },
  zeitgeist: { label: "Zeitgeist", color: "#6B7C5E", icon: "≈", description: "What else was being made at the same moment" },
  method: { label: "Shared Method", color: "#C4963C", icon: "⚙", description: "Same design methodology, different outcomes" },
};

export const ARCHIVE = [
  {
    id: 1, title: "Arco Floor Lamp", designer: "Achille & Pier Giacomo Castiglioni", year: 1962, discipline: "Lighting", origin: "Italy", manufacturer: "Flos", collection: "MoMA, New York", movement: "Italian Rationalism",
    wikiTitle: "Arco_(lamp)",
    description: "A 2.7-metre arc of stainless steel springs from a block of Carrara marble to suspend a spun-aluminium reflector over a dining table. The Castiglioni brothers' logic was ruthless: people want overhead light without ceiling fixtures, so the lamp must reach across the room. The marble base weighs 65kg — heavy enough to counterbalance the arc, with a hole drilled through it so two people can carry it with a broomstick.",
    significance: "The Arco made the floor lamp architectural. But its real lesson is methodological — the Castiglionis started from behaviour (how people eat, where they want light) rather than form. The marble isn't decorative. The arc isn't sculptural. Every element solves a problem. The fact that it's beautiful is a consequence, not an intention.",
    connections: [
      { id: 3, type: "sameProblem", reason: "Both solve 'light over a surface' — Arco with mass and arc, Parentesi with tension and gravity" },
      { id: 8, type: "material", reason: "Both use marble as functional mass, not decoration — counterweight here, heat sink in the Taccia" },
      { id: 11, type: "argument", reason: "Rams' systematic rationalism vs. Castiglioni's intuitive problem-solving — two routes to the same rigour" },
      { id: 6, type: "sameProblem", reason: "Ponti's Superleggera and Arco both achieve maximum with minimum — one pursues lightness, the other embraces weight" },
    ],
    keywords: ["counterbalance", "Carrara marble", "problem-solving", "arc", "Flos"]
  },
  {
    id: 2, title: "Mezzadro Stool", designer: "Achille & Pier Giacomo Castiglioni", year: 1957, discipline: "Furniture", origin: "Italy", manufacturer: "Zanotta (from 1971)", collection: "Triennale Design Museum, Milan", movement: "Ready-made / Italian Radical",
    wikiTitle: "Mezzadro_(stool)",
    description: "A tractor seat mounted on a chromium-plated steel stem with a beechwood crossbar foot. Designed in 1957 but not produced until 1971 because manufacturers considered it a joke. The Castiglionis bought the tractor seat from an agricultural supply catalogue. They didn't redesign it — they recognised that its form, shaped by decades of ergonomic refinement for a completely different purpose, was already resolved.",
    significance: "The Mezzadro is a Duchampian gesture executed with an engineer's precision. It asks: what if the best design solution already exists, just in the wrong context? This is readymade thinking applied to industrial design. It took 14 years to reach production because the industry couldn't accept that a tractor part was furniture.",
    connections: [
      { id: 9, type: "argument", reason: "Mezzadro finds form through function. Juicy Salif abandons function for meaning. The central argument in design discourse, in two objects." },
      { id: 4, type: "method", reason: "Both designed by observing existing behaviour — Mezzadro watches farmers, Sella watches telephone users" },
      { id: 12, type: "argument", reason: "Carlton's Memphis excess vs. Mezzadro's readymade economy — both reject Modernist convention, but in opposite directions" },
      { id: 6, type: "zeitgeist", reason: "Both created in 1957. Ponti refines tradition; the Castiglionis detonate it. Same year, same country, opposite instincts." },
    ],
    keywords: ["readymade", "tractor seat", "recontextualisation", "Duchamp", "Zanotta"]
  },
  {
    id: 3, title: "Parentesi Lamp", designer: "Achille Castiglioni & Pio Manzù", year: 1971, discipline: "Lighting", origin: "Italy", manufacturer: "Flos", collection: "Design Museum, London", movement: "Italian Rationalism",
    wikiTitle: "Parentesi_(lamp)",
    description: "A ceiling-to-floor tensioned steel cable holds a nickel-plated brass slider — shaped like a parenthesis mark — that grips a spotlight. The lamp slides up and down and rotates 360 degrees. No screws, no switches on the body. You move the light physically, with your hands. The entire mechanism is the cable, the bracket, and gravity.",
    significance: "Parentesi reduces a lighting system to its absolute minimum components. The cable is structure. The bracket is adjustment. Gravity is the lock. Castiglioni called it a 'non-lamp' — an absence of design that still solves the problem completely.",
    connections: [
      { id: 1, type: "sameProblem", reason: "Both solve adjustable directional light — Arco through monumental engineering, Parentesi through radical reduction" },
      { id: 11, type: "method", reason: "Both achieve maximum function through minimum means — Parentesi with three components, 606 with one rail system" },
      { id: 7, type: "lineage", reason: "The Ulm Stool's multi-function minimalism anticipates Parentesi's component-reduction logic by 17 years" },
    ],
    keywords: ["tension", "minimal components", "gravity", "systems", "non-lamp"]
  },
  {
    id: 4, title: "Sella Stool", designer: "Achille & Pier Giacomo Castiglioni", year: 1957, discipline: "Furniture", origin: "Italy", manufacturer: "Zanotta (from 1983)", collection: "MoMA, New York", movement: "Ready-made / Behavioural Design",
    wikiTitle: null,
    description: "A bicycle saddle on a steel column rising from a cast-iron doorstop base. Designed for taking telephone calls — in 1957, phones were fixed to walls, and people stood to use them. The Sella gives you something to lean on without fully sitting. The hemispherical base lets you pivot and shift weight naturally while talking.",
    significance: "The Sella is arguably the first piece of furniture designed around a specific behaviour rather than a generic function. It doesn't ask 'how should a chair work?' but 'what does the body do during a phone call?' This observational method predates human-centred design methodology by decades.",
    connections: [
      { id: 2, type: "method", reason: "Both use readymade parts (bicycle saddle, tractor seat) selected for ergonomic qualities already refined in another context" },
      { id: 10, type: "lineage", reason: "Sella's behavioural observation → Grillo's pocket-fit analysis → modern UX research. A direct methodological lineage." },
      { id: 9, type: "argument", reason: "Sella is designed entirely around use. Juicy Salif is designed entirely around conversation. Function vs. meaning at its starkest." },
    ],
    keywords: ["behavioural", "telephone", "bicycle saddle", "observation", "lean"]
  },
  {
    id: 5, title: "Snoopy Table Lamp", designer: "Achille & Pier Giacomo Castiglioni", year: 1967, discipline: "Lighting", origin: "Italy", manufacturer: "Flos", collection: "Triennale Design Museum, Milan", movement: "Italian Rationalism",
    wikiTitle: null,
    description: "A heavy white Carrara marble base supports an enamelled metal reflector on a slim glass stem. The reflector's profile resembles the cartoon dog's nose, hence the name. But the form is entirely functional: it directs light downward while the marble base re-reflects ambient light upward through the glass stem, creating a secondary glow.",
    significance: "The Snoopy demonstrates the Castiglionis' ability to generate visual personality from functional logic. The marble base isn't just a counterweight — it's a reflective surface. The glass stem isn't just structure — it's a light conductor. Nothing is merely what it appears.",
    connections: [
      { id: 1, type: "material", reason: "Both use Carrara marble as functional mass — counterweight in the Arco, reflective surface in the Snoopy" },
      { id: 8, type: "sameProblem", reason: "Both solve 'indirect ambient light from a table lamp' — Taccia with an inverted bowl, Snoopy with reflective marble" },
      { id: 3, type: "method", reason: "Parentesi and Snoopy both make every component serve double duty — structural and optical" },
    ],
    keywords: ["marble", "reflected light", "dual function", "humour", "Flos"]
  },
  {
    id: 6, title: "Superleggera Chair", designer: "Gio Ponti", year: 1957, discipline: "Furniture", origin: "Italy", manufacturer: "Cassina", collection: "Design Museum, London", movement: "Italian Modernism",
    wikiTitle: "Superleggera_chair",
    description: "Weighing 1.7kg. An ash frame with an Indian cane seat. Ponti spent eight years refining the traditional Chiavari fishermen's chair — a vernacular form dating to 1807 — reducing each element to its structural minimum. The legs taper to a triangular cross-section of just 18mm. It can be lifted with a single finger.",
    significance: "The Superleggera is not a reinvention but a perfection. Ponti didn't reject tradition — he subjected it to the same analytical rigour the Castiglionis applied to tractor seats. The chair proves that innovation doesn't require novelty. Eight years of refinement on a 150-year-old typology produced something unmistakably modern.",
    connections: [
      { id: 2, type: "zeitgeist", reason: "Both 1957. Ponti refines a vernacular chair over 8 years. The Castiglionis bolt a tractor seat to a stem. Same year, opposite philosophies of innovation." },
      { id: 7, type: "method", reason: "Both reduce an existing typology to structural minimum — Ulm Stool in wood, Superleggera in ash. Subtraction as method." },
      { id: 1, type: "argument", reason: "Superleggera pursues extreme lightness (1.7kg). Arco embraces extreme weight (65kg). Both are perfect solutions." },
    ],
    keywords: ["lightness", "Chiavari", "vernacular", "ash", "refinement", "1.7kg"]
  },
  {
    id: 7, title: "Ulm Stool", designer: "Max Bill & Hans Gugelot", year: 1954, discipline: "Furniture", origin: "Germany", manufacturer: "Wb Form (reissue)", collection: "Vitra Design Museum", movement: "Ulm School / Concrete Art",
    wikiTitle: "Ulm_stool",
    description: "Three pieces of solid wood — two identical side panels and a seat — joined with a single dowel rod. It serves simultaneously as a stool, a side table, a shelf, a step, and a carrying device. Designed as utility furniture for the Hochschule für Gestaltung Ulm, it was never intended to be an 'object' at all.",
    significance: "The Ulm Stool embodies the school's philosophy so completely that it functions as a manifesto in wood. Maximum function, minimum means, zero decoration. That it became a design icon collected by museums would have appalled Bill, who believed design should be anonymous and democratic.",
    connections: [
      { id: 11, type: "lineage", reason: "Ulm Stool is the furniture expression of the same ideology that produced the 606 shelving — systematic, anonymous, democratic" },
      { id: 6, type: "method", reason: "Both achieve structural minimum through subtraction — but Ponti refines tradition while Bill invents from principle" },
      { id: 12, type: "argument", reason: "Ulm Stool: design should be anonymous. Carlton: design should scream. The entire postwar argument in two objects." },
    ],
    keywords: ["Ulm School", "multi-function", "anonymous", "Max Bill", "manifesto"]
  },
  {
    id: 8, title: "Taccia Table Lamp", designer: "Achille & Pier Giacomo Castiglioni", year: 1962, discipline: "Lighting", origin: "Italy", manufacturer: "Flos", collection: "Victoria & Albert Museum", movement: "Italian Rationalism",
    wikiTitle: null,
    description: "An inverted glass bowl floats above an aluminium body shaped like a squat column. The concave glass diffuser catches light from below and scatters it upward and outward. The aluminium base houses the bulb and acts as a heat sink. It resembles, deliberately, a Roman column capital.",
    significance: "The Taccia applies architectural indirect lighting — bouncing light off ceilings — to a table lamp. The classical column reference is neither postmodern irony nor decoration; it's recognition that the Romans understood reflected light in public spaces. The Castiglionis simply miniaturised the principle.",
    connections: [
      { id: 5, type: "sameProblem", reason: "Both solve indirect table lighting — Taccia bounces light off the ceiling, Snoopy bounces it off marble" },
      { id: 1, type: "material", reason: "Both Castiglioni pieces that use heavy material (marble/aluminium) as functional engineering, not aesthetic choice" },
      { id: 15, type: "lineage", reason: "Taccia's column-capital form references Roman civic architecture — Pompidou's exposed systems reference industrial architecture. Both bring public-scale thinking indoors." },
    ],
    keywords: ["indirect light", "glass diffuser", "Roman", "column", "civic"]
  },
  {
    id: 9, title: "Juicy Salif Lemon Squeezer", designer: "Philippe Starck", year: 1990, discipline: "Product", origin: "France / Italy", manufacturer: "Alessi", collection: "Design Museum, London", movement: "Postmodernism",
    wikiTitle: "Juicy_Salif",
    description: "A cast-aluminium citrus squeezer standing on three legs. Starck sketched it on a pizzeria napkin. It barely functions — the juice runs down the legs, the seeds aren't caught, the aluminium reacts with citric acid. Starck himself admitted it 'is not meant to squeeze lemons — it is meant to start conversations.'",
    significance: "The Juicy Salif is the direct opposite of Castiglioni's method. Where the Mezzadro finds form through function, the Juicy Salif abandons function for cultural meaning. These two objects frame the central argument in design discourse: is a product's purpose practical or communicative?",
    connections: [
      { id: 2, type: "argument", reason: "The defining confrontation. Mezzadro: readymade function elevated. Juicy Salif: function deliberately sacrificed. Choose your position." },
      { id: 12, type: "lineage", reason: "Memphis → Starck. Both reject Modernist functionalism, but Memphis uses colour and form while Starck uses sculptural provocation." },
      { id: 4, type: "argument", reason: "Sella is designed entirely around how the body behaves. Juicy Salif is designed entirely around how culture behaves. Body vs. culture." },
    ],
    keywords: ["Alessi", "anti-function", "conversation piece", "Starck", "napkin sketch"]
  },
  {
    id: 10, title: "Grillo Telephone", designer: "Marco Zanuso & Richard Sapper", year: 1965, discipline: "Product", origin: "Italy", manufacturer: "Siemens", collection: "MoMA, New York", movement: "Italian Industrial Design",
    wikiTitle: "Grillo_telephone",
    description: "The first flip phone — a hinged plastic shell that folds the earpiece onto the mouthpiece, halving the footprint when not in use. 'Grillo' means cricket in Italian. Zanuso and Sapper compressed the electronics into a space manufacturers considered impossibly small, collaborating directly with Siemens' engineers to redesign internal components.",
    significance: "The Grillo anticipates the mobile phone by three decades. Its hinge, its portability concern, its integration of form and miniaturised electronics — all map directly onto the problems Motorola and Nokia would face in the 1990s. It demonstrates the Italian model of designer-as-engineer.",
    connections: [
      { id: 4, type: "lineage", reason: "Sella observed telephone behaviour in 1957. Grillo redesigned the telephone itself in 1965. The same user-centred logic, applied at different scales." },
      { id: 16, type: "method", reason: "Both Grillo and the Braun SK 4 required designers to work inside engineering constraints — redesigning internals, not just styling surfaces" },
      { id: 11, type: "sameProblem", reason: "Both solve 'how to make a complex system take up less space' — 606 through modular wall-mounting, Grillo through folding" },
    ],
    keywords: ["flip", "hinge", "miniaturisation", "Sapper", "Zanuso", "Siemens"]
  },
  {
    id: 11, title: "606 Universal Shelving System", designer: "Dieter Rams", year: 1960, discipline: "Furniture", origin: "Germany", manufacturer: "Vitsœ", collection: "Vitra Design Museum", movement: "Functionalism / Systems Design",
    wikiTitle: "606_Universal_Shelving_System",
    description: "Wall-mounted modular shelving using an aluminium E-Track rail system. Components clip onto tracks at any height, in any combination. In continuous production since 1960, unchanged. You can buy a shelf today that connects to a track installed in 1962.",
    significance: "The 606 is not a product but a platform. Its sixty-year backward compatibility is a radical statement against planned obsolescence. Rams designed it to outlast its owner, to adapt to different lives and rooms. What would it mean to design something this permanent?",
    connections: [
      { id: 12, type: "argument", reason: "The defining opposition. 606: permanence, neutrality, system. Carlton: presence, emotion, spectacle. Entire postwar design discourse in two shelving units." },
      { id: 1, type: "argument", reason: "Rams: systematic, rational, Ulm-derived. Castiglioni: intuitive, observational, Milan-derived. Two routes to rigour." },
      { id: 7, type: "lineage", reason: "Ulm Stool and 606 share DNA — both emerge from the HfG Ulm ideology of anonymous, democratic, systematic design" },
      { id: 3, type: "method", reason: "Both achieve maximum flexibility through minimum components — Parentesi with cable + bracket, 606 with track + shelf" },
    ],
    keywords: ["modular", "platform", "backward compatible", "Vitsœ", "permanence"]
  },
  {
    id: 12, title: "Carlton Bookcase", designer: "Ettore Sottsass", year: 1981, discipline: "Furniture", origin: "Italy", manufacturer: "Memphis", collection: "Victoria & Albert Museum", movement: "Memphis / Postmodernism",
    wikiTitle: "Carlton_(bookcase)",
    description: "A totemic construction of angled shelves surfaced in brightly coloured plastic laminates. It looks like a figure with outstretched arms, or a totem pole, or a piece of architecture — anything except a bookcase. Designed for the first Memphis collection, shown at the 1981 Milan Furniture Fair.",
    significance: "Carlton is the anti-606. Where Rams sought permanence and neutrality, Sottsass demanded presence and emotion. The laminates are deliberately cheap-looking. Memphis argued that Modernist 'good taste' was just another ideology — that design could be joyful, irreverent, and culturally loud.",
    connections: [
      { id: 11, type: "argument", reason: "Place them side by side. Rams: design disappears. Sottsass: design screams. The entire history of postwar design discourse in two shelving units." },
      { id: 9, type: "lineage", reason: "Memphis → Starck → contemporary design-art. Carlton broke the functionalist consensus that made the Juicy Salif thinkable." },
      { id: 2, type: "argument", reason: "Both reject convention — but Mezzadro through readymade wit, Carlton through chromatic explosion. Italian radicalism's two faces." },
      { id: 7, type: "argument", reason: "Ulm Stool: design should be anonymous. Carlton: design should be unmistakable. The argument that defined the 1980s." },
    ],
    keywords: ["Memphis", "laminate", "anti-Modernist", "totem", "Milan 1981"]
  },
  {
    id: 13, title: "London Underground Map", designer: "Harry Beck", year: 1933, discipline: "Graphic", origin: "United Kingdom", manufacturer: "London Transport", collection: "London Transport Museum", movement: "Information Design",
    wikiTitle: "Tube_map",
    description: "Beck, an engineering draughtsman — not a graphic designer — proposed replacing the geographically accurate Underground map with a schematic using only horizontal, vertical and 45-degree lines. London Transport rejected it. When printed as a trial, public demand made it permanent. Beck was paid five guineas.",
    significance: "Beck understood that underground passengers don't need geography — they need topology. The map sacrifices literal truth for functional truth. Every metro system in the world now follows his principle. The most influential information design ever produced, made by a man the organisation barely acknowledged.",
    connections: [
      { id: 14, type: "method", reason: "Both Tschichold and Beck created systems of rules so clear that anyone could execute them — composition rules for books, schematic rules for transit" },
      { id: 16, type: "lineage", reason: "Akzidenz-Grotesk → Beck's map lettering → Johnston Sans → the entire language of public information typography" },
      { id: 7, type: "method", reason: "Beck and Bill both applied engineering logic to visual problems — Beck was literally a draughtsman, Bill was trained in silversmithing and architecture" },
    ],
    keywords: ["topology", "schematic", "wayfinding", "five guineas", "draughtsman"]
  },
  {
    id: 14, title: "Penguin Books Composition Rules", designer: "Jan Tschichold", year: 1947, discipline: "Graphic", origin: "United Kingdom / Switzerland", manufacturer: "Penguin Books", collection: "Victoria & Albert Museum", movement: "New Typography / Modernism",
    wikiTitle: "Jan_Tschichold",
    description: "Tschichold spent three years redesigning Penguin's entire output — not individual covers but the system itself. A four-page set of composition rules so precise that any designer could execute them: exact margins, standardised type sizes, the tripartite grid, the colour-coding. Over 500 titles redesigned.",
    significance: "The first true design system at publishing scale. Tschichold proved that rigorous constraints produce elegance, not monotony. A masterclass in what we now call 'design systems' and 'brand guidelines,' executed decades before those terms existed.",
    connections: [
      { id: 13, type: "method", reason: "Both create rule-based systems that anyone can execute consistently — Beck for transit, Tschichold for publishing" },
      { id: 11, type: "method", reason: "606 and Penguin rules both prove that systems thinking produces beauty — modular shelving, modular typography" },
      { id: 16, type: "lineage", reason: "Akzidenz-Grotesk → Tschichold's earlier radical typography → his Penguin classicism. A designer who moved from revolution to refinement." },
    ],
    keywords: ["design system", "composition rules", "Penguin", "Tschichold", "constraints"]
  },
  {
    id: 15, title: "Centre Pompidou", designer: "Renzo Piano & Richard Rogers", year: 1977, discipline: "Architecture", origin: "France", manufacturer: "—", collection: "Centre Pompidou, Paris", movement: "High-Tech Architecture",
    wikiTitle: "Centre_Pompidou",
    description: "A cultural centre in Paris with its structure and mechanical services on the outside — colour-coded pipes, ducts, and escalators forming the facade. Blue for air, green for water, yellow for electricity, red for movement. The building turns itself inside out, freeing internal space for art.",
    significance: "Pompidou weaponised transparency as ideology. By exposing how a building works, Piano and Rogers challenged the idea that architecture should conceal its own making. The external escalator gives Paris back to visitors for free. It democratised the museum.",
    connections: [
      { id: 16, type: "method", reason: "Both Braun SK 4 and Pompidou make the mechanism visible — acrylic lid reveals the turntable, glass tubes reveal the building's guts" },
      { id: 8, type: "lineage", reason: "Taccia references Roman civic light. Pompidou references industrial infrastructure. Both bring public-scale thinking into intimate spaces." },
      { id: 11, type: "argument", reason: "606 conceals its system behind the objects it holds. Pompidou makes the system the spectacle. Order vs. exhibition." },
    ],
    keywords: ["inside-out", "high-tech", "colour-coded", "transparency", "democratic"]
  },
  {
    id: 16, title: "Braun SK 4 Radiogram", designer: "Dieter Rams & Hans Gugelot", year: 1956, discipline: "Product", origin: "Germany", manufacturer: "Braun", collection: "MoMA, New York", movement: "Ulm School / Functionalism",
    wikiTitle: "Braun_SK_4",
    description: "Known as 'Snow White's Coffin' — a combined radio and record player in a white-painted metal body with a transparent acrylic lid. The lid was a radical gesture: it made the mechanism visible, turning the act of playing a record into something to watch.",
    significance: "The SK 4 established the visual grammar that consumer electronics still speaks. Its lineage to Jony Ive's Apple products is well documented. But the deeper legacy is ideological: the Ulm School's insistence that design is a systematic, rational discipline shaped industrial design education for decades.",
    connections: [
      { id: 15, type: "method", reason: "Both make the mechanism visible as an ideological statement — SK 4's acrylic lid, Pompidou's exposed pipes" },
      { id: 10, type: "method", reason: "Both required designers to work inside engineering constraints — Rams redesigned Braun's innards, Zanuso redesigned Siemens' electronics" },
      { id: 14, type: "lineage", reason: "Akzidenz-Grotesk's anonymous rationalism → Ulm School typography → Braun's visual language. A direct aesthetic lineage from 1898 to 1956." },
      { id: 11, type: "lineage", reason: "SK 4 and 606 are the two pillars of Rams' practice — one for electronics, one for furniture. Same philosophy, different materials." },
    ],
    keywords: ["Braun", "Ulm School", "Snow White's Coffin", "acrylic", "Apple"]
  },

  // =========================================================================
  // NEW ENTRIES — paste pipeline output below this line
  // =========================================================================

];
