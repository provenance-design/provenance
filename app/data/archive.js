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
  // SCANDINAVIAN DESIGN
  // =========================================================================

  {
    id: 17, title: "Paimio Chair", designer: "Alvar Aalto", year: 1932, discipline: "Furniture", origin: "Finland", manufacturer: "Artek", collection: "MoMA, New York", movement: "Nordic Modernism",
    wikiTitle: "Paimio_Chair",
    description: "A cantilevered armchair made from a single sheet of birch plywood bent into a continuous scroll between a laminated birch frame. Designed for tuberculosis patients at the Paimio Sanatorium — the angle was calculated to ease breathing. The plywood is warm to touch, unlike the tubular steel furniture of the Bauhaus.",
    significance: "Aalto rejected the Bauhaus's steel-and-leather vocabulary for a material that was humane, local, and warm. The Paimio didn't just solve a medical problem — it proved that modernism could be soft. Every Scandinavian designer who followed worked in the space Aalto opened.",
    connections: [
      { id: 6, type: "argument", reason: "Both pursue lightness through different logics — Ponti subtracts from tradition, Aalto bends a new material into a new form. Refinement vs. invention." },
      { id: 18, type: "method", reason: "Paimio and Stool 60 both emerge from Aalto's plywood experiments — the chair solves a medical brief, the stool solves a stackability problem. Same material, different questions." },
      { id: 7, type: "argument", reason: "Ulm Stool: wood as anonymous utility. Paimio: wood as warmth and care. Same material, opposite ideologies." },
      { id: 16, type: "zeitgeist", reason: "Both 1930s responses to Bauhaus orthodoxy — Aalto softened it, Rams would later systematise it. Two futures growing from the same root." },
    ],
    keywords: ["birch plywood", "sanatorium", "bent wood", "humane modernism", "Artek", "cantilever"]
  },
  {
    id: 18, title: "Stool 60", designer: "Alvar Aalto", year: 1933, discipline: "Furniture", origin: "Finland", manufacturer: "Artek", collection: "Design Museum, Helsinki", movement: "Nordic Modernism",
    wikiTitle: "Stool_60",
    description: "Three L-shaped birch legs bolted to a circular seat. The legs are made by sawing slots into solid birch, steaming the wood, and bending it 90 degrees — Aalto's patented 'L-leg' technique, which eliminated the need for a separate underframe. Eight million produced and counting.",
    significance: "The Stool 60 is the IKEA flat-pack principle invented forty years early — three legs and a seat, shipped flat, assembled with screws. But unlike flat-pack, it's made from solid birch, stackable to infinity, and hasn't changed in ninety years. Mass production without disposability.",
    connections: [
      { id: 11, type: "sameProblem", reason: "Both solve 'how to make furniture that adapts and lasts' — 606 through wall-mounted modularity, Stool 60 through stackable simplicity. Platform vs. primitive." },
      { id: 17, type: "method", reason: "Both emerge from Aalto's L-leg innovation — Paimio bends plywood into a scroll, Stool 60 bends solid wood into a right angle. Same technique, different scales." },
      { id: 7, type: "method", reason: "Both reduce furniture to absolute structural minimum — three pieces each. Bill invents from geometry, Aalto invents from wood grain." },
    ],
    keywords: ["L-leg", "stackable", "birch", "flat-pack", "mass production", "Artek"]
  },
  {
    id: 19, title: "Savoy Vase", designer: "Alvar Aalto", year: 1936, discipline: "Product", origin: "Finland", manufacturer: "Iittala", collection: "MoMA, New York", movement: "Nordic Modernism / Organic Modernism",
    wikiTitle: "Aalto_vase",
    description: "A free-form glass vase with an irregular, undulating profile — no two cross-sections are identical. Originally entered anonymously in a competition for the Karhula-Iittala glassworks. The form references Finnish lakes seen from the air, though Aalto denied literal inspiration. Still mouth-blown by a team of seven.",
    significance: "The Savoy introduced organic form to modernist production without abandoning it. It isn't decorative — it's a rejection of the straight line as the only rational form. Nature, Aalto argued, is rational too. The vase opened a door that Noguchi, the Eameses, and Saarinen would walk through.",
    connections: [
      { id: 47, type: "lineage", reason: "Aalto's organic form → Noguchi's biomorphic sculpture → the Coffee Table. A direct line from Finnish lakes to sculptural furniture." },
      { id: 45, type: "lineage", reason: "Savoy's free-form curves anticipate Saarinen's Tulip series — organic modernism moving from glass to furniture." },
      { id: 9, type: "argument", reason: "Both reject geometric rationalism — but Aalto does it through nature, Starck through provocation. Organic sincerity vs. postmodern theatre." },
    ],
    keywords: ["organic form", "mouth-blown", "Iittala", "Finnish lakes", "free-form", "glass"]
  },
  {
    id: 20, title: "Faaborg Chair", designer: "Kaare Klint", year: 1914, discipline: "Furniture", origin: "Denmark", manufacturer: "Rud. Rasmussen", collection: "Designmuseum Danmark", movement: "Danish Functionalism",
    wikiTitle: null,
    description: "A mahogany and leather armchair designed for the Faaborg Museum. Klint studied proportions from English Chippendale and Hepplewhite chairs, Greek klismos, and Chinese horseshoe-back chairs — then synthesised them into something that belongs to none of those traditions. Every dimension calibrated to the human body.",
    significance: "Klint invented the method that defines Danish furniture design: study historical precedent, measure the human body, synthesise. Wegner, Mogensen, Juhl — all Klint's students or inheritors. Without the Faaborg Chair, there is no 'Danish Modern.'",
    connections: [
      { id: 6, type: "method", reason: "Both refine historical vernacular through analytical rigour — Ponti studies Chiavari fishermen's chairs, Klint studies Chippendale and klismos. Tradition as raw material." },
      { id: 27, type: "lineage", reason: "Klint's method directly produced Wegner's Round Chair — study precedent, measure the body, synthesise. Teacher to student to masterpiece." },
      { id: 2, type: "argument", reason: "Klint: the answer is in history, refine it. Castiglioni: the answer is in a tractor catalogue, recontextualise it. Two radical approaches to 'found' form." },
    ],
    keywords: ["Danish Functionalism", "proportion", "Klint", "precedent study", "Faaborg Museum"]
  },
  {
    id: 21, title: "PH Artichoke", designer: "Poul Henningsen", year: 1958, discipline: "Lighting", origin: "Denmark", manufacturer: "Louis Poulsen", collection: "Designmuseum Danmark", movement: "Danish Functionalism",
    wikiTitle: "PH_Artichoke",
    description: "72 copper leaves arranged in 12 rows of 6, positioned so that every light path from the bulb hits at least one leaf before reaching the eye. Designed for the Langelinie Pavillonen restaurant in Copenhagen. The geometry is trigonometric — each leaf angle calculated to eliminate glare from any seated position in the room.",
    significance: "Henningsen spent his entire career on one problem: how to produce glare-free light from an exposed bulb. The Artichoke is his most complex answer — but the PH 5, designed the same year with three shades, proves the same principle can be solved with radical simplicity. Both approaches work. That's the lesson.",
    connections: [
      { id: 1, type: "sameProblem", reason: "Both solve 'how to direct light where people need it' — Arco reaches across the room, the Artichoke shields from every angle. Distance vs. diffusion." },
      { id: 3, type: "argument", reason: "Parentesi: three components. Artichoke: 72 leaves. Both achieve glare-free light. Maximum reduction vs. maximum elaboration arriving at the same result." },
      { id: 22, type: "method", reason: "PH Artichoke and PH 5 solve the same problem in the same year — one with 72 leaves, one with three shades. Henningsen arguing with himself." },
    ],
    keywords: ["glare-free", "72 leaves", "copper", "trigonometry", "Louis Poulsen", "Henningsen"]
  },
  {
    id: 22, title: "PH 5 Pendant", designer: "Poul Henningsen", year: 1958, discipline: "Lighting", origin: "Denmark", manufacturer: "Louis Poulsen", collection: "Design Museum, London", movement: "Danish Functionalism",
    wikiTitle: "PH_5",
    description: "Five shades — three outer, one cone, one small reflector disc — positioned so the bulb is invisible from any angle below. It works with any bulb type or colour temperature because the shade geometry, not the light source, determines the quality. Designed to prove that Henningsen's glare-free principle didn't require complexity.",
    significance: "The PH 5 hangs in more Danish homes than any other lamp. Its genius is democratic — it looks simple enough to be unremarkable, but the shade proportions encode decades of research into human perception of light. It's the most sophisticated 'ordinary' object in design history.",
    connections: [
      { id: 21, type: "method", reason: "Same designer, same year, same problem — Artichoke uses 72 leaves, PH 5 uses five shades. Complexity and simplicity as parallel valid answers." },
      { id: 5, type: "sameProblem", reason: "Both solve indirect ambient light — Snoopy bounces light off marble, PH 5 sculpts it with shade geometry. Material vs. form." },
      { id: 14, type: "method", reason: "Both are systems refined to the point of invisibility — Tschichold's composition rules, Henningsen's shade geometry. Rigour that disappears into use." },
    ],
    keywords: ["glare-free", "five shades", "democratic design", "pendant", "Louis Poulsen"]
  },
  {
    id: 23, title: "Ant Chair", designer: "Arne Jacobsen", year: 1952, discipline: "Furniture", origin: "Denmark", manufacturer: "Fritz Hansen", collection: "Design Museum, London", movement: "Danish Modernism",
    wikiTitle: "Ant_(chair)",
    description: "A single piece of pressure-moulded laminated veneer pinched at the waist, supported by three tubular steel legs. The original had three legs because Jacobsen wanted the minimum structure — later versions added a fourth for stability. Nine million sold. The first industrially produced Danish chair.",
    significance: "The Ant bridged craft and industry. Danish furniture was handmade in small workshops until Jacobsen proved that moulded plywood could be mass-produced without losing formal intelligence. Fritz Hansen went from cabinet-maker to manufacturer overnight. The Ant is where Scandinavian design became Scandinavian industry.",
    connections: [
      { id: 6, type: "argument", reason: "Superleggera: handcraft refined to perfection. Ant: industrial production achieved with formal intelligence. The craft-vs-industry argument resolved differently." },
      { id: 39, type: "lineage", reason: "Eames's LCW moulded plywood experiments in 1946 directly enabled Jacobsen's Ant in 1952. American technique, Danish form." },
      { id: 18, type: "method", reason: "Both prove that mass production and design integrity aren't opposed — Stool 60 through bent solid wood, Ant through moulded plywood." },
    ],
    keywords: ["moulded plywood", "three legs", "Fritz Hansen", "mass production", "waist"]
  },
  {
    id: 24, title: "Egg Chair", designer: "Arne Jacobsen", year: 1958, discipline: "Furniture", origin: "Denmark", manufacturer: "Fritz Hansen", collection: "Design Museum, London", movement: "Danish Modernism / Organic Modernism",
    wikiTitle: "Egg_(chair)",
    description: "A foam-padded fibreglass shell on an aluminium pedestal base, upholstered in leather or fabric. Designed for the SAS Royal Hotel in Copenhagen, where Jacobsen controlled every detail from the building to the cutlery. The shell creates a zone of privacy in public space — you sit inside the form, not on it.",
    significance: "The Egg turns a chair into architecture — it makes space, not just fills it. In the SAS Royal lobby, rows of Eggs created semi-private alcoves without walls. This is furniture thinking at the scale of interior design, a principle IKEA and WeWork would eventually commodify.",
    connections: [
      { id: 25, type: "method", reason: "Egg Chair and SAS Royal Hotel are one project — Jacobsen designed the building, then designed the furniture to complete it. Total design as method." },
      { id: 45, type: "zeitgeist", reason: "Both 1958. Saarinen's Tulip and Jacobsen's Egg both use pedestal bases to achieve sculptural unity — the same idea appearing simultaneously in Denmark and America." },
      { id: 4, type: "argument", reason: "Sella: furniture shaped by behaviour. Egg: furniture shaped by spatial psychology. Body vs. atmosphere." },
    ],
    keywords: ["fibreglass shell", "SAS Royal Hotel", "privacy", "pedestal", "Fritz Hansen", "total design"]
  },
  {
    id: 25, title: "SAS Royal Hotel", designer: "Arne Jacobsen", year: 1960, discipline: "Architecture", origin: "Denmark", manufacturer: "—", collection: "Radisson Collection Royal Hotel, Copenhagen", movement: "International Style / Total Design",
    wikiTitle: "Radisson_Blu_Royal_Hotel,_Copenhagen",
    description: "Copenhagen's first skyscraper — a 22-storey curtain-wall tower where Jacobsen designed everything: structure, facade, interiors, furniture (Egg, Swan, Drop chairs), textiles, cutlery, door handles, ashtrays. Room 606 is preserved in its original state. The building is the most complete expression of Gesamtkunstwerk in postwar architecture.",
    significance: "The SAS Royal is an argument that design coherence requires total authorial control. Every object relates to every other because one mind conceived them all. It raises the question students must eventually answer: is total design visionary or authoritarian?",
    connections: [
      { id: 15, type: "argument", reason: "Pompidou exposes its systems for democratic transparency. SAS Royal conceals them behind total aesthetic control. Open vs. closed. Democratic vs. authored." },
      { id: 24, type: "method", reason: "The Egg Chair only makes full sense inside the SAS Royal — it was designed to create privacy in this specific lobby. Object and building are inseparable." },
      { id: 46, type: "zeitgeist", reason: "SAS Royal (1960) and TWA Terminal (1962) — both architects designed the furniture to complete the architecture. Jacobsen and Saarinen arriving at total design independently." },
    ],
    keywords: ["Gesamtkunstwerk", "total design", "curtain wall", "Room 606", "Copenhagen"]
  },
  {
    id: 26, title: "The Round Chair", designer: "Hans Wegner", year: 1949, discipline: "Furniture", origin: "Denmark", manufacturer: "PP Møbler", collection: "Designmuseum Danmark", movement: "Danish Modern",
    wikiTitle: "Round_Chair",
    description: "An oak frame with a cane seat, so refined that there is no visible joinery — the top rail flows into the armrests in a single continuous curve. Known simply as 'The Chair' after appearing on the Kennedy-Nixon debate stage in 1960. Wegner made over 500 chair designs; this is the one the world chose.",
    significance: "The Round Chair is Klint's method perfected: study Chinese horseshoe-back chairs, measure the human body, remove everything that isn't structure. When American Interiors magazine put it on its cover in 1950, it single-handedly created the American market for Danish Modern.",
    connections: [
      { id: 20, type: "lineage", reason: "Klint's Faaborg method — study precedent, measure the body, synthesise — flows directly into Wegner's Round Chair. The student surpassed the teacher." },
      { id: 6, type: "method", reason: "Both refine a vernacular chair to its structural essence — Ponti from Chiavari, Wegner from Chinese horseshoe-back. Parallel traditions of subtraction." },
      { id: 28, type: "method", reason: "Wegner designed the Round Chair and the Wishbone Chair the same year — one reduces to perfect simplicity, the other adds the Y-shaped splat. Two solutions from one mind." },
    ],
    keywords: ["The Chair", "Kennedy-Nixon", "continuous curve", "Danish Modern", "PP Møbler", "cane seat"]
  },
  {
    id: 27, title: "Wishbone Chair", designer: "Hans Wegner", year: 1949, discipline: "Furniture", origin: "Denmark", manufacturer: "Carl Hansen & Søn", collection: "MoMA, New York", movement: "Danish Modern",
    wikiTitle: "Wishbone_chair",
    description: "A steam-bent beech frame with a hand-woven paper cord seat, distinguished by the Y-shaped back splat that gives it its name. The top rail curves continuously from arm to arm. The paper cord seat takes a skilled craftsperson an hour to weave — 120 metres of cord per chair. In continuous production since 1950.",
    significance: "The Wishbone synthesises Chinese, Danish, and Shaker traditions into something irreducibly Wegner. The paper cord seat is the key — it ages, darkens, moulds to the body. The chair gets better with use. This is the opposite of planned obsolescence, built into the material itself.",
    connections: [
      { id: 26, type: "method", reason: "Same designer, same year. Round Chair reduces to essentials; Wishbone adds the Y-splat. Both masterpieces — proof that there isn't one right answer." },
      { id: 11, type: "argument", reason: "606: permanent because the system never changes. Wishbone: permanent because the material improves with age. Systemic permanence vs. material permanence." },
      { id: 6, type: "sameProblem", reason: "Both solve 'the lightest strong chair' — Superleggera at 1.7kg in ash, Wishbone in steam-bent beech with woven cord. Different materials, same pursuit." },
    ],
    keywords: ["Y-splat", "paper cord", "steam-bent", "Carl Hansen", "Chinese influence", "ageing"]
  },
  {
    id: 28, title: "Chieftain Chair", designer: "Finn Juhl", year: 1949, discipline: "Furniture", origin: "Denmark", manufacturer: "Niels Vodder (original) / One Collection", collection: "Designmuseum Danmark", movement: "Danish Modern / Organic Modernism",
    wikiTitle: "Chieftain_Chair",
    description: "A teak and leather armchair where the upholstered seat and back float free of the wooden frame — they touch but don't merge. The frame is sculptural, almost figurative, with joints that resemble shoulders and hips. Cabinetmaker Niels Vodder needed new techniques to execute the complex curves Juhl drew.",
    significance: "Juhl separated structure from support, frame from surface — a principle borrowed from abstract sculpture. His colleagues in the Danish cabinetmakers' guild dismissed it as impractical art. But this 'floating' separation between frame and body influenced everything from Jacobsen's Egg to contemporary lounge chairs.",
    connections: [
      { id: 24, type: "lineage", reason: "Juhl's separation of frame and body anticipates Jacobsen's shell-on-pedestal Egg Chair. The sculptural turn in Danish furniture starts here." },
      { id: 26, type: "zeitgeist", reason: "Both 1949. Wegner refines toward invisibility; Juhl sculpts toward expression. Danish design's two parallel instincts in a single year." },
      { id: 2, type: "method", reason: "Both treat furniture as found art — Castiglioni finds the tractor seat, Juhl finds the sculpture in the chair frame. Readymade vs. carved." },
    ],
    keywords: ["floating seat", "teak", "sculptural", "Niels Vodder", "frame separation"]
  },
  {
    id: 29, title: "Spanish Chair", designer: "Børge Mogensen", year: 1958, discipline: "Furniture", origin: "Denmark", manufacturer: "Fredericia", collection: "Designmuseum Danmark", movement: "Danish Functionalism",
    wikiTitle: null,
    description: "A solid oak frame with wide armrests and a saddle leather seat and back held in place by the frame's own tension — no upholstery, no springs, no webbing. Inspired by Spanish colonial furniture Mogensen studied in Seville. The leather stretches and moulds to the owner's body over decades.",
    significance: "Mogensen's chairs are the least fashionable and most enduring in Danish design. The Spanish Chair doesn't photograph well — it needs to be sat in. That's the point. Where Juhl and Jacobsen designed for the eye, Mogensen designed for the body over time.",
    connections: [
      { id: 27, type: "sameProblem", reason: "Both solve 'a chair that improves with age' — Wishbone through paper cord, Spanish Chair through saddle leather. Materials that record use." },
      { id: 20, type: "lineage", reason: "Klint → Mogensen (his student). Both study foreign vernacular forms — Klint studies English chairs, Mogensen studies Spanish colonial. Same method, different sources." },
      { id: 11, type: "method", reason: "Both designed for permanence through material honesty — 606's aluminium tracks, Spanish Chair's saddle leather. Systems that outlast trends." },
    ],
    keywords: ["saddle leather", "Spanish colonial", "Mogensen", "Fredericia", "ageing", "oak"]
  },
  {
    id: 30, title: "Panton Chair", designer: "Verner Panton", year: 1967, discipline: "Furniture", origin: "Denmark / Switzerland", manufacturer: "Vitra (current)", collection: "Vitra Design Museum", movement: "Pop Design / Space Age",
    wikiTitle: "Panton_Chair",
    description: "The first single-material, single-piece injection-moulded chair — a cantilevered S-curve in polypropylene with no legs, no joints, no separate components. Panton spent ten years and worked with Vitra to solve the engineering. Early versions in fibreglass cracked; the final polypropylene version arrived in 1999.",
    significance: "The Panton Chair is the end point of a sixty-year question: can a chair be one piece? Aalto bent plywood, Eames moulded it, Saarinen tried fibreglass — Panton finally achieved it in plastic. It also killed the question. Once solved, there was nowhere further to go.",
    connections: [
      { id: 23, type: "lineage", reason: "Ant (moulded plywood, 1952) → Panton (moulded plastic, 1967). Each generation pushes single-form production one step further." },
      { id: 45, type: "sameProblem", reason: "Both pursue the single-pedestal idea — Saarinen's Tulip still has a separate cushion. Panton eliminates even that. Total formal unity." },
      { id: 12, type: "zeitgeist", reason: "Panton and Memphis both reject Scandinavian restraint — Panton through plastic and Pop colour, Sottsass through laminate and irony. The fun alternatives to good taste." },
    ],
    keywords: ["single piece", "injection moulded", "cantilever", "S-curve", "Vitra", "polypropylene"]
  },
  {
    id: 31, title: "Kilta Tableware", designer: "Kaj Franck", year: 1953, discipline: "Product", origin: "Finland", manufacturer: "Arabia (now Iittala)", collection: "Design Museum, Helsinki", movement: "Finnish Functionalism",
    wikiTitle: null,
    description: "Stackable, modular ceramic tableware in simple geometric forms — cylinders, hemispheres, discs — that combine freely. No matching sets required. Redesigned as Teema in 1981 with slight refinements. Pieces from 1953 and 2024 sit together on a table without conflict.",
    significance: "Franck called himself an 'anti-designer' — he wanted to eliminate unnecessary variation, not create it. Kilta argues that you don't need a soup bowl and a cereal bowl and a dessert bowl. You need one bowl. This is systems thinking applied to the kitchen table.",
    connections: [
      { id: 11, type: "method", reason: "Both create modular systems with indefinite backward compatibility — 606 for shelving, Kilta for tableware. Buy one piece in 1960, add another in 2024." },
      { id: 14, type: "method", reason: "Both impose systematic constraints that produce freedom — Tschichold's composition rules, Franck's modular tableware. Rigour as liberation." },
      { id: 57, type: "argument", reason: "Russell Wright's American Modern celebrates organic decorative form. Franck's Kilta strips everything to geometry. Two ideologies of 'modern' tableware." },
    ],
    keywords: ["modular", "stackable", "Teema", "Arabia", "anti-design", "systems"]
  },
  {
    id: 32, title: "Ultima Thule Glassware", designer: "Tapio Wirkkala", year: 1968, discipline: "Product", origin: "Finland", manufacturer: "Iittala", collection: "Design Museum, Helsinki", movement: "Finnish Organic Modernism",
    wikiTitle: null,
    description: "Glassware with a textured ice-crystal surface created by charring the inner surface of the wooden mould before blowing — the molten glass interacts with the burning wood to produce an unrepeatable frozen texture. Named after the mythical northernmost land. Each piece is unique because the carbonisation pattern differs every time.",
    significance: "Wirkkala turned a manufacturing accident into a design language. The charred mould technique means human hands and material physics co-author every piece. It's the opposite of precision engineering — it's designed imprecision, controlled randomness, nature as collaborator.",
    connections: [
      { id: 19, type: "method", reason: "Both Aalto's Savoy and Wirkkala's Ultima Thule use glass as a medium for organic Finnish form — but Aalto shapes the profile, Wirkkala shapes the surface." },
      { id: 9, type: "argument", reason: "Juicy Salif: form imposed on material. Ultima Thule: form negotiated with material. Authorship vs. collaboration." },
      { id: 59, type: "sameProblem", reason: "Both Nakashima and Wirkkala let material imperfection become the design — wood grain in furniture, mould-char in glass. Nature as co-designer." },
    ],
    keywords: ["ice crystal", "charred mould", "controlled randomness", "Iittala", "mouth-blown"]
  },
  {
    id: 33, title: "Pitcher 992", designer: "Henning Koppel", year: 1952, discipline: "Product", origin: "Denmark", manufacturer: "Georg Jensen", collection: "Designmuseum Danmark", movement: "Danish Modernism / Biomorphism",
    wikiTitle: null,
    description: "A hand-raised sterling silver water pitcher with a biomorphic profile — no straight lines, no right angles, no historical references. The form flows from a wide base to a narrow neck through continuously changing curves. Each pitcher is raised from a single sheet of silver by a silversmith over many hours.",
    significance: "Koppel brought abstract sculpture into functional silverware. The Pitcher 992 doesn't reference any previous pitcher — it references Arp and Moore. Georg Jensen's craftspeople initially refused to make it, arguing it wasn't 'real' silverwork. It won the Grand Prix at the 1954 Milan Triennale.",
    connections: [
      { id: 28, type: "zeitgeist", reason: "Both late 1940s/early 1950s. Juhl brings sculpture into furniture, Koppel brings sculpture into silver. Danish design's simultaneous turn toward abstraction." },
      { id: 19, type: "method", reason: "Both translate organic form into production — Aalto through glass-blowing, Koppel through hand-raising silver. Craft processes that resist industrial standardisation." },
      { id: 47, type: "zeitgeist", reason: "Koppel's biomorphic silver and Noguchi's biomorphic furniture emerge from the same postwar moment — abstract sculpture entering domestic life from opposite sides of the Atlantic." },
    ],
    keywords: ["biomorphic", "sterling silver", "Georg Jensen", "hand-raised", "Milan Triennale"]
  },
  {
    id: 34, title: "Unikko", designer: "Maija Isola", year: 1964, discipline: "Graphic", origin: "Finland", manufacturer: "Marimekko", collection: "Design Museum, Helsinki", movement: "Finnish Pop / Textile Design",
    wikiTitle: "Unikko",
    description: "An oversized poppy-flower print in flat, bold colours — originally red and pink on white. Marimekko's founder Armi Ratia had banned floral prints, declaring them old-fashioned. Isola created Unikko in defiance. Ratia relented when it outsold everything else. It remains Marimekko's defining pattern sixty years later.",
    significance: "Unikko is an act of creative disobedience that became a national symbol. It proves that graphic identity can be built from a single repeating pattern — no logo, no wordmark, just a poppy. Isola also demonstrates that textile design is graphic design at architectural scale.",
    connections: [
      { id: 55, type: "argument", reason: "Vignelli's NYC signage: identity through systematic restraint. Unikko: identity through a single bold pattern. System vs. gesture." },
      { id: 54, type: "method", reason: "Both Saul Bass and Maija Isola create graphic identities through radical simplification of natural forms — Bass abstracts movement, Isola abstracts flowers." },
      { id: 12, type: "zeitgeist", reason: "Unikko (1964) anticipates Memphis (1981) — both argue that colour and pattern aren't frivolous, they're serious design tools." },
    ],
    keywords: ["poppy", "Marimekko", "textile", "pattern", "defiance", "Armi Ratia"]
  },
  {
    id: 35, title: "Sydney Opera House", designer: "Jørn Utzon", year: 1973, discipline: "Architecture", origin: "Australia / Denmark", manufacturer: "—", collection: "UNESCO World Heritage Site", movement: "Expressionist Modernism",
    wikiTitle: "Sydney_Opera_House",
    description: "Interlocking concrete shells on a granite podium at Bennelong Point. Utzon won the competition in 1957 with sketches so unresolved that engineers spent years proving the roof was buildable. The shells are all cut from the same sphere — a geometric insight that made construction possible but that Utzon discovered only after years of searching.",
    significance: "The Opera House is the most famous building designed by someone who never saw it completed — Utzon was driven off the project in 1966 by political interference. It raises the hardest question in architecture: who owns the design, the architect or the client? And what's lost when the visionary is removed?",
    connections: [
      { id: 46, type: "zeitgeist", reason: "Both Utzon's shells and Saarinen's TWA Terminal use concrete expressionism to make transport buildings transcendent. The late 1950s believed infrastructure could be art." },
      { id: 15, type: "argument", reason: "Pompidou: architecture as transparent democratic machine. Opera House: architecture as poetic sculptural event. Two positions on what public buildings owe the public." },
      { id: 25, type: "argument", reason: "Jacobsen controlled every detail of SAS Royal. Utzon lost control entirely. Total design achieved vs. total design denied." },
    ],
    keywords: ["shells", "spherical geometry", "Bennelong Point", "Utzon", "UNESCO", "concrete"]
  },
  {
    id: 36, title: "Cylinda-Line", designer: "Arne Jacobsen", year: 1967, discipline: "Product", origin: "Denmark", manufacturer: "Stelton", collection: "MoMA, New York", movement: "Danish Modernism / Industrial Design",
    wikiTitle: "Cylinda-Line",
    description: "A complete tableware service — teapot, coffee pot, ice bucket, ash trays, sauce boat — made from seamless cylinders of cold-pressed stainless steel. Every piece is a pure cylinder with a flat lid. The handles are integrated, not applied. Jacobsen spent three years developing the deep-drawing technique with Stelton's engineers.",
    significance: "Cylinda-Line applies architectural discipline to tableware. Every form derives from the same cylinder — the service is a system, not a collection. It's the 606 principle at the dinner table: one module, infinite combinations.",
    connections: [
      { id: 11, type: "method", reason: "Both create systems from a single repeated module — 606 from aluminium tracks, Cylinda-Line from stainless cylinders. Modular thinking across scales." },
      { id: 31, type: "sameProblem", reason: "Both solve 'coherent tableware without matching sets' — Franck through geometric stackability, Jacobsen through cylindrical uniformity. Finnish democracy vs. Danish discipline." },
      { id: 16, type: "method", reason: "Both required the designer to push manufacturing technique — Rams with Braun's electronics, Jacobsen with Stelton's cold-pressing. Design as engineering negotiation." },
    ],
    keywords: ["cylinder", "stainless steel", "Stelton", "cold-pressed", "seamless", "system"]
  },
  {
    id: 37, title: "Margrethe Bowl", designer: "Sigvard Bernadotte & Acton Bjørn", year: 1950, discipline: "Product", origin: "Denmark", manufacturer: "Rosti (now Mepal)", collection: "Designmuseum Danmark", movement: "Scandinavian Industrial Design",
    wikiTitle: "Margrethe_bowl",
    description: "A melamine mixing bowl with an asymmetric rubber ring on the base that grips any surface, a pouring lip, and interior measurements. Named after Princess Margrethe (later Queen). Designed by the first Scandinavian industrial design consultancy. Over 60 million sold across three generations of production.",
    significance: "The Margrethe Bowl is the quiet masterclass in human-centred design — every feature solves a real kitchen problem. The rubber ring means you can whisk one-handed. The lip means you can pour without spilling. It's Castiglioni's observational method applied to baking, decades before 'user experience' was a term.",
    connections: [
      { id: 4, type: "method", reason: "Both designed by watching people — Sella watches telephone callers, Margrethe Bowl watches home bakers. Behavioural observation as design method." },
      { id: 10, type: "method", reason: "Both solve problems through integrated features rather than accessories — Grillo folds the phone, Margrethe grips the counter." },
      { id: 57, type: "sameProblem", reason: "Both reimagine kitchen objects for modern domestic life — Russell Wright through sculptural form, Bernadotte & Bjørn through functional intelligence." },
    ],
    keywords: ["melamine", "rubber ring", "pouring lip", "Bernadotte", "60 million", "kitchen"]
  },
  {
    id: 38, title: "Eva Chair", designer: "Bruno Mathsson", year: 1934, discipline: "Furniture", origin: "Sweden", manufacturer: "Dux (now Mathsson International)", collection: "Nationalmuseum, Stockholm", movement: "Swedish Functionalism",
    wikiTitle: null,
    description: "A laminated beech frame with a seat and back made from woven hemp webbing — no springs, no cushions, no upholstery. The frame's curves were derived from Mathsson's studies of the human spine in different resting positions. He built test rigs to measure pressure distribution, then shaped the frame to match.",
    significance: "Mathsson invented ergonomic furniture design by treating the body as a measurable problem, not a stylistic assumption. The hemp webbing gives exactly where pressure increases and resists where it decreases — a passive responsive system. He was doing evidence-based design in rural Sweden in the 1930s.",
    connections: [
      { id: 17, type: "zeitgeist", reason: "Both 1930s. Aalto's Paimio Chair solves a medical breathing problem. Mathsson's Eva solves a spinal pressure problem. Scandinavian modernism as body-centred care." },
      { id: 4, type: "method", reason: "Both derive form from the body's actual behaviour — Sella from how you lean during phone calls, Eva from how your spine curves at rest." },
      { id: 29, type: "sameProblem", reason: "Both use tension materials that mould to the body — Eva's hemp webbing, Spanish Chair's saddle leather. Passive comfort through material intelligence." },
    ],
    keywords: ["hemp webbing", "ergonomic", "spinal curve", "pressure distribution", "Mathsson", "laminated beech"]
  },
  // =========================================================================
  // AMERICAN MID-CENTURY
  // =========================================================================

  {
    id: 39, title: "LCW (Lounge Chair Wood)", designer: "Charles & Ray Eames", year: 1946, discipline: "Furniture", origin: "United States", manufacturer: "Herman Miller", collection: "MoMA, New York", movement: "American Modernism / Organic Design",
    wikiTitle: "Eames_Lounge_Chair_Wood",
    description: "Five pieces of moulded plywood — seat, back, two spine pieces, and a lumbar connector — mounted on a plywood and steel base. The Eameses developed the moulding technology during WWII making leg splints for the Navy. The compound curves were considered impossible until they built their own 'Kazam!' press in their apartment.",
    significance: "The LCW translated wartime manufacturing innovation into peacetime domestic furniture. Time magazine called it 'the chair of the century.' But the real legacy is methodological: the Eameses proved that serious design could emerge from playful experimentation with industrial processes.",
    connections: [
      { id: 23, type: "lineage", reason: "Eames LCW (1946) → Jacobsen Ant (1952). American moulded plywood technology directly enabled Danish mass production. The technique crossed the Atlantic." },
      { id: 17, type: "lineage", reason: "Aalto bent birch in the 1930s. The Eameses moulded plywood in the 1940s. Same material, escalating ambition — from single curves to compound forms." },
      { id: 40, type: "method", reason: "LCW and Lounge 670 represent two poles of Eames thinking — democratic plywood vs. luxurious rosewood. Both equally serious." },
    ],
    keywords: ["moulded plywood", "Kazam press", "compound curves", "Herman Miller", "wartime", "five pieces"]
  },
  {
    id: 40, title: "Eames Lounge Chair (670)", designer: "Charles & Ray Eames", year: 1956, discipline: "Furniture", origin: "United States", manufacturer: "Herman Miller", collection: "MoMA, New York", movement: "American Modernism",
    wikiTitle: "Eames_Lounge_Chair",
    description: "Three moulded rosewood plywood shells — headrest, backrest, seat — each padded with leather cushions, on a cast aluminium swivelling base. Inspired by the 'warm receptive look of a well-used first baseman's mitt.' The Eameses wanted it to age like a baseball glove — the leather softening, the wood mellowing.",
    significance: "The 670 is often dismissed as the Eameses' luxury moment, but it's actually their most honest argument about comfort. They asked: what would an honest modern club chair look like if it admitted it wanted to be comfortable? Not Corbusier's chrome geometry. Not a Victorian wingback. Something in between.",
    connections: [
      { id: 24, type: "sameProblem", reason: "Both create enclosed comfort — Egg wraps you in a shell, 670 cradles you in tilted planes. Danish enclosure vs. American recline." },
      { id: 39, type: "method", reason: "LCW (1946) and 670 (1956) — democratic plywood and luxurious rosewood. The Eameses proving they could work at any price point without compromising intelligence." },
      { id: 29, type: "sameProblem", reason: "Both promise comfort through material ageing — Spanish Chair's saddle leather, 670's baseball-glove leather. Designed to improve over decades." },
    ],
    keywords: ["rosewood", "baseball glove", "leather", "aluminium base", "Herman Miller", "comfort"]
  },
  {
    id: 41, title: "Eames House (Case Study #8)", designer: "Charles & Ray Eames", year: 1949, discipline: "Architecture", origin: "United States", manufacturer: "—", collection: "National Historic Landmark", movement: "Case Study Houses / American Modernism",
    wikiTitle: "Eames_House",
    description: "A steel-frame house in Pacific Palisades, Los Angeles, built entirely from off-the-shelf industrial components — steel decking, factory sash windows, Ferrobord panels — ordered from catalogues. The Eameses redesigned it mid-construction when the steel arrived, flipping the plan to preserve a row of eucalyptus trees. They filled it with objects: toys, shells, textiles, folk art.",
    significance: "Case Study #8 is the readymade applied to architecture. Like Castiglioni's Mezzadro, it argues that the best components already exist — you just need to see them differently. But its deeper lesson is about inhabitation: the Eameses designed the house as a frame for living, then spent forty years proving how.",
    connections: [
      { id: 2, type: "method", reason: "Both are readymade thinking — Mezzadro recontextualises a tractor seat, Eames House recontextualises factory components. Same logic, different scales." },
      { id: 25, type: "argument", reason: "SAS Royal: architect controls every object. Eames House: architects create a frame and fill it with found objects. Total design vs. total curation." },
      { id: 15, type: "lineage", reason: "Eames House makes industrial components domestic. Pompidou makes industrial systems monumental. Both normalise the factory aesthetic." },
    ],
    keywords: ["Case Study House", "off-the-shelf", "Pacific Palisades", "steel frame", "readymade architecture"]
  },
  {
    id: 42, title: "Eames Leg Splint", designer: "Charles & Ray Eames", year: 1942, discipline: "Product", origin: "United States", manufacturer: "Evans Products / US Navy", collection: "MoMA, New York", movement: "Wartime Innovation",
    wikiTitle: "Eames_leg_splint",
    description: "A moulded plywood leg splint designed for the US Navy to replace heavy metal versions. The compound-curved form cradles the leg anatomically. Over 150,000 produced during WWII. The moulding technique — using a custom-built press called 'Kazam!' and a new resin-bonded plywood process — became the foundation for all subsequent Eames furniture.",
    significance: "Every Eames plywood chair exists because of this splint. It's the purest example of wartime necessity driving peacetime design — a direct lineage from military contract to MoMA collection. The splint also proves that design constraints (lightweight, mass-producible, anatomically precise) produce better form than aesthetic freedom.",
    connections: [
      { id: 39, type: "lineage", reason: "Splint (1942) → LCW (1946). The Navy contract gave the Eameses the manufacturing knowledge that produced the chair of the century." },
      { id: 17, type: "sameProblem", reason: "Both solve medical seating problems with bent plywood — Aalto for tuberculosis patients, Eames for injured soldiers. Healthcare as design driver." },
      { id: 10, type: "method", reason: "Both required designers to work inside engineering constraints imposed by another industry — Grillo with Siemens electronics, Eames with Navy specifications." },
    ],
    keywords: ["leg splint", "US Navy", "Kazam press", "wartime", "moulded plywood", "150,000 units"]
  },
  {
    id: 43, title: "Powers of Ten", designer: "Charles & Ray Eames", year: 1977, discipline: "Graphic", origin: "United States", manufacturer: "IBM", collection: "Library of Congress", movement: "Information Design / Scientific Communication",
    wikiTitle: "Powers_of_Ten_(film)",
    description: "A nine-minute film that begins with a couple picnicking in Chicago, then zooms out by a factor of ten every ten seconds — past the solar system, past galaxies, to 10²⁵ metres — then zooms back in to 10⁻¹⁶ metres inside a proton. Commissioned by IBM. No narration beyond calm description of scale.",
    significance: "Powers of Ten is information design at its most ambitious — it makes the incomprehensible comprehensible through a single visual device. The Eameses proved that a design studio could communicate scientific ideas more effectively than most scientists. It remains the benchmark for data visualisation through narrative.",
    connections: [
      { id: 13, type: "method", reason: "Both Beck and the Eameses solve the same problem: how to make an incomprehensible system navigable. Beck simplifies geography; Eames simplifies scale." },
      { id: 55, type: "method", reason: "Both create information systems that work through relentless visual consistency — Vignelli's subway signage through Helvetica, Powers of Ten through logarithmic zooming." },
      { id: 41, type: "method", reason: "House, chairs, films — the Eameses applied the same design thinking across every scale. Powers of Ten is literally about this: everything connects across scale." },
    ],
    keywords: ["scale", "IBM", "zoom", "information design", "film", "logarithmic"]
  },
  {
    id: 44, title: "Tulip Chair", designer: "Eero Saarinen", year: 1956, discipline: "Furniture", origin: "United States", manufacturer: "Knoll", collection: "MoMA, New York", movement: "Organic Modernism",
    wikiTitle: "Tulip_chair",
    description: "A fibreglass shell seat on a cast aluminium pedestal base, designed to eliminate 'the ugly, confusing, unrestful world' under chairs and tables. Saarinen wanted a single-material solution but 1950s plastics couldn't support the base structurally — the aluminium pedestal is lacquered white to disguise the compromise.",
    significance: "The Tulip is a magnificent near-miss. Saarinen's vision of total formal unity required a material that didn't yet exist. The hidden aluminium base is honest and dishonest simultaneously — it solves the engineering while betraying the concept. Students should debate whether the compromise invalidates or enriches the design.",
    connections: [
      { id: 30, type: "lineage", reason: "Saarinen needed one material but couldn't achieve it (1956). Panton finally achieved it in plastic (1967). The Tulip is the problem; the Panton is the answer." },
      { id: 24, type: "zeitgeist", reason: "Both 1956-58. Both use pedestal bases. Both pursue sculptural unity. Saarinen and Jacobsen solving the same formal problem simultaneously, without collaboration." },
      { id: 19, type: "lineage", reason: "Aalto's Savoy vase organic curves → Saarinen's Tulip pedestal. The organic modernist line from Finland to America runs through Saarinen (whose father was Finnish)." },
    ],
    keywords: ["pedestal", "fibreglass", "Knoll", "formal unity", "hidden aluminium", "Saarinen"]
  },
  {
    id: 45, title: "TWA Flight Center", designer: "Eero Saarinen", year: 1962, discipline: "Architecture", origin: "United States", manufacturer: "—", collection: "TWA Hotel (preserved), JFK Airport", movement: "Neo-Expressionism / Organic Modernism",
    wikiTitle: "TWA_Flight_Center",
    description: "A reinforced concrete terminal at JFK Airport with a roof of four intersecting barrel vaults that swoops upward like a bird taking flight. Saarinen designed the building, the departure boards, the signage, the furniture, the red carpet. The interior flows without corridors — passengers move through sculptural space. Saarinen died before its completion.",
    significance: "The TWA Terminal is the last moment when airports were designed to celebrate flight rather than process passengers. Saarinen proved that concrete could be as expressive as steel, and that infrastructure could make people feel something. Every airport built since has been a retreat from this ambition.",
    connections: [
      { id: 25, type: "method", reason: "Both total-design projects — Jacobsen and Saarinen both designed building and furniture as one inseparable work. Two architects, same instinct." },
      { id: 35, type: "zeitgeist", reason: "TWA (1962) and Sydney Opera House (1973) — both expressive concrete shells, both designed by architects who didn't see them finished. Ambition outrunning institutions." },
      { id: 15, type: "argument", reason: "Pompidou: public space as transparent machine. TWA: public space as sculptural experience. Reason vs. emotion in civic architecture." },
    ],
    keywords: ["concrete vaults", "TWA", "JFK", "flight", "total design", "neo-expressionism"]
  },
  {
    id: 46, title: "Noguchi Coffee Table (IN-50)", designer: "Isamu Noguchi", year: 1948, discipline: "Furniture", origin: "United States", manufacturer: "Herman Miller", collection: "MoMA, New York", movement: "Biomorphism / Sculptural Design",
    wikiTitle: "Noguchi_table",
    description: "A freeform glass top balanced on two identical interlocking walnut or ebonised wood bases. The bases are the same shape but rotated — they pivot to support the glass through geometry alone. No hardware, no adhesive. The form derives from Noguchi's sculpture practice, not from furniture typology.",
    significance: "Noguchi was a sculptor who made furniture, not a furniture designer who sculpted. The Coffee Table treats the living room as a gallery — every surface, every angle invites contemplation rather than use. It asks whether functional objects can simultaneously be art without irony.",
    connections: [
      { id: 19, type: "lineage", reason: "Aalto's Savoy organic form → Noguchi's biomorphic furniture. The organic modernist line runs from Finnish glass to American sculpture." },
      { id: 9, type: "argument", reason: "Both treat functional objects as sculpture — but Noguchi does it with formal integrity, Starck does it with deliberate dysfunction. Sincere vs. ironic." },
      { id: 33, type: "zeitgeist", reason: "Koppel's biomorphic silver (1952) and Noguchi's biomorphic furniture (1948) — abstract sculpture entering domestic life from opposite sides of the Atlantic." },
    ],
    keywords: ["biomorphic", "interlocking bases", "glass top", "sculpture", "Herman Miller", "Noguchi"]
  },
  {
    id: 47, title: "Akari Light Sculptures", designer: "Isamu Noguchi", year: 1951, discipline: "Lighting", origin: "Japan / United States", manufacturer: "Ozeki & Co.", collection: "Noguchi Museum, New York", movement: "Japanese-American Modernism",
    wikiTitle: "Akari_Light_Sculptures",
    description: "Over 200 designs for paper lanterns made from washi paper and bamboo ribbing, inspired by traditional Gifu chōchin lanterns. 'Akari' means light or luminous in Japanese. Each is handmade by artisans in Gifu. The paper diffuses light uniformly — the lantern appears to glow from within, like a moon.",
    significance: "Noguchi insisted these were 'light sculptures, not lanterns' — the distinction matters. They bridge Japanese craft tradition and American modernism without reducing either. They also prove that democratic pricing (some Akari cost less than a restaurant meal) doesn't require industrial mass production.",
    connections: [
      { id: 22, type: "sameProblem", reason: "Both solve 'soft, even, glare-free ambient light' — PH 5 through engineered metal shades, Akari through handmade paper diffusion. Technology vs. craft, same result." },
      { id: 1, type: "argument", reason: "Arco weighs 65kg in marble and steel. Akari weighs grams in paper and bamboo. Both define their space completely. Mass vs. ethereality." },
      { id: 32, type: "method", reason: "Both embed craft imprecision as the design — Wirkkala's charred moulds, Noguchi's handmade paper. The human hand as essential collaborator." },
    ],
    keywords: ["washi paper", "bamboo", "Gifu", "light sculpture", "handmade", "diffusion"]
  },
  {
    id: 48, title: "Ball Clock", designer: "George Nelson (attributed)", year: 1948, discipline: "Product", origin: "United States", manufacturer: "Howard Miller", collection: "MoMA, New York", movement: "American Modernism / Atomic Age",
    wikiTitle: "Ball_clock",
    description: "Twelve coloured balls on brass rods radiating from a centre — no numbers, no dial, no housing. Possibly sketched during a drunken evening with Noguchi, Buckminster Fuller, and Irving Harper at Nelson's office (the attribution is disputed). It tells time through position alone — you know what hour it is by where the ball is.",
    significance: "The Ball Clock stripped time-telling to pure spatial logic. It's the Beck's Tube Map principle applied to a clock: remove everything except the information structure. That it might have been a collaborative joke that became an icon says something important about how design actually happens — not in briefs, but in conversation.",
    connections: [
      { id: 13, type: "method", reason: "Both reduce information to spatial position — Beck strips geography to topology, Ball Clock strips time to angle. Functional abstraction." },
      { id: 49, type: "method", reason: "Ball Clock and Marshmallow Sofa both come from Nelson's office — playful, almost absurd, but formally rigorous. The studio as creative ecosystem." },
      { id: 9, type: "zeitgeist", reason: "Ball Clock (1948) is a serious design that looks like a joke. Juicy Salif (1990) is a joke that looks like serious design. Forty years of shifting boundaries." },
    ],
    keywords: ["no numbers", "atomic age", "Howard Miller", "Irving Harper", "spatial time", "attribution"]
  },
  {
    id: 49, title: "Marshmallow Sofa", designer: "George Nelson / Irving Harper", year: 1956, discipline: "Furniture", origin: "United States", manufacturer: "Herman Miller", collection: "Vitra Design Museum", movement: "American Modernism / Pop",
    wikiTitle: "Marshmallow_sofa",
    description: "Eighteen individual round cushions mounted on a tubular steel frame in a three-by-six grid. Each cushion is independently replaceable — you can swap colours, replace worn ones, or reconfigure the pattern. Originally designed as a cost-saving measure: individual cushions were cheaper to produce than one large upholstered surface.",
    significance: "The Marshmallow anticipated modular, customisable furniture by decades. Its Pop aesthetic was accidental — Nelson's office solved a manufacturing problem and produced something that looks like it predicted Warhol. It sold poorly in 1956 because the market wasn't ready for furniture that looked like fun.",
    connections: [
      { id: 12, type: "zeitgeist", reason: "Marshmallow (1956) is accidentally Pop. Carlton (1981) is deliberately anti-Modern. Both too playful for their moment — one arrived too early, the other detonated on time." },
      { id: 11, type: "argument", reason: "606: serious, neutral, systematic. Marshmallow: playful, colourful, modular. Both are modular systems — one succeeded commercially, one failed." },
      { id: 48, type: "method", reason: "Both from Nelson's studio, both formally playful, both more intelligent than they first appear. The office that proved design could be witty and rigorous simultaneously." },
    ],
    keywords: ["18 cushions", "modular", "Pop", "Herman Miller", "Irving Harper", "replaceable"]
  },
  {
    id: 50, title: "Platform Bench", designer: "George Nelson", year: 1946, discipline: "Furniture", origin: "United States", manufacturer: "Herman Miller", collection: "MoMA, New York", movement: "American Modernism",
    wikiTitle: "Nelson_bench",
    description: "Hardwood slats on a steel or wood base — simultaneously a bench, a coffee table, a display platform, and a room divider. It has no back, no arms, no upholstery, and no prescribed orientation. You can push two together, stand things on it, sit on it, or slide it against a wall.",
    significance: "The Platform Bench is the American Ulm Stool — multi-function furniture reduced to a surface. Nelson published 'Storage Wall' concepts in 1944 that reimagined the American home around flexible platforms rather than fixed furniture. The bench is that theory built.",
    connections: [
      { id: 7, type: "sameProblem", reason: "Both solve 'one object, multiple functions' — Ulm Stool through three pieces of wood, Nelson Bench through slats on a frame. German theory vs. American pragmatism." },
      { id: 11, type: "method", reason: "Both are platform thinking — 606 is a vertical platform for objects, Nelson Bench is a horizontal platform for living. Wall vs. floor." },
      { id: 41, type: "method", reason: "Both Eames House and Nelson Bench treat living as arrangement — flexible components you configure rather than fixed objects you accommodate." },
    ],
    keywords: ["platform", "multi-function", "slat bench", "Herman Miller", "Storage Wall", "flexible"]
  },
  {
    id: 51, title: "Diamond Chair", designer: "Harry Bertoia", year: 1952, discipline: "Furniture", origin: "United States", manufacturer: "Knoll", collection: "MoMA, New York", movement: "Sculptural Modernism",
    wikiTitle: "Diamond_Chair",
    description: "A welded steel wire mesh shell shaped into a diamond form on a rod base. Bertoia was a sculptor and jeweller — he approached the chair as a study in space rather than surface. The wire mesh is mostly air: 'If you look at these chairs, they are mainly made of air, like sculpture. Space passes right through them.'",
    significance: "Bertoia proved that furniture doesn't need to be solid. The Diamond Chair is more void than material — it defines space by bounding it with wire rather than filling it with mass. It's the opposite of upholstered comfort, and it asks whether transparency is its own kind of beauty.",
    connections: [
      { id: 28, type: "method", reason: "Both treat furniture as sculpture — Juhl carves teak into figurative forms, Bertoia welds wire into spatial ones. Mass vs. transparency." },
      { id: 3, type: "sameProblem", reason: "Both achieve maximum with minimum material — Parentesi uses cable and bracket, Diamond Chair uses wire mesh. Structural efficiency as aesthetic." },
      { id: 46, type: "zeitgeist", reason: "Both 1948-52, both at the intersection of sculpture and furniture, both from artists who saw furniture as a three-dimensional problem, not a comfort problem." },
    ],
    keywords: ["wire mesh", "transparency", "Knoll", "sculpture", "space", "welded steel"]
  },
  {
    id: 52, title: "Knoll Planning Unit", designer: "Florence Knoll", year: 1948, discipline: "Furniture", origin: "United States", manufacturer: "Knoll", collection: "—", movement: "American Corporate Modernism",
    wikiTitle: "Florence_Knoll",
    description: "Not a single object but a method: Florence Knoll invented the modern interior design practice of 'total planning' — floor plans, furniture specification, colour schemes, and spatial flow designed as one integrated system. She called her own furniture 'meat and potatoes' pieces — the connective tissue between statement designs by Saarinen, Bertoia, and Mies.",
    significance: "Florence Knoll professionalised interior design. Before her, decorators chose objects. After her, planners designed systems. She also made the commissioning model work — giving Saarinen and Bertoia the freedom to design statement pieces because her own work held the room together. She designed the stage, not the performers.",
    connections: [
      { id: 14, type: "method", reason: "Both create systems that others execute — Tschichold's Penguin rules, Knoll's Planning Unit method. Framework-makers, not object-makers." },
      { id: 25, type: "sameProblem", reason: "Both solve 'total interior coherence' — Jacobsen by designing everything himself, Knoll by designing the system and commissioning others for the pieces." },
      { id: 44, type: "lineage", reason: "Knoll commissioned Saarinen's Tulip — without her planning method providing the context, the chair is just a sculptural object. She gave it a room to belong to." },
    ],
    keywords: ["total planning", "interior system", "Knoll", "commissioning", "spatial design", "corporate modern"]
  },
  {
    id: 53, title: "Girard Wooden Dolls", designer: "Alexander Girard", year: 1963, discipline: "Product", origin: "United States", manufacturer: "Vitra (reissue)", collection: "Vitra Design Museum", movement: "American Folk Modernism",
    wikiTitle: null,
    description: "A family of hand-painted wooden figures — stylised faces in bold colours and simple geometries — originally made as personal gifts and home decorations. Girard, the head of Herman Miller's textile division, collected over 100,000 folk art objects from sixty countries. The Dolls synthesise that collection into a personal visual language.",
    significance: "Girard argued that modernism's rejection of decoration was a mistake — that colour, pattern, and folk art were essential to humanising designed environments. The Wooden Dolls are his manifesto: handmade in an industrial age, decorative in a functionalist culture, joyful in a serious profession.",
    connections: [
      { id: 12, type: "sameProblem", reason: "Both argue that decoration matters — Sottsass through architectural-scale laminate, Girard through intimate hand-painted wood. Memphis screams; Girard smiles." },
      { id: 34, type: "method", reason: "Both Isola and Girard smuggle joy into rationalist design culture — Unikko through defiant florals, Girard through folk art synthesis." },
      { id: 7, type: "argument", reason: "Ulm Stool: design must be anonymous. Girard's Dolls: design must have personality. The functionalism debate's warmest counterargument." },
    ],
    keywords: ["folk art", "hand-painted", "Herman Miller textiles", "decoration", "Vitra", "100,000 objects"]
  },
  {
    id: 54, title: "Vertigo Title Sequence", designer: "Saul Bass", year: 1958, discipline: "Graphic", origin: "United States", manufacturer: "Paramount Pictures", collection: "Academy Film Archive", movement: "American Graphic Modernism",
    wikiTitle: "Vertigo_(film)",
    description: "Spiraling Lissajous curves generated by a pendulum harmonograph, rotating over extreme close-ups of a woman's face — eye, pupil, lips. The typography spins. The geometry induces vertigo before the film begins. Bass's title sequences for Hitchcock, Preminger, and Scorsese treated opening credits as the film's psychological overture.",
    significance: "Bass invented the title sequence as a design problem. Before him, credits were typed lists. After him, they were architecture — setting mood, establishing visual language, preparing the audience's emotional state. Every streaming-era title sequence (from Mad Men to Severance) descends from this moment.",
    connections: [
      { id: 55, type: "method", reason: "Both Bass and Vignelli create identity systems through radical visual reduction — Bass condenses a film's psychology into geometry, Vignelli condenses a city's navigation into Helvetica." },
      { id: 43, type: "method", reason: "Both use film/moving image as information design — Eames zoom through scale, Bass spirals through psychology. Cinema as design medium." },
      { id: 13, type: "lineage", reason: "Beck: information design for navigation. Bass: information design for emotion. The discipline expanding from the functional to the psychological." },
    ],
    keywords: ["title sequence", "Hitchcock", "Lissajous", "spirograph", "Paramount", "psychological"]
  },
  {
    id: 55, title: "New York Subway Signage", designer: "Massimo Vignelli", year: 1966, discipline: "Graphic", origin: "United States / Italy", manufacturer: "New York City Transit Authority", collection: "MoMA, New York", movement: "International Typographic Style / Swiss Design",
    wikiTitle: "New_York_City_Subway#Signage",
    description: "A comprehensive wayfinding system using Helvetica in white on black or coloured backgrounds, with coloured circles for line identification. Vignelli's 1972 subway map replaced geography with diagrammatic clarity — horizontal, vertical, and 45-degree lines only — but was rejected by riders who wanted geographic accuracy. The signage system endured.",
    significance: "Vignelli's subway work is a case study in the tension between designer logic and user expectation. The signage succeeded because clarity is universal. The map failed because New Yorkers navigate by neighbourhood, not by system. Knowing which design problems are universal and which are cultural — that's the lesson.",
    connections: [
      { id: 13, type: "lineage", reason: "Beck's Tube Map (1933) → Vignelli's Subway Map (1972). Same diagrammatic principle, but Beck succeeded where Vignelli didn't — London accepted abstraction, New York didn't." },
      { id: 14, type: "method", reason: "Both Tschichold and Vignelli create design systems so rigorous that anyone can execute them — Penguin rules for books, subway standards for signage." },
      { id: 34, type: "argument", reason: "Vignelli: identity through systematic restraint, zero decoration. Unikko: identity through a single bold decorative pattern. Swiss discipline vs. Finnish exuberance." },
    ],
    keywords: ["Helvetica", "wayfinding", "subway", "Vignelli", "diagrammatic", "signage system"]
  },
  {
    id: 56, title: "IBM Logo", designer: "Paul Rand", year: 1972, discipline: "Graphic", origin: "United States", manufacturer: "IBM", collection: "—", movement: "American Corporate Identity / Modernism",
    wikiTitle: "IBM#Logo",
    description: "Eight horizontal stripes cutting through the letters I, B, and M — suggesting speed, dynamism, and the scan lines of a computer monitor. Rand designed three versions: a solid version, an 8-stripe version, and a 13-stripe version. The stripes unify three very different letterforms into a single visual system.",
    significance: "Rand proved that a logo is not an illustration but a system — it must work at every scale, in every medium, in every context. His IBM identity survived fifty years because it was designed for reproduction, not for presentation. The 'Eye-Bee-M' rebus poster (1982) showed he could be playful within his own system's rules.",
    connections: [
      { id: 55, type: "method", reason: "Both Rand and Vignelli build identity systems from typographic discipline — IBM through striped letterforms, NYC subway through Helvetica consistency." },
      { id: 14, type: "lineage", reason: "Tschichold's Penguin rules → Rand's corporate identity methodology. Both create visual systems precise enough for anyone to implement correctly." },
      { id: 43, type: "zeitgeist", reason: "Rand's IBM logo (1972) and Eames's Powers of Ten (1977, also for IBM) — the same corporation commissioning both graphic identity and experimental film. Corporate patronage at its best." },
    ],
    keywords: ["eight stripes", "corporate identity", "IBM", "Paul Rand", "rebus", "system"]
  },
  {
    id: 57, title: "American Modern Dinnerware", designer: "Russel Wright", year: 1937, discipline: "Product", origin: "United States", manufacturer: "Steubenville Pottery", collection: "Cooper Hewitt, Smithsonian Design Museum", movement: "American Streamline Modernism",
    wikiTitle: "Russel_Wright",
    description: "Organic, flowing ceramic forms in earthy colours — Seafoam, Granite Grey, Chartreuse, Coral — designed to mix and match rather than form identical sets. Over 250 million pieces sold, making it the most commercially successful American dinnerware ever produced. Wright insisted on being credited on the packaging — revolutionary for 1937.",
    significance: "American Modern democratised modernist design in America. Wright understood something European modernists didn't: American consumers wanted warmth, colour, and personality, not Bauhaus austerity. He proved that 'modern' could mean accessible, not elite — a lesson the Scandinavians would learn independently.",
    connections: [
      { id: 31, type: "argument", reason: "Franck's Kilta: modernism through geometric reduction. Wright's American Modern: modernism through organic warmth. Finnish austerity vs. American accessibility." },
      { id: 37, type: "sameProblem", reason: "Both reimagine kitchen objects for modern domestic life — Margrethe Bowl through functional intelligence, American Modern through emotional warmth." },
      { id: 19, type: "zeitgeist", reason: "Aalto's Savoy (1936) and Wright's American Modern (1937) — organic form entering modernist production simultaneously in Finland and America." },
    ],
    keywords: ["250 million", "mix and match", "Steubenville", "organic form", "Chartreuse", "democratic"]
  },
  {
    id: 58, title: "Conoid Bench", designer: "George Nakashima", year: 1960, discipline: "Furniture", origin: "United States / Japan", manufacturer: "Nakashima Studios", collection: "Smithsonian American Art Museum", movement: "American Craft / Mingei",
    wikiTitle: "George_Nakashima",
    description: "A free-edge walnut slab supported by two conoid (inverted cone) legs made from laminated rosewood and hickory. Each bench is unique because each slab retains its natural edge — knots, bark inclusions, and grain figuring determine the final form. Nakashima selected each tree personally and seasoned his wood for years.",
    significance: "Nakashima argued that the tree is the designer — his job was to listen to the wood and reveal what it wanted to become. This isn't mysticism; it's a design philosophy that puts material intelligence above human intention. Each piece carries the specific history of a specific tree.",
    connections: [
      { id: 32, type: "method", reason: "Both Nakashima and Wirkkala let material imperfection become the design — wood grain in furniture, mould-char in glass. Nature as co-designer." },
      { id: 7, type: "argument", reason: "Ulm Stool: anonymous industrial rationalism. Conoid Bench: singular material reverence. The machine vs. the tree." },
      { id: 2, type: "argument", reason: "Castiglioni finds form in industrial catalogues. Nakashima finds form in tree trunks. Both are 'found' design, from opposite worlds." },
    ],
    keywords: ["free edge", "walnut slab", "conoid", "tree selection", "Mingei", "natural form"]
  },
  {
    id: 59, title: "Farnsworth House", designer: "Ludwig Mies van der Rohe", year: 1951, discipline: "Architecture", origin: "United States / Germany", manufacturer: "—", collection: "National Trust for Historic Preservation", movement: "International Style",
    wikiTitle: "Farnsworth_House",
    description: "A single room of floor-to-ceiling glass suspended between a roof slab and floor slab on eight wide-flange steel columns, elevated five feet above a flood plain in Plano, Illinois. No interior walls except a walnut service core. The house is transparent to nature on all sides — you live inside the landscape.",
    significance: "Farnsworth is Mies's 'less is more' taken to its logical extreme — and its logical crisis. It leaks, overheats, offers no privacy, and its owner sued the architect. It's simultaneously the most beautiful house in America and the most unlivable. Students must reckon with this: can a design be a masterpiece and a failure at once?",
    connections: [
      { id: 41, type: "argument", reason: "Eames House: industrial components, warm inhabitation, stuff everywhere. Farnsworth: pure structure, radical emptiness, nothing allowed. Two American houses, two philosophies of living." },
      { id: 15, type: "method", reason: "Both Pompidou and Farnsworth achieve transparency — Pompidou exposes systems, Farnsworth dissolves walls. Mechanical transparency vs. spatial transparency." },
      { id: 60, type: "method", reason: "Farnsworth and Barcelona Chair share DNA — both elevate planes on minimal structure. Mies thinking at two scales." },
    ],
    keywords: ["glass house", "less is more", "eight columns", "Plano", "International Style", "Mies"]
  },
  {
    id: 60, title: "Barcelona Chair", designer: "Ludwig Mies van der Rohe", year: 1929, discipline: "Furniture", origin: "Germany / Spain", manufacturer: "Knoll", collection: "MoMA, New York", movement: "International Style / Bauhaus",
    wikiTitle: "Barcelona_chair",
    description: "Two X-shaped chromed flat steel bars — one supporting the seat, one the back — with leather cushions laid across them. Originally designed for the King and Queen of Spain to sit in at the German Pavilion, Barcelona International Exposition. The steel bars are a single curve, no welding visible. Each chair requires hand-grinding and chrome-plating.",
    significance: "The Barcelona Chair is the throne of modernism — originally designed for actual royalty, now the symbol of corporate lobbies worldwide. Its paradox is that this icon of industrial aesthetics requires extensive handcraft to produce. Mass production's most famous chair isn't mass-produced at all.",
    connections: [
      { id: 26, type: "sameProblem", reason: "Both pursue effortless visual simplicity that conceals intense craft — Wegner's Round Chair hides its joinery, Barcelona Chair hides its hand-grinding." },
      { id: 59, type: "method", reason: "Barcelona Chair and Farnsworth House — Mies applying the same principle at different scales. Floating planes, minimal structure, maximum presence." },
      { id: 40, type: "sameProblem", reason: "Both are modernism's luxury armchairs — Barcelona in chrome and leather, Eames 670 in rosewood and leather. European severity vs. American warmth." },
    ],
    keywords: ["X-frame", "chrome steel", "leather cushions", "Knoll", "hand-ground", "1929 Exposition"]
  },
  {
    id: 61, title: "Wassily Chair (B3)", designer: "Marcel Breuer", year: 1925, discipline: "Furniture", origin: "Germany", manufacturer: "Knoll (current)", collection: "MoMA, New York", movement: "Bauhaus",
    wikiTitle: "Wassily_Chair",
    description: "Bent tubular steel frame with leather or canvas strips for seat, back, and armrests. Breuer, a 23-year-old Bauhaus student, was inspired by his bicycle's handlebars — he wondered why tubular steel couldn't make furniture. Named after his colleague Wassily Kandinsky, who admired the prototype.",
    significance: "The first tubular steel chair. Breuer didn't just design a new chair — he invented a new material category for furniture. Every tubular steel object since descends from this moment. A student's bicycle observation became the most consequential material innovation in twentieth-century furniture.",
    connections: [
      { id: 2, type: "method", reason: "Both find furniture in non-furniture contexts — Breuer sees a chair in bicycle handlebars, Castiglioni sees a stool in a tractor seat. Found inspiration, then rigorous execution." },
      { id: 17, type: "argument", reason: "Aalto's Paimio rejected Bauhaus steel for warm plywood. Breuer's Wassily IS Bauhaus steel. The argument Aalto was responding to." },
      { id: 60, type: "lineage", reason: "Breuer's Wassily (1925) → Mies's Barcelona (1929). Tubular steel from student experiment to royal throne in four years." },
    ],
    keywords: ["tubular steel", "Bauhaus", "bicycle handlebars", "Kandinsky", "B3", "canvas"]
  },
  {
    id: 62, title: "Womb Chair", designer: "Eero Saarinen", year: 1948, discipline: "Furniture", origin: "United States", manufacturer: "Knoll", collection: "MoMA, New York", movement: "Organic Modernism",
    wikiTitle: "Womb_chair",
    description: "A deep fibreglass shell on tubular steel legs, upholstered in fabric, with a matching ottoman. Florence Knoll challenged Saarinen to design 'a chair I can curl up in.' The shell is wide and deep enough to sit cross-legged, sideways, or in any position. It embraces rather than supports.",
    significance: "The Womb Chair answered modernism's comfort deficit. Mies and Breuer made furniture for sitting upright. Saarinen made furniture for sprawling. Florence Knoll's brief — essentially 'make me a chair I actually want to sit in' — produced the first truly comfortable piece of modern furniture.",
    connections: [
      { id: 24, type: "lineage", reason: "Saarinen's Womb (1948) → Jacobsen's Egg (1958). Both shell chairs that create psychological enclosure — Saarinen for domestic sprawl, Jacobsen for public privacy." },
      { id: 52, type: "method", reason: "Florence Knoll commissioned the Womb Chair from Saarinen with a one-sentence brief. Her skill was knowing what to ask for and whom to ask." },
      { id: 44, type: "method", reason: "Womb Chair (1948) and Tulip Chair (1956) — Saarinen solving different problems with the same material (fibreglass) eight years apart. Comfort, then unity." },
    ],
    keywords: ["fibreglass shell", "curl up", "Florence Knoll", "Knoll", "ottoman", "comfort"]
  },
  // =========================================================================
  // BRIDGES, GRAPHIC DESIGN & KEY GAPS
  // =========================================================================

  {
    id: 63, title: "Cesca Chair (B32)", designer: "Marcel Breuer", year: 1928, discipline: "Furniture", origin: "Germany / Hungary", manufacturer: "Knoll (current)", collection: "MoMA, New York", movement: "Bauhaus / International Style",
    wikiTitle: "Cesca_chair",
    description: "A cantilevered tubular steel frame with a cane seat and back — no rear legs. The sitter's weight is supported by the spring of the steel cantilever. Breuer combined industrial material (chromed steel) with traditional craft (Viennese cane weaving). Named after his daughter Francesca. The most reproduced chair in history.",
    significance: "The Cesca resolves the argument between Breuer's own Wassily and Aalto's Paimio — it's industrial steel AND warm natural material. The cantilever principle (no rear legs) also introduced genuine structural innovation to seating. That it became ubiquitous in offices and dining rooms proves its social intelligence.",
    connections: [
      { id: 61, type: "lineage", reason: "Wassily (1925) → Cesca (1928). Breuer's own evolution: from pure steel-and-canvas manifesto to the warm steel-and-cane synthesis the market actually wanted." },
      { id: 17, type: "sameProblem", reason: "Both solve 'how to make modern furniture humane' — Aalto uses birch plywood alone, Breuer combines steel with cane. Mono-material warmth vs. hybrid warmth." },
      { id: 6, type: "zeitgeist", reason: "Both became the most ubiquitous expressions of their respective traditions — Cesca in every office, Superleggera in every Italian restaurant. Democratic icons." },
    ],
    keywords: ["cantilever", "cane seat", "tubular steel", "B32", "most reproduced", "Francesca"]
  },
  {
    id: 64, title: "LC4 Chaise Longue", designer: "Le Corbusier, Pierre Jeanneret & Charlotte Perriand", year: 1928, discipline: "Furniture", origin: "France / Switzerland", manufacturer: "Cassina", collection: "MoMA, New York", movement: "International Style / Modernism",
    wikiTitle: "Chaise_longue_LC4",
    description: "A reclining frame of chromed tubular steel resting freely on a black-lacquered steel H-frame base — the two pieces are not connected. The recliner slides along the base to adjust the angle. Originally credited to Le Corbusier alone; Charlotte Perriand was the actual furniture designer. Her authorship was suppressed for decades.",
    significance: "The LC4 is a masterpiece of ergonomic logic — it maps the body's reclining curve precisely. But its significance today is also about attribution: Perriand, not Corbusier, designed it. The history of design is full of women whose work was credited to the men they worked with. Students need to know this.",
    connections: [
      { id: 38, type: "sameProblem", reason: "Both map furniture to the body's curves — Mathsson through spinal pressure studies, Perriand through reclining geometry. Evidence-based ergonomics from different traditions." },
      { id: 60, type: "zeitgeist", reason: "Barcelona Chair (1929) and LC4 (1928) — both chromed steel furniture designed for exhibition. Mies for Spanish royalty, Corbusier/Perriand for the Salon d'Automne." },
      { id: 52, type: "argument", reason: "Florence Knoll was credited and controlled her practice. Perriand was suppressed. Two women in modernist furniture — one empowered, one erased. Same era, different outcomes." },
    ],
    keywords: ["chaise longue", "Charlotte Perriand", "attribution", "chromed steel", "Cassina", "reclining curve"]
  },
  {
    id: 65, title: "Grid Systems in Graphic Design", designer: "Josef Müller-Brockmann", year: 1961, discipline: "Graphic", origin: "Switzerland", manufacturer: "Verlag Niggli", collection: "—", movement: "Swiss International Typographic Style",
    wikiTitle: "Josef_Müller-Brockmann",
    description: "Not a single poster but a design methodology codified in Müller-Brockmann's book and practice: the modular grid as an organising principle for all visual communication. Every element — text, image, whitespace — locks to an underlying mathematical structure. His Zurich Tonhalle concert posters demonstrated the principle with radical clarity.",
    significance: "Müller-Brockmann systematised intuition. The grid isn't a constraint — it's a decision-making framework that frees the designer to focus on content rather than composition. Every website, every app, every magazine layout that uses a grid system descends from this methodology.",
    connections: [
      { id: 14, type: "lineage", reason: "Tschichold's Penguin rules → Müller-Brockmann's grid systems. Both codify visual organisation into transferable rules — one for publishing, one for all graphic design." },
      { id: 55, type: "method", reason: "Both Vignelli and Müller-Brockmann apply Swiss grid methodology to real-world complexity — subway systems, concert posters. Theory meeting the street." },
      { id: 11, type: "method", reason: "Both are modular systems — 606 organises physical space with tracks, Müller-Brockmann organises visual space with grids. Same principle, different dimensions." },
    ],
    keywords: ["grid system", "Swiss Style", "Tonhalle", "modular", "Müller-Brockmann", "methodology"]
  },
  {
    id: 66, title: "Helvetica", designer: "Max Miedinger & Eduard Hoffmann", year: 1957, discipline: "Typography", origin: "Switzerland", manufacturer: "Haas Type Foundry (now Linotype)", collection: "—", movement: "Swiss International Typographic Style",
    wikiTitle: "Helvetica",
    description: "A neo-grotesque sans-serif typeface originally called Neue Haas Grotesk, renamed Helvetica (Latin for 'Swiss') for international marketing. The letterforms aim for maximum neutrality — no calligraphic stress, nearly uniform stroke width, tight but open spacing. It became the default typeface of corporate modernism, government signage, and visual identity worldwide.",
    significance: "Helvetica is the most successful typeface ever designed and the most contentious. Its advocates say it's invisible — it communicates content without imposing personality. Its critics say it's authoritarian — it flattens every message into the same neutral tone. Both are right. That's the debate students need to have.",
    connections: [
      { id: 55, type: "lineage", reason: "Helvetica (1957) → Vignelli's NYC Subway (1966). The typeface found its most famous application in urban wayfinding." },
      { id: 16, type: "zeitgeist", reason: "Braun SK 4 (1956) and Helvetica (1957) — both embody the postwar European conviction that neutrality equals honesty. Same ideology, different mediums." },
      { id: 65, type: "method", reason: "Both Helvetica and the grid system aim for designer-as-neutral-conduit — the form shouldn't express the designer's personality, only the content's logic." },
    ],
    keywords: ["neo-grotesque", "Neue Haas Grotesk", "neutrality", "Swiss", "Miedinger", "ubiquitous"]
  },
  {
    id: 67, title: "Eames House of Cards", designer: "Charles & Ray Eames", year: 1952, discipline: "Graphic", origin: "United States", manufacturer: "Ravensburger (reissue)", collection: "Eames Office", movement: "American Modernism / Play",
    wikiTitle: null,
    description: "A deck of 54 interlocking cards with six slits each, printed with close-up photographs of everyday materials and objects — fabric weaves, bread texture, toy surfaces, natural patterns. The cards slot together to build three-dimensional structures. No rules, no prescribed outcome. A toy, a teaching tool, and a photographic collection.",
    significance: "The House of Cards embodies the Eameses' core belief: the best learning happens through play. It also reveals their visual method — they photographed the world in extreme close-up to make familiar textures unfamiliar, teaching visual literacy through defamiliarisation. It's a design education in a box.",
    connections: [
      { id: 43, type: "method", reason: "Both Powers of Ten and House of Cards teach through scale shifts — one through zooming, the other through close-up photography. The Eameses' consistent pedagogical method." },
      { id: 53, type: "sameProblem", reason: "Both make design playful — Girard through hand-painted dolls, Eames through interlocking cards. Joy as a design tool, not a design compromise." },
      { id: 31, type: "method", reason: "Both are modular, combinatorial systems — Kilta combines ceramic shapes freely, House of Cards combines photographic surfaces freely. Open systems for open use." },
    ],
    keywords: ["interlocking", "play", "photography", "texture", "learning", "54 cards"]
  },
  {
    id: 68, title: "Eames Molded Plastic Chair (DSW/DSR)", designer: "Charles & Ray Eames", year: 1950, discipline: "Furniture", origin: "United States", manufacturer: "Herman Miller / Vitra", collection: "MoMA, New York", movement: "American Modernism / Democratic Design",
    wikiTitle: "Eames_Fiberglass_Armchair",
    description: "A single-shell fibreglass seat available on multiple bases — wooden dowel legs (DSW), Eiffel Tower wire base (DSR), rocker runners, stacking base, or pedestal. The first mass-produced plastic chair. The shell stays the same; the base changes the function. Originally fibreglass, now polypropylene for environmental reasons.",
    significance: "The Eames shell chair is platform thinking applied to seating — one form, infinite configurations. It also proved that plastic didn't have to mean cheap. The Eameses treated fibreglass with the same design intelligence they applied to plywood, proving the material doesn't determine the quality.",
    connections: [
      { id: 30, type: "lineage", reason: "Eames plastic shell (1950) → Panton single-piece chair (1967). Eames proved plastic could be furniture; Panton pushed it to the single-piece limit." },
      { id: 44, type: "zeitgeist", reason: "Both 1950s fibreglass shells on different bases — Eames with multiple base options, Saarinen with a single pedestal. Modular vs. unified." },
      { id: 11, type: "method", reason: "Both are platform systems — 606 offers one track, multiple shelf types. Eames shell offers one seat, multiple bases. Same design logic." },
    ],
    keywords: ["fibreglass shell", "platform", "DSW", "DSR", "multiple bases", "mass-produced plastic"]
  },
  {
    id: 69, title: "TWA Identity & Terminal Signage", designer: "Chermayeff & Geismar", year: 1960, discipline: "Graphic", origin: "United States", manufacturer: "Trans World Airlines", collection: "—", movement: "American Corporate Identity",
    wikiTitle: null,
    description: "The red TWA logotype and comprehensive identity system that unified the airline's visual presence from ticket counters to tail fins. Ivan Chermayeff and Tom Geismar pioneered the practice of designing corporate identities as total systems — not just logos but every touchpoint, every surface, every communication.",
    significance: "Chermayeff & Geismar's practice established the modern model of corporate identity design — the logo as the tip of a systematic iceberg. Their work for Chase Manhattan, Mobil, PBS, and the Smithsonian proved that a single mark, rigorously applied, could unify the most complex organisations.",
    connections: [
      { id: 56, type: "method", reason: "Both Rand's IBM and Chermayeff & Geismar's identities prove that logos are systems, not pictures. The mark is nothing without the rules governing its use." },
      { id: 45, type: "zeitgeist", reason: "TWA identity and TWA Terminal — same airline, same era. Saarinen designed the space; Chermayeff & Geismar designed the visual language inside it. Architecture and graphics as one experience." },
      { id: 14, type: "lineage", reason: "Tschichold's publishing system → Rand's corporate identity → Chermayeff & Geismar's total identity programs. Design systems scaling up with each generation." },
    ],
    keywords: ["corporate identity", "Chermayeff & Geismar", "TWA", "total system", "logotype"]
  },
  {
    id: 70, title: "Artek Tea Trolley 901", designer: "Alvar Aalto", year: 1936, discipline: "Furniture", origin: "Finland", manufacturer: "Artek", collection: "MoMA, New York", movement: "Nordic Modernism",
    wikiTitle: null,
    description: "A two-tiered trolley with a birch frame, white lacquered shelves, rattan basket, and large rubber-tired wheels. The bent birch curves are Aalto's signature L-leg technique scaled up. The rattan basket hangs below the top shelf — originally for newspapers, now used for bottles, plants, anything. Its form resembles a friendly animal.",
    significance: "The Tea Trolley shows Aalto at his most casually brilliant. It's not a statement piece — it's a generous, practical object that anticipates every possible use. The oversized wheels mean it rolls over thresholds and rugs. The rattan basket means storage moves with you. It designs for real life, not for museums.",
    connections: [
      { id: 18, type: "method", reason: "Same designer, same material technology — but Stool 60 is pure geometry while the Tea Trolley is warmly anthropomorphic. Aalto's range in a single material." },
      { id: 37, type: "method", reason: "Both solve domestic tasks through quiet functional intelligence — Margrethe Bowl grips the counter, Tea Trolley rolls over thresholds. Design you don't notice working." },
      { id: 50, type: "sameProblem", reason: "Both are horizontal platforms for living — Nelson Bench for sitting and displaying, Tea Trolley for moving and serving. American platform vs. Finnish trolley." },
    ],
    keywords: ["tea trolley", "birch", "rubber wheels", "rattan", "Artek", "L-leg"]
  },
  {
    id: 71, title: "Series 7 Chair", designer: "Arne Jacobsen", year: 1955, discipline: "Furniture", origin: "Denmark", manufacturer: "Fritz Hansen", collection: "Design Museum, London", movement: "Danish Modernism",
    wikiTitle: "Series_7_chair",
    description: "A pressure-moulded veneer seat on a tubular steel base — the evolution of the Ant Chair with a wider seat, four legs instead of three, and a continuous curve from edge to edge. Available in wood veneer, lacquered colours, or upholstered. Over seven million sold. The most commercially successful chair in Danish history.",
    significance: "If the Ant proved Danish design could be mass-produced, the Series 7 proved it could become universal infrastructure. It works in airports, schools, offices, dining rooms — anywhere a chair is needed. Seven million sold means seven million different contexts. True democratic design isn't about price; it's about adaptability.",
    connections: [
      { id: 23, type: "lineage", reason: "Ant (1952) → Series 7 (1955). Three legs became four, the waist widened, the form matured. Jacobsen improving on himself." },
      { id: 68, type: "sameProblem", reason: "Both solve 'one shell, many contexts' — Eames with interchangeable bases, Series 7 with interchangeable finishes. American modularity vs. Danish versatility." },
      { id: 63, type: "zeitgeist", reason: "Cesca and Series 7 — the two most ubiquitous chairs of the twentieth century. Both achieved universality through quiet formal intelligence, not marketing." },
    ],
    keywords: ["pressure-moulded", "seven million", "Fritz Hansen", "universal", "four legs", "veneer"]
  },
  {
    id: 72, title: "Saarinen Dining Table (Pedestal Table)", designer: "Eero Saarinen", year: 1956, discipline: "Furniture", origin: "United States", manufacturer: "Knoll", collection: "MoMA, New York", movement: "Organic Modernism",
    wikiTitle: "Pedestal_table",
    description: "A circular white laminate top on a single cast aluminium pedestal base — the companion piece to the Tulip Chair. Saarinen wanted to 'clear up the slum of legs' beneath dining tables. The heavy base allows the top to cantilever without visual support. Available in marble, laminate, or wood veneer tops up to 120cm diameter.",
    significance: "The Pedestal Table completes the Tulip system — chair and table sharing the same formal language, the same single-column base, the same ambition to unify a room into a single visual statement. Paired with the chairs, it creates the cleanest dining environment in modern design.",
    connections: [
      { id: 44, type: "method", reason: "Tulip Chair and Pedestal Table are one system — designed simultaneously, using the same pedestal logic. Furniture as coordinated architecture." },
      { id: 36, type: "method", reason: "Both Jacobsen's Cylinda-Line and Saarinen's Pedestal series create coherent systems from a single formal idea — cylinder for tableware, pedestal for furniture." },
      { id: 1, type: "sameProblem", reason: "Both solve 'eliminate the visual clutter below' — Arco reaches overhead to avoid floor lamps, Pedestal Table unifies legs into one column." },
    ],
    keywords: ["pedestal", "slum of legs", "Knoll", "cast aluminium", "Tulip system", "white laminate"]
  },
  {
    id: 73, title: "Aalto Vase Collection (Savoy System)", designer: "Alvar Aalto", year: 1936, discipline: "Product", origin: "Finland", manufacturer: "Iittala", collection: "Design Museum, Helsinki", movement: "Nordic Modernism",
    wikiTitle: null,
    description: "A family of mouth-blown glass vessels derived from the same organic-wave form as the Savoy Vase, expanded into bowls, candleholders, and platters of varying scales. The undulating form remains consistent while the dimensions and proportions shift — each piece is recognisably Aalto without being a repetition.",
    significance: "Where Franck's Kilta creates a system through geometric standardisation, Aalto's collection creates coherence through an organic signature form. It's a different model of design consistency — not modular interchangeability but family resemblance. Like faces in a lineage, related but individual.",
    connections: [
      { id: 19, type: "method", reason: "The Savoy vase as a single object vs. the Savoy system as a family — Aalto extending one formal idea across scales and functions." },
      { id: 31, type: "argument", reason: "Franck's Kilta: systematic coherence through geometry. Aalto's Savoy system: coherence through organic family resemblance. Two Finnish models of unity." },
      { id: 36, type: "sameProblem", reason: "Both create product families from a single formal principle — Jacobsen's cylinder, Aalto's undulating wave. Geometric unity vs. organic unity." },
    ],
    keywords: ["mouth-blown", "organic wave", "Iittala", "family", "system", "glass"]
  },
  {
    id: 74, title: "Eames Storage Unit (ESU)", designer: "Charles & Ray Eames", year: 1950, discipline: "Furniture", origin: "United States", manufacturer: "Herman Miller", collection: "MoMA, New York", movement: "American Modernism / Industrial",
    wikiTitle: "Eames_storage_unit",
    description: "A modular steel-frame shelving system with birch plywood panels, fibreglass shelves, and coloured sliding doors in masonite. The steel frame is spot-welded from L-angle stock — the same industrial components used in factory shelving. Panels can be opaque, perforated, or coloured, creating visual variety within systematic structure.",
    significance: "The ESU is the Eames response to the same problem Rams solved with the 606 — modular storage as a system. But where Rams is invisible, the ESU is visual — the coloured panels turn storage into a composition. It argues that systems don't have to be neutral to be systematic.",
    connections: [
      { id: 11, type: "argument", reason: "606: the system disappears behind what it holds. ESU: the system is a composition in itself. Neutral vs. expressive modularity." },
      { id: 41, type: "method", reason: "ESU uses the same off-the-shelf industrial logic as the Eames House — factory components, domestic application. Readymade architecture, readymade furniture." },
      { id: 50, type: "method", reason: "ESU and Nelson Bench both reimagine living space as flexible platforms — but ESU goes vertical, Nelson stays horizontal." },
    ],
    keywords: ["modular", "steel frame", "coloured panels", "Herman Miller", "factory components", "ESU"]
  },
  {
    id: 75, title: "Stacking Chair (Model 3107 Colour)", designer: "Arne Jacobsen / Fritz Hansen", year: 1955, discipline: "Furniture", origin: "Denmark", manufacturer: "Fritz Hansen", collection: "Various", movement: "Danish Modernism / Colour",
    wikiTitle: null,
    description: "The Series 7 chair in lacquered colours rather than wood veneer — a decision Fritz Hansen made in the 1960s that transformed an institutional workhorse into a design statement. The colour palette has been updated periodically, with Tal R, Kasper Salto, and others contributing limited editions. The form is identical; the surface changes everything.",
    significance: "The coloured Series 7 proves that surface treatment is design, not decoration. The same chair reads as institutional in natural veneer, playful in yellow, luxurious in deep green. Colour changes context, which changes meaning, which changes use. One form, infinite identities.",
    connections: [
      { id: 71, type: "lineage", reason: "Same chair, different identity. Natural veneer Series 7 is institutional. Coloured Series 7 is expressive. Surface as design language." },
      { id: 30, type: "sameProblem", reason: "Both use colour on modern form — Panton in moulded plastic, coloured Series 7 in lacquered plywood. Pop sensibility meets Danish restraint." },
      { id: 34, type: "method", reason: "Both prove colour is a serious design tool — Unikko through bold pattern, coloured Series 7 through solid lacquer. Chromatic arguments against monochrome rationalism." },
    ],
    keywords: ["colour", "lacquered", "Series 7", "Fritz Hansen", "surface", "identity"]
  },
  {
    id: 76, title: "Herbert Matter Swiss Tourism Posters", designer: "Herbert Matter", year: 1935, discipline: "Graphic", origin: "Switzerland / United States", manufacturer: "Swiss National Tourist Office", collection: "MoMA, New York", movement: "Swiss Modernism / Photomontage",
    wikiTitle: "Herbert_Matter",
    description: "Tourism posters combining extreme photographic scale contrasts — a giant close-up face beside a distant mountain landscape — with bold sans-serif typography and primary colours. Matter used photomontage not as Dada collage but as information hierarchy: the face pulls you in, the landscape shows you where, the text tells you how.",
    significance: "Matter invented the modern poster's visual grammar: photography at conflicting scales, minimal typography, maximum impact. Before him, travel posters were illustrations. After him, they were designed communications. He later brought this method to Knoll's advertising, creating the visual language of American corporate modernism.",
    connections: [
      { id: 54, type: "lineage", reason: "Matter's photographic scale-play (1935) → Bass's cinematic scale-play (1958). The poster technique that became the title sequence." },
      { id: 65, type: "zeitgeist", reason: "Both Matter and Müller-Brockmann define Swiss graphic design — but Matter through photographic drama, Müller-Brockmann through typographic restraint. Expressive vs. systematic Swiss style." },
      { id: 52, type: "lineage", reason: "Matter designed Knoll's advertising, establishing the visual language that Florence Knoll's interiors then fulfilled. Graphic design and furniture in one brand identity." },
    ],
    keywords: ["photomontage", "tourism", "scale contrast", "Swiss", "Knoll advertising"]
  },
  {
    id: 77, title: "Action Office II", designer: "Robert Propst / George Nelson", year: 1968, discipline: "Furniture", origin: "United States", manufacturer: "Herman Miller", collection: "—", movement: "Systems Design / Office Design",
    wikiTitle: "Action_Office",
    description: "The first modular office partition system — freestanding fabric-covered panels that create semi-enclosed workspaces without permanent walls. Propst's research found that open offices were noisy and closed offices were isolated. Action Office II was his middle ground: visual privacy with acoustic separation, reconfigurable overnight.",
    significance: "Action Office II is the most misunderstood design in history. Propst intended flexible, humane workspaces. Cost-cutting facilities managers packed them into minimum-size grids and created the soul-crushing cubicle. Propst called the result 'monolithic insanity.' The gap between design intention and institutional implementation is the lesson.",
    connections: [
      { id: 11, type: "sameProblem", reason: "Both create modular workspace systems — 606 for domestic vertical storage, Action Office for commercial horizontal space. Both succeeded as systems, but Action Office was corrupted by misuse." },
      { id: 52, type: "argument", reason: "Florence Knoll designed beautiful offices from above. Propst designed humane offices from research. Both were right — and both were eventually overridden by cost-cutting." },
      { id: 50, type: "lineage", reason: "Nelson Bench's platform thinking → Nelson's involvement in Action Office. The same flexibility-as-principle, scaled from a bench to an entire office system." },
    ],
    keywords: ["cubicle", "partition", "modular office", "Propst", "Herman Miller", "misunderstood"]
  },
  {
    id: 78, title: "Hang-It-All", designer: "Charles & Ray Eames", year: 1953, discipline: "Product", origin: "United States", manufacturer: "Herman Miller / Vitra", collection: "MoMA, New York", movement: "American Modernism / Play",
    wikiTitle: "Hang-It-All",
    description: "A white-coated steel wire frame with fourteen solid maple balls in primary colours. Designed for children's rooms — the balls are hooks for coats, hats, and bags. The wire frame creates a molecular-model pattern on the wall. It was part of the Eameses' children's furniture line, which applied the same design intelligence as their adult work.",
    significance: "The Hang-It-All proves the Eameses didn't distinguish between serious design and playful design — they were the same thing. A coat rack for a child gets the same material precision, the same formal clarity, and the same joy as a lounge chair for MoMA. There is no hierarchy of objects, only a hierarchy of attention.",
    connections: [
      { id: 67, type: "method", reason: "Both Hang-It-All and House of Cards apply adult design intelligence to children's products — no condescension, no simplification. Play as rigorous practice." },
      { id: 48, type: "zeitgeist", reason: "Ball Clock and Hang-It-All — both use coloured spheres as both function and ornament. The Atomic Age's visual language of molecular structures turned into domestic objects." },
      { id: 53, type: "sameProblem", reason: "Both bring joy into functional objects — Girard through folk art colour, Eames through molecular playfulness. Warmth against cold modernism." },
    ],
    keywords: ["coat rack", "maple balls", "primary colours", "children", "molecular", "play"]
  },

];
