# veha.app website

Astro static site, deployed on Cloudflare. No server code.

## Develop
```
cd site
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs dist/
```
Node 22 (see `.nvmrc`).

## Structure
- `src/pages/` home, privacy policy, POS vendors list, careers (URLs match the old WordPress site)
- `src/layouts/`, `src/components/` shared head, headers and footer
- `src/data/km.json` all Khmer strings for the EN/ខ្មែរ toggle (English text lives in the page markup)
- `public/` CSS, JS, images, `robots.txt`, `sitemap.xml`, `_redirects` (old URLs), `_headers` (caching)
- `wrangler.jsonc` Cloudflare deploy config (serves `dist/`)

## Cloudflare settings
- Repository: this repo; **Root directory:** `site`
- **Build command:** `npm run build`
- **Deploy command:** `npx wrangler deploy` (default)
- Production branch: `main`

## Before the veha.app swap
- **Lead form (n8n):** create a Webhook node (POST), set Options > Allowed Origins to the site's domain, then paste its Production URL into `LEAD_ENDPOINT` at the top of `public/js/main.js`. Fields sent as JSON: `business`, `name`, `phone`, `email`, `stage`, `lang`, `page`, `submittedAt`. Until set, the form tells visitors to phone 093 923 030.
- **Khmer:** have a native speaker review `src/data/km.json`. Strings not translated fall back to English.
- **Pricing:** shows $165/year, $499, $899 and add-ons from the pricing page. The old homepage showed $13.99/month; confirm which billing model to advertise.
- **Photos and client names:** confirm each customer agreed to appear.
- **Careers:** the page is a stub; add the Digital Sales Executive details.
- **Claims kept cautious:** payments (KHQR, cards, multi-currency), QR/KDS/CDS modules, unlimited users, inventory and offline use are not promised; see `VEHA_Cloud_POS_Knowledge_Base.md` section 23.
- **Email DNS:** when switching the domain, keep existing MX/TXT records and change only the website records.
- Old pricing, free-trial and clients URLs redirect to home-page sections via `public/_redirects`. Verify the `#fragment` redirects on the Cloudflare preview.
