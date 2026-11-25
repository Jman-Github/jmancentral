# Jman Central

Source for [jmancentral.com](https://jmancentral.com): a small React + Vite + Tailwind site deployed to GitHub Pages.

## Local development

Requires Node.js 20.19+ or 22.12+ (what Vite 8 supports).

```sh
git clone https://github.com/Jman-Github/jmancentral.git
cd jmancentral
npm install
npm run dev        # http://localhost:8080
```

Other scripts:

| Script              | What it does                                                        |
| ------------------- | ------------------------------------------------------------------- |
| `npm run build`     | Refreshes GitHub stats, builds to `dist/`, writes per-route HTML    |
| `npm run preview`   | Serves the production build                                         |
| `npm run lint`      | ESLint                                                              |
| `npm run typecheck` | TypeScript (strict)                                                 |

## Editing content

- **Projects, social links, contact details:** `src/config/siteData.ts` (the GitHub, X, YouTube and Reddit URLs are also in the JSON-LD `sameAs` in `index.html`, and the X handle in its `twitter:site` tag; keep them in sync)
- **Page titles and descriptions:** `src/config/pages.json` (used by the app and by the build for each route's static HTML)
- **Design tokens (colors for both themes):** `src/index.css`; Tailwind names them in `tailwind.config.ts`
- **Third-party credits (icons, fonts):** `public/third-party-notices.txt`, served at `/third-party-notices.txt`; update it when adding icons or fonts

## GitHub stats

`scripts/generate-github-stats.mjs` runs before every build. It calls the GitHub API and writes:

- `src/data/github-stats.json`: profile totals plus per-repository stars, latest release, and last push. This is bundled into the site, so visitors never call the GitHub API.
- `public/github-stats.svg`: the card embedded in the GitHub profile README.

If the API is unavailable the script keeps the committed JSON, except on scheduled CI runs, which fail instead of redeploying stale numbers. Set `GITHUB_TOKEN` locally to avoid the unauthenticated rate limit.

## Deployment

`.github/workflows/deploy.yml` lints, typechecks, builds, and deploys to GitHub Pages on every push to `main` and every 6 hours (to refresh stats). Because Pages has no SPA fallback, `scripts/postbuild-pages.mjs` writes `index.html`, `social/index.html`, and `404.html` with each page's title and description from `src/config/pages.json` (so edit titles there, not in `index.html`) and adds a Content-Security-Policy `<meta>` tag with hashes for the inline scripts.
