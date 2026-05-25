# mywallybot.com

Static corporate parent site for MyWallyBot LLC — the institutional front door for the WallyBot family of properties. Built to PRD v3, vanilla HTML/CSS/minimal JS, no framework, no build system.

## Deploy

- **Target:** Cloudflare Pages
- **Domain:** mywallybot.com
- **Build command:** _none_ (static)
- **Output directory:** `/` (repo root)
- **Routing:** Cloudflare Pages serves `company.html` at both `/company.html` and `/company`. All internal links use clean URLs (no `.html`).

## Preview locally

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

Any static file server works (`npx serve`, `php -S`, etc.).

## Things to swap before going live

| What | Where | Search for |
|---|---|---|
| **Formspree endpoint** | `contact.html` | `FORM_ENDPOINT_TO_BE_SUPPLIED` |
| **Etsy shop URL** | `ecosystem.html` (WallyBot Studio card) | `<!-- TBD: Etsy shop URL` |
| **Facebook page URL** | `ecosystem.html` (WallyBot Studio card) | `<!-- TBD: Facebook page URL` |
| **peoplesdata.org final URL** | `ecosystem.html` (peoplesdata.org card) | `<!-- TBD: peoplesdata.org final public URL` |
| **Wally Guard page URL** | `ecosystem.html` (Wally Guard card) | `<!-- TBD: Wally Guard domain` |
| **Wally Vault page URL** | `ecosystem.html` (Wally Vault card) | `<!-- TBD: Wally Vault domain` |

After replacing the Formspree endpoint, also remove the `<!-- TODO: ... -->` comment immediately above the `<form>` tag in `contact.html` if desired (it is required by PRD §8 until the endpoint is verified).

## Logo files — placeholder status

The PRD provided two PNG logo files (horizontal lockup + square stacked). The build environment could not receive those PNGs as files, so the current logo assets are **approximations** generated to match the actual mark (chrome rim circle, metallic-to-cyan W with inner cyan V, gradient wordmark).

**How the brand is composed in the header/footer:** the W-circle mark is an SVG (`logo-mark.svg`) drawn as pure shapes (no text), and the "MyWallyBot LLC" wordmark next to it is plain HTML text styled with the page's Orbitron font + brand color rules. This guarantees the wordmark always renders in the intended typeface and color split (steel "My", cyan "Wally", steel "Bot", dim "LLC"), regardless of how the mark image is served.

Assets:
- `assets/img/logo-mark.svg` — **W-circle mark only** (used in every header and footer)
- `assets/img/logo-horizontal.svg` / `.png` — combined lockup with rasterized wordmark (not referenced by the pages — kept for press / external use)
- `assets/img/logo-stacked.svg` / `.png` — stacked variant (not referenced by pages — kept for external use)
- `assets/img/favicon.svg`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png` — favicons rasterized from `favicon.svg`
- `assets/img/og-image.png`, `og-image.svg` — Open Graph share image, 1200×630, referenced by every page's `<meta property="og:image">`

**To replace with the authoritative artwork:**
1. Drop the founder's W-circle mark SVG into `assets/img/logo-mark.svg` (overwrite). The header/footer pick it up automatically.
2. Drop the founder's `logo-horizontal.png` / `logo-stacked.png` into `assets/img/` (overwrite the approximations).
3. Regenerate the favicons and OG image PNGs from the authoritative mark (any vector tool will do). Drop them into `assets/img/` with the same filenames.
4. No HTML changes required — references stay the same.

## Fonts

Headings use **Orbitron** (display) and body uses **Inter**, loaded from Google Fonts via `<link rel="stylesheet">`. No analytics, no Google scripts — just the font CSS. If you prefer fully self-hosted fonts (no third-party requests), download the `.woff2` files from Google Fonts, drop them in `assets/fonts/`, and replace the `<link>` tags with `@font-face` declarations in `assets/css/styles.css`.

## Privacy posture

Per PRD §7: no analytics, no Meta Pixel, no Google Analytics, no embedded trackers, no third-party logins, no account system, no cookies, no e-commerce. The only third-party request is the Google Fonts stylesheet noted above.

## File layout

```
/
├── index.html              Home
├── company.html            Company
├── ecosystem.html          WallyBot Ecosystem
├── contact.html            Contact (Formspree form)
├── legal.html              Legal & Disclosures
├── 404.html                Branded 404 (noindex)
├── robots.txt
├── sitemap.xml
├── assets/
│   ├── css/styles.css
│   ├── js/main.js          Mobile nav toggle only
│   └── img/                Logo + favicon + OG image
├── README.md
└── gitignore
```

## Acceptance check

This build was self-checked against all 31 acceptance criteria in PRD §13 before commit. See `git log` for details.
