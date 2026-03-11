# Image Sourcing Archivist — Memory

## Project Architecture
- Candidates data: `/app/data/candidates.js` — exports `CANDIDATES` array
- Image fallback: site uses Wikipedia REST API (`/api/rest_v1/page/summary/{wikiTitle}`) to fetch images when `imageUrl` is empty
- Image field: `imageUrl` on each entry (empty string = no direct image, falls back to wikiTitle)
- Wikipedia API requires User-Agent header for server-side fetching

## Verified Museum Collection URLs

### V&A (Victoria and Albert Museum)
- Image URL pattern: `https://framemark.vam.ac.uk/collections/{image_id}/full/{width},/0/default.jpg`
- Example: OpenDesk Edie Stool (W.28-2016): `2016JG7864`
- Totomoxtle panel (W.18-2024): no online image yet as of March 2026
- Rights: non-commercial use up to 768px for 5 years; commercial via vaimages@vam.ac.uk

### Cooper Hewitt
- Image URL pattern: `https://images.collection.cooperhewitt.org/{id}_{hash}_{size}.jpg`
- Totomoxtle (NATURE.013, obj 2318798838): confirmed accessible image
- Rights: restrictions on reuse; contact ArtResource for commercial

### Metropolitan Museum of Art
- Dyalvane works: Umwonyo (2021.350) and Sandi Conical Vase (846964)
- iThongo series NOT in Met collection by that name — Met has different Dyalvane pieces
- Rights: varies per object; some Open Access, some restricted (c) artist

### Friedman Benda Gallery
- iThongo exhibition images: `friedmanbenda.com/wp-content/uploads/` pattern
- Good high-res installation photography available
- No explicit photographer credit on exhibition pages

## Wikipedia wikiTitle Verification
- `Material_Design` — returns Material You screenshot (correct, adequate)
- `WikiHouse` — returns Hub Westminster photo (correct, shows real building)
- `Opendesk` — returns desk with fern photo (correct furniture platform article, NOT the German OpenDesk software)
- WARNING: Wikipedia has TWO articles: "OpenDesk" (German govt software) vs "Opendesk" (furniture). Case matters in wikiTitle.

## Items Without wikiTitle (Need Direct Images)
- ID 922: Andile Dyalvane iThongo — use Friedman Benda or Met collection
- ID 928: Fernando Laposse Totomoxtle — use Cooper Hewitt or designer portfolio

## Source Reliability Notes
- Fernando Laposse portfolio: fernandolaposse.com (Squarespace) — has good images, photographer Emilio Diaz credited
- Southern Guild (southernguild.com): Sanity CMS, images load dynamically — hard to scrape
- Google Design (design.google): good Material Design editorial images on Google Storage CDN
- OpenDesk (opendesk.cc): product images on Cloudinary CDN, photographer Peter Gunzel credited

## See Also
- [source-urls.md](source-urls.md) — verified image URLs from test run
