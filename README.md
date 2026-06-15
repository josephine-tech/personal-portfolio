# Josephine — Portfolio Site

A single-page portfolio site for Josephine, Creative Strategist & Performance Marketer.

Built as a static site with plain HTML and CSS — no build step, no dependencies.

## Structure

| File | Purpose |
| --- | --- |
| `index.html` | Page markup and content |
| `styles.css` | All styling (extracted from the original single-file design) |
| `favicon.svg` | Site icon |
| `.nojekyll` | Tells GitHub Pages to serve files as-is |

## Run locally

Open `index.html` directly in a browser, or serve the folder:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy (GitHub Pages)

1. Push to the repository.
2. In **Settings → Pages**, set the source to the branch and `/ (root)` folder.
3. The site publishes at `https://<user>.github.io/personal-portfolio/`.

The site is also ready for any static host (Netlify, Vercel, Cloudflare Pages) — point it at the repo root.

## Editing

- Update the consultation link in `index.html` (`href="https://calendly.com/your-link"`) to a real booking URL.
- Content lives inline in `index.html`; design tokens (colors, etc.) are CSS variables at the top of `styles.css`.
