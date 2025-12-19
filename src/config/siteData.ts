// Site configuration - Edit this file to customize your content

export const siteConfig = {
  name: "JMAN CENTRAL",
  email: "jman@public.jmancentral.com",
  tagline: "Projects and links",
};

export interface Project {
  id: string;
  name: string;
  description: string;
  details: string;
  status: "active" | "discontinued";
  url: string;
  image?: string;
  lastUpdated?: string;
}

export const projects: Project[] = [
  {
    id: "revanced-patches",
    name: "ReVanced Patch Bundles Repository",
    description: "A collection of ReVanced patches bundled for easy use",
    details: "This repository contains pre-bundled ReVanced patches that simplify the patching process for various Android applications. Actively maintained with regular updates.",
    status: "active",
    url: "https://github.com/Jman-Github/ReVanced-Patch-Bundles",
    image: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
  },
  {
    id: "awesome-revanced",
    name: "Awesome ReVanced Repository",
    description: "A curated list of awesome ReVanced resources",
    details: "An awesome list featuring tools, guides, and resources related to ReVanced. Community-driven and regularly updated with new content. Actively maintained with regular updates.",
    status: "active",
    url: "https://github.com/Jman-Github/Awesome-ReVanced",
    image: "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png",
  },
  {
    id: "universal-revanced-manager",
    name: "Universal ReVanced Manager Repository",
    description: "A fork of the official ReVanced Manager",
    details: "An Android application to use ReVanced on that has extra features the official manager doesn't have. Actively maintained with regular updates.",
    status: "active",
    url: "https://github.com/Jman-Github/Universal-ReVanced-Manager",
    image: "https://raw.githubusercontent.com/Jman-Github/Universal-ReVanced-Manager/refs/heads/main/assests/icons/icon.png",
  },
  {
    id: "scp-sculpture",
    name: "[SCP] The Sculpture Roleplay",
    description: "A Roblox roleplay experience based on SCP-173",
    details: "An immersive Roblox experience where players could roleplay scenarios involving SCP-173. The project was discontinued due to a loss of motivation.",
    status: "discontinued",
    url: "https://www.roblox.com/games/5941309542/SCP-The-Sculpture-Roleplay",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Roblox_%282025%29_%28App_Icon%29.svg/500px-Roblox_%282025%29_%28App_Icon%29.svg.png",
    lastUpdated: "April 2024",
  },
  {
    id: "infinite-cart-ride",
    name: "Infinite Cart Ride",
    description: "An endless cart ride adventure game on Roblox",
    details: "A fun cart ride game featuring infinite procedurally generated tracks. The project was discontinued due to a loss of motivation.",
    status: "discontinued",
    url: "https://www.roblox.com/games/13975568604/Infinite-Cart-Ride",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Roblox_%282025%29_%28App_Icon%29.svg/500px-Roblox_%282025%29_%28App_Icon%29.svg.png",
    lastUpdated: "August 2023",
  },
];

export interface SocialLink {
  id: string;
  platform: string;
  username: string;
  url: string;
  icon: string;
}

export const socialLinks: SocialLink[] = [
  { id: "roblox", platform: "Roblox", username: "Jman_Blox", url: "https://www.roblox.com/users/539566549/profile", icon: "roblox" },
  { id: "discord", platform: "Discord", username: "JmanMedia", url: "https://discordapp.com/users/608814881302511616", icon: "discord" },
  { id: "medal", platform: "Medal", username: "JmanMedal", url: "https://medal.tv/u/JmanMedal?invite=ur-MSxoVXAsMTg4Mzc2NjA4LA", icon: "medal" },
  { id: "steam", platform: "Steam", username: "JmanGaming", url: "https://steamcommunity.com/profiles/76561199007938519/", icon: "steam" },
  { id: "youtube", platform: "YouTube", username: "OffcialJmanYoutube", url: "https://www.youtube.com/channel/UCB4b-b-eiFoPyhs45tPqGZw", icon: "youtube" },
  { id: "twitter", platform: "X / Twitter", username: "Jman_TW", url: "https://x.com/Jman_TW", icon: "x" },
  { id: "github", platform: "GitHub", username: "Jman-Github", url: "https://github.com/Jman-Github", icon: "github" },
  { id: "instagram", platform: "Instagram", username: "jman_media", url: "https://instagram.com", icon: "instagram" },
  { id: "guilded", platform: "Guilded", username: "JmanGuilded", url: "https://www.guilded.gg/u/JmanGuilded", icon: "guilded" },
  { id: "threads", platform: "Threads", username: "jman_media", url: "https://www.threads.net/@jman_media", icon: "threads" },
  { id: "reddit", platform: "Reddit", username: "u/Jman-Reddit", url: "https://www.reddit.com/user/Jman-Redditm", icon: "reddit" },
  { id: "replit", platform: "Replit", username: "JmanReplit", url: "https://replit.com/@JmanReplit", icon: "replit" },
  { id: "tiktok", platform: "TikTok", username: "jmantiktok6666", url: "https://www.tiktok.com/@jmantiktok6666", icon: "tiktok" },
  { id: "twitch", platform: "Twitch", username: "Jman_Twitch6666", url: "https://www.twitch.tv/jman_twitch6666", icon: "twitch" },
  { id: "xbox", platform: "Xbox Live", username: "JmanCraft6646", url: "https://account.xbox.com/en-us/profile?gamertag=JmanCraft6646", icon: "xbox" },
];
