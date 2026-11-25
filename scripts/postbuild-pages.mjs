// GitHub Pages has no SPA fallback, so emit a real HTML file per route with the right metadata:
//   dist/index.html         -> /
//   dist/social/index.html  -> /social/
//   dist/404.html           -> every unknown path (served with a 404 status; the app renders NotFound)
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const distDir = path.resolve("dist");
const siteUrl = "https://jmancentral.com";
const pages = JSON.parse(await readFile(path.resolve("src/config/pages.json"), "utf8"));
const homeHtml = withContentSecurityPolicy(await readFile(path.join(distDir, "index.html"), "utf8"));

// GitHub Pages can't send response headers, so the policy ships as a <meta> tag. Inline scripts
// (the pre-paint theme script) are allowed by hash, computed here so edits can't silently break them.
function withContentSecurityPolicy(html) {
  const inlineScripts = [...html.matchAll(/<script(?![^>]*\ssrc=)(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/g)];
  // Browsers hash the script text after the HTML parser has turned CRLF and lone CR into LF, so do the
  // same; otherwise a CRLF checkout (Windows with core.autocrlf) produces a hash that blocks the script.
  const hashes = inlineScripts.map(([, body]) => `'sha256-${createHash("sha256").update(body.replace(/\r\n?/g, "\n")).digest("base64")}'`);
  const policy = [
    "default-src 'self'",
    `script-src 'self' ${hashes.join(" ")}`.trim(),
    "style-src 'self'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
  if (!/<meta charset="UTF-8" \/>/.test(html)) throw new Error("index.html is missing <meta charset>");
  return html.replace(/(<meta charset="UTF-8" \/>)/, (tag) => `${tag}\n    <meta http-equiv="Content-Security-Policy" content="${policy}" />`);
}

const escapeAttr = (value) => value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// Replacements below use functions, not strings: a replacement string would expand `$&`, `$1`,
// `$'` etc. inside page titles and descriptions edited in pages.json.
function setMeta(html, attribute, key, content) {
  const pattern = new RegExp(`(<meta ${attribute}="${key}" content=")[^"]*(")`);
  if (!pattern.test(html)) throw new Error(`index.html is missing <meta ${attribute}="${key}">`);
  return html.replace(pattern, (_, open, close) => `${open}${escapeAttr(content)}${close}`);
}

function renderPage(page, { canonical = true, noindex = false } = {}) {
  let html = homeHtml.replace(/<title>[^<]*<\/title>/, () => `<title>${escapeAttr(page.title)}</title>`);
  for (const [attribute, key, value] of [
    ["name", "description", page.description],
    ["property", "og:title", page.title],
    ["property", "og:description", page.description],
    ["name", "twitter:title", page.title],
    ["name", "twitter:description", page.description],
  ]) {
    html = setMeta(html, attribute, key, value);
  }

  if (canonical) {
    const url = new URL(page.path, siteUrl).href;
    html = setMeta(html, "property", "og:url", url).replace(/(<link rel="canonical" href=")[^"]*(")/, (_, open, close) => `${open}${escapeAttr(url)}${close}`);
  } else {
    html = html.replace(/\s*<link rel="canonical"[^>]*>/, "").replace(/\s*<meta property="og:url"[^>]*>/, "");
  }

  if (noindex) html = html.replace("</title>", () => '</title>\n    <meta name="robots" content="noindex" />');
  return html;
}

// The home page also goes through renderPage so pages.json stays the single source for every route.
await writeFile(path.join(distDir, "index.html"), renderPage(pages.home));
await mkdir(path.join(distDir, "social"), { recursive: true });
await writeFile(path.join(distDir, "social", "index.html"), renderPage(pages.social));
await writeFile(path.join(distDir, "404.html"), renderPage(pages.notFound, { canonical: false, noindex: true }));
console.log("Wrote index.html (CSP), social/index.html and 404.html");
