// Fetches public GitHub stats at build time.
//   src/data/github-stats.json  -> bundled into the site (no client-side API calls)
//   public/github-stats.svg     -> embedded in the GitHub profile README
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const username = "Jman-Github";
const statsPath = fileURLToPath(new URL("../src/data/github-stats.json", import.meta.url));
const svgPath = fileURLToPath(new URL("../public/github-stats.svg", import.meta.url));
const numberFormat = new Intl.NumberFormat("en-US");
const strictRefresh = process.env.GITHUB_STATS_STRICT === "true";
const githubToken = process.env.GITHUB_TOKEN;

const xml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
})[character]);

// The card is rendered by GitHub as an <img>, which can't load external fonts, so the site's
// IBM Plex files are embedded as data URIs. Colors mirror the site's tokens in src/index.css.
const fontFile = (path) => fileURLToPath(new URL("../node_modules/" + path, import.meta.url));
const FONT_FILES = {
  sans: fontFile("@fontsource-variable/ibm-plex-sans/files/ibm-plex-sans-latin-wght-normal.woff2"),
  mono: fontFile("@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2"),
};

async function fontDataUri(path) {
  try {
    return "data:font/woff2;base64," + (await readFile(path)).toString("base64");
  } catch {
    return null; // Falls back to system fonts if node_modules is missing.
  }
}

const cardDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const listFormat = new Intl.ListFormat("en-US", { style: "long", type: "conjunction" });

function svgText(x, y, value, className, anchor = "start") {
  return '<text x="' + x + '" y="' + y + '" class="' + className + '"' + (anchor === "start" ? "" : ' text-anchor="' + anchor + '"') + ">" + xml(value) + "</text>";
}

function createSvg(stats, fonts) {
  const width = 840;
  const height = 256;
  const pad = 32;
  const items = [
    ["Stars earned", stats.totalStars],
    ["Followers", stats.followers],
    ["Pull requests", stats.totalPullRequests],
    ["Issues opened", stats.totalIssues],
    ["Public repos", stats.publicRepos],
    ["Forks", stats.totalForks],
  ];
  const column = (width - pad * 2) / items.length;
  const site = "jmancentral.com";
  const siteWidth = site.length * 7.2; // IBM Plex Mono advance is 0.6em at 12px.

  const fontFaces = [
    fonts.sans && '@font-face{font-family:"IBM Plex Sans Variable";font-weight:100 700;src:url(' + fonts.sans + ') format("woff2")}',
    fonts.mono && '@font-face{font-family:"IBM Plex Mono";font-weight:400;src:url(' + fonts.mono + ') format("woff2")}',
  ].filter(Boolean).join("");

  const style =
    fontFaces +
    "svg{--bg:#0e0e0d;--fg:#ecebe6;--muted:#a09f97;--subtle:#85847d;--line:#282825;--accent:#ff6b35}" +
    "@media (prefers-color-scheme: light){svg{--bg:#f7f6f2;--fg:#141413;--muted:#575651;--subtle:#6a6963;--line:#e0dfd8;--accent:#c2410c}}" +
    ".card{fill:var(--bg);stroke:var(--line)}.rule{stroke:var(--line)}.underline{stroke:var(--accent);stroke-width:1.5}" +
    "text{font-family:\"IBM Plex Sans Variable\",-apple-system,\"Segoe UI\",Helvetica,Arial,sans-serif}" +
    ".mono{font-family:\"IBM Plex Mono\",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12px}" +
    ".name{fill:var(--fg);font-size:20px;font-weight:500;letter-spacing:-.2px}" +
    ".value{fill:var(--fg);font-size:30px;font-weight:500;letter-spacing:-.6px;font-variant-numeric:tabular-nums}" +
    ".label{fill:var(--muted);font-size:13px}.note{fill:var(--muted);font-size:14px}" +
    ".muted{fill:var(--muted)}.subtle{fill:var(--subtle)}";

  const stat = ([label, value], index) => {
    const x = Math.round(pad + index * column);
    return svgText(x, 142, numberFormat.format(value), "value") + svgText(x, 167, label, "label");
  };

  const summary = items.map(([label, value]) => numberFormat.format(value) + " " + label.toLowerCase()).join(", ");
  const languages = stats.topLanguages.length > 0 ? listFormat.format(stats.topLanguages) : "";
  const updated = cardDate.format(new Date(stats.updatedAt));

  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + " " + height + '" fill="none" role="img" aria-labelledby="title desc">\n' +
    '<title id="title">Jman on GitHub</title>\n' +
    '<desc id="desc">' + xml("Public GitHub activity for @" + stats.username + ": " + summary + "." + (languages ? " Mostly " + languages + "." : "")) + "</desc>\n" +
    "<style>" + style + "</style>\n" +
    '<defs><clipPath id="avatar"><rect x="' + pad + '" y="24" width="40" height="40" rx="9"/></clipPath></defs>\n' +
    '<rect class="card" x=".5" y=".5" width="' + (width - 1) + '" height="' + (height - 1) + '" rx="12"/>\n' +
    '<image href="' + xml(stats.avatarImage ?? stats.avatarUrl) + '" x="' + pad + '" y="24" width="40" height="40" preserveAspectRatio="xMidYMid slice" clip-path="url(#avatar)"/>\n' +
    svgText(pad + 52, 43, "Jman", "name") +
    svgText(pad + 52, 62, "@" + stats.username + " · on GitHub since " + stats.joinedYear, "mono subtle") +
    svgText(width - pad, 48, site, "mono muted", "end") +
    '<line class="underline" x1="' + (width - pad - siteWidth) + '" y1="54" x2="' + (width - pad) + '" y2="54"/>\n' +
    '<line class="rule" x1="' + pad + '" y1="88" x2="' + (width - pad) + '" y2="88"/>\n' +
    items.map(stat).join("\n") + "\n" +
    '<line class="rule" x1="' + pad + '" y1="196" x2="' + (width - pad) + '" y2="196"/>\n' +
    (languages ? svgText(pad, 229, "Mostly " + languages + ".", "note") : "") +
    svgText(width - pad, 229, "Updated " + updated, "mono subtle", "end") +
    "\n</svg>\n";
}

