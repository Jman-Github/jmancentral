import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const username = "Jman-Github";
const publicDirectory = fileURLToPath(new URL("../public/", import.meta.url));
const statsPath = publicDirectory + "github-stats.json";
const svgPath = publicDirectory + "github-stats.svg";
const numberFormat = new Intl.NumberFormat("en-US");
const strictRefresh = process.env.GITHUB_STATS_STRICT === "true";
const githubToken = process.env.GITHUB_TOKEN;

const xml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
})[character]);

function text(x, y, value, options) {
  const { fill = "#F5FBFF", size = 14, weight = 400, anchor = "start", spacing = 0 } = options ?? {};
  return '<text x="' + x + '" y="' + y + '" text-anchor="' + anchor + '" fill="' + fill + '" font-family="Inter,Segoe UI,Arial,sans-serif" font-size="' + size + '" font-weight="' + weight + '" letter-spacing="' + spacing + '">' + xml(value) + '</text>';
}

function icon(type, x, y) {
  const start = '<g transform="translate(' + x + ' ' + y + ')" fill="none" stroke="#25D3EC" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">';
  const icons = {
    issue: '<circle cx="8" cy="8" r="6.5"/><circle cx="8" cy="8" r="1"/>',
    repos: '<path d="M2 3.5h5l1.5 2H14a1.5 1.5 0 0 1 1.5 1.5v6A1.5 1.5 0 0 1 14 14.5H2A1.5 1.5 0 0 1 .5 13V5A1.5 1.5 0 0 1 2 3.5Z"/><path d="M10.5 8.5v4M8.5 10.5h4"/>',
    stars: '<path d="m8 1.2 2 4.2 4.6.7-3.3 3.3.8 4.6L8 11.8 3.9 14l.8-4.6L1.4 6.1 6 5.4Z"/>',
    followers: '<circle cx="6" cy="5.3" r="2.8"/><circle cx="12.5" cy="6.5" r="2.1"/><path d="M1.5 14.5v-1.4A4.1 4.1 0 0 1 5.6 9h.8a4.1 4.1 0 0 1 4.1 4.1v1.4M11.1 10.1a3.5 3.5 0 0 1 3.4 3.5v.9"/>',
    prs: '<circle cx="4" cy="3.5" r="2"/><circle cx="12" cy="12.5" r="2"/><path d="M6 3.5h2.5A3.5 3.5 0 0 1 12 7v3.5M6 12.5h2.5A3.5 3.5 0 0 0 12 9V7"/>',
    forks: '<circle cx="4" cy="3.5" r="2"/><circle cx="12" cy="3.5" r="2"/><circle cx="8" cy="12.5" r="2"/><path d="M4 5.5v1.3A3.2 3.2 0 0 0 7.2 10H8M12 5.5v1.3A3.2 3.2 0 0 1 8.8 10H8"/>',
    github: '<path d="M8 1.2a6.8 6.8 0 0 0-2.2 13.2c.3.1.4-.1.4-.3v-1.3c-1.5.3-1.8-.6-1.8-.6-.2-.6-.6-.8-.6-.8-.5-.3 0-.3 0-.3.5 0 .8.6.8.6.5.8 1.3.6 1.6.5.1-.3.2-.6.4-.7-1.2-.2-2.5-.6-2.5-2.7 0-.6.2-1 .6-1.4-.1-.2-.3-.7.1-1.4 0 0 .5-.2 1.5.5a5.2 5.2 0 0 1 2.7 0c1-.7 1.5-.5 1.5-.5.4.7.2 1.2.1 1.4.4.4.6.8.6 1.4 0 2.1-1.3 2.5-2.5 2.7.2.2.4.5.4 1v1.5c0 .2.1.4.4.3A6.8 6.8 0 0 0 8 1.2Z"/>',
    code: '<path d="m6 4-4 4 4 4M10 4l4 4-4 4M9 2.2 7 13.8"/>',
  };
  return start + icons[type] + '</g>';
}

