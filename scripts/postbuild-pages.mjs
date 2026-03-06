import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const distDir = path.resolve("dist");
const indexPath = path.join(distDir, "index.html");
const notFoundPath = path.join(distDir, "404.html");
const socialDir = path.join(distDir, "social");
const socialPath = path.join(socialDir, "index.html");

const homeHtml = await readFile(indexPath, "utf8");

const socialHtml = homeHtml
  .replace(
    /<title>.*?<\/title>/,
    "<title>Jman Central - Social Links</title>",
  )
  .replace(
    /<meta name="description" content=".*?" \/>/,
    '<meta name="description" content="Find JMAN CENTRAL across the internet." />',
  )
  .replace(
    /<link rel="canonical" href=".*?" \/>/,
    '<link rel="canonical" href="https://jmancentral.com/social" />',
  )
  .replace(
    /<meta property="og:title" content=".*?" \/>/,
    '<meta property="og:title" content="Jman Central - Social Links" />',
  )
  .replace(
    /<meta property="og:description" content=".*?" \/>/,
    '<meta property="og:description" content="Find JMAN CENTRAL across the internet." />',
  )
  .replace(
    /<meta property="og:url" content=".*?" \/>/,
    '<meta property="og:url" content="https://jmancentral.com/social" />',
  )
  .replace(
    /<meta name="twitter:title" content=".*?" \/>/,
    '<meta name="twitter:title" content="Jman Central - Social Links" />',
  )
  .replace(
    /<meta name="twitter:description" content=".*?" \/>/,
    '<meta name="twitter:description" content="Find JMAN CENTRAL across the internet." />',
  );

await writeFile(notFoundPath, homeHtml);
await mkdir(socialDir, { recursive: true });
await writeFile(socialPath, socialHtml);
