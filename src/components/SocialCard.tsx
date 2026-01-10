import { useState } from "react";
import { ExternalLink, Copy } from "lucide-react";
import type { SocialLink } from "@/config/siteData";
import { cn } from "@/lib/utils";
import discordIconUrl from "@/assets/icons/discord.svg";
import githubIconUrl from "@/assets/icons/github.svg";
import guildedIconUrl from "@/assets/icons/guilded.svg";
import instagramIconUrl from "@/assets/icons/instagram.svg";
import medalIconUrl from "@/assets/icons/medal.png";
import redditIconUrl from "@/assets/icons/reddit.svg";
import replitIconUrl from "@/assets/icons/replit.svg";
import robloxIconUrl from "@/assets/icons/roblox.png";
import soraIconUrl from "@/assets/icons/sora.png";
import steamIconUrl from "@/assets/icons/steam.svg";
import threadsIconUrl from "@/assets/icons/threads.svg";
import tiktokIconUrl from "@/assets/icons/tiktok.svg";
import twitchIconUrl from "@/assets/icons/twitch.svg";
import xIconUrl from "@/assets/icons/x.svg";
import xboxIconUrl from "@/assets/icons/xbox.svg";
import youtubeIconUrl from "@/assets/icons/youtube.svg";

type IconProps = { className?: string; style?: React.CSSProperties };
type IconComponent = React.ComponentType<IconProps>;

type ImageIconProps = IconProps & { src: string; alt?: string };

function ImageIcon({ src, alt = "", className, style }: ImageIconProps) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return <ExternalLink className={cn("h-6 w-6", className)} style={style} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn("h-6 w-6", className)}
      style={style}
      loading="lazy"
      decoding="async"
      onError={() => setErrored(true)}
    />
  );
}

const makeImageIcon = (src: string): IconComponent => {
  return function Icon({ className, style }: IconProps) {
    return <ImageIcon src={src} className={className} style={style} />;
  };
};

const RobloxIcon = makeImageIcon(robloxIconUrl);
const DiscordIcon = makeImageIcon(discordIconUrl);
const MedalIcon = makeImageIcon(medalIconUrl);
const SoraIcon = makeImageIcon(soraIconUrl);
const SteamIcon = makeImageIcon(steamIconUrl);
const YoutubeIcon = makeImageIcon(youtubeIconUrl);
const XIcon = makeImageIcon(xIconUrl);
const GithubIcon = makeImageIcon(githubIconUrl);
const InstagramIcon = makeImageIcon(instagramIconUrl);
const GuildedIcon = makeImageIcon(guildedIconUrl);
const ThreadsIcon = makeImageIcon(threadsIconUrl);
const RedditIcon = makeImageIcon(redditIconUrl);
const ReplitIcon = makeImageIcon(replitIconUrl);
const TiktokIcon = makeImageIcon(tiktokIconUrl);
const TwitchIcon = makeImageIcon(twitchIconUrl);
const XboxIcon = makeImageIcon(xboxIconUrl);

const iconMap: Record<
  string,
  {
    Icon: IconComponent;
    color?: string;
    backgroundColor?: string;
    className?: string;
    full?: boolean;
  }
> = {
  roblox: {
    Icon: RobloxIcon,
    backgroundColor: "#00A2FF",
    className: "h-full w-full object-cover",
    full: true,
  },
  discord: { Icon: DiscordIcon, backgroundColor: "#5865F2" },
  medal: { Icon: MedalIcon, backgroundColor: "#000000" },
  sora: { Icon: SoraIcon, className: "h-full w-full object-cover", full: true },
  steam: { Icon: SteamIcon, backgroundColor: "#1b2838" },
  youtube: { Icon: YoutubeIcon, backgroundColor: "#FF0000" },
  x: { Icon: XIcon, backgroundColor: "#000000" },
  github: { Icon: GithubIcon, backgroundColor: "#181717" },
  instagram: { Icon: InstagramIcon, backgroundColor: "#E4405F" },
  guilded: { Icon: GuildedIcon, backgroundColor: "#F5C400" },
  threads: { Icon: ThreadsIcon, backgroundColor: "#000000" },
  reddit: { Icon: RedditIcon, backgroundColor: "#FF4500" },
  replit: { Icon: ReplitIcon, backgroundColor: "#F26207" },
  tiktok: { Icon: TiktokIcon, backgroundColor: "#000000" },
  twitch: { Icon: TwitchIcon, backgroundColor: "#9146FF" },
  xbox: { Icon: XboxIcon, backgroundColor: "#107C10" },
};

interface SocialCardProps {
  social: SocialLink;
  index: number;
}

export function SocialCard({ social, index }: SocialCardProps) {
  const iconEntry = iconMap[social.icon];
  const Icon = iconEntry?.Icon ?? ExternalLink;
  const iconStyle = iconEntry?.color ? { color: iconEntry.color } : undefined;
  const iconClassName = iconEntry?.className ?? "h-6 w-6";
  const iconContainerStyle = iconEntry?.backgroundColor
    ? { backgroundColor: iconEntry.backgroundColor }
    : undefined;
  const [copied, setCopied] = useState(false);

  const fallbackCopy = (text: string) => {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      return true;
    } catch (e) {
      console.error("Fallback copy failed", e);
      return false;
    }
  };

  const handleCopy = async (e?: React.MouseEvent | React.KeyboardEvent) => {
    e?.stopPropagation();
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(social.username);
        setCopied(true);
      } else if (fallbackCopy(social.username)) {
        setCopied(true);
      }
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      const ok = fallbackCopy(social.username);
      if (ok) {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } else {
        console.error("Failed to copy handle", e);
      }
    }
  };

  return (
    <article
      className={cn(
        "group glass rounded-xl p-6 transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/60 focus-within:ring-offset-2 focus-within:ring-offset-background",
        "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/8",
        "hover:-translate-y-1.5",
        "animate-slide-up"
      )}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-center gap-4 relative">
        {/* Icon */}
        <div
          className={cn(
            "flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-colors",
            iconEntry?.full
              ? "overflow-hidden bg-transparent"
              : iconEntry?.backgroundColor
                ? "opacity-90 group-hover:opacity-100"
                : "bg-primary/10 group-hover:bg-primary/20"
          )}
          style={iconContainerStyle}
        >
          <Icon className={iconClassName} style={iconStyle} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {social.platform}
          </h3>
          <button
            className="text-left w-full text-sm text-muted-foreground truncate cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            title={copied ? "Copied!" : "Click to copy handle"}
            onClick={handleCopy}
            aria-label={`Copy ${social.username}`}
          >
            {social.username}
          </button>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-secondary/60 hover:bg-secondary transition-colors"
              title={copied ? "Copied!" : "Copy handle"}
            >
              <Copy className="h-3 w-3" aria-hidden="true" />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* Link Button */}
        <a
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex-shrink-0 inline-flex items-center justify-center",
            "w-10 h-10 rounded-lg ring-0",
            "bg-secondary hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/25",
            "transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          )}
          aria-label={`Open ${social.platform}`}
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}
