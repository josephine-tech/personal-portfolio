# Maya Tan — Consulting Website

A premium single-page personal-brand website for **Maya Tan**, an independent growth and market expansion consultant based in Singapore, serving founders and scaling companies across Asia-Pacific.

Static site (plain HTML, CSS, vanilla JS). **No build step, no dependencies to install, and no required runtime CDN** — all motion and interactivity are self-contained, so the site works fully offline and degrades gracefully.

## Structure

| File | Purpose |
| --- | --- |
| `index.html` | Page markup, content, and SEO/JSON-LD metadata |
| `styles.css` | Design system and all styling (White · Charcoal · Deep Navy · Warm Beige · Gold) |
| `app.js` | Scroll reveals, animated counters, parallax, 3D tilt, magnetic buttons, custom cursor, testimonial carousel, FAQ accordion, form handling |
| `favicon.svg` | "MT" monogram icon |
| `images/maya-portrait.svg` | Hero portrait **placeholder** (editorial brand art) |
| `images/maya-about.svg` | About-section portrait **placeholder** |
| `.nojekyll` | Tells GitHub Pages to serve files as-is |

## Design system

- **Type:** Fraunces (display serif) + Inter (UI/body), loaded from Google Fonts with a system-serif/sans fallback.
- **Palette:** Deep Navy `#102a43`, Charcoal `#1b1f24`, Warm Beige `#efe7d8`, White/Paper `#fbfaf7`, minimal Gold accents `#c39b46`.
- **Motion:** IntersectionObserver-driven scroll reveals + CSS transitions, animated stat counters, mouse-responsive hero parallax, 3D card tilt, magnetic buttons, and a custom cursor. Everything respects `prefers-reduced-motion` and disables on touch devices.

## Sections

Hero (with animated metrics) → Markets marquee → About / *Meet Maya* (+ career milestones) → Services → Success Stories → Testimonials → Insights (thought leadership) → Work Process → Personal Brand → Booking & Contact (form + FAQ) → CTA → Footer (newsletter).

## Placeholders to replace

- **Portraits:** `images/maya-portrait.svg` and `images/maya-about.svg` are tasteful editorial placeholders. Swap in real professional photography of Maya (keep the same dimensions/aspect for a drop-in replacement).
- **Personal-brand gallery & insight thumbnails** currently use designed gradient tiles — replace with real photos/article images if desired.
- **Forms** (booking + newsletter) are front-end only. Wire them to a backend or a form service (e.g. Formspree, Netlify Forms) by setting the `<form>` action/handler in `index.html` / `app.js`.
- **Contact details** (`hello@mayatan.co`, LinkedIn `/in/mayatan`) and case-study figures are illustrative — replace with real values.

## Run locally

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

Any static host (GitHub Pages, Vercel, Netlify, Cloudflare Pages). Point it at the repo root; no build command needed.
