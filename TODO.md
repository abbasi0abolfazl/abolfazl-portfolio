# TODO — Items Requiring Review

List of items remaining after bug fixes and content updates that require **your decision or action**.

---

## 🔴 Before Launch (Launch blockers)

- [x] **Domain replacement:** `YOUR-DOMAIN.com` replaced with `abolfazlabbasi.com` in:
  - `index.html` → `og:url`, `og:image`, `twitter:image`
  - `public/robots.txt` → `Sitemap:` line
  - `public/sitemap.xml` → all `<loc>` entries
- [ ] **Remove test blog post:** `src/content/blog/posts/2025-01-01-test-post.md` (placeholder content).

---

## 🟠 Icons & Metadata (Favicon / OG)

- [ ] **Export og-image.png:** `public/og-image.svg` is ready but some platforms (WhatsApp/Telegram/older browsers) don't render SVG for link previews.
  - Export a `og-image.png` at **1200×630** from the SVG and replace `.svg` in `index.html` meta tags.
- [ ] **Raster icons:** For older browsers and iOS:
  - Generate `favicon.ico` (32×32) and `apple-touch-icon.png` (180×180) from `public/favicon.svg` and link them in `index.html`.

> Theme for all icons: background `#14161a`, gradient blue `#60a5fa` → green `#34d399` (matching tokens in `src/index.css`).

---

## 🟡 Content & Projects

- [x] **Dead "Download Case Study" button removed** from `src/pages/ProjectDetail.jsx`.
- [ ] **Title alignment:** Project card says "Social Media Intelligence Platform" but blog post says "X (Twitter) Crawler Bot". Decide: unify them or add a cross-reference in the project description.
- [ ] **Project ↔ Blog link:** (Optional) Add a "Read the write-up →" link from a project detail page to the related blog post.
- [ ] **LinkedIn URL:** `social.linkedin` in `src/data/personalInfo.js` is empty — fill it when ready (the icon will appear automatically).

---

## 🟢 Technical & Cleanup

- [ ] **GitHub Activity section:** Unreachable from some networks (`ERR_TIMED_OUT` on `api.github.com`). Current fix: fast timeout falls back to error state. For a permanent fix: fetch stats once at build time and store them statically, or proxy through your own backend.
- [ ] **Unused pages:** Routes `/dashboard` and `/analytics` were removed but `src/pages/Dashboard.jsx`, `src/pages/Analytics.jsx`, and `src/components/dashboard/*` files remain on disk. Decide: keep for later or delete entirely.
  - If re-enabled, store the password in `.env` as `VITE_DASHBOARD_PASSWORD` (never hardcode).
- [ ] **i18n:** `LanguageContext`/`i18n.js` infrastructure is ready but only `en` is populated. If the site becomes bilingual: add Farsi translations + language switcher + `dir: 'rtl'`.
- [ ] **Unused dependency:** Package `three` is in `package.json` but never imported → run `npm remove three`.
- [ ] **Local project folders:** `didartalk_analyzer/` and `xbot/` are inside the portfolio repo. Add them to `.gitignore` if you don't want them committed.
