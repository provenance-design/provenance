'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import { CANDIDATES } from "../data/candidates";

// ═══════════════════════════════════════════════════════════
// PROVENANCE STAGING
// provenancearchive.uk/staging
//
// Full archive experience loading from candidates.js
// Password-protected. Same design as live site.
// When ready, copy candidates.js content into archive.js.
// ═══════════════════════════════════════════════════════════

const STAGING_PASSWORD = "provenance2026";

const ARCHIVE = CANDIDATES.map(c => {
  const { status, notes, ...entry } = c;
  return entry;
});

const DISCIPLINES = [...new Set(ARCHIVE.map(e => e.discipline))];

const CONN_TYPES = {
  argument: { label: "Argument", icon: "⟷", symbol: "⟷", color: "#8B4513" },
  lineage: { label: "Lineage", icon: "→", symbol: "→", color: "#2F5233" },
  material: { label: "Material Thread", icon: "◆", symbol: "◆", color: "#4A6741" },
  sameProblem: { label: "Same Problem", icon: "◎", symbol: "◎", color: "#5B7065" },
  zeitgeist: { label: "Zeitgeist", icon: "≈", symbol: "≈", color: "#6B7B6F" },
  method: { label: "Shared Method", icon: "●", symbol: "●", color: "#7A8B7A" },
};
const PALETTE = { Product: "#8B4513", Furniture: "#2F5233", Graphic: "#4A6741", Lighting: "#5B7065", Architecture: "#6B7B6F", Typography: "#7A8B7A", Textile: "#9B6B4A", Transport: "#5A7B8B", Ceramic: "#8B7355", Glass: "#6B8B7B", Metalwork: "#7B6B8B", Digital: "#5B6B8B", Fashion: "#8B5B6B", Systems: "#6B7B6F" };

function getConnection(id) { return ARCHIVE.find(item => item.id === id); }

// ── PASSWORD GATE ──
function PasswordGate({ onAuth }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  const submit = () => {
    if (pw === STAGING_PASSWORD) {
      sessionStorage.setItem("provenance_staging_auth", "true");
      onAuth();
    } else { setError(true); setPw(""); }
  };
  return (
    <div style={{ minHeight: "100vh", background: "#F6F5F0", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ textAlign: "center", maxWidth: "320px" }}>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "32px", marginBottom: "5px" }}>Provenance</div>
        <div style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: "#B8763C", marginBottom: "40px" }}>Staging</div>
        <input type="password" value={pw} onChange={e => { setPw(e.target.value); setError(false); }}
          onKeyDown={e => e.key === "Enter" && submit()} placeholder="Password" autoFocus
          style={{ width: "100%", padding: "12px 16px", fontFamily: "inherit", fontSize: "14px",
            border: error ? "1px solid #C5A0A0" : "1px solid #E4E0D8", background: error ? "#FFF8F8" : "#FDFCF8",
            textAlign: "center", letterSpacing: "0.1em", color: "#555", boxSizing: "border-box", outline: "none" }} />
        <button onClick={submit} style={{ width: "100%", padding: "10px", marginTop: "10px", fontFamily: "inherit",
          fontSize: "10px", letterSpacing: "0.14em", textTransform: "uppercase",
          border: "1px solid #1C1C1C", background: "#1C1C1C", color: "#F6F5F0", cursor: "pointer" }}>Enter</button>
        {error && <div style={{ fontSize: "11px", color: "#C5A0A0", marginTop: "12px" }}>Incorrect password</div>}
      </div>
    </div>
  );
}