// Fail fast instead of waiting on Node's 5-minute default when GitHub stalls; errors reach the
// fallback/strict handling in getCurrentStats.
const REQUEST_TIMEOUT_MS = 20_000;
const withTimeout = (options = {}) => ({ ...options, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });

async function getJson(url, headers) {
  const response = await fetch(url, withTimeout({ headers }));
  if (!response.ok) throw new Error("GitHub API request failed (" + response.status + "): " + url);
  return response.json();
}

// /users/{user}/repos returns at most 100 per page; follow pages so totals don't undercount.
// Sorted by name: an order that doesn't shift when a repo is pushed to mid-pagination, which would
// move repos across page boundaries (skipped or counted twice).
const MAX_REPO_PAGES = 10;

async function getAllRepos(headers) {
  const repos = [];
  // One extra request past the limit tells "exactly 1,000" apart from "more than 1,000".
  for (let page = 1; page <= MAX_REPO_PAGES + 1; page++) {
    const batch = await getJson("https://api.github.com/users/" + username + "/repos?per_page=100&sort=full_name&page=" + page, headers);
    if (page > MAX_REPO_PAGES) {
      if (batch.length === 0) return repos;
      break;
    }
    repos.push(...batch);
    if (batch.length < 100) return repos;
  }
  throw new Error("More than " + MAX_REPO_PAGES * 100 + " repositories; raise MAX_REPO_PAGES in getAllRepos");
}

async function getSearchTotal(query, headers) {
  const result = await getJson("https://api.github.com/search/issues?q=" + encodeURIComponent(query) + "&per_page=1", headers);
  if (result.incomplete_results) throw new Error("GitHub returned incomplete search results");
  return result.total_count;
}

