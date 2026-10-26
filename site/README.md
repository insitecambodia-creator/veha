# veha.app website

Static site (HTML, CSS, vanilla JS). No build step. Deploy the contents of this folder to any static host (Cloudflare Pages, Netlify, GitHub Pages) and point veha.app at it.

Preview locally: `npx http-server site` or open `index.html`.

## Before launch
- **Lead form (n8n):** create a Webhook node (POST), set Options > Allowed Origins to the site's domain, then paste its Production URL into `LEAD_ENDPOINT` at the top of `js/main.js`. Fields sent as JSON: `business`, `name`, `phone`, `email`, `stage`, `lang`, `page`, `submittedAt`. Until set, the form tells visitors to phone 093 923 030.
- **Khmer:** the EN/ខ្មែរ toggle covers the main headings, navigation, pricing and form. Strings not yet translated fall back to English. Have a native speaker review `KM` in `js/main.js`.
- **Pricing:** shows $165/year, $499, $899 and add-ons from the current pricing page. The old homepage showed $13.99/month; confirm which billing model to advertise.
- **Photos and client names:** confirm each customer agreed to appear (Beans and Co, Pou Tun Coffee and Eatery, and the client list).
- **Claims kept deliberately cautious:** payments (KHQR, cards, multi-currency), QR/KDS/CDS modules, unlimited users, inventory and offline use are not promised; see `VEHA_Cloud_POS_Knowledge_Base.md` section 23.
- Rebuilt pages (same URLs as WordPress): privacy policy, POS vendors list, careers. The careers page is a stub: add the Digital Sales Executive details.
- `vercel.json` redirects the old pricing, free-trial and clients pages to the matching home-page sections.