// ── IMAGE COMPONENT (same as live site) ──
function ImageWithFallback({ item, aspectRatio = "4/3" }) {
  const [imgUrl, setImgUrl] = useState(item.imageUrl || null);
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(!item.imageUrl);

  useEffect(() => {
    if (item.imageUrl || !item.wikiTitle) { setLoading(false); return; }
    let cancelled = false;
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(item.wikiTitle)}`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        const src = data?.thumbnail?.source?.replace(/\/\d+px-/, '/800px-') || data?.originalimage?.source;
        if (src) setImgUrl(src); else setFailed(true);
        setLoading(false);
      })
      .catch(() => { if (!cancelled) { setFailed(true); setLoading(false); } });
    return () => { cancelled = true; };
  }, [item.wikiTitle, item.imageUrl]);

  const fallbackEl = (
    <div style={{ aspectRatio, background: '#EDEADE', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '16px', right: '16px', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#B8A080' }}>№ {String(item.id).padStart(3, '0')}</div>
      <div style={{ position: 'absolute', top: '16px', left: '16px', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: PALETTE[item.discipline], fontWeight: 600 }}>{item.discipline}</div>
      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: aspectRatio === "3/2" ? '26px' : '48px', color: '#D4CFC0', lineHeight: 0.92, letterSpacing: '-0.03em', marginBottom: '8px' }}>{item.title.split(' ').slice(0, 3).join(' ')}</div>
      <div style={{ fontSize: '10px', color: '#B8A080', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{item.designer.split('&')[0].trim()} · {item.year}</div>
    </div>
  );

  if ((!item.wikiTitle && !item.imageUrl) || failed) return fallbackEl;
  if (loading) return fallbackEl;

  return (
    <div style={{ position: 'relative', overflow: 'hidden', aspectRatio, background: '#EDEADE' }}>
      <img src={imgUrl} alt={item.title} onError={() => setFailed(true)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'contrast(1.02) saturate(0.85)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.45))', padding: '24px 16px 12px', color: '#fff' }}>
        <div style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.85 }}>{item.discipline} · {item.year}</div>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════
// NETWORK VISUALISER — Full archive topology
// ═══════════════════════════════════════════════
const GRAPH_DATA = {"n":[[1,"Arco Floor Lamp","Lighting",4,1962,"Achille & Pier Giacomo Castiglioni"],[2,"Mezzadro Stool","Furniture",4,1957,"Achille & Pier Giacomo Castiglioni"],[3,"Parentesi Lamp","Lighting",3,1971,"Achille Castiglioni & Pio Manz\u00f9"],[4,"Sella Stool","Furniture",3,1957,"Achille & Pier Giacomo Castiglioni"],[5,"Snoopy Table Lamp","Lighting",3,1967,"Achille & Pier Giacomo Castiglioni"],[6,"Superleggera Chair","Furniture",3,1957,"Gio Ponti"],[7,"Ulm Stool","Furniture",3,1954,"Max Bill & Hans Gugelot"],[8,"Taccia Table Lamp","Lighting",3,1962,"Achille & Pier Giacomo Castiglioni"],[9,"Juicy Salif Lemon Squeezer","Product",3,1990,"Philippe Starck"],[10,"Grillo Telephone","Product",3,1965,"Marco Zanuso & Richard Sapper"],[11,"606 Universal Shelving System","Furniture",4,1960,"Dieter Rams"],[12,"Carlton Bookcase","Furniture",4,1981,"Ettore Sottsass"],[13,"London Underground Map","Graphic",3,1933,"Harry Beck"],[14,"Penguin Books Composition Rules","Graphic",3,1947,"Jan Tschichold"],[15,"Centre Pompidou","Architecture",3,1977,"Renzo Piano & Richard Rogers"],[16,"Braun SK 4 Radiogram","Product",4,1956,"Dieter Rams & Hans Gugelot"],[17,"Paimio Chair","Furniture",4,1932,"Alvar Aalto"],[18,"Stool 60","Furniture",3,1933,"Alvar Aalto"],[19,"Savoy Vase","Product",3,1936,"Alvar Aalto"],[20,"Faaborg Chair","Furniture",3,1914,"Kaare Klint"],[21,"PH Artichoke","Lighting",3,1958,"Poul Henningsen"],[22,"PH 5 Pendant","Lighting",3,1958,"Poul Henningsen"],[23,"Ant Chair","Furniture",3,1952,"Arne Jacobsen"],[24,"Egg Chair","Furniture",3,1958,"Arne Jacobsen"],[25,"SAS Royal Hotel","Architecture",3,1960,"Arne Jacobsen"],[26,"The Round Chair","Furniture",3,1949,"Hans Wegner"],[27,"Wishbone Chair","Furniture",3,1949,"Hans Wegner"],[28,"Chieftain Chair","Furniture",3,1949,"Finn Juhl"],[29,"Spanish Chair","Furniture",3,1958,"B\u00f8rge Mogensen"],[30,"Panton Chair","Furniture",3,1967,"Verner Panton"],[31,"Kilta Tableware","Product",3,1953,"Kaj Franck"],[32,"Ultima Thule Glassware","Product",3,1968,"Tapio Wirkkala"],[33,"Pitcher 992","Product",3,1952,"Henning Koppel"],[34,"Unikko","Graphic",3,1964,"Maija Isola"],[35,"Sydney Opera House","Architecture",3,1973,"J\u00f8rn Utzon"],[36,"Cylinda-Line","Product",3,1967,"Arne Jacobsen"],[37,"Margrethe Bowl","Product",3,1950,"Sigvard Bernadotte & Acton Bj\u00f8rn"],[38,"Eva Chair","Furniture",3,1934,"Bruno Mathsson"],[39,"LCW (Lounge Chair Wood)","Furniture",3,1946,"Charles & Ray Eames"],[40,"Eames Lounge Chair (670)","Furniture",3,1956,"Charles & Ray Eames"],[41,"Eames House (Case Study #8)","Architecture",3,1949,"Charles & Ray Eames"],[42,"Eames Leg Splint","Product",3,1942,"Charles & Ray Eames"],[43,"Powers of Ten","Graphic",3,1977,"Charles & Ray Eames"],[44,"Tulip Chair","Furniture",3,1956,"Eero Saarinen"],[45,"TWA Flight Center","Architecture",3,1962,"Eero Saarinen"],[46,"Noguchi Coffee Table (IN-50)","Furniture",3,1948,"Isamu Noguchi"],[47,"Akari Light Sculptures","Lighting",3,1951,"Isamu Noguchi"],[48,"Ball Clock","Product",3,1948,"George Nelson (attributed)"],[49,"Marshmallow Sofa","Furniture",3,1956,"George Nelson / Irving Harper"],[50,"Platform Bench","Furniture",3,1946,"George Nelson"],[51,"Diamond Chair","Furniture",3,1952,"Harry Bertoia"],[52,"Knoll Planning Unit","Furniture",3,1948,"Florence Knoll"],[53,"Girard Wooden Dolls","Product",3,1963,"Alexander Girard"],[54,"Vertigo Title Sequence","Graphic",3,1958,"Saul Bass"],[55,"New York Subway Signage","Graphic",3,1966,"Massimo Vignelli"],[56,"IBM Logo","Graphic",3,1972,"Paul Rand"],[57,"American Modern Dinnerware","Product",3,1937,"Russel Wright"],[58,"Conoid Bench","Furniture",3,1960,"George Nakashima"],[59,"Farnsworth House","Architecture",3,1951,"Ludwig Mies van der Rohe"],[60,"Barcelona Chair","Furniture",3,1929,"Ludwig Mies van der Rohe"],[61,"Wassily Chair (B3)","Furniture",3,1925,"Marcel Breuer"],[62,"Womb Chair","Furniture",3,1948,"Eero Saarinen"],[63,"Cesca Chair (B32)","Furniture",3,1928,"Marcel Breuer"],[64,"LC4 Chaise Longue","Furniture",3,1928,"Le Corbusier, Pierre Jeanneret & Charlotte Perriand"],[65,"Grid Systems in Graphic Design","Graphic",3,1961,"Josef M\u00fcller-Brockmann"],[66,"Helvetica","Typography",4,1957,"Max Miedinger & Eduard Hoffmann"],[67,"Eames House of Cards","Graphic",3,1952,"Charles & Ray Eames"],[68,"Eames Molded Plastic Chair (DSW/DSR)","Furniture",3,1950,"Charles & Ray Eames"],[69,"TWA Identity & Terminal Signage","Graphic",3,1960,"Chermayeff & Geismar"],[70,"Artek Tea Trolley 901","Furniture",3,1936,"Alvar Aalto"],[71,"Series 7 Chair","Furniture",3,1955,"Arne Jacobsen"],[72,"Saarinen Dining Table (Pedestal Table)","Furniture",3,1956,"Eero Saarinen"],[73,"Aalto Vase Collection (Savoy System)","Product",3,1936,"Alvar Aalto"],[74,"Eames Storage Unit (ESU)","Furniture",3,1950,"Charles & Ray Eames"],[75,"Stacking Chair (Model 3107 Colour)","Furniture",3,1955,"Arne Jacobsen / Fritz Hansen"],[76,"Herbert Matter Swiss Tourism Posters","Graphic",3,1935,"Herbert Matter"],[77,"Action Office II","Furniture",3,1968,"Robert Propst / George Nelson"],[78,"Hang-It-All","Product",3,1953,"Charles & Ray Eames"],[79,"Stool No. 60","Furniture",3,1933,"Alvar Aalto"],[80,"Paimio Armchair","Furniture",3,1932,"Alvar Aalto"],[81,"Armchair 41","Furniture",2,1932,"Alvar Aalto"],[82,"AJ Cutlery","Product",3,1958,"Arne Jacobsen"],[83,"Cylinda Line Cocktail Jug","Product",3,1967,"Arne Jacobsen"],[85,"Shell Chair","Furniture",3,1948,"Hans Wegner"],[86,"Chair 24","Furniture",3,1950,"Hans Wegner"],[87,"812 Chair","Furniture",3,1970,"Hans Wegner"],[88,"RT 20 Radio","Product",3,1963,"Dieter Rams"],[89,"HLD 31 Hair Dryer","Product",4,1970,"Dieter Rams"],[90,"RZ 62 Chair","Furniture",3,1962,"Dieter Rams"],[91,"M 140 Food Mixer","Product",2,1960,"Dieter Rams"],[92,"MPZ 2 Juicer","Product",3,1972,"Dieter Rams"],[93,"T 1000 Radio","Product",3,1963,"Dieter Rams"],[94,"TP1 Record Player","Product",2,1959,"Dieter Rams"],[95,"Phonosuper Radiogram SK55","Product",2,1956,"Dieter Rams"],[96,"ET66 Calculator","Product",1,1987,"Dieter Rams"],[97,"Cosmolux","Lighting",2,1964,"Dieter Rams"],[98,"Braun Pocket de Luxe","Product",3,1992,"Braun AG"],[99,"Kitchen Wall Clock","Product",3,1956,"Max Bill"],[100,"Eames Elephant","Furniture",2,2007,"Charles Eames"],[101,"DCM (dining chair metal)","Furniture",4,1947,"Charles Eames"],[103,"CTW Coffee Table","Furniture",2,1947,"Charles Eames"],[104,"ESU 421-C Storage Unit","Furniture",2,1949,"Charles Eames"],[105,"The Colouring Toy","Product",2,1955,"Charles Eames"],[106,"Model DKR 2 Chair","Furniture",3,1951,"Ray Eames"],[107,"LCM Chair","Furniture",4,1947,"Charles & Ray Eames"],[108,"Aluminium Group, model 682","Furniture",2,1958,"Charles & Ray Eames"],[109,"S Chair","Furniture",4,1987,"Tom Dixon"],[110,"Dining chair, model SF/SC","Furniture",4,1938,"Gerald Summers"],[111,"Westside Lounge","Furniture",3,1983,"Ettore Sottsass"],[112,"Ashoka","Lighting",3,1981,"Ettore Sottsass"],[113,"Casablanca","Furniture",3,1981,"Ettore Sottsass"],[114,"Designs for 'Carlton' bookcase and 'Casablanca' sideboard","Graphic",2,1981,"Ettore Sottsass"],[115,"Le Strutture Tremano","Furniture",2,1979,"Ettore Sottsass"],[116,"Drawing for 'Murmansk' Centrepiece","Graphic",4,1982,"Ettore Sottsass"],[117,"Totem","Product",4,1965,"Ettore Sottsass"],[118,"Mumansk","Product",3,1982,"Ettore Sottsass"],[119,"Lithograph","Graphic",4,1973,"Ettore Sottsass"],[120,"Cruet Set","Product",3,1984,"Ettore Sottsass"],[121,"Sirio Vase","Product",2,1980,"Ettore Sottsass"],[122,"Three Nesting Tables","Furniture",4,1936,"Marcel Breuer"],[123,"Long Chair","Furniture",4,1936,"Marcel Breuer"],[124,"Club Chair B3","Furniture",4,1925,"Marcel Breuer"],[125,"Wooden Armchair","Furniture",3,1922,"Marcel Breuer"],[126,"B33 Chair","Furniture",4,1927,"Marcel Breuer"],[127,"Model B64","Furniture",4,1928,"Marcel Breuer"],[128,"Short Chair","Furniture",2,1936,"Marcel Breuer"],[129,"Dining Chair","Furniture",3,1936,"Marcel Breuer"],[130,"Model B32","Furniture",3,1928,"Marcel Breuer"],[131,"Model B5","Furniture",3,1926,"Marcel Breuer"],[132,"Ottoman","Furniture",3,1948,"Eero Saarinen"],[133,"Flamingo Armchair","Furniture",3,1959,"Ernest Race"],[134,"Jason Chair","Furniture",3,1950,"Carl Jacobs"],[135,"Bofinger Chair","Furniture",3,1964,"Rudolf Baresel-Bofinger"],[136,"Costume Design for 'King Lear'","Graphic",3,1955,"Isamu Noguchi"],[137,"Noguchi Table","Furniture",4,1947,"Isamu Noguchi"],[138,"Costume design for Kent in 'King Lear'","Graphic",3,1955,"Isamu Noguchi"],[139,"Costume design for Cordelia in 'King Lear'","Graphic",3,1955,"Isamu Noguchi"],[140,"Costume design for the Fool in 'King Lear'","Graphic",3,1955,"Isamu Noguchi"],[141,"Costume design for Cordelia's drummer in 'King Lear'","Graphic",3,1955,"Isamu Noguchi"],[142,"Costume design for Albany in 'King Lear'","Graphic",3,1955,"Isamu Noguchi"],[143,"Costume design for Cornwall in 'King Lear'","Graphic",3,1955,"Isamu Noguchi"],[144,"Costume design for Edgar in 'King Lear'","Graphic",2,1955,"Isamu Noguchi"],[145,"Radio Nurse","Product",4,1937,"Isamu Noguchi"],[146,"Vetrate Grosse","Product",3,1965,"Gio Ponti"],[147,"Black 201 Television","Product",3,1969,"Richard Sapper"],[148,"Hebi Lamp","Lighting",4,1971,"Isao Hosoe"],[149,"Cord Chair","Furniture",4,2009,"Oki Sato (nendo)"],[150,"Artichoke Lamp","Lighting",3,1960,"Poul Henningsen"],[151,"Advise & Consent","Graphic",4,1962,"Saul Bass"],[152,"Sheet music","Graphic",4,1970,"Chappell & Co."],[153,"Vignelli Carafe","Product",4,1991,"Lella and Massimo Vignelli"],[154,"Il Gioco dei Potenti","Graphic",4,1965,"Massimo Vignelli"],[155,"Juni-Festwochen Z\u00fcrich 1950","Graphic",4,1950,"Josef M\u00fcller-Brockmann"],[156,"Bel Air Chair","Furniture",4,1982,"Peter Shire"],[157,"Hilton Trolley","Furniture",4,1981,"Javier Mariscal"],[158,"Drawing for Super Lamp","Graphic",4,1981,"Martine Bedin"],[159,"Cipriani","Furniture",4,1981,"Alessandro Mendini"],[160,"Design for Beds","Graphic",4,1982,"George Sowden"],[161,"Terminus","Lighting",4,1981,"Martine Bedin"],[162,"Oceanic Lamp","Lighting",4,1981,"Michele de Lucchi"],[163,"Memphis Swatch","Product",3,1985,"Memphis Group"],[164,"Alpha Centauri Vase","Product",3,1982,"Marco Zanini"],[165,"Aldo Cibic Drawing","Graphic",3,1980,"Aldo Cibic"],[166,"Metropole Clock","Product",3,1982,"George J. Sowden"],[167,"Floating Smithereens Carpet","Product",3,1986,"Natalie du Pasquier"],[168,"Breuer Metallm\u00f6bel","Graphic",4,1927,"Herbert Bayer"],[169,"Seminar Chair","Furniture",4,1947,"Selman Selmanagic"],[170,"Bauspiel Ein Schiff","Product",4,1923,"Alma Siedhoff-Buscher"],[171,"Bird and Anemone","Product",4,1882,"William Morris"],[172,"Strawberry Thief","Product",4,1883,"William Morris"],[173,"Indian Wallpaper","Product",4,1868,"William Morris"],[175,"Lea Fabric","Product",4,1885,"William Morris"],[176,"Wreath Wallpaper","Product",3,1876,"William Morris"],[177,"Wandle Fabric","Product",4,1884,"William Morris"],[178,"Trellis Wallpaper","Product",2,1862,"William Morris"],[179,"Willow Bough Wallpaper","Product",3,1887,"William Morris"],[180,"Tulip and Willow Fabric","Product",4,1873,"William Morris"],[181,"St George Cabinet","Furniture",4,1861,"Philip Webb"],[182,"Aalto Flower Dish","Product",4,1939,"Alvar Aalto"],[183,"Anglepoise Lamp 1227","Lighting",4,1938,"George Carwardine"],[184,"Routemaster Bus","Product",3,1969,"Meccano Ltd"],[185,"Great British Classics","Product",3,2011,"Hornby Hobbies Limited"],[186,"The London Poster Project","Graphic",3,2009,"London Design Festival"],[187,"Jigsaw Puzzle","Product",3,1940,"Paul & Majorie Abbatt Ltd."],[188,"'New Family' Sewing Machine","Product",4,1888,"Singer Manufacturing Company"],[189,"Fantasy","Product",3,1936,"Rebecca Crompton"],[190,"Tray cloth","Product",2,1938,"Rebecca Crompton"],[191,"Horse","Product",3,1930,"Rebecca Crompton"],[192,"Sampler","Product",3,1930,"Rebecca Crompton"],[193,"Evening dress","Product",3,1881,"Worth"],[195,"Future Nostalgia","Product",4,2022,"Casey Cadwallader"],[196,"Chris Martin's Viva La Vida costume","Product",4,2008,"Sara Jowett"],[197,"Fauteuil Transatlantique","Furniture",4,1925,"Eileen Gray"],[198,"S bend chair","Furniture",4,1938,"Eileen Gray"],[199,"Fauteuil Transatlantic Design Drawing","Graphic",4,1927,"Eileen Gray"],[200,"Geometric Carpet Design","Product",4,1920,"Eileen Gray"],[201,"Carpet Design with Circles","Product",4,1922,"Eileen Gray"],[202,"Articulated Chair Design","Furniture",4,1965,"Eileen Gray"],[203,"Geometric Abstraction Study","Graphic",4,1965,"Eileen Gray"],[204,"Metal Frame Chair Design","Furniture",4,1930,"Eileen Gray"],[205,"Fauteuil pivotant","Furniture",3,1927,"Charlotte Perriand"],[206,"Butterfly stool","Furniture",4,1954,"Sori Yanagi"],[207,"Cabinet de Curiosit\u00e9","Furniture",4,1988,"Shiro Kuramata"],[208,"How High the Moon","Furniture",4,1986,"Shiro Kuramata"],[209,"Drawers in irregular form","Furniture",3,1970,"Shiro Kuramata"],[213,"Tracer","Product",3,1992,"Michael Heindorff"],[214,"Textile design","Product",3,1972,"Pat Albeck"],[215,"Indian Heroes","Product",4,1858,"John Crossley & Sons Ltd"],[216,"Designs for tiles in Islamic style","Graphic",3,1840,"Owen Jones"],[219,"Polypropylene Armchair","Furniture",4,1967,"Robin Day"],[220,"Polypropylene Chair (Mark II)","Furniture",4,1964,"Robin Day"],[221,"Q Stak","Furniture",4,1954,"Robin Day"],[222,"Pye model CS17","Product",4,1956,"Robin Day"],[223,"Pye Model 1108","Product",4,1965,"Robin Day"],[224,"Storage System","Furniture",4,1950,"Robin Day"],[225,"Leo","Product",4,1961,"Robin Day"],[226,"Q Rod Chair","Furniture",4,1960,"Robin Day"],[227,"Discus Carpet","Product",4,1962,"Robin Day"],[228,"Carpet Sample","Product",4,1955,"Robin Day"],[229,"Single Convertible Bed-Settee","Furniture",3,1957,"Robin Day"],[230,"Night and Day Glass Towel","Product",4,1961,"Lucienne Day"],[231,"BA3 Chair","Furniture",4,1946,"Ernest Race"],[232,"DA1 Armchair","Furniture",4,1946,"Ernest Race"],[233,"Antelope","Furniture",4,1950,"Ernest Race"],[234,"Kangaroo","Furniture",4,1953,"Ernest Race"],[235,"BA3A","Furniture",4,1945,"Ernest Race"],[236,"Sheppey Chair","Furniture",4,1963,"Ernest Race"],[237,"Cormorant","Furniture",4,1961,"Ernest Race"],[238,"Bottleship Mark 2","Furniture",4,1963,"Ernest Race"],[239,"The Obstacle Race","Graphic",4,1900,"G. H. Thompson"],[241,"Columbine","Product",3,1958,"Lucienne Day"],[242,"Four Seasons: Summer","Product",2,1958,"Lucienne Day"],[243,"Four Seasons: Spring","Product",3,1958,"Lucienne Day"],[244,"Four Seasons: Winter","Product",3,1958,"Lucienne Day"],[245,"Regent Street","Product",4,1958,"Lucienne Day"],[246,"Club","Product",3,1962,"Lucienne Day"],[247,"Four Seasons: Autumn","Product",4,1958,"Lucienne Day"],[248,"Calyx","Product",4,1951,"Lucienne Day"],[249,"Graphica","Product",4,1953,"Lucienne Day"],[250,"Rig","Product",4,1952,"Lucienne Day"],[251,"Provence","Product",4,1951,"Lucienne Day"],[252,"Flying in Blue","Product",4,1985,"Lucienne Day"],[253,"Furnishing fabric","Product",4,1939,"Lucienne Day"],[254,"Door handle","Product",4,2001,"Kenneth Grange"],[255,"Kenwood Chefette","Product",4,1966,"Kenneth Grange"],[256,"Kodaslide 40","Product",3,1961,"Kenneth Grange"],[257,"Variset V1 W","Product",4,1970,"Kenneth Grange"],[258,"Variset W 75","Product",4,1970,"Kenneth Grange"],[259,"Variset range of hat and coat hooks H 170","Product",4,1970,"Kenneth Grange"],[260,"Variset range of hat and coat hooks, W1, WH and W75","Product",2,1970,"Kenneth Grange"],[262,"Women at Work","Graphic",4,2017,"Margaret Calvert"],[263,"Festival of Britain 1951","Graphic",3,1951,"Abram Games"],[264,"Festival of Britain Scarf","Product",4,1951,"Joyce Clissold"],[265,"Insulin 8.27 Wallpaper","Product",4,1951,"William J. Odell"],[266,"Guinness in Festival Land","Graphic",4,1951,"Eric George Fraser"],[267,"Beryl 8.9 Furnishing Fabric","Product",4,1951,"H. Webster"],[268,"Boric Acid 8.34","Graphic",3,1951,"William J. Odell"],[270,"Leaf","Product",3,1957,"Terence Conran"],[271,"Tree Section","Product",3,1957,"Terence Conran"],[272,"Geometry Stripe","Product",4,1957,"Terence Conran"],[273,"Midwinter Bowl","Product",4,1954,"Terence Conran"],[274,"Plant Life","Product",4,1955,"Terence Conran"],[275,"Save our Planet, Save Our Cities!","Graphic",4,1971,"Buckminster Fuller"],[276,"Save our Planet, Save our Wildlife","Graphic",3,1971,"Alexander Calder"],[277,"Zometool","Product",3,2020,"Steve Baer"],[278,"Save our Planet, Save our Water","Graphic",3,1971,"Roy Lichtenstein"],[279,"CIA v UFO","Graphic",3,1967,"Michael English"],[282,"Extinction Rebellion Printing Block","Graphic",4,2019,"Extinction Rebellion Arts Group"],[283,"Extinction Rebellion Placard","Graphic",2,2019,"Extinction Rebellion Arts Group"],[284,"ESP Printing Block","Graphic",3,2019,"ESP"],[285,"Extinction Rebellion Flag","Graphic",2,2019,"Extinction Rebellion Arts Group"],[286,"Extinction Rebellion Vest","Product",3,2018,"Extinction Rebellion Arts Group"],[287,"Extinction Rebellion Leaflet","Graphic",3,2018,"Extinction Rebellion Arts Group"],[288,"U-Build Box Configuration Concept","Product",4,2019,"George Emmanuel Njike"],[289,"U-Build Box Configuration Refinement","Product",4,2019,"George Emmanuel Njike"],[290,"Extinction Rebellion Protest Sketch","Graphic",4,2019,"Esra Alma"],[291,"Heathrow","Graphic",4,2007,"Noel Douglas"],[292,"Resisters","Graphic",4,2018,"Aqui"],[293,"Imagine What London Will Be Like Run by Whitehall","Graphic",3,1984,"Peter Gatley"],[296,"If The GLC Goes, Whitehall Moves In. Say No To No Say.","Graphic",4,1984,"Peter Gatley"],[298,"European Socialists for the Women of Europe","Graphic",3,1994,"Lolli Aboutboul"],[299,"Austerity and Socialist Strategy","Graphic",4,2015,"David Mabb"],[300,"T.G.M. March 7, 1850 - September 14, 1937. In politics we demand not only pragmatic, but moral judgement. T. G. Masaryk.","Graphic",3,1990,"Hlad\u00edk"],[301,"Under the Banner of Lenin for Socialist Construction","Graphic",4,1930,"Gustavs Klucis"],[302,"Gone with the Wind","Graphic",3,1985,"John Houston"],[303,"Millionarios Socialistas","Graphic",3,1966,"Pedro de Ora\u00e1"],[304,"Illustrations of the Victorian Series and other Wall-papers","Graphic",3,1887,"Walter Crane"],[307,"With the Socialists for tomorrow","Graphic",4,1990,"Farkas"],[308,"Robert Barltrop's 'The Monument: The Story of the Socialist Party of Great Britain'","Graphic",4,1975,"Richard Hollis"],[309,"Truth Prevails","Graphic",3,1989,"V\u00e1clav Jir\u00e1sek"],[310,"Knotted Chair","Furniture",4,1996,"Marcel Wanders"],[311,"111 Navy Chair","Furniture",4,2022,"Emeco"],[312,"Materialized Sketch","Furniture",4,2005,"Front Design"],[313,"GynePunk 3D printed speculum","Product",4,2019,"Klau Chinche"],[314,"3D Print","Product",4,2018,"Royal College of Art"],[315,"3D printed Door Handle","Product",4,2021,"Materialise"],[316,"The Liberator","Product",4,2013,"Digits2Widgets"],[317,"Comb","Product",4,2018,"Chelsea Park"],[318,"Round Tray","Product",4,2018,"Mu-Hau Kao"],[319,"Flint","Product",4,2018,"Thilo Alex Brunner"],[320,"Scissors","Product",3,2018,"Miji Noh"],[321,"Thing-O-Matic","Product",3,2010,"MakerBot"],[322,"3D Checkerboard Pattern","Graphic",3,1968,"Donald K. Robbins"],[323,"3D printed earring prototype","Product",3,2022,"Evgeniia Balashova"],[324,"Fragile Future Chandelier","Lighting",3,2011,"Studio Drift (Lonneke Gordijn and Ralph Nauta)"],[326,"Bookends","Product",4,2015,"Assemble"],[327,"Chair One","Furniture",3,2002,"Konstantin Grcic"],[328,"Tomotom","Furniture",3,1967,"Bernard Holdaway"],[329,"Rock Table Lamp","Lighting",4,2015,"Assemble"],[330,"Architectural Spikes","Architecture",3,2014,"Kent Stainless"],[331,"High-backed chair","Furniture",3,1956,"Frank Lloyd Wright"],[332,"Pogo","Furniture",3,1956,"Peter Smithson"],[333,"Saul","Graphic",3,2007,"Matt Small"],[334,"Green inflatable PVC pillow with circles","Product",4,1967,"Philip Orenstein"],[335,"Orange and silver striped inflatable PVC pillow","Product",4,1967,"Philip Orenstein"],[336,"Blow","Furniture",4,1967,"Jonathan de Pas, Donato D'Urbino & Paolo Lomazzi"],[337,"Inflatable backpack","Product",4,1999,"Nick Crosbie"],[338,"Contour chair","Furniture",4,1967,"David Colwell"],[339,"Prototype pouffe","Furniture",4,1965,"Arthur Quarmby"],[340,"Book 6","Graphic",4,1972,"Eddie Squires"],[341,"The Incadinc Dress Kit","Product",4,1966,"Incadinc"],[342,"Ply-Chair","Furniture",4,1989,"Jasper Morrison"],[343,"Thinking Man's Chair","Furniture",3,1986,"Jasper Morrison"],[344,"Bottlerack","Product",4,1994,"Jasper Morrison"],[345,"Falcon Beer Glass","Product",4,1992,"Jasper Morrison"],[346,"Pill Stool","Furniture",3,1997,"Jasper Morrison"],[347,"BD:1","Furniture",4,1994,"Bj\u00f6rn Dahlstr\u00f6m"],[348,"Delft Bue B-jug","Product",4,2001,"Hella Jongerius"],[349,"UN Lounge Chair","Furniture",4,2013,"Hella Jongerius"],[350,"Wall hanging","Product",4,2000,"Hella Jongerius"],[351,"B-set","Product",4,1998,"Hella Jongerius"],[352,"Unfoldable Cube","Product",4,2005,"Hella Jongerius"],[353,"Woven Windows","Product",4,2010,"Hella Jongerius"],[354,"Mayday Lamp","Lighting",4,1999,"Konstantin Grcic"],[355,"Mono table","Furniture",3,1995,"Konstantin Grcic"],[356,"360 chair","Furniture",3,2009,"Konstantin Grcic"],[357,"Serif","Product",3,2014,"Ronan & Erwan Bouroullec"],[358,"Stationery Tray","Product",3,2018,"Camille Blin"],[359,"Algue","Product",3,2004,"Ronan & Erwan Bouroullec"],[360,"Cabbage Chair","Furniture",4,2008,"Oki Sato (nendo)"],[361,"Mimicry Chairs","Furniture",4,2012,"Oki Sato (nendo)"],[362,"21400 mm chair","Furniture",4,2010,"Oki Sato (nendo)"],[363,"Hiroshima Chair","Furniture",4,2008,"Naoto Fukasawa"],[364,"Scarf","Product",2,1980,"Yves Saint Laurent"],[365,"Greeting card","Graphic",3,2000,"SFM"],[366,"Farewell, Sweet Liberty","Product",3,1992,"Joe Casely-Hayford"],[367,"501","Product",3,1980,"Levi Strauss & Co."],[368,"Breeches","Product",3,1938,"Lionel Allerton Hemsley"],[369,"Arcus 1","Product",4,1991,"Stanislav Libensky"],[370,"Gone Fishing","Product",4,2000,"David Clarke"],[371,"Theatre costume","Product",4,1925,"Maurice Utrillo"],[372,"Faraday chair","Furniture",4,1995,"Dunne & Raby"],[373,"Cucumber Sandwiches","Furniture",4,1998,"Michael Anastassiades"],[374,"Weeds, Aliens and Other Stories: Number One","Furniture",4,2000,"Salvatore Vinci"],[375,"Weeds, Aliens and Other Stories: Number Two","Furniture",4,2000,"Salvatore Vinci"],[376,"Weeds, Aliens and Other Stories: Number Three","Furniture",4,2000,"Salvatore Vinci"],[377,"Weeds, Aliens and Other Stories: Number Six","Furniture",3,2000,"Salvatore Vinci"],[378,"Weeds, Aliens and Other Stories: Number Seven","Furniture",4,2000,"Salvatore Vinci"],[379,"Number four in series of \"Weeds, Aliens and Other Stories-Psychological Furniture for the Home and Garden\"","Graphic",4,2000,"Salvatore Vinci"],[380,"Botanica","Product",3,2011,"Studio Formafantasma"],[381,"Smartphone Cover","Product",4,2018,"Thomas Miss\u00e9"],[382,"Black Vase 2","Product",4,2021,"1882 Ltd"],[383,"Small bowl","Product",4,2022,"1882 Ltd"],[385,"Iside Toothpaste Bag","Product",3,2018,"Bethan Laura Wood"],[386,"Prototype Bag Handle for Valextra's Toothpaste Range","Product",3,2018,"Bethan Laura Wood"],[387,"London Olympic Cauldron Model","Architecture",3,2012,"Thomas Heatherwick"],[388,"Spun Chair","Furniture",3,2010,"Thomas Heatherwick"],[389,"SUPERFLUX, Issue 1","Graphic",3,2015,"Superflux"],[390,"Phantom Drone","Product",3,2013,"DJI"],[391,"Dracula Has Risen From the Grave poster design","Graphic",3,1968,"Thomas (William) Chantrell"],[393,"Printed flannel","Product",3,1924,"Varvara Stepanova"],[394,"geist.xyz","Graphic",3,2016,"ZEITGUISED"],[395,"J'ai bais\u00e9 ta bouche Iokanaan","Graphic",3,1892,"Aubrey Vincent Beardsley"],[396,"Harper's Magazine","Graphic",3,1895,"Beggarstaff Brothers"],[397,"Architectural Panel","Architecture",4,1933,"Sigmund Pollitzer"],[398,"Rowntree's Elect Cocoa Poster","Graphic",4,1896,"James Pryde"],[399,"GEC Radio Model BC4941","Product",3,1948,"General Electric Company"],[400,"Costume Design for Frankenstein","Graphic",4,2018,"Bunny Christie"],[401,"Action Man Mission Brief","Graphic",4,1973,"Palitoy"],[403,"Morris Kestelmen design","Graphic",2,1944,"Morris Kestelman"],[404,"You Can't Lay Down Your Memory","Furniture",3,1991,"Tejo Remy"],[406,"Small Egg Vase","Product",3,1997,"Marcel Wanders"],[407,"Foam Bowl","Product",4,1997,"Marcel Wanders"],[408,"Sponge Vase","Product",4,1997,"Marcel Wanders"],[409,"Set Up Shades","Lighting",3,1988,"Marcel Wanders"],[410,"Sexy Relaxy","Furniture",4,2002,"Richard Hutten"],[411,"Berlage chair","Furniture",4,2004,"Richard Hutten"],[412,"Neckpiece","Product",4,1987,"Gijs Bakker"],[413,"Reef","Product",3,2016,"Hella Jongerius"],[414,"Glaze","Product",3,2019,"Hella Jongerius"],[415,"Plastic Chair in Wood","Furniture",4,2008,"Maarten Baas"],[416,"Smoke Mirror","Product",4,2007,"Maarten Baas"],[417,"HS-011","Furniture",4,2016,"Taizhou Changheng Trado Co., Ltd"],[418,"Table-upon-table barstool","Furniture",4,1991,"Richard Hutten"],[419,"One Minute","Product",3,2004,"Marcel Wanders"],[420,"CD-player","Product",4,1999,"Naoto Fukasawa"],[421,"Compact disc player","Product",4,1999,"Fukasawa"],[422,"au NEON","Product",4,2006,"Naoto Fukasawa"],[423,"au W11K","Product",4,2003,"Naoto Fukasawa"],[424,"au Infobar","Product",4,2001,"Naoto Fukasawa"],[425,"Barbican Hand Rinse Basin","Product",4,1967,"Michael Hohmann"],[426,"Storage Boxes Set","Product",4,1938,"Wilhelm Wagenfeld"],[427,"Boby","Product",4,1970,"Joe Cesare Colombo"],[428,"Honey-Pop chair","Furniture",4,2001,"Tokujin Yoshioka"],[429,"Power, Corruption and Lies","Graphic",4,1983,"Peter Saville"],[430,"Dazzle Ships","Graphic",4,1983,"Malcolm Garrett"],[431,"Waste Painting","Graphic",4,2001,"Peter Saville"],[432,"Lament","Graphic",3,1984,"Peter Saville"],[433,"Unknown Pleasures","Graphic",4,1979,"Peter Saville"],[434,"Record sleeve","Graphic",4,1984,"Ben Kelly"],[435,"Waste Painting #9, The Crown Jewels","Graphic",3,2003,"Peter Saville"],[436,"Stereo/Porno","Graphic",3,1988,"Peter Saville Associates"],[437,"Panel","Graphic",3,1990,"Jonathan Barnbrook"],[438,"Framed Award","Graphic",3,2003,"Jonathan Barnbrook"],[439,"Merchandise","Product",3,2016,"Jonathan Barnbrook"],[440,"Do women have to be naked to get into the Met. Museum?","Graphic",3,1989,"Guerrilla Girls"],[441,"The Advantages Of Being A Woman Artist","Graphic",2,1985,"Guerrilla Girls"],[442,"Sticker","Graphic",3,1980,"PESTS"],[443,"HOW OFTEN DO YOU SEE A ONE PERSON SHOW BY AN ARTIST OF COLOR?","Graphic",3,1980,"PESTS"],[444,"Exhibition list","Graphic",3,1980,"PESTS"],[445,"Flyer","Graphic",3,1980,"PESTS"],[446,"We Serve Whites Only","Graphic",3,1980,"PESTS"],[447,"Waldi","Graphic",4,1972,"Otl Aicher"],[448,"Aldermaston to London Easter 62","Graphic",4,1962,"Ken Garland"],[449,"A policy for Britain","Graphic",3,1966,"Ken Garland"],[450,"Ken","Graphic",4,1980,"Peter Bragg"],[451,"Original sketch for the London Underground Railways Map","Graphic",4,1931,"Henry C. Beck"],[452,"In Loving Memory of Work","Graphic",4,2015,"Craig Oldham"],[453,"Armchair","Furniture",3,1944,"Hans Wegner"],[454,"Plywood Chair","Furniture",4,1945,"Charles Eames"],[455,"Desk","Furniture",3,1935,"Marcel Breuer"],[456,"Cabinet","Furniture",4,1951,"Gio Ponti"],[457,"Screen","Furniture",3,1923,"Eileen Gray"],[458,"Pipistrello Lamp","Lighting",4,1970,"Gae Aulenti"],[459,"Laser Chair","Furniture",3,2002,"Ineke Hans"],[460,"High Tea Pot","Product",3,2003,"Wieki Somers"],[463,"Circuit","Product",3,1967,"Eddie Squires"],[464,"Colourtron","Product",3,1967,"Eddie Squires"],[465,"Mise en page","Typography",2,1931,"Alfred Tolmer"],[466,"High Flyer, Low Profile","Graphic",3,1989,"Sue Coffey"],[469,"V&A 150th Anniversary Album Page","Graphic",3,2007,"Ron Arad"],[470,"Kaleidoscope House Living Room Set","Product",4,2001,"Laurie Simmons"],[471,"Jack Light","Lighting",3,1996,"Tom Dixon"],[472,"Fat Chair","Furniture",3,1991,"Tom Dixon"],[474,"Fresh Fat Plastic","Product",3,2002,"Tom Dixon"],[475,"De La Warr Pavilion Chair","Furniture",3,2005,"Edward Barber"],[476,"Loop Coffee Table","Furniture",3,1999,"Edward Barber & Jay Osgerby"],[477,"London 2012 Olympic Torch","Product",3,2011,"Edward Barber & Jay Osgerby"],[478,"V&A 150th Anniversary Album Design","Graphic",3,2007,"Edward Barber"],[479,"Experimental Design Study","Product",3,2011,"Edward Barber"],[480,"Loop Shelf","Furniture",3,1996,"Edward Barber & Jay Osgerby"],[481,"Magic Tape Dispenser","Product",3,2018,"Camille Blin"],[482,"Branca Chair","Furniture",3,2010,"Sam Hecht"],[487,"Bobbins of Nylon Yarn, British Nylon Spinners, Pontypool Wales, 1957","Graphic",3,1957,"Maurice Broomfield"],[491,"Serif TV","Product",3,2013,"Erwan Bouroullec"],[492,"The Rape of the Sabines No.2","Graphic",3,1998,"Leon Kossoff"],[493,"Captain Hook Chair Frame","Furniture",3,2020,"Yinka Ilori"],[494,"iPad","Product",3,2010,"Jonathan Ive"],[495,"iPhone","Product",3,2007,"Jonathan Ive"],[496,"iMac G3","Product",3,1998,"Jonathan Ive"],[497,"iPhone 6","Product",3,2014,"Jonathan Ive"],[498,"iPod Touch","Product",3,2012,"Apple Inc"],[499,"Olivetti Lexicon 80","Product",3,1942,"Marcello Nizzoli"],[500,"Valentine","Product",3,1969,"Ettore Sottsass"],[501,"Olivetti Lexikon Poster","Graphic",4,1953,"Giovanni Pintori"],[502,"Selectric 1","Product",4,1961,"Eliot Noyes"],[503,"Cultic Textsite Excavated at Rasshamra","Typography",3,1969,"Dom Sylvester Hou\u00e9dard"],[504,"Minnesota Ojibwa Sacrificing","Typography",3,1965,"Dom Sylvester Hou\u00e9dard"],[505,"Study and Love Poster","Graphic",4,1975,"Tadaaki Kanasashi"],[506,"untitled","Typography",3,1970,"Dom Sylvester Hou\u00e9dard"],[507,"Stowaway TPS-L2","Product",3,1979,"Sony Corporation"],[508,"Walkman","Product",4,1990,"Sony Corporation"],[509,"Sports Walkman","Product",3,1990,"Sony Corporation"],[510,"Sony Memory Stick Walkman NW-MS7","Product",3,2000,"Sony Corporation"],[511,"Sony Sports Walkman FM","Product",3,1982,"Sony Corporation"],[512,"Credit Card Radio","Product",3,1985,"Sony Corporation"],[513,"Sony VAIO PCG-C1XD Notebook Computer","Product",3,1999,"Sony Corporation"],[514,"Wedgwood Plate","Product",3,2005,"Josiah Wedgwood and Sons"],[515,"Strata Tumbler","Product",4,1999,"Jasper Conran"],[516,"Aura Martini Glass","Product",4,1999,"Jasper Conran"],[517,"Civil Partnership Suit","Product",3,2006,"Jasper Conran"],[518,"Design and Fittings of a Shop for Jasper Conran","Architecture",3,1986,"Nigel Coates"],[519,"Driftwood after a Storm, Betws-y-Coed","Graphic",3,1870,"Richard Sebastian Bond"],[520,"Nova Shoes","Product",3,2013,"Zaha Hadid"],[521,"BRIT Award","Product",3,2017,"Zaha Hadid"],[522,"Architectural model","Architecture",3,2012,"Zaha Hadid Architects"],[523,"Reclining Artist (small)","Graphic",3,2017,"Grayson Perry"],[524,"Boby Trolley","Furniture",3,1970,"Joe Cesare Colombo"],[525,"Model 4801","Furniture",4,1963,"Joe Cesare Colombo"],[526,"Universale","Furniture",4,1965,"Joe Colombo"],[527,"Brionvega TS502","Product",4,1963,"Marco Zanuso"],[528,"Muji CD Player","Product",2,1999,"Naoto Fukasawa"],[529,"Wagenfeld Storage Boxes","Product",3,1938,"Wilhelm Wagenfeld"],[530,"Atollo Table Lamp","Lighting",4,1977,"Vico Magistretti"],[531,"Veranda Sofa","Furniture",3,1983,"Vico Magistretti"],[532,"Selene Chair","Furniture",3,1968,"Vico Magistretti"],[533,"Black ST 201 TV","Product",4,1969,"Marco Zanuso"],[534,"RR126 Radiofonografo","Product",4,1966,"Achille & Pier Giacomo Castiglioni"],[535,"Crosby Chair","Furniture",3,1998,"Gaetano Pesce"],[536,"UP 3","Furniture",4,1969,"Gaetano Pesce"],[537,"Gallery Mourmans Exhibition Invitation","Graphic",4,1993,"Gaetano Pesce"],[538,"Pratt Chair","Furniture",3,1984,"Gaetano Pesce"],[539,"Nobody's Shelves","Furniture",3,2002,"Gaetano Pesce"],[540,"Peter Joseph Gallery Invitation","Graphic",4,1993,"Gaetano Pesce"],[541,"Toga","Furniture",3,1968,"Sergio Mazza"],[542,"Dodo","Furniture",3,2009,"Oiva Toikka"],[543,"Puppy","Furniture",3,2005,"Eero Aarnio"],[544,"Labrador","Product",3,1982,"Andrea Branzi"],[545,"Aeo Chair","Furniture",3,1975,"Archizoom"],[546,"Sinerpica Lamp","Lighting",3,1979,"Michele de Lucchi"],[547,"Flamingo Table","Furniture",3,1983,"Michele de Lucchi"],[548,"Plastic Body Bustier","Product",2,1980,"Issey Miyake"],[549,"Lucent Bao Bao Tote Bag","Product",3,2019,"Issey Miyake"],[550,"Light Lamp","Lighting",3,2012,"Issey Miyake"],[551,"Spiral Handbag","Product",3,1990,"Issey Miyake"],[552,"Pleated Dress","Product",3,1990,"Issey Miyake"],[553,"A-POC T-shirt","Product",3,2002,"Issey Miyake"],[554,"132 5. Issey Miyake Dress","Product",3,2016,"Issey Miyake"],[555,"Suit","Product",3,1991,"Issey Miyake"],[556,"Autoprogettazione Chair Plans","Furniture",3,1970,"Enzo Mari"],[557,"Multi-Purpose Puzzle","Product",3,1979,"Philip Gell"],[558,"Equilpiemonte Coffee Pot","Product",3,1983,"Gabriele De Vecchi"],[559,"Torincubo","Product",4,1985,"Gabriele De Vecchi"],[560,"Platter","Product",4,2006,"Taizo Kuroda"],[561,"Palace of Justice, Salerno","Architecture",3,2001,"David Chipperfield"],[563,"Button mould","Product",3,1941,"Lucie Rie"],[564,"Bud-shaped pot","Product",2,1968,"Hans Coper"],[565,"Bottle form with ridged shoulders and wide rim","Product",3,1968,"Hans Coper"],[566,"Flat spade-shaped pot","Product",3,1968,"Hans Coper"],[567,"Large oval-bodied pot narrowing to an elliptical top","Product",3,1968,"Hans Coper"],[568,"White pot on high foot","Product",4,1975,"Hans Coper"],[569,"Black form on square foot","Product",3,1975,"Hans Coper"],[570,"Washbasin and pedestal","Product",3,1959,"Hans Coper"],[571,"Large flat bottle","Product",3,1958,"Hans Coper"],[572,"On the White Road","Product",3,2022,"Josiah Wedgwood and Sons"],[573,"Teapot","Product",3,1996,"Edmund de Waal"],[574,"Signs & Wonders","Product",3,2009,"Edmund de Waal"],[575,"Lidded jar","Product",3,2001,"Edmund de Waal"],[576,"Beaker","Product",4,1996,"Edmund de Waal"],[577,"Mr and Mrs Perry","Graphic",3,2006,"Grayson Perry"],[578,"My Heroes","Product",4,1994,"Grayson Perry"],[579,"The Charms of Lincolnshire","Graphic",4,2006,"Grayson Perry"],[580,"Matching Pair","Product",3,2017,"Grayson Perry"],[581,"April Ashley (1935-2021)","Graphic",3,2023,"Museum of Transology"],[582,"Vessel 985","Product",3,1987,"June Schwarcz"],[583,"Laughing Mouth Vessel","Product",3,1985,"Mutsuo Yanagihara"],[584,"Vessel #2169","Product",4,2000,"June Schwarcz"],[585,"Rare Earthenware","Product",3,2015,"Unknown Fields Division"],[586,"Plique-\u00e0-jour Vessel #602","Product",4,1972,"June Schwarcz"],[587,"Vessel","Product",3,1960,"Berndt Friberg"],[588,"Lockheed Lounge","Furniture",3,1988,"Marc Newson"],[589,"Tree Trunk Bench","Furniture",4,1999,"Jurgen Bey"],[590,"Rover Chair","Furniture",4,1981,"Ron Arad"],[591,"Bookworm Shelf","Furniture",3,1993,"Ron Arad"],[592,"UP5 Armchair","Furniture",4,1969,"Gaetano Pesce"],[593,"Multi Chair","Furniture",3,1970,"Joe Colombo"],[594,"Nobody's Perfect Chair","Furniture",3,2002,"Gaetano Pesce"],[595,"Embryo Chair","Furniture",3,1988,"Marc Newson"],[596,"Black Gold","Product",3,2002,"Ineke Hans"],[597,"Showtime Armchair","Furniture",4,2006,"Jaime Hayon"],[598,"Green Chicken","Ceramic",3,2006,"Jaime Hayon"],[599,"Kokon Furniture","Furniture",4,1997,"Jurgen Bey"],[600,"Favela Chair","Furniture",4,1991,"Fernando & Humberto Campana"],[601,"Bubble Chair","Furniture",3,2000,"Hussein Chalayan"],[602,"Body Meets Dress, Dress Meets Body","Textile",3,1997,"Rei Kawakubo / Comme des Gar\u00e7ons"],[603,"Pratone","Furniture",3,1971,"Giorgio Ceretti, Pietro Derossi & Riccardo Rosso"],[604,"Autoprogettazione","Furniture",3,1974,"Enzo Mari"],[605,"Miss Blanche","Furniture",3,1988,"Shiro Kuramata"],[606,"Smoke Chair","Furniture",4,2002,"Maarten Baas"],[607,"Do Hit Chair","Furniture",3,2000,"Marijn van der Poll"],[608,"100 Chairs in 100 Days","Furniture",4,2007,"Martino Gamper"],[609,"Colour Porcelain","Ceramic",3,2012,"Scholten & Baijings"],[610,"Dawn Light","Lighting",3,2015,"Sabine Marcelis"],[611,"Chair_One","Furniture",4,2003,"Konstantin Grcic"],[612,"Orgone Lounge","Furniture",3,1993,"Marc Newson"],[613,"Felt Chair","Furniture",2,1993,"Marc Newson"],[614,"Big Shadow","Lighting",2,1998,"Marcel Wanders"],[615,"Fracture Furniture","Furniture",3,2007,"Ineke Hans"],[616,"Rex Chair","Furniture",3,2021,"Ineke Hans"],[617,"Light Shade Shade","Lighting",3,1999,"Jurgen Bey"],[618,"Monkey Table","Furniture",3,2015,"Jaime Hayon"],[619,"Dino Armchair","Furniture",3,2019,"Jaime Hayon"],[620,"Campana Banquete Chair","Furniture",3,2002,"Fernando & Humberto Campana"],[621,"Vermelha Chair","Furniture",2,1998,"Fernando & Humberto Campana"],[622,"Faye Toogood Roly Poly Chair","Furniture",3,2014,"Faye Toogood"],[623,"Spoon Chair (Assemblage 5)","Furniture",3,2016,"Faye Toogood"],[624,"Totem","Product",3,2011,"Bethan Laura Wood"],[626,"Ore Streams","Product",3,2017,"Formafantasma"],[627,"Cambio","Product",2,2020,"Formafantasma"],[628,"Clay Table","Furniture",3,2006,"Maarten Baas"],[629,"Real Time: Sweepers Clock","Product",2,2009,"Maarten Baas"],[630,"Ronan & Erwan Bouroullec Alcove Sofa","Furniture",3,2006,"Ronan & Erwan Bouroullec"],[631,"Palissade Outdoor Collection","Furniture",2,2015,"Ronan & Erwan Bouroullec"],[632,"Konstantin Grcic Mayday Lamp","Lighting",3,2000,"Konstantin Grcic"],[633,"Dunne & Raby Placebo Project","Product",3,2001,"Anthony Dunne & Fiona Raby"],[634,"United Micro Kingdoms","Product",3,2013,"Anthony Dunne & Fiona Raby"],[635,"Sabine Marcelis Candy Cube","Furniture",2,2017,"Sabine Marcelis"],[636,"Scholten & Baijings Paper Porcelain","Ceramic",3,2010,"Scholten & Baijings"]],"e":[[1,3,"sameProblem"],[1,8,"material"],[1,11,"argument"],[1,6,"sameProblem"],[2,9,"argument"],[2,4,"method"],[2,12,"argument"],[2,6,"zeitgeist"],[3,11,"method"],[3,7,"lineage"],[4,10,"lineage"],[4,9,"argument"],[5,1,"material"],[5,8,"sameProblem"],[5,3,"method"],[6,7,"method"],[7,11,"lineage"],[7,12,"argument"],[8,15,"lineage"],[9,12,"lineage"],[10,16,"method"],[10,11,"sameProblem"],[11,12,"argument"],[13,14,"method"],[13,16,"lineage"],[13,7,"method"],[14,11,"method"],[14,16,"lineage"],[15,16,"method"],[15,11,"argument"],[16,11,"lineage"],[17,6,"argument"],[17,18,"method"],[17,7,"argument"],[17,16,"zeitgeist"],[18,11,"sameProblem"],[18,7,"method"],[19,47,"lineage"],[19,45,"lineage"],[19,9,"argument"],[20,6,"method"],[20,27,"lineage"],[20,2,"argument"],[21,1,"sameProblem"],[21,3,"argument"],[21,22,"method"],[22,5,"sameProblem"],[22,14,"method"],[23,6,"argument"],[23,39,"lineage"],[23,18,"method"],[24,25,"method"],[24,45,"zeitgeist"],[24,4,"argument"],[25,15,"argument"],[25,46,"zeitgeist"],[26,20,"lineage"],[26,6,"method"],[26,28,"method"],[27,26,"method"],[27,11,"argument"],[27,6,"sameProblem"],[28,24,"lineage"],[28,2,"method"],[29,27,"sameProblem"],[29,20,"lineage"],[29,11,"method"],[30,23,"lineage"],[30,45,"sameProblem"],[30,12,"zeitgeist"],[31,11,"method"],[31,14,"method"],[31,57,"argument"],[32,19,"method"],[32,9,"argument"],[32,59,"sameProblem"],[33,28,"zeitgeist"],[33,19,"method"],[33,47,"zeitgeist"],[34,55,"argument"],[34,54,"method"],[34,12,"zeitgeist"],[35,46,"zeitgeist"],[35,15,"argument"],[35,25,"argument"],[36,11,"method"],[36,31,"sameProblem"],[36,16,"method"],[37,4,"method"],[37,10,"method"],[37,57,"sameProblem"],[38,17,"zeitgeist"],[38,4,"method"],[38,29,"sameProblem"],[39,17,"lineage"],[39,40,"method"],[40,24,"sameProblem"],[40,29,"sameProblem"],[41,2,"method"],[41,25,"argument"],[41,15,"lineage"],[42,39,"lineage"],[42,17,"sameProblem"],[42,10,"method"],[43,13,"method"],[43,55,"method"],[43,41,"method"],[44,30,"lineage"],[44,24,"zeitgeist"],[44,19,"lineage"],[45,25,"method"],[45,35,"zeitgeist"],[45,15,"argument"],[46,19,"lineage"],[46,9,"argument"],[46,33,"zeitgeist"],[47,22,"sameProblem"],[47,1,"argument"],[47,32,"method"],[48,13,"method"],[48,49,"method"],[48,9,"zeitgeist"],[49,12,"zeitgeist"],[49,11,"argument"],[50,7,"sameProblem"],[50,11,"method"],[50,41,"method"],[51,28,"method"],[51,3,"sameProblem"],[51,46,"zeitgeist"],[52,14,"method"],[52,25,"sameProblem"],[52,44,"lineage"],[53,12,"sameProblem"],[53,34,"method"],[53,7,"argument"],[54,55,"method"],[54,43,"method"],[54,13,"lineage"],[55,13,"lineage"],[55,14,"method"],[56,55,"method"],[56,14,"lineage"],[56,43,"zeitgeist"],[57,19,"zeitgeist"],[58,32,"method"],[58,7,"argument"],[58,2,"argument"],[59,41,"argument"],[59,15,"method"],[59,60,"method"],[60,26,"sameProblem"],[60,40,"sameProblem"],[61,2,"method"],[61,17,"argument"],[61,60,"lineage"],[62,24,"lineage"],[62,52,"method"],[62,44,"method"],[63,61,"lineage"],[63,17,"sameProblem"],[63,6,"zeitgeist"],[64,38,"sameProblem"],[64,60,"zeitgeist"],[64,52,"argument"],[65,14,"lineage"],[65,55,"method"],[65,11,"method"],[66,55,"lineage"],[66,16,"zeitgeist"],[66,65,"method"],[66,14,"method"],[67,43,"method"],[67,53,"sameProblem"],[67,31,"method"],[68,30,"lineage"],[68,44,"zeitgeist"],[68,11,"method"],[69,56,"method"],[69,45,"zeitgeist"],[69,14,"lineage"],[70,18,"method"],[70,37,"method"],[70,50,"sameProblem"],[71,23,"lineage"],[71,68,"sameProblem"],[71,63,"zeitgeist"],[72,44,"method"],[72,36,"method"],[72,1,"sameProblem"],[73,19,"method"],[73,31,"argument"],[73,36,"sameProblem"],[74,11,"argument"],[74,41,"method"],[74,50,"method"],[75,71,"lineage"],[75,30,"sameProblem"],[75,34,"method"],[76,54,"lineage"],[76,65,"zeitgeist"],[76,52,"lineage"],[77,11,"sameProblem"],[77,52,"argument"],[77,50,"lineage"],[78,67,"method"],[78,48,"zeitgeist"],[78,53,"sameProblem"],[79,6,"argument"],[79,80,"lineage"],[79,2,"argument"],[80,81,"method"],[80,11,"argument"],[81,2,"argument"],[82,24,"zeitgeist"],[82,11,"method"],[82,16,"argument"],[83,82,"material"],[83,3,"argument"],[83,9,"argument"],[85,86,"lineage"],[85,1,"sameProblem"],[85,2,"method"],[86,8,"sameProblem"],[86,16,"zeitgeist"],[87,86,"method"],[87,85,"argument"],[87,7,"argument"],[88,16,"lineage"],[88,11,"method"],[88,10,"sameProblem"],[89,88,"method"],[89,87,"zeitgeist"],[89,5,"argument"],[89,7,"sameProblem"],[90,11,"method"],[90,6,"argument"],[90,1,"zeitgeist"],[91,5,"argument"],[91,14,"method"],[92,9,"argument"],[92,3,"argument"],[92,91,"method"],[93,13,"lineage"],[93,10,"sameProblem"],[93,16,"method"],[94,93,"method"],[94,343,"argument"],[95,99,"zeitgeist"],[95,13,"method"],[96,95,"method"],[97,14,"sameProblem"],[97,519,"zeitgeist"],[98,14,"sameProblem"],[98,96,"material"],[98,10,"argument"],[99,7,"method"],[99,13,"argument"],[100,9,"argument"],[100,12,"zeitgeist"],[101,8,"sameProblem"],[101,7,"argument"],[101,11,"zeitgeist"],[101,16,"method"],[103,27,"lineage"],[103,6,"argument"],[104,11,"sameProblem"],[104,16,"method"],[105,13,"argument"],[105,14,"sameProblem"],[106,103,"material"],[106,28,"argument"],[106,6,"sameProblem"],[107,27,"sameProblem"],[107,28,"lineage"],[107,6,"zeitgeist"],[107,108,"method"],[108,10,"material"],[109,30,"lineage"],[109,2,"method"],[109,12,"zeitgeist"],[109,9,"argument"],[110,1,"material"],[110,38,"sameProblem"],[110,27,"zeitgeist"],[110,6,"argument"],[111,12,"zeitgeist"],[111,37,"argument"],[111,9,"method"],[112,113,"zeitgeist"],[112,1,"argument"],[112,5,"argument"],[113,11,"argument"],[113,12,"method"],[114,113,"lineage"],[114,13,"method"],[115,117,"lineage"],[115,6,"argument"],[116,118,"lineage"],[116,44,"method"],[116,13,"argument"],[116,15,"zeitgeist"],[117,3,"argument"],[117,118,"lineage"],[117,16,"argument"],[117,119,"material"],[118,5,"argument"],[118,9,"sameProblem"],[118,7,"argument"],[119,14,"argument"],[119,115,"method"],[119,15,"zeitgeist"],[119,30,"argument"],[120,5,"argument"],[120,48,"sameProblem"],[120,3,"argument"],[121,47,"lineage"],[121,120,"method"],[122,1,"method"],[122,11,"sameProblem"],[122,123,"material"],[122,32,"zeitgeist"],[123,27,"sameProblem"],[123,2,"argument"],[123,124,"lineage"],[124,6,"argument"],[124,28,"zeitgeist"],[124,7,"sameProblem"],[125,54,"lineage"],[125,10,"sameProblem"],[125,1,"material"],[126,125,"lineage"],[126,28,"sameProblem"],[126,7,"argument"],[126,8,"method"],[127,126,"lineage"],[127,37,"argument"],[127,11,"method"],[127,10,"sameProblem"],[128,53,"zeitgeist"],[128,27,"material"],[129,128,"sameProblem"],[129,8,"argument"],[129,28,"zeitgeist"],[130,56,"lineage"],[130,8,"sameProblem"],[130,28,"zeitgeist"],[131,54,"lineage"],[131,55,"argument"],[131,10,"sameProblem"],[132,62,"lineage"],[132,37,"sameProblem"],[132,1,"argument"],[133,34,"material"],[133,63,"sameProblem"],[133,54,"lineage"],[134,27,"zeitgeist"],[134,8,"sameProblem"],[134,2,"material"],[135,38,"sameProblem"],[135,8,"argument"],[135,1,"method"],[136,13,"method"],[136,30,"zeitgeist"],[136,14,"argument"],[137,31,"sameProblem"],[137,3,"method"],[137,27,"zeitgeist"],[137,138,"method"],[138,139,"sameProblem"],[138,140,"argument"],[138,12,"method"],[139,141,"lineage"],[139,3,"argument"],[139,63,"zeitgeist"],[140,12,"zeitgeist"],[140,9,"method"],[140,45,"argument"],[141,32,"method"],[141,36,"material"],[141,30,"zeitgeist"],[142,143,"sameProblem"],[142,13,"zeitgeist"],[142,73,"material"],[143,144,"sameProblem"],[143,63,"zeitgeist"],[143,9,"argument"],[144,45,"argument"],[144,30,"zeitgeist"],[145,10,"sameProblem"],[145,16,"argument"],[145,9,"zeitgeist"],[145,6,"method"],[146,3,"argument"],[146,15,"zeitgeist"],[146,12,"argument"],[147,10,"lineage"],[147,16,"argument"],[147,18,"sameProblem"],[148,3,"zeitgeist"],[148,1,"sameProblem"],[148,45,"argument"],[148,5,"argument"],[149,6,"argument"],[149,2,"method"],[149,56,"lineage"],[149,38,"sameProblem"],[150,1,"argument"],[150,3,"sameProblem"],[150,5,"method"],[151,13,"method"],[151,152,"zeitgeist"],[151,14,"argument"],[151,12,"argument"],[152,14,"lineage"],[152,13,"method"],[152,15,"zeitgeist"],[153,154,"method"],[153,11,"argument"],[153,3,"argument"],[153,7,"sameProblem"],[154,155,"lineage"],[154,14,"argument"],[154,13,"method"],[155,13,"method"],[155,14,"argument"],[155,11,"zeitgeist"],[156,12,"zeitgeist"],[156,157,"argument"],[156,6,"argument"],[156,9,"method"],[157,12,"zeitgeist"],[157,11,"argument"],[157,9,"zeitgeist"],[158,161,"lineage"],[158,12,"zeitgeist"],[158,44,"method"],[158,9,"argument"],[159,12,"zeitgeist"],[159,11,"argument"],[159,41,"method"],[159,45,"lineage"],[160,158,"method"],[160,159,"zeitgeist"],[160,12,"argument"],[160,2,"argument"],[161,5,"argument"],[161,1,"argument"],[161,162,"zeitgeist"],[162,3,"argument"],[162,8,"sameProblem"],[162,12,"method"],[163,12,"zeitgeist"],[163,10,"argument"],[163,24,"argument"],[164,3,"argument"],[164,12,"zeitgeist"],[164,47,"lineage"],[165,44,"lineage"],[165,45,"zeitgeist"],[165,30,"argument"],[166,24,"argument"],[166,12,"zeitgeist"],[166,97,"method"],[167,12,"zeitgeist"],[167,13,"argument"],[167,49,"method"],[168,54,"argument"],[168,14,"method"],[168,13,"sameProblem"],[168,169,"lineage"],[169,61,"lineage"],[169,7,"zeitgeist"],[169,8,"sameProblem"],[169,27,"argument"],[170,7,"method"],[170,24,"argument"],[170,33,"sameProblem"],[170,32,"lineage"],[171,172,"method"],[171,11,"argument"],[171,12,"lineage"],[171,14,"zeitgeist"],[172,3,"argument"],[172,9,"lineage"],[172,13,"argument"],[173,109,"method"],[173,176,"lineage"],[173,12,"argument"],[173,11,"argument"],[175,177,"sameProblem"],[175,173,"material"],[175,3,"argument"],[175,9,"argument"],[176,24,"argument"],[176,13,"method"],[177,109,"material"],[177,5,"argument"],[177,15,"argument"],[178,181,"zeitgeist"],[178,110,"lineage"],[179,178,"lineage"],[179,109,"sameProblem"],[179,14,"method"],[180,179,"sameProblem"],[180,178,"material"],[180,114,"zeitgeist"],[180,9,"argument"],[181,11,"argument"],[181,12,"argument"],[181,32,"sameProblem"],[182,3,"material"],[182,179,"argument"],[182,1,"method"],[182,9,"sameProblem"],[183,1,"argument"],[183,3,"sameProblem"],[183,5,"argument"],[183,78,"argument"],[184,185,"lineage"],[184,13,"sameProblem"],[184,33,"zeitgeist"],[185,29,"method"],[185,100,"argument"],[185,107,"argument"],[186,13,"argument"],[186,14,"method"],[186,92,"argument"],[187,107,"sameProblem"],[187,33,"zeitgeist"],[187,13,"method"],[188,189,"argument"],[188,11,"lineage"],[188,16,"argument"],[188,10,"sameProblem"],[189,190,"method"],[189,14,"zeitgeist"],[189,12,"argument"],[190,5,"argument"],[190,109,"argument"],[191,3,"argument"],[191,14,"zeitgeist"],[191,69,"sameProblem"],[192,128,"method"],[192,109,"argument"],[192,24,"zeitgeist"],[193,11,"method"],[193,16,"argument"],[193,125,"zeitgeist"],[195,196,"sameProblem"],[195,12,"zeitgeist"],[195,9,"argument"],[195,15,"method"],[196,13,"method"],[196,16,"material"],[196,2,"argument"],[197,198,"lineage"],[197,54,"zeitgeist"],[197,27,"sameProblem"],[197,37,"argument"],[198,38,"sameProblem"],[198,1,"method"],[198,7,"argument"],[199,13,"method"],[199,60,"zeitgeist"],[199,14,"sameProblem"],[199,30,"argument"],[200,13,"method"],[200,11,"argument"],[200,12,"zeitgeist"],[200,115,"argument"],[201,200,"lineage"],[201,3,"method"],[201,104,"argument"],[201,109,"sameProblem"],[202,11,"sameProblem"],[202,32,"method"],[202,100,"zeitgeist"],[202,2,"argument"],[203,202,"zeitgeist"],[203,30,"method"],[203,60,"sameProblem"],[203,45,"argument"],[204,54,"sameProblem"],[204,137,"lineage"],[204,56,"zeitgeist"],[204,8,"method"],[205,54,"zeitgeist"],[205,56,"sameProblem"],[205,81,"argument"],[206,1,"argument"],[206,7,"sameProblem"],[206,27,"material"],[206,3,"method"],[207,12,"argument"],[207,11,"argument"],[207,206,"zeitgeist"],[207,15,"method"],[208,149,"lineage"],[208,12,"zeitgeist"],[208,209,"method"],[208,54,"argument"],[209,45,"zeitgeist"],[209,11,"argument"],[213,12,"zeitgeist"],[213,15,"method"],[213,104,"argument"],[214,15,"zeitgeist"],[214,12,"lineage"],[214,109,"argument"],[215,110,"argument"],[215,131,"zeitgeist"],[215,109,"argument"],[215,13,"argument"],[216,13,"method"],[216,159,"zeitgeist"],[216,109,"argument"],[219,220,"lineage"],[219,8,"material"],[219,38,"zeitgeist"],[219,81,"argument"],[220,38,"sameProblem"],[220,1,"argument"],[220,10,"material"],[221,8,"sameProblem"],[221,1,"material"],[221,164,"lineage"],[221,224,"method"],[222,16,"argument"],[222,10,"sameProblem"],[222,83,"zeitgeist"],[222,223,"lineage"],[223,13,"argument"],[223,18,"sameProblem"],[223,225,"zeitgeist"],[224,11,"sameProblem"],[224,32,"argument"],[224,118,"argument"],[225,109,"argument"],[225,156,"zeitgeist"],[225,104,"argument"],[226,8,"sameProblem"],[226,164,"lineage"],[226,6,"argument"],[226,11,"zeitgeist"],[227,228,"lineage"],[227,13,"method"],[227,156,"argument"],[227,104,"argument"],[228,109,"argument"],[228,24,"zeitgeist"],[228,14,"method"],[229,32,"sameProblem"],[229,6,"zeitgeist"],[229,2,"method"],[230,109,"argument"],[230,1,"zeitgeist"],[230,156,"sameProblem"],[230,14,"method"],[231,233,"lineage"],[231,8,"sameProblem"],[231,16,"zeitgeist"],[231,27,"argument"],[232,231,"lineage"],[232,11,"method"],[232,37,"argument"],[232,54,"zeitgeist"],[233,81,"argument"],[233,156,"zeitgeist"],[233,38,"sameProblem"],[234,233,"lineage"],[234,27,"material"],[234,63,"argument"],[234,1,"method"],[235,175,"lineage"],[235,177,"method"],[235,54,"zeitgeist"],[235,27,"sameProblem"],[236,38,"zeitgeist"],[236,8,"sameProblem"],[236,164,"argument"],[236,81,"argument"],[237,2,"argument"],[237,36,"material"],[237,7,"method"],[237,3,"sameProblem"],[238,11,"argument"],[238,32,"sameProblem"],[238,12,"zeitgeist"],[238,118,"argument"],[239,13,"lineage"],[239,14,"argument"],[239,30,"method"],[239,69,"sameProblem"],[241,242,"sameProblem"],[241,109,"argument"],[241,156,"zeitgeist"],[242,243,"sameProblem"],[242,116,"argument"],[243,244,"sameProblem"],[243,115,"method"],[243,169,"zeitgeist"],[244,24,"argument"],[244,16,"zeitgeist"],[244,172,"method"],[245,247,"sameProblem"],[245,249,"method"],[245,186,"zeitgeist"],[245,156,"argument"],[246,245,"lineage"],[246,1,"zeitgeist"],[246,24,"method"],[247,187,"sameProblem"],[247,248,"lineage"],[247,109,"argument"],[247,3,"zeitgeist"],[248,249,"argument"],[248,156,"zeitgeist"],[248,109,"method"],[249,246,"method"],[249,13,"argument"],[249,14,"zeitgeist"],[250,193,"lineage"],[250,156,"zeitgeist"],[250,109,"argument"],[250,251,"sameProblem"],[251,115,"argument"],[251,110,"sameProblem"],[251,13,"method"],[252,12,"zeitgeist"],[252,250,"argument"],[252,45,"method"],[252,3,"argument"],[253,109,"lineage"],[253,193,"lineage"],[253,156,"argument"],[253,116,"method"],[254,5,"method"],[254,16,"argument"],[254,10,"sameProblem"],[254,7,"material"],[255,16,"zeitgeist"],[255,10,"sameProblem"],[255,256,"method"],[255,9,"argument"],[256,83,"sameProblem"],[256,13,"zeitgeist"],[257,11,"sameProblem"],[257,258,"method"],[257,32,"argument"],[257,2,"material"],[258,259,"lineage"],[258,11,"argument"],[258,12,"argument"],[259,120,"material"],[259,3,"sameProblem"],[259,1,"argument"],[260,203,"method"],[260,2,"argument"],[262,13,"lineage"],[262,14,"argument"],[262,15,"zeitgeist"],[262,12,"method"],[263,13,"method"],[263,156,"zeitgeist"],[263,14,"argument"],[264,263,"zeitgeist"],[264,193,"zeitgeist"],[264,109,"argument"],[264,104,"method"],[265,263,"zeitgeist"],[265,156,"sameProblem"],[265,24,"method"],[265,115,"argument"],[266,263,"sameProblem"],[266,14,"argument"],[266,88,"method"],[266,91,"zeitgeist"],[267,264,"zeitgeist"],[267,193,"sameProblem"],[267,109,"method"],[267,156,"zeitgeist"],[268,24,"zeitgeist"],[268,156,"sameProblem"],[268,13,"method"],[270,271,"method"],[270,6,"zeitgeist"],[270,109,"argument"],[271,24,"argument"],[271,3,"argument"],[272,6,"zeitgeist"],[272,24,"method"],[272,156,"sameProblem"],[272,219,"argument"],[273,16,"zeitgeist"],[273,5,"sameProblem"],[273,274,"method"],[273,3,"argument"],[274,109,"argument"],[274,156,"sameProblem"],[274,219,"lineage"],[275,15,"zeitgeist"],[275,13,"method"],[275,11,"argument"],[275,7,"method"],[276,278,"zeitgeist"],[276,15,"zeitgeist"],[276,92,"argument"],[277,107,"lineage"],[277,11,"method"],[277,33,"argument"],[278,88,"argument"],[278,13,"argument"],[279,276,"argument"],[279,12,"zeitgeist"],[279,91,"argument"],[282,283,"lineage"],[282,13,"argument"],[282,14,"argument"],[282,92,"argument"],[283,224,"zeitgeist"],[283,209,"method"],[284,282,"zeitgeist"],[284,14,"argument"],[284,604,"method"],[285,283,"sameProblem"],[285,13,"argument"],[286,287,"zeitgeist"],[286,2,"method"],[286,209,"sameProblem"],[287,231,"lineage"],[287,14,"method"],[287,224,"zeitgeist"],[288,289,"lineage"],[288,11,"sameProblem"],[288,107,"method"],[288,15,"argument"],[289,32,"sameProblem"],[289,206,"method"],[289,60,"zeitgeist"],[289,7,"argument"],[290,286,"zeitgeist"],[290,30,"method"],[290,185,"sameProblem"],[290,13,"argument"],[291,13,"method"],[291,14,"method"],[291,209,"sameProblem"],[291,293,"zeitgeist"],[292,293,"argument"],[292,209,"zeitgeist"],[292,232,"method"],[292,92,"argument"],[293,13,"sameProblem"],[296,242,"lineage"],[296,13,"argument"],[296,14,"argument"],[296,298,"zeitgeist"],[298,209,"lineage"],[298,299,"sameProblem"],[299,109,"material"],[299,12,"method"],[299,14,"argument"],[300,13,"sameProblem"],[300,14,"method"],[300,92,"zeitgeist"],[301,13,"argument"],[301,302,"argument"],[301,92,"argument"],[301,303,"zeitgeist"],[302,88,"argument"],[302,131,"zeitgeist"],[303,91,"method"],[303,228,"zeitgeist"],[304,109,"method"],[304,14,"method"],[304,110,"lineage"],[307,309,"zeitgeist"],[307,249,"sameProblem"],[307,247,"argument"],[307,14,"method"],[308,14,"lineage"],[308,13,"method"],[308,91,"argument"],[308,92,"method"],[309,13,"argument"],[309,250,"argument"],[310,38,"argument"],[310,2,"method"],[310,39,"zeitgeist"],[310,12,"argument"],[311,6,"sameProblem"],[311,38,"material"],[311,8,"sameProblem"],[311,164,"lineage"],[312,30,"argument"],[312,310,"method"],[312,9,"argument"],[312,15,"zeitgeist"],[313,11,"method"],[313,2,"argument"],[313,314,"material"],[313,13,"method"],[314,312,"zeitgeist"],[314,107,"method"],[314,33,"sameProblem"],[315,2,"argument"],[315,264,"material"],[315,199,"sameProblem"],[315,9,"argument"],[316,315,"material"],[316,2,"argument"],[316,263,"zeitgeist"],[316,15,"argument"],[317,5,"sameProblem"],[317,315,"method"],[317,11,"argument"],[317,16,"argument"],[318,3,"sameProblem"],[318,317,"method"],[318,5,"argument"],[318,7,"sameProblem"],[319,2,"argument"],[319,318,"material"],[319,1,"argument"],[319,24,"sameProblem"],[320,5,"argument"],[320,2,"method"],[320,9,"argument"],[321,107,"method"],[321,11,"argument"],[321,2,"zeitgeist"],[322,13,"argument"],[322,24,"method"],[322,14,"zeitgeist"],[323,321,"material"],[323,9,"argument"],[323,5,"sameProblem"],[324,1,"argument"],[324,3,"method"],[324,15,"zeitgeist"],[326,329,"material"],[326,2,"argument"],[326,15,"method"],[326,600,"method"],[327,38,"argument"],[327,7,"method"],[327,6,"sameProblem"],[328,38,"zeitgeist"],[328,65,"sameProblem"],[328,3,"argument"],[329,2,"method"],[329,120,"argument"],[329,632,"argument"],[330,15,"argument"],[330,11,"sameProblem"],[330,13,"argument"],[331,12,"argument"],[331,11,"sameProblem"],[331,118,"lineage"],[332,7,"zeitgeist"],[332,2,"argument"],[332,15,"method"],[333,14,"argument"],[333,13,"method"],[333,231,"material"],[334,335,"sameProblem"],[334,336,"lineage"],[334,38,"zeitgeist"],[334,12,"argument"],[335,336,"material"],[335,100,"argument"],[335,104,"zeitgeist"],[336,38,"argument"],[336,15,"zeitgeist"],[337,336,"lineage"],[337,11,"sameProblem"],[337,2,"method"],[337,15,"argument"],[338,38,"zeitgeist"],[338,65,"sameProblem"],[338,287,"zeitgeist"],[338,164,"sameProblem"],[339,63,"sameProblem"],[339,287,"zeitgeist"],[339,64,"sameProblem"],[339,285,"zeitgeist"],[340,13,"method"],[340,15,"zeitgeist"],[340,14,"argument"],[340,30,"sameProblem"],[341,11,"method"],[341,107,"sameProblem"],[341,33,"zeitgeist"],[341,2,"argument"],[342,27,"lineage"],[342,12,"argument"],[342,6,"sameProblem"],[342,1,"material"],[343,6,"argument"],[343,7,"sameProblem"],[343,12,"zeitgeist"],[344,2,"argument"],[344,11,"sameProblem"],[344,9,"zeitgeist"],[344,5,"method"],[345,5,"sameProblem"],[345,7,"argument"],[345,3,"method"],[345,16,"zeitgeist"],[346,1,"sameProblem"],[346,2,"argument"],[346,73,"material"],[347,56,"lineage"],[347,8,"sameProblem"],[347,81,"argument"],[347,7,"zeitgeist"],[348,3,"argument"],[348,7,"sameProblem"],[348,9,"argument"],[348,109,"lineage"],[349,37,"sameProblem"],[349,36,"argument"],[349,63,"method"],[349,15,"zeitgeist"],[350,109,"argument"],[350,351,"method"],[350,12,"zeitgeist"],[350,352,"sameProblem"],[351,5,"argument"],[351,3,"argument"],[351,9,"zeitgeist"],[352,13,"method"],[352,107,"argument"],[352,32,"zeitgeist"],[353,115,"argument"],[353,104,"method"],[353,15,"zeitgeist"],[353,350,"lineage"],[354,120,"lineage"],[354,3,"sameProblem"],[354,277,"method"],[354,16,"argument"],[355,65,"sameProblem"],[355,7,"lineage"],[355,70,"argument"],[356,277,"lineage"],[356,38,"argument"],[356,8,"sameProblem"],[357,83,"argument"],[357,15,"method"],[357,16,"zeitgeist"],[358,11,"method"],[358,107,"sameProblem"],[358,5,"argument"],[359,11,"sameProblem"],[359,3,"material"],[359,12,"argument"],[360,2,"argument"],[360,38,"sameProblem"],[360,81,"argument"],[360,107,"method"],[361,12,"method"],[361,9,"argument"],[361,8,"sameProblem"],[361,13,"method"],[362,38,"sameProblem"],[362,11,"method"],[362,7,"argument"],[362,5,"material"],[363,81,"sameProblem"],[363,10,"zeitgeist"],[363,1,"method"],[363,11,"argument"],[364,109,"method"],[364,104,"zeitgeist"],[365,13,"method"],[365,14,"argument"],[365,100,"zeitgeist"],[366,12,"zeitgeist"],[366,131,"argument"],[366,9,"method"],[367,11,"method"],[367,81,"argument"],[367,364,"zeitgeist"],[368,367,"sameProblem"],[368,26,"zeitgeist"],[368,81,"argument"],[369,3,"material"],[369,12,"zeitgeist"],[369,15,"argument"],[369,370,"zeitgeist"],[370,9,"argument"],[370,5,"sameProblem"],[370,2,"method"],[371,69,"sameProblem"],[371,54,"zeitgeist"],[371,12,"argument"],[371,109,"method"],[372,12,"argument"],[372,15,"method"],[372,2,"argument"],[372,36,"material"],[373,70,"sameProblem"],[373,370,"method"],[373,3,"argument"],[373,9,"argument"],[374,12,"zeitgeist"],[374,2,"argument"],[374,9,"method"],[374,15,"zeitgeist"],[375,374,"lineage"],[375,45,"argument"],[375,39,"zeitgeist"],[375,260,"method"],[376,375,"lineage"],[376,149,"argument"],[376,262,"zeitgeist"],[376,274,"method"],[377,376,"lineage"],[377,283,"zeitgeist"],[377,327,"method"],[378,377,"lineage"],[378,150,"argument"],[378,328,"zeitgeist"],[378,135,"method"],[379,331,"lineage"],[379,12,"argument"],[379,15,"zeitgeist"],[379,262,"method"],[380,3,"argument"],[380,15,"zeitgeist"],[380,109,"method"],[381,10,"sameProblem"],[381,100,"argument"],[381,273,"zeitgeist"],[381,5,"method"],[382,383,"material"],[382,3,"argument"],[382,16,"method"],[382,9,"argument"],[383,5,"sameProblem"],[383,7,"method"],[383,1,"argument"],[385,9,"argument"],[385,2,"method"],[385,100,"zeitgeist"],[386,385,"lineage"],[386,30,"method"],[386,60,"zeitgeist"],[387,15,"argument"],[387,11,"method"],[387,13,"zeitgeist"],[388,387,"method"],[388,38,"argument"],[388,2,"sameProblem"],[389,327,"method"],[389,13,"argument"],[389,15,"zeitgeist"],[390,10,"sameProblem"],[390,16,"method"],[390,15,"argument"],[391,88,"sameProblem"],[391,12,"zeitgeist"],[391,91,"argument"],[393,250,"zeitgeist"],[393,109,"argument"],[393,104,"lineage"],[394,15,"method"],[394,135,"material"],[394,262,"argument"],[395,14,"lineage"],[395,13,"method"],[395,91,"argument"],[396,395,"zeitgeist"],[396,92,"lineage"],[396,88,"method"],[397,13,"zeitgeist"],[397,24,"method"],[397,14,"argument"],[397,118,"argument"],[398,352,"lineage"],[398,92,"lineage"],[398,13,"method"],[398,14,"argument"],[399,16,"sameProblem"],[399,166,"zeitgeist"],[399,168,"argument"],[400,69,"sameProblem"],[400,135,"zeitgeist"],[400,15,"method"],[400,350,"method"],[401,13,"method"],[401,14,"method"],[401,33,"argument"],[401,107,"zeitgeist"],[403,14,"zeitgeist"],[403,13,"method"],[404,11,"argument"],[404,12,"zeitgeist"],[404,2,"method"],[406,3,"argument"],[406,9,"sameProblem"],[406,404,"zeitgeist"],[407,9,"argument"],[407,2,"method"],[407,408,"material"],[407,260,"zeitgeist"],[408,3,"argument"],[408,363,"lineage"],[408,361,"zeitgeist"],[409,314,"method"],[409,1,"argument"],[409,11,"method"],[410,63,"sameProblem"],[410,37,"argument"],[410,411,"zeitgeist"],[410,12,"argument"],[411,7,"argument"],[411,6,"sameProblem"],[411,24,"method"],[412,9,"argument"],[412,2,"method"],[412,12,"zeitgeist"],[412,11,"argument"],[413,109,"argument"],[413,303,"lineage"],[413,308,"method"],[414,413,"method"],[414,104,"argument"],[414,189,"method"],[415,38,"argument"],[415,2,"method"],[415,9,"sameProblem"],[415,12,"zeitgeist"],[416,415,"method"],[416,45,"argument"],[416,275,"zeitgeist"],[416,3,"material"],[417,8,"sameProblem"],[417,164,"material"],[417,38,"zeitgeist"],[417,418,"argument"],[418,2,"method"],[418,9,"argument"],[418,361,"zeitgeist"],[419,9,"zeitgeist"],[419,363,"lineage"],[419,12,"method"],[420,16,"argument"],[420,10,"sameProblem"],[420,24,"method"],[420,421,"lineage"],[421,318,"method"],[421,13,"zeitgeist"],[421,83,"sameProblem"],[422,424,"lineage"],[422,377,"method"],[422,10,"sameProblem"],[422,24,"argument"],[423,424,"lineage"],[423,16,"method"],[423,422,"zeitgeist"],[423,13,"argument"],[424,318,"method"],[424,3,"argument"],[424,79,"sameProblem"],[424,9,"argument"],[425,3,"material"],[425,5,"sameProblem"],[425,24,"method"],[425,7,"zeitgeist"],[426,11,"sameProblem"],[426,32,"argument"],[426,107,"method"],[426,24,"zeitgeist"],[427,11,"sameProblem"],[427,12,"zeitgeist"],[427,2,"method"],[427,10,"material"],[428,38,"argument"],[428,2,"method"],[428,1,"sameProblem"],[428,3,"zeitgeist"],[429,430,"zeitgeist"],[429,12,"method"],[429,9,"argument"],[429,92,"argument"],[430,13,"method"],[430,15,"argument"],[430,24,"material"],[431,387,"lineage"],[431,12,"zeitgeist"],[431,9,"argument"],[431,29,"method"],[432,387,"zeitgeist"],[432,433,"method"],[432,92,"argument"],[433,13,"method"],[433,24,"argument"],[433,14,"argument"],[433,15,"zeitgeist"],[434,432,"zeitgeist"],[434,15,"method"],[434,13,"sameProblem"],[434,387,"zeitgeist"],[435,431,"lineage"],[435,9,"method"],[435,131,"zeitgeist"],[436,434,"lineage"],[436,387,"method"],[436,131,"zeitgeist"],[437,13,"argument"],[437,14,"argument"],[437,604,"argument"],[438,398,"lineage"],[438,13,"argument"],[438,14,"argument"],[439,438,"method"],[439,100,"argument"],[439,9,"argument"],[440,441,"method"],[440,13,"argument"],[440,209,"zeitgeist"],[441,14,"argument"],[442,440,"zeitgeist"],[442,231,"lineage"],[442,13,"argument"],[443,209,"argument"],[443,250,"method"],[443,13,"argument"],[444,443,"lineage"],[444,185,"method"],[444,14,"argument"],[445,444,"material"],[445,236,"sameProblem"],[445,14,"method"],[446,445,"material"],[446,403,"zeitgeist"],[446,231,"argument"],[447,24,"zeitgeist"],[447,13,"method"],[447,14,"argument"],[447,92,"lineage"],[448,449,"zeitgeist"],[448,13,"method"],[448,14,"argument"],[448,92,"argument"],[449,258,"sameProblem"],[449,250,"argument"],[450,448,"argument"],[450,88,"sameProblem"],[450,251,"zeitgeist"],[450,387,"zeitgeist"],[451,13,"lineage"],[451,24,"zeitgeist"],[451,14,"method"],[451,11,"method"],[452,448,"lineage"],[452,232,"sameProblem"],[452,248,"zeitgeist"],[452,209,"argument"],[453,10,"lineage"],[453,54,"argument"],[453,1,"sameProblem"],[454,27,"lineage"],[454,26,"lineage"],[454,8,"zeitgeist"],[454,1,"argument"],[455,52,"sameProblem"],[455,32,"zeitgeist"],[455,54,"material"],[456,11,"sameProblem"],[456,6,"method"],[456,12,"argument"],[456,32,"zeitgeist"],[457,137,"lineage"],[457,54,"zeitgeist"],[457,12,"material"],[458,1,"sameProblem"],[458,3,"zeitgeist"],[458,274,"argument"],[458,15,"material"],[459,11,"argument"],[459,310,"zeitgeist"],[459,171,"argument"],[460,2,"zeitgeist"],[460,5,"method"],[463,15,"zeitgeist"],[463,13,"material"],[463,189,"method"],[464,10,"argument"],[464,12,"zeitgeist"],[464,231,"argument"],[465,14,"argument"],[465,13,"method"],[466,465,"argument"],[466,12,"zeitgeist"],[466,208,"zeitgeist"],[469,12,"argument"],[469,109,"method"],[469,521,"method"],[470,472,"argument"],[470,9,"sameProblem"],[470,15,"argument"],[470,104,"argument"],[471,4,"sameProblem"],[471,8,"argument"],[471,500,"method"],[472,12,"zeitgeist"],[472,9,"method"],[472,471,"lineage"],[474,20,"material"],[474,9,"argument"],[474,6,"zeitgeist"],[475,6,"sameProblem"],[475,474,"argument"],[475,15,"method"],[476,7,"argument"],[476,11,"method"],[476,6,"sameProblem"],[477,15,"method"],[477,16,"argument"],[477,25,"lineage"],[478,16,"zeitgeist"],[478,14,"method"],[478,13,"argument"],[479,24,"method"],[479,18,"argument"],[479,565,"method"],[480,26,"lineage"],[480,11,"argument"],[480,7,"material"],[481,16,"argument"],[481,9,"sameProblem"],[481,15,"method"],[482,482,"method"],[482,4,"argument"],[482,6,"sameProblem"],[487,6,"zeitgeist"],[487,11,"argument"],[487,604,"argument"],[491,359,"method"],[491,16,"argument"],[491,10,"sameProblem"],[492,496,"zeitgeist"],[492,18,"material"],[492,24,"method"],[493,12,"argument"],[493,15,"method"],[493,5,"argument"],[494,495,"lineage"],[494,16,"argument"],[494,13,"method"],[495,496,"lineage"],[495,10,"sameProblem"],[495,14,"method"],[496,15,"argument"],[496,16,"sameProblem"],[496,13,"zeitgeist"],[497,49,"lineage"],[497,498,"sameProblem"],[497,528,"argument"],[498,48,"argument"],[498,96,"lineage"],[499,500,"argument"],[499,10,"zeitgeist"],[499,16,"sameProblem"],[500,50,"lineage"],[500,9,"zeitgeist"],[501,13,"method"],[501,502,"sameProblem"],[501,14,"zeitgeist"],[501,16,"argument"],[502,16,"method"],[502,10,"zeitgeist"],[502,50,"lineage"],[503,502,"material"],[503,504,"method"],[503,15,"zeitgeist"],[504,13,"argument"],[504,12,"argument"],[505,503,"argument"],[505,504,"zeitgeist"],[505,14,"method"],[505,11,"sameProblem"],[506,58,"lineage"],[506,14,"argument"],[506,13,"method"],[507,508,"lineage"],[507,10,"sameProblem"],[507,49,"argument"],[508,509,"sameProblem"],[508,96,"zeitgeist"],[508,10,"sameProblem"],[509,15,"method"],[509,27,"zeitgeist"],[510,63,"lineage"],[510,49,"sameProblem"],[510,52,"zeitgeist"],[511,65,"sameProblem"],[511,15,"method"],[511,10,"argument"],[512,48,"lineage"],[512,16,"argument"],[512,13,"method"],[513,50,"sameProblem"],[513,512,"method"],[513,7,"material"],[514,6,"sameProblem"],[514,37,"material"],[514,13,"method"],[515,516,"method"],[515,7,"argument"],[515,15,"material"],[515,609,"method"],[516,193,"zeitgeist"],[516,5,"sameProblem"],[516,153,"sameProblem"],[517,75,"lineage"],[517,518,"zeitgeist"],[517,11,"method"],[518,12,"zeitgeist"],[518,42,"sameProblem"],[518,15,"argument"],[519,37,"method"],[519,35,"argument"],[519,175,"argument"],[520,15,"argument"],[520,50,"method"],[520,9,"sameProblem"],[521,80,"method"],[521,9,"argument"],[521,611,"argument"],[522,15,"argument"],[522,45,"method"],[522,592,"method"],[523,12,"argument"],[523,5,"zeitgeist"],[523,21,"sameProblem"],[524,11,"sameProblem"],[524,55,"zeitgeist"],[524,10,"material"],[525,526,"lineage"],[525,6,"argument"],[525,2,"zeitgeist"],[525,50,"material"],[526,11,"sameProblem"],[526,7,"argument"],[526,417,"lineage"],[527,10,"method"],[527,525,"zeitgeist"],[527,16,"argument"],[527,49,"lineage"],[528,71,"sameProblem"],[528,13,"method"],[529,11,"method"],[529,73,"material"],[529,7,"zeitgeist"],[530,8,"sameProblem"],[530,1,"zeitgeist"],[530,7,"argument"],[530,531,"lineage"],[531,6,"argument"],[531,11,"method"],[531,12,"zeitgeist"],[532,87,"sameProblem"],[532,6,"lineage"],[532,50,"material"],[533,88,"lineage"],[533,16,"argument"],[533,55,"zeitgeist"],[533,528,"argument"],[534,147,"sameProblem"],[534,16,"argument"],[534,2,"method"],[534,85,"zeitgeist"],[535,20,"material"],[535,5,"argument"],[535,9,"method"],[536,55,"zeitgeist"],[536,20,"material"],[536,50,"argument"],[536,105,"lineage"],[537,540,"sameProblem"],[537,12,"zeitgeist"],[537,14,"argument"],[537,607,"method"],[538,536,"lineage"],[538,12,"zeitgeist"],[538,18,"argument"],[539,11,"argument"],[539,538,"method"],[539,6,"zeitgeist"],[540,73,"material"],[540,50,"zeitgeist"],[540,594,"lineage"],[541,95,"zeitgeist"],[541,106,"sameProblem"],[541,50,"material"],[542,543,"sameProblem"],[542,4,"method"],[542,20,"argument"],[543,100,"sameProblem"],[543,50,"material"],[543,87,"argument"],[544,9,"zeitgeist"],[544,12,"method"],[544,55,"argument"],[545,106,"sameProblem"],[545,55,"zeitgeist"],[545,20,"method"],[546,162,"lineage"],[546,104,"sameProblem"],[546,1,"argument"],[547,12,"zeitgeist"],[547,120,"method"],[547,9,"argument"],[548,50,"material"],[548,15,"zeitgeist"],[549,548,"lineage"],[549,45,"method"],[549,13,"argument"],[550,548,"lineage"],[550,3,"argument"],[550,549,"method"],[551,123,"lineage"],[551,45,"method"],[551,9,"argument"],[552,551,"method"],[552,11,"argument"],[552,6,"sameProblem"],[553,13,"method"],[553,552,"lineage"],[553,15,"zeitgeist"],[554,553,"lineage"],[554,7,"method"],[554,45,"sameProblem"],[555,127,"lineage"],[555,7,"argument"],[555,129,"zeitgeist"],[556,11,"argument"],[556,4,"method"],[556,5,"zeitgeist"],[557,556,"zeitgeist"],[557,45,"method"],[557,18,"argument"],[558,12,"zeitgeist"],[558,9,"argument"],[558,16,"argument"],[559,140,"lineage"],[559,12,"zeitgeist"],[559,9,"argument"],[559,16,"argument"],[560,37,"material"],[560,130,"method"],[560,24,"argument"],[560,6,"sameProblem"],[561,15,"argument"],[561,7,"method"],[561,13,"sameProblem"],[563,37,"material"],[563,11,"method"],[563,13,"zeitgeist"],[564,20,"material"],[564,9,"argument"],[565,564,"method"],[565,93,"sameProblem"],[565,15,"zeitgeist"],[566,2,"method"],[566,7,"argument"],[566,128,"argument"],[567,565,"sameProblem"],[567,6,"method"],[567,16,"zeitgeist"],[568,569,"argument"],[568,93,"sameProblem"],[568,7,"argument"],[568,147,"lineage"],[569,570,"method"],[569,90,"zeitgeist"],[569,12,"argument"],[570,571,"sameProblem"],[570,16,"argument"],[570,10,"zeitgeist"],[571,15,"argument"],[571,149,"lineage"],[571,37,"material"],[572,72,"lineage"],[572,146,"material"],[572,37,"zeitgeist"],[573,147,"argument"],[573,7,"sameProblem"],[573,126,"argument"],[574,11,"method"],[574,575,"lineage"],[574,45,"sameProblem"],[575,153,"material"],[575,16,"argument"],[576,159,"lineage"],[576,7,"argument"],[576,578,"argument"],[576,147,"zeitgeist"],[577,578,"method"],[577,579,"sameProblem"],[577,13,"zeitgeist"],[578,12,"method"],[578,9,"sameProblem"],[578,5,"zeitgeist"],[579,13,"argument"],[579,42,"zeitgeist"],[579,578,"lineage"],[580,164,"lineage"],[580,147,"argument"],[580,9,"sameProblem"],[581,7,"argument"],[581,13,"method"],[581,76,"zeitgeist"],[582,147,"sameProblem"],[582,20,"material"],[582,24,"zeitgeist"],[583,147,"argument"],[583,164,"zeitgeist"],[583,9,"sameProblem"],[584,170,"lineage"],[584,586,"method"],[584,50,"zeitgeist"],[584,565,"method"],[585,37,"argument"],[585,49,"material"],[585,15,"method"],[586,15,"zeitgeist"],[586,73,"material"],[586,610,"material"],[587,7,"zeitgeist"],[587,6,"method"],[587,16,"sameProblem"],[588,9,"argument"],[588,6,"sameProblem"],[588,1,"method"],[589,7,"argument"],[589,11,"sameProblem"],[589,172,"argument"],[589,608,"argument"],[590,11,"lineage"],[590,7,"argument"],[590,282,"method"],[590,96,"argument"],[591,1,"argument"],[591,3,"method"],[591,55,"method"],[592,9,"zeitgeist"],[592,6,"argument"],[592,15,"argument"],[592,601,"method"],[593,3,"lineage"],[593,10,"method"],[593,535,"lineage"],[594,4,"argument"],[594,3,"sameProblem"],[594,14,"argument"],[595,10,"method"],[595,471,"zeitgeist"],[595,587,"lineage"],[596,31,"sameProblem"],[596,11,"method"],[596,569,"material"],[597,3,"method"],[597,9,"zeitgeist"],[597,164,"argument"],[597,617,"method"],[598,9,"lineage"],[598,140,"method"],[598,172,"argument"],[599,6,"argument"],[599,11,"method"],[599,627,"method"],[599,606,"argument"],[600,4,"argument"],[600,7,"sameProblem"],[600,282,"method"],[600,626,"zeitgeist"],[601,10,"argument"],[601,549,"method"],[601,15,"argument"],[602,2,"argument"],[602,592,"method"],[602,45,"argument"],[603,9,"zeitgeist"],[603,55,"zeitgeist"],[603,592,"zeitgeist"],[604,4,"argument"],[604,7,"sameProblem"],[604,448,"method"],[605,9,"argument"],[605,54,"method"],[605,153,"material"],[606,4,"argument"],[606,7,"sameProblem"],[606,435,"method"],[606,172,"argument"],[607,4,"argument"],[607,1,"sameProblem"],[607,186,"method"],[608,6,"argument"],[608,11,"lineage"],[608,435,"zeitgeist"],[608,590,"method"],[609,2,"method"],[609,21,"argument"],[609,231,"method"],[610,2,"method"],[610,115,"argument"],[610,605,"material"],[611,6,"sameProblem"],[611,1,"lineage"],[611,65,"method"],[611,93,"argument"],[612,6,"sameProblem"],[612,88,"material"],[612,595,"lineage"],[613,2,"method"],[613,175,"material"],[614,140,"method"],[614,617,"argument"],[615,310,"method"],[615,613,"sameProblem"],[615,606,"method"],[616,4,"argument"],[616,96,"argument"],[616,14,"method"],[617,2,"argument"],[617,1,"sameProblem"],[617,56,"method"],[618,9,"lineage"],[618,100,"method"],[618,541,"method"],[619,6,"sameProblem"],[619,622,"argument"],[619,598,"lineage"],[620,4,"argument"],[620,15,"zeitgeist"],[620,603,"method"],[621,2,"method"],[621,55,"method"],[622,6,"argument"],[622,65,"argument"],[622,565,"method"],[623,1,"argument"],[623,439,"method"],[623,626,"zeitgeist"],[624,310,"method"],[624,617,"sameProblem"],[624,614,"zeitgeist"],[626,4,"argument"],[626,448,"argument"],[626,447,"method"],[627,7,"argument"],[627,178,"argument"],[628,4,"argument"],[628,56,"argument"],[628,573,"argument"],[629,13,"argument"],[629,15,"method"],[630,10,"sameProblem"],[630,65,"method"],[630,93,"argument"],[631,6,"method"],[631,14,"method"],[632,1,"lineage"],[632,590,"method"],[632,593,"method"],[633,4,"argument"],[633,603,"method"],[633,13,"argument"],[634,13,"method"],[634,15,"method"],[634,448,"zeitgeist"],[635,7,"sameProblem"],[635,121,"material"],[636,2,"method"],[636,14,"method"],[636,21,"material"]]};

const DISC_COLORS = {
  Product:"#C4A882", Furniture:"#7BA68C", Graphic:"#8BA4B8", Lighting:"#D4B896",
  Architecture:"#9BB0A0", Typography:"#A8B8C8", Textile:"#C4A08A", Transport:"#7BAAB8",
  Ceramic:"#B8A88C", Glass:"#8CB8A8", Metalwork:"#A898B0", Digital:"#8898B8",
  Fashion:"#B898A8", Systems:"#8CA898"
};
const TYPE_COLORS = {
  argument:"#C47050", lineage:"#6BA080", material:"#80A870",
  sameProblem:"#7090A0", zeitgeist:"#908878", method:"#8A9A8A"
};

function NetworkCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const stateRef = useRef({
    nodes: [], edges: [], adj: new Map(), nodeMap: new Map(),
    tx: 0, ty: 0, scale: 1, dragging: false, dragX: 0, dragY: 0,
    hovered: null, selected: null, simSteps: 0
  });
  const [panelNode, setPanelNode] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.parentElement.clientWidth;
    const H = canvas.parentElement.clientHeight;
    canvas.width = W; canvas.height = H;

    const S = stateRef.current;
    S.nodes = GRAPH_DATA.n.map(n => ({
      id: n[0], t: n[1], disc: n[2], nc: n[3], y: n[4], designer: n[5] || '',
      x: W/2 + (Math.random()-0.5)*W*0.7,
      y: H/2 + (Math.random()-0.5)*H*0.7,
      vx: 0, vy: 0
    }));
    S.nodeMap = new Map(S.nodes.map(n => [n.id, n]));
    S.edges = GRAPH_DATA.e.filter(e => S.nodeMap.has(e[0]) && S.nodeMap.has(e[1])).map(e => ({
      source: S.nodeMap.get(e[0]), target: S.nodeMap.get(e[1]), type: e[2]
    }));
    S.adj = new Map();
    S.edges.forEach(e => {
      const sid = e.source.id, tid = e.target.id;
      if (!S.adj.has(sid)) S.adj.set(sid, []);
      if (!S.adj.has(tid)) S.adj.set(tid, []);
      S.adj.get(sid).push(tid);
      S.adj.get(tid).push(sid);
    });

    function tick() {
      const nodes = S.nodes, edges = S.edges;
      for (const n of nodes) {
        n.vx += (W/2 - n.x) * 0.0003;
        n.vy += (H/2 - n.y) * 0.0003;
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i+1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          let dx = b.x-a.x, dy = b.y-a.y;
          let dist = Math.sqrt(dx*dx+dy*dy) || 1;
          if (dist > 250) continue;
          const f = -12/(dist*dist);
          const fx = dx/dist*f, fy = dy/dist*f;
          a.vx += fx; a.vy += fy; b.vx -= fx; b.vy -= fy;
        }
      }
      for (const e of edges) {
        const dx = e.target.x-e.source.x, dy = e.target.y-e.source.y;
        const dist = Math.sqrt(dx*dx+dy*dy) || 1;
        const f = (dist-55)*0.003;
        const fx = dx/dist*f, fy = dy/dist*f;
        e.source.vx += fx; e.source.vy += fy;
        e.target.vx -= fx; e.target.vy -= fy;
      }
      for (const n of nodes) {
        n.vx *= 0.85; n.vy *= 0.85;
        n.x += n.vx; n.y += n.vy;
      }
    }

    function draw() {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#1E2228'; ctx.fillRect(0, 0, W, H);
      ctx.save();
      ctx.translate(S.tx, S.ty); ctx.scale(S.scale, S.scale);

      const activeId = (S.selected || S.hovered)?.id;
      const nb = activeId ? new Set(S.adj.get(activeId) || []) : null;

      for (const e of S.edges) {
        const sid = e.source.id, tid = e.target.id;
        const isActive = activeId && (sid === activeId || tid === activeId);
        if (activeId && !isActive) { ctx.globalAlpha = 0.02; ctx.strokeStyle = '#444'; }
        else if (isActive) { ctx.globalAlpha = 0.65; ctx.strokeStyle = TYPE_COLORS[e.type] || '#888'; }
        else { ctx.globalAlpha = 0.07; ctx.strokeStyle = '#667'; }
        ctx.lineWidth = isActive ? 1.5 : 0.4;
        ctx.beginPath(); ctx.moveTo(e.source.x, e.source.y);
        ctx.lineTo(e.target.x, e.target.y); ctx.stroke();
      }

      for (const n of S.nodes) {
        const r = Math.sqrt(n.nc)*2.5+3;
        const isActive = n.id === activeId;
        const isNb = nb?.has(n.id);
        const dimmed = activeId && !isActive && !isNb;
        ctx.globalAlpha = dimmed ? 0.06 : isActive ? 1 : isNb ? 0.85 : 0.5;
        ctx.fillStyle = DISC_COLORS[n.disc] || '#999';
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI*2); ctx.fill();
        if (isActive) {
          ctx.globalAlpha = 0.35; ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();
          ctx.globalAlpha = 0.12; ctx.beginPath(); ctx.arc(n.x, n.y, r+8, 0, Math.PI*2); ctx.fill();
        }
        if ((r > 7 && S.scale > 0.5) || isActive || isNb) {
          ctx.globalAlpha = dimmed ? 0.04 : isActive ? 1 : isNb ? 0.65 : 0.25;
          ctx.fillStyle = '#E8E4DC';
          ctx.font = (isActive ? 11 : 9) + 'px -apple-system, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(n.t.slice(0, 28), n.x, n.y - r - 4);
        }
      }
      ctx.restore(); ctx.globalAlpha = 1;
    }

    function simulate() {
      if (S.simSteps < 400) {
        for (let i = 0; i < 3; i++) tick();
        S.simSteps++;
        draw();
        animRef.current = requestAnimationFrame(simulate);
      }
    }
    simulate();

    // Events
    const onWheel = (e) => {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 0.92 : 1.08;
      const ns = Math.max(0.15, Math.min(6, S.scale * factor));
      S.tx = e.offsetX - (e.offsetX - S.tx) * ns / S.scale;
      S.ty = e.offsetY - (e.offsetY - S.ty) * ns / S.scale;
      S.scale = ns; draw();
    };
    const onDown = (e) => { S.dragging = true; S.dragX = e.offsetX; S.dragY = e.offsetY; };
    const onMove = (e) => {
      if (S.dragging) {
        S.tx += e.offsetX - S.dragX; S.ty += e.offsetY - S.dragY;
        S.dragX = e.offsetX; S.dragY = e.offsetY; draw();
      } else {
        const mx = (e.offsetX - S.tx)/S.scale, my = (e.offsetY - S.ty)/S.scale;
        let best = null, bestD = 25/S.scale;
        for (const n of S.nodes) {
          const dist = Math.sqrt((n.x-mx)**2 + (n.y-my)**2);
          if (dist < bestD) { best = n; bestD = dist; }
        }
        if (best !== S.hovered) { S.hovered = best; draw(); setPanelNode(S.selected || best); }
        canvas.style.cursor = best ? 'pointer' : 'grab';
      }
    };
    const onUp = () => { S.dragging = false; };
    const onClick = (e) => {
      const mx = (e.offsetX - S.tx)/S.scale, my = (e.offsetY - S.ty)/S.scale;
      let best = null, bestD = 25/S.scale;
      for (const n of S.nodes) {
        const dist = Math.sqrt((n.x-mx)**2 + (n.y-my)**2);
        if (dist < bestD) { best = n; bestD = dist; }
      }
      S.selected = (S.selected?.id === best?.id) ? null : best;
      draw(); setPanelNode(S.selected);
    };

    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('mousedown', onDown);
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseup', onUp);
    canvas.addEventListener('click', onClick);

    const onResize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
      draw();
    };
    window.addEventListener('resize', onResize);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('mousedown', onDown);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseup', onUp);
      canvas.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const S = stateRef.current;
  const neighbors = panelNode ? (S.adj.get(panelNode.id) || []).map(id => S.nodeMap.get(id)).filter(Boolean) : [];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', background: '#1E2228', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />

      <div style={{ position: 'absolute', top: 16, left: 20, pointerEvents: 'none' }}>
        <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#666', marginTop: '36px' }}>
          {S.nodes.length} objects · {S.edges.length} connections
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 16, left: 20, pointerEvents: 'none' }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', maxWidth: '500px' }}>
          {Object.entries(DISC_COLORS).filter(([k]) => S.nodes.some(n => n.disc === k)).map(([d, c]) => (
            <span key={d} style={{ fontSize: '8px', color: '#666', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: c, opacity: 0.7, display: 'inline-block' }} />{d}
            </span>
          ))}
        </div>
      </div>

      {!panelNode && (
        <div style={{ position: 'absolute', bottom: 16, right: 20, pointerEvents: 'none', fontSize: '10px', color: '#555', textAlign: 'right', lineHeight: 1.8 }}>
          Scroll to zoom · Drag to pan · Hover to explore · Click to select
        </div>
      )}

      {panelNode && (
        <div style={{ position: 'absolute', top: 16, right: 20, width: 260, background: 'rgba(30,34,40,0.92)', border: '1px solid #333', padding: '14px', backdropFilter: 'blur(8px)' }}>
          <div style={{ fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: DISC_COLORS[panelNode.disc], fontWeight: 600, marginBottom: '5px' }}>{panelNode.disc} · {panelNode.y}</div>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '17px', color: '#E8E4DC', lineHeight: 1.2, marginBottom: '4px' }}>{panelNode.t}</div>
          <div style={{ fontSize: '11px', color: '#999', marginBottom: '6px' }}>{panelNode.designer}</div>
          <div style={{ fontSize: '10px', color: '#888', marginBottom: '6px' }}>{panelNode.nc} outgoing · {neighbors.length} total links</div>
          <a href={'/?entry=' + panelNode.id} target="_blank" rel="noopener" style={{ fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6BA080', textDecoration: 'none', display: 'block', marginBottom: '10px' }}>View on site →</a>
          <div style={{ fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#666', marginBottom: '5px' }}>Connected to</div>
          <div style={{ maxHeight: 200, overflow: 'auto' }}>
            {neighbors.slice(0, 18).map(n => (
              <div key={n.id} style={{ fontSize: '11px', color: '#AAA', padding: '2px 0', borderBottom: '1px solid #2A2E34', cursor: 'pointer' }}
                onClick={() => { S.selected = n; setPanelNode(n); const canvas = canvasRef.current; if (canvas) { const ctx = canvas.getContext('2d'); } }}>
                <span style={{ color: DISC_COLORS[n.disc], marginRight: '5px', fontSize: '8px' }}>●</span>{n.t}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN PAGE ──
export default function StagingPage() {
  const [authed, setAuthed] = useState(false);
  const [view, setView] = useState("featured");
  const [selectedDiscipline, setSelectedDiscipline] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [connFilter, setConnFilter] = useState("all");
  const [featured] = useState(() => ARCHIVE[0]);
  const scrollPosRef = useRef(0);

  useEffect(() => {
    if (sessionStorage.getItem("provenance_staging_auth") === "true") setAuthed(true);
  }, []);

  if (!authed) return <PasswordGate onAuth={() => setAuthed(true)} />;

  const filteredArchive = ARCHIVE.filter(item => {
    const d = selectedDiscipline === "All" || item.discipline === selectedDiscipline;
    const q = searchQuery.toLowerCase();
    const s = q === "" || item.title.toLowerCase().includes(q) || item.designer.toLowerCase().includes(q) || item.movement.toLowerCase().includes(q) || item.keywords.some(k => k.toLowerCase().includes(q)) || item.manufacturer.toLowerCase().includes(q);
    return d && s;
  });

  const openItem = (item) => { scrollPosRef.current = window.scrollY; setSelectedItem(item); setView("detail"); setConnFilter("all"); window.scrollTo(0, 0); };

  const filteredConnections = (item) => {
    if (!item) return [];
    return connFilter === "all" ? item.connections : item.connections.filter(c => c.type === connFilter);
  };

  const renderConnections = (item, columns = 3) => {
    const conns = filteredConnections(item);
    const types = [...new Set(item.connections.map(c => c.type))];
    return (
      <div>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '9.5px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#B8A080', fontWeight: 600, marginRight: '8px' }}>Connections</span>
          <button onClick={() => setConnFilter("all")} style={{ fontFamily: 'inherit', fontSize: '10px', padding: '3px 10px', border: connFilter === 'all' ? '1px solid #1C1C1C' : '1px solid #DDD', background: connFilter === 'all' ? '#1C1C1C' : 'transparent', color: connFilter === 'all' ? '#F6F5F0' : '#AAA', cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase' }}>All</button>
          {types.map(t => (
            <button key={t} onClick={() => setConnFilter(t)} style={{ fontFamily: 'inherit', fontSize: '10px', padding: '3px 10px', border: connFilter === t ? `1px solid ${CONN_TYPES[t].color}` : '1px solid #DDD', background: connFilter === t ? CONN_TYPES[t].color : 'transparent', color: connFilter === t ? '#FFF' : '#AAA', cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {CONN_TYPES[t].icon} {CONN_TYPES[t].label}
            </button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '12px' }}>
          {conns.map((conn, idx) => {
            const target = getConnection(conn.id);
            const ct = CONN_TYPES[conn.type];
            // For staging: connections to live archive entries won't resolve — show as reference
            if (!target) return (
              <div key={idx} style={{ padding: '16px', background: '#FDFCF8', border: '1px solid #EBE8E0', borderLeft: `3px solid ${ct.color}`, opacity: 0.6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: ct.color, fontWeight: 600 }}>{ct.icon} {ct.label}</span>
                </div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '15px', marginBottom: '3px', color: '#999' }}>→ Live Archive #{conn.id}</div>
                <div style={{ fontSize: '11px', color: '#888', lineHeight: 1.55, fontStyle: 'italic' }}>{conn.reason}</div>
              </div>
            );
            return (
              <div key={idx} onClick={() => openItem(target)} style={{ cursor: 'pointer', padding: '16px', background: '#FDFCF8', border: '1px solid #EBE8E0', transition: 'all 0.25s', borderLeft: `3px solid ${ct.color}` }}
                onMouseEnter={e => { e.currentTarget.style.background = '#FFF'; e.currentTarget.style.borderColor = '#CCC'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#FDFCF8'; e.currentTarget.style.borderColor = '#EBE8E0'; }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: ct.color, fontWeight: 600 }}>{ct.icon} {ct.label}</span>
                  <span style={{ fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: PALETTE[target.discipline] }}>{target.discipline}</span>
                </div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '15px', marginBottom: '3px', lineHeight: 1.25 }}>{target.title}</div>
                <div style={{ fontSize: '11px', color: '#AAA', marginBottom: '10px' }}>{target.designer.split('&')[0].trim()}, {target.year}</div>
                <div style={{ fontSize: '11px', color: '#888', lineHeight: 1.55, fontStyle: 'italic' }}>{conn.reason}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // ── FULL-SCREEN NETWORK MODE ──
  if (view === 'network') {
    return (
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#1E2228' }}>
        <NetworkCanvas />
        <button onClick={() => setView('featured')} style={{
          position: 'fixed', top: 20, left: 24, zIndex: 20, fontFamily: "'DM Sans', sans-serif",
          fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase',
          padding: '6px 14px', border: '1px solid #555', background: 'rgba(30,34,40,0.8)',
          color: '#AAA', cursor: 'pointer', backdropFilter: 'blur(4px)',
        }}>← Back</button>
        <div style={{ position: 'fixed', top: 22, left: 120, zIndex: 20, display: 'flex', alignItems: 'baseline', gap: '10px', pointerEvents: 'none' }}>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '20px', color: '#E8E4DC', letterSpacing: '-0.02em' }}>Provenance</span>
          <span style={{ fontSize: '8px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#B8763C' }}>Network</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* HEADER */}
      <header style={{ padding: '28px 44px 0', background: '#F6F5F0', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px' }}>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '32px', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1, cursor: 'pointer' }} onClick={() => { setView('featured'); setSelectedItem(null); }}>Provenance</div>
              <span style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#B8763C', fontWeight: 600, padding: '3px 10px', border: '1px solid #D4A574', background: '#FFF8F0' }}>Staging</span>
            </div>
            <div style={{ fontSize: '10.5px', fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#B8A080', marginTop: '5px' }}>Candidate entries under review</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', color: '#CCC', letterSpacing: '0.06em', lineHeight: 1.6 }}>
              {ARCHIVE.length} candidates · {ARCHIVE.reduce((s, e) => s + e.connections.length, 0)} connections
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid #DDD', alignItems: 'center' }}>
          {[['featured', 'Today'], ['archive', 'Archive'], ['connections', 'Connection Map'], ['about', 'About'], ['network', 'Network']].map(([v, label]) => (
            <button key={v} onClick={() => { setView(v); setSelectedItem(null); }}
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', color: (view === v || (v === 'archive' && view === 'detail')) ? '#1C1C1C' : '#AAA', background: 'none', border: 'none', padding: '10px 20px 12px', cursor: 'pointer', borderBottom: (view === v || (v === 'archive' && view === 'detail')) ? '2px solid #1C1C1C' : '2px solid transparent', marginBottom: '-1px', transition: 'all 0.2s' }}>
              {label}
            </button>
          ))}
          {view === 'archive' && (
            <input type="text" placeholder="Search designer, movement, keyword…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              style={{ marginLeft: 'auto', fontFamily: 'inherit', fontSize: '12px', padding: '6px 16px', border: '1px solid #DDD', background: '#FFF', outline: 'none', width: '220px', color: '#1C1C1C' }} />
          )}
        </div>
      </header>


      <div style={{ padding: '44px', maxWidth: '1100px', margin: '0 auto' }}>

        {/* FEATURED */}
        {view === 'featured' && (
          <div>
            <div style={{ fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#B8A080', marginBottom: '32px', fontWeight: 500 }}>Featured Candidate</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '56px' }}>
              <div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '110px', color: '#E8E4DC', lineHeight: 0.85, letterSpacing: '-0.04em', marginBottom: '16px' }}>{featured.year}</div>
                <div style={{ display: 'inline-block', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 500, color: PALETTE[featured.discipline], borderBottom: `2px solid ${PALETTE[featured.discipline]}`, marginBottom: '16px', paddingBottom: '2px' }}>{featured.discipline}</div>
                <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '36px', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.015em', marginBottom: '10px' }}>{featured.title}</h1>
                <div style={{ fontSize: '15px', color: '#888', marginBottom: '8px' }}>{featured.designer}</div>
                <div style={{ fontSize: '12px', color: '#BBB', marginBottom: '28px' }}>{featured.manufacturer} · {featured.origin} · {featured.collection}</div>
                <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#444', marginBottom: '28px' }}>{featured.description}</p>
                <div style={{ fontSize: '9.5px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#B8A080', marginBottom: '10px', fontWeight: 600 }}>Why It Matters</div>
                <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#777', fontStyle: 'italic' }}>{featured.significance}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '24px' }}>
                  {featured.keywords.map((kw, i) => <span key={i} style={{ fontSize: '10px', padding: '3px 10px', background: '#EDEADE', color: '#888' }}>{kw}</span>)}
                </div>
              </div>
              <div>
                <ImageWithFallback key={featured.id} item={featured} aspectRatio="3/4" />
                <div style={{ marginTop: '36px', paddingTop: '24px', borderTop: '1px solid #E4E0D8' }}>
                  {renderConnections(featured, 2)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ARCHIVE GRID */}
        {view === 'archive' && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
              {DISCIPLINES.map(d => (
                <button key={d} onClick={() => setSelectedDiscipline(selectedDiscipline === d ? 'All' : d)}
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '10.5px', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '6px 14px', border: selectedDiscipline === d ? '1px solid #1C1C1C' : '1px solid #DDD', background: selectedDiscipline === d ? '#1C1C1C' : 'transparent', color: selectedDiscipline === d ? '#F6F5F0' : '#AAA', cursor: 'pointer', transition: 'all 0.2s' }}>
                  {d}
                </button>
              ))}
            </div>
            {filteredArchive.length === 0 ? <div style={{ textAlign: 'center', padding: '80px 0', color: '#CCC' }}>No entries match your search.</div> : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1px', background: '#E4E0D8', border: '1px solid #E4E0D8' }}>
                {filteredArchive.map(item => (
                  <div key={item.id} onClick={() => openItem(item)}
                    style={{ background: '#FDFCF8', cursor: 'pointer', display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#FFF'}
                    onMouseLeave={e => e.currentTarget.style.background = '#FDFCF8'}>
                    <ImageWithFallback key={item.id} item={item} aspectRatio="3/2" />
                    <div style={{ padding: '16px 20px 20px' }}>
                      <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '18px', lineHeight: 1.2, marginBottom: '4px' }}>{item.title}</div>
                      <div style={{ fontSize: '13px', color: '#999', marginBottom: '8px' }}>{item.designer.split('&')[0].trim()}, {item.year}</div>
                      <div style={{ fontSize: '11px', color: '#BBB', paddingTop: '8px', borderTop: '1px solid #EBE8E0' }}>
                        {item.movement} · {item.connections.length} connections
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* DETAIL */}
        {view === 'detail' && selectedItem && (() => { const s = selectedItem; return (
          <div>
            <button onClick={() => { setView('archive'); setTimeout(() => window.scrollTo(0, scrollPosRef.current), 0); }} style={{ fontFamily: 'inherit', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#BBB', cursor: 'pointer', background: 'none', border: 'none', padding: 0, marginBottom: '36px' }}>← Back to Archive</button>
            <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '56px', alignItems: 'start' }}>
              <div>
                <ImageWithFallback key={s.id} item={s} aspectRatio="4/3" />
                <div style={{ marginTop: '36px', paddingTop: '24px', borderTop: '1px solid #E4E0D8' }}>
                  {renderConnections(s, 2)}
                </div>
              </div>
              <div>
                <div style={{ display: 'inline-block', fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 500, color: PALETTE[s.discipline], borderBottom: `2px solid ${PALETTE[s.discipline]}`, marginBottom: '14px', paddingBottom: '2px' }}>{s.discipline} · {s.movement}</div>
                <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '30px', fontWeight: 400, lineHeight: 1.1, marginBottom: '10px' }}>{s.title}</h1>
                <div style={{ fontSize: '15px', color: '#888', marginBottom: '20px' }}>{s.designer}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '28px', paddingBottom: '24px', borderBottom: '1px solid #E4E0D8' }}>
                  {[['Year', s.year], ['Origin', s.origin], ['Manufacturer', s.manufacturer], ['Collection', s.collection]].map(([l, v]) => (
                    <div key={l}><div style={{ fontSize: '9.5px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#BBB', marginBottom: '3px' }}>{l}</div><div style={{ fontSize: '13px', color: '#555' }}>{v}</div></div>
                  ))}
                </div>
                <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#444', marginBottom: '28px' }}>{s.description}</p>
                <div style={{ fontSize: '9.5px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#B8A080', marginBottom: '10px', fontWeight: 600 }}>Why It Matters</div>
                <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#777', fontStyle: 'italic', marginBottom: '24px' }}>{s.significance}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {s.keywords.map((kw, i) => <span key={i} style={{ fontSize: '10px', padding: '3px 10px', background: '#EDEADE', color: '#888' }}>{kw}</span>)}
                </div>
              </div>
            </div>
          </div>
        ); })()}

        {/* CONNECTION MAP */}
        {view === 'connections' && (
          <div>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '26px', fontWeight: 400, marginBottom: '12px' }}>Connection Map</h2>
              <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.6, maxWidth: '600px' }}>
                Every entry connects to others through argued relationships. Connections to live archive entries (not in staging) show the connection text but can&apos;t be navigated.
              </p>
            </div>
            <div style={{ display: 'grid', gap: '2px', background: '#E4E0D8' }}>
              {ARCHIVE.map(item => (
                <div key={item.id} style={{ background: '#FDFCF8', padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '18px', cursor: 'pointer' }} onClick={() => openItem(item)}>{item.title}</span>
                    <span style={{ fontSize: '12px', color: '#BBB' }}>{item.designer.split('&')[0].trim()}, {item.year}</span>
                    <span style={{ fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: PALETTE[item.discipline], fontWeight: 500 }}>{item.discipline}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {item.connections.map((conn, idx) => {
                      const target = getConnection(conn.id);
                      const ct = CONN_TYPES[conn.type];
                      return (
                        <span key={idx} onClick={() => target && openItem(target)} style={{ fontSize: '11px', padding: '3px 10px', background: '#F0EDE8', color: target ? '#666' : '#BBB', cursor: target ? 'pointer' : 'default', borderLeft: `2px solid ${ct.color}`, lineHeight: 1.4 }}>
                          {ct.icon} {target ? target.title : `Live #${conn.id}`}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABOUT */}
        {view === 'about' && (
          <div style={{ maxWidth: '600px' }}>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: '30px', fontWeight: 400, lineHeight: 1.2, marginBottom: '28px' }}>Staging Environment</h1>
            <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#555', marginBottom: '16px' }}>
              This is the staging version of Provenance. Entries here are candidates for the live archive. Browse them exactly as visitors would — follow connections, read descriptions, check significance statements.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#555', marginBottom: '16px' }}>
              Connections that reference live archive entries (by ID) will show the connection text but appear greyed out since those objects aren&apos;t loaded here. This lets you judge the quality of the argument without needing the full archive present.
            </p>
            <p style={{ fontSize: '15px', lineHeight: 1.75, color: '#555' }}>
              When satisfied, the approved entries from <code style={{ background: '#EDEADE', padding: '2px 6px', fontSize: '13px' }}>candidates.js</code> get merged into <code style={{ background: '#EDEADE', padding: '2px 6px', fontSize: '13px' }}>archive.js</code> and pushed live.
            </p>
          </div>
        )}
      </div>

      <footer style={{ borderTop: '1px solid #E4E0D8', padding: '20px 44px', marginTop: '80px', display: 'flex', justifyContent: 'center', fontSize: '10px', color: '#C0BDB6', letterSpacing: '0.04em' }}>
        <span>Provenance Staging · Not public · {ARCHIVE.length} candidate entries</span>
      </footer>
    </div>
  );
}