function chip(x, label) {
  const width = Math.max(72, 28 + label.length * 7.2);
  return { width, svg: '<g transform="translate(' + x + ' 262)"><rect width="' + width + '" height="26" rx="13" fill="#083047" stroke="#0A5B78"/>' + icon("code", 11, 5) + text(31, 17, label, { fill: "#25D3EC", size: 12, weight: 600 }) + '</g>' };
}

function statCard(x, y, label, value, description, iconName) {
  return '<g transform="translate(' + x + ' ' + y + ')"><title>' + xml(description) + '</title><rect width="144" height="121" rx="17" fill="#091526" fill-opacity=".58" stroke="#1A2C43"/>' + icon(iconName, 17, 17) +
    text(17, 76, value, { size: 25, weight: 700 }) +
    text(17, 100, label, { fill: "#8FA2B7", size: 11.5, weight: 700, spacing: .35 }) + '</g>';
}

function createSvg(stats) {
  let chipX = 50;
  const languageChips = stats.topLanguages.slice(0, 4).map((language) => {
    const item = chip(chipX, language);
    chipX += item.width + 8;
    return item.svg;
  }).join("");

  return '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<svg width="1075" height="416" viewBox="0 0 1075 416" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title description">\n' +
    '<title id="title">Jman GitHub developer profile</title><desc id="description">This card summarizes my public GitHub activity: ' + xml(stats.totalPullRequests) + ' public pull requests, ' + xml(stats.totalIssues) + ' public issues, ' + xml(stats.publicRepos) + ' public repositories, ' + xml(stats.totalStars) + ' stars received, ' + xml(stats.followers) + ' followers, and ' + xml(stats.totalForks) + ' forks received.</desc>\n' +
    '<defs><linearGradient id="panel" x1="0" y1="0" x2="1075" y2="416" gradientUnits="userSpaceOnUse"><stop stop-color="#0B182A"/><stop offset="1" stop-color="#071320"/></linearGradient><filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter><clipPath id="avatar"><rect x="50" y="118" width="55" height="55" rx="16"/></clipPath></defs>\n' +
    '<rect x="9" y="16" width="1052" height="384" rx="24" fill="url(#panel)" stroke="#0A5976"/><circle cx="1030" cy="119" r="151" stroke="#25D3EC" stroke-opacity=".18"/><circle cx="1030" cy="119" r="113" stroke="#25D3EC" stroke-opacity=".11"/><circle cx="50" cy="70" r="4.5" fill="#25D3EC" filter="url(#glow)"/>\n' +
    text(64, 74, "DEVELOPER PROFILE", { fill: "#25D3EC", size: 12.5, weight: 700, spacing: 2.2 }) +
    '<image href="' + xml(stats.avatarImage ?? stats.avatarUrl) + '" x="50" y="118" width="55" height="55" preserveAspectRatio="xMidYMid slice" clip-path="url(#avatar)"/><rect x="50" y="118" width="55" height="55" rx="16" fill="none" stroke="#0D5975"/>' +
    text(121, 132, "Open-source work by", { fill: "#8FAFC9", size: 14, weight: 600 }) +
    text(121, 166, "Jman", { size: 29, weight: 700 }) +
    icon("github", 50, 187) + text(72, 201, "On GitHub since " + stats.joinedYear, { fill: "#9EC2DD", size: 12, weight: 600 }) +
    text(50, 247, "MOST USED LANGUAGES", { fill: "#91A6BB", size: 12, weight: 700, spacing: 1.7 }) + languageChips +
    statCard(562, 118, "TOTAL ISSUES", numberFormat.format(stats.totalIssues), "Total number of public issues I have opened on GitHub.", "issue") +
    statCard(718, 118, "PUBLIC REPOS", numberFormat.format(stats.publicRepos), "Total number of public repositories I own.", "repos") +
    statCard(875, 118, "STARS EARNED", numberFormat.format(stats.totalStars), "Total number of stars my public repositories have received.", "stars") +
    statCard(562, 251, "FOLLOWERS", numberFormat.format(stats.followers), "Total number of GitHub users who follow me.", "followers") +
    statCard(718, 251, "TOTAL PRS", numberFormat.format(stats.totalPullRequests), "Total number of public pull requests I have opened on GitHub.", "prs") +
    statCard(875, 251, "FORKS RECEIVED", numberFormat.format(stats.totalForks), "Total number of times my public repositories have been forked.", "forks") + '</svg>';
}

