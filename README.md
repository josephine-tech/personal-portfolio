# Josephine, Portfolio Site

A premium single-page portfolio for Josephine, Full-Stack Marketing Strategist.

Static site (plain HTML, CSS, and vanilla JS), no build step, no dependencies to install. Motion is powered by GSAP, ScrollTrigger, and Lenis loaded from a CDN at runtime.

## Structure

| File | Purpose |
| --- | --- |
| `index.html` | Page markup and content |
| `styles.css` | Design system and all styling (Burgundy & Cream Executive theme) |
| `app.js` | Scroll reveals, parallax, 3D tilt, magnetic buttons, cursor, counters, carousel |
| `favicon.svg` | Site icon |
| `images/portrait.svg` | Hero portrait **placeholder** |
| `.nojekyll` | Tells GitHub Pages to serve files as-is |

## Design system

- **Type:** Space Grotesk (display) + Inter (body).
- **Palette:** Burgundy `#6B2737`, Cream `#F7F3EC`, Warm Taupe `#BFA6A0`, Espresso `#3D2C29`, Light `#FDFBF8`.
- **Motion:** GSAP + ScrollTrigger (reveals, staggered entrances, animated bar charts), Lenis (smooth inertia scrolling), plus CSS for glassmorphism, ambient gradient orbs, and 3D depth.
- All effects respect `prefers-reduced-motion` and degrade gracefully on touch devices and if the CDN libraries fail to load (content stays fully visible).

## Photos / placeholders to replace

- **Hero portrait**: `images/portrait.jpg` (+ `portrait.webp`). Real headshot, optimized and cropped head-and-shoulders.
- **Industry and case-study images**: currently seeded `picsum.photos` placeholders. Replace the `src` URLs with real visuals.
- **Viral-post metrics** and the **B2B SaaS testimonial** (Daniel Mercer) are illustrative; swap in real ones.
- **Consultation link**: update `https://calendly.com/your-link` in `index.html`.

## Run locally

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

Any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages). Point it at the repo root; no build command needed.