// Latest stable (non-draft, non-prerelease) release tag, or null when the repo has none.
async function getLatestRelease(fullName, headers) {
  const response = await fetch("https://api.github.com/repos/" + fullName + "/releases/latest", withTimeout({ headers }));
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Unable to retrieve latest release for " + fullName);
  const release = await response.json();
  return release.tag_name ?? release.name ?? null;
}

async function getCurrentStats() {
  let fallback = null;
  try {
    fallback = JSON.parse(await readFile(statsPath, "utf8"));
  } catch {
    // Stats file doesn't exist yet or is empty
  }
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "jmancentral-stats",
    ...(githubToken ? { Authorization: "Bearer " + githubToken } : {}),
  };
  try {
    const [profile, repos] = await Promise.all([
      getJson("https://api.github.com/users/" + username, headers),
      getAllRepos(headers),
    ]);
    const originalRepos = repos.filter((repo) => !repo.fork);

    const [repositoryLanguages, latestReleases, totalPullRequests, totalIssues] = await Promise.all([
      Promise.all(originalRepos.map((repo) => getJson(repo.languages_url, headers))),
      Promise.all(originalRepos.map((repo) => getLatestRelease(repo.full_name, headers))),
      getSearchTotal("author:" + username + " type:pr", headers),
      getSearchTotal("author:" + username + " type:issue", headers),
    ]);

    const languages = new Map();
    repositoryLanguages.forEach((languageBytes) => Object.entries(languageBytes).forEach(([language, bytes]) => {
      languages.set(language, (languages.get(language) ?? 0) + bytes);
    }));

    // Keyed by lowercase "owner/name" so lookups survive casing differences.
    const repositories = Object.fromEntries(originalRepos.map((repo, index) => [
      repo.full_name.toLowerCase(),
      {
        fullName: repo.full_name,
        url: repo.html_url,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        pushedAt: repo.pushed_at,
        latestRelease: latestReleases[index],
      },
    ]));

    return {
      username,
      profileUrl: profile.html_url,
      avatarUrl: profile.avatar_url,
      publicRepos: profile.public_repos,
      followers: profile.followers,
      totalStars: repos.reduce((total, repo) => total + repo.stargazers_count, 0),
      totalForks: repos.reduce((total, repo) => total + repo.forks_count, 0),
      totalPullRequests,
      totalIssues,
      joinedYear: new Date(profile.created_at).getFullYear(),
      topLanguages: [...languages.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([language]) => language),
      repositories,
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    if (strictRefresh) throw error;
    if (fallback) {
      console.warn("Using saved GitHub stats: " + error.message);
      return fallback;
    }
    throw new Error("Unable to fetch GitHub stats and no saved fallback stats are available: " + error.message);
  }
}

// The card is shown as an <img>, which can't load external URLs, so the avatar must be embedded.
// If the download fails, embed the local copy of the same mascot rather than an unloadable link.
const localAvatarPath = fileURLToPath(new URL("../src/assets/brandmark.png", import.meta.url));

async function getAvatarImage(url) {
  try {
    const response = await fetch(url, withTimeout());
    if (!response.ok) throw new Error("Unable to retrieve avatar");
    const mimeType = response.headers.get("content-type")?.split(";")[0] ?? "image/png";
    return "data:" + mimeType + ";base64," + Buffer.from(await response.arrayBuffer()).toString("base64");
  } catch (error) {
    console.warn("Using the local brandmark for the stats card avatar: " + error.message);
    try {
      return "data:image/png;base64," + (await readFile(localAvatarPath)).toString("base64");
    } catch {
      return url;
    }
  }
}

const stats = await getCurrentStats();
const [avatarImage, sans, mono] = await Promise.all([
  getAvatarImage(stats.avatarUrl),
  fontDataUri(FONT_FILES.sans),
  fontDataUri(FONT_FILES.mono),
]);
await mkdir(fileURLToPath(new URL("../src/data/", import.meta.url)), { recursive: true });
await writeFile(statsPath, JSON.stringify(stats, null, 2) + "\n");
await writeFile(svgPath, createSvg({ ...stats, avatarImage }, { sans, mono }));
console.log("Generated GitHub stats for " + username + ".");