async function getSearchTotal(query, headers) {
  const response = await fetch("https://api.github.com/search/issues?q=" + encodeURIComponent(query) + "&per_page=1", { headers });

  if (!response.ok) throw new Error("Unable to retrieve GitHub search results");

  const result = await response.json();
  if (result.incomplete_results) throw new Error("GitHub returned incomplete search results");

  return result.total_count;
}

async function getCurrentStats() {
  const fallback = JSON.parse(await readFile(statsPath, "utf8"));
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "jmancentral-stats",
    ...(githubToken ? { Authorization: "Bearer " + githubToken } : {}),
  };
  try {
    const [profileResponse, reposResponse] = await Promise.all([
      fetch("https://api.github.com/users/" + username, { headers }),
      fetch("https://api.github.com/users/" + username + "/repos?per_page=100&sort=updated", { headers }),
    ]);
    if (!profileResponse.ok || !reposResponse.ok) throw new Error("GitHub API request failed");

    const profile = await profileResponse.json();
    const repos = await reposResponse.json();
    const originalRepos = repos.filter((repo) => !repo.fork);
    const languageResponses = await Promise.all(originalRepos.map((repo) => fetch(repo.languages_url, { headers })));
    if (languageResponses.some((response) => !response.ok)) throw new Error("Unable to retrieve repository languages");

    const languages = new Map();
    const repositoryLanguages = await Promise.all(languageResponses.map((response) => response.json()));
    repositoryLanguages.forEach((languageBytes) => Object.entries(languageBytes).forEach(([language, bytes]) => {
      languages.set(language, (languages.get(language) ?? 0) + bytes);
    }));
    const topRepository = [...originalRepos].sort((a, b) => b.stargazers_count - a.stargazers_count)[0];
    const activeAfter = Date.now() - 180 * 24 * 60 * 60 * 1000;
    const [totalPullRequests, totalIssues] = await Promise.all([
      getSearchTotal("author:" + username + " type:pr", headers),
      getSearchTotal("author:" + username + " type:issue", headers),
    ]);

    return {
      username, profileUrl: profile.html_url, avatarUrl: profile.avatar_url, publicRepos: profile.public_repos, followers: profile.followers, following: profile.following,
      totalStars: repos.reduce((total, repo) => total + repo.stargazers_count, 0), totalForks: repos.reduce((total, repo) => total + repo.forks_count, 0), totalPullRequests, totalIssues,
      activeRepos: repos.filter((repo) => repo.pushed_at && new Date(repo.pushed_at).getTime() >= activeAfter).length, joinedYear: new Date(profile.created_at).getFullYear(),
      topLanguages: [...languages.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([language]) => language),
      featuredRepo: topRepository ? { name: topRepository.name, url: topRepository.html_url, description: topRepository.description, stars: topRepository.stargazers_count } : null,
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    if (strictRefresh) throw error;
    console.warn("Using saved GitHub stats: " + error.message);
    return fallback;
  }
}

async function getAvatarImage(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Unable to retrieve avatar");
    const mimeType = response.headers.get("content-type")?.split(";")[0] ?? "image/png";
    return "data:" + mimeType + ";base64," + Buffer.from(await response.arrayBuffer()).toString("base64");
  } catch {
    return url;
  }
}

const stats = await getCurrentStats();
const avatarImage = await getAvatarImage(stats.avatarUrl);
await writeFile(statsPath, JSON.stringify(stats, null, 2) + "\n");
await writeFile(svgPath, createSvg({ ...stats, avatarImage }));
console.log("Generated GitHub stats for " + username + ".");

