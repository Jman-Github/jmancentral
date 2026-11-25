// Site content. Edit this file to change projects, links, and contact details.

import patchBundleRegistryIcon from "@/assets/icons/patch-bundle-registry.svg";
import universalPatchManagerIcon from "@/assets/icons/universal-patch-manager.svg";

export const site = {
  name: "Jman Central",
  owner: "Jman",
  url: "https://jmancentral.com",
  email: "jman@public.jmancentral.com",
  timeZone: "America/New_York",
  sourceUrl: "https://github.com/Jman-Github/jmancentral",
  githubUrl: "https://github.com/Jman-Github",
  pgpKey: {
    href: "/jman.public.key.asc",
    fingerprint: "F8F1 026F C129 EF4F 2603  8E84 A760 77A9 B421 7C52",
  },
};

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "discontinued";
  url: string;
  /** Platform glyph shown when there is no project icon. */
  platform: "github" | "roblox";
  /** Project icon URL. */
  icon?: string;
  /** "owner/name"; stars, release and last push come from build-time GitHub stats. */
  githubRepo?: string;
  /** Shown for projects without GitHub data. */
  lastUpdated?: string;
}

export const projects: Project[] = [
  {
    id: "patch-bundle-registry",
    name: "Patch Bundle Registry Repository",
    description:
      "A comprehensive registry for ReVanced, Morphe, and Reseam patch bundles with searchable patches, app compatibility, historical releases, prereleases, and changelogs, available through a REST and GraphQL API plus a user-friendly frontend.",
    status: "active",
    url: "https://github.com/Jman-Github/Patch-Bundle-Registry",
    githubRepo: "Jman-Github/Patch-Bundle-Registry",
    platform: "github",
    icon: patchBundleRegistryIcon,
  },
  {
    id: "awesome-android-patching",
    name: "Awesome Android Patching Repository",
    description:
      "An awesome list of tools, guides, and resources for ReVanced, Morphe, and Reseam. Community-driven and regularly updated with new content.",
    status: "active",
    url: "https://github.com/Jman-Github/Awesome-Android-Patching",
    githubRepo: "Jman-Github/Awesome-Android-Patching",
    platform: "github",
  },
  {
    id: "universal-patch-manager",
    name: "Universal Patch Manager Repository",
    description:
      "Android manager for ReVanced, Morphe, and Reseam with third-party patch bundles, batch and automatic repatching, advanced installers, APK tools, and deep customization.",
    status: "active",
    url: "https://github.com/Jman-Github/Universal-Patch-Manager",
    githubRepo: "Jman-Github/Universal-Patch-Manager",
    platform: "github",
    icon: universalPatchManagerIcon,
  },
  {
    id: "scp-sculpture",
    name: "[SCP] The Sculpture Roleplay",
    description:
      "A Roblox experience where players roleplay scenarios involving SCP-173. Discontinued due to a loss of motivation.",
    status: "discontinued",
    url: "https://www.roblox.com/games/5941309542/The-Sculpture-Roleplay",
    platform: "roblox",
    lastUpdated: "April 2024",
  },
  {
    id: "infinite-cart-ride",
    name: "Infinite Cart Ride",
    description:
      "A cart ride game on Roblox with infinite procedurally generated tracks. Discontinued due to a loss of motivation.",
    status: "discontinued",
    url: "https://www.roblox.com/games/13975568604/Infinite-Cart-Ride",
    platform: "roblox",
    lastUpdated: "August 2023",
  },
];

export interface SocialLink {
  id: string;
  platform: string;
  username: string;
  url: string;
  /** Key in socialIconPaths, or "medal" (bitmap mask). */
  icon: string;
}

// The GitHub, X, YouTube and Reddit URLs are also listed in the JSON-LD "sameAs" in index.html,
// and the X handle in its twitter:site meta tag; update both together.
export const socialLinks: SocialLink[] = [
  { id: "roblox", platform: "Roblox", username: "Jman_Blox", url: "https://www.roblox.com/users/539566549/profile", icon: "roblox" },
  { id: "discord", platform: "Discord", username: "JmanMedia", url: "https://discord.com/users/608814881302511616", icon: "discord" },
  { id: "medal", platform: "Medal", username: "JmanMedal", url: "https://medal.tv/u/JmanMedal?invite=ur-MSxoVXAsMTg4Mzc2NjA4LA", icon: "medal" },
  { id: "steam", platform: "Steam", username: "JmanGaming", url: "https://steamcommunity.com/profiles/76561199007938519/", icon: "steam" },
  { id: "youtube", platform: "YouTube", username: "OfficialJmanYoutube", url: "https://www.youtube.com/channel/UCB4b-b-eiFoPyhs45tPqGZw", icon: "youtube" },
  { id: "twitter", platform: "X / Twitter", username: "Jman_TW", url: "https://x.com/Jman_TW", icon: "x" },
  { id: "github", platform: "GitHub", username: "Jman-Github", url: "https://github.com/Jman-Github", icon: "github" },
  { id: "instagram", platform: "Instagram", username: "jman_media", url: "https://www.instagram.com/jman_media", icon: "instagram" },
  { id: "threads", platform: "Threads", username: "jman_media", url: "https://www.threads.com/@jman_media", icon: "threads" },
  { id: "reddit", platform: "Reddit", username: "u/Jman-Reddit", url: "https://www.reddit.com/user/Jman-Reddit", icon: "reddit" },
  { id: "replit", platform: "Replit", username: "JmanReplit", url: "https://replit.com/@JmanReplit", icon: "replit" },
  { id: "tiktok", platform: "TikTok", username: "jman_tiktok", url: "https://www.tiktok.com/@jman_tiktok", icon: "tiktok" },
  { id: "twitch", platform: "Twitch", username: "Jman_Twitch6666", url: "https://www.twitch.tv/jman_twitch6666", icon: "twitch" },
  { id: "xbox", platform: "Xbox Live", username: "JmanCraft6646", url: "https://account.xbox.com/en-us/profile?gamertag=JmanCraft6646", icon: "xbox" },
];
