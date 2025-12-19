import { useState } from "react";
import { ExternalLink, Copy } from "lucide-react";
import { FaXbox } from "react-icons/fa";
import {
  SiDiscord,
  SiGithub,
  SiGuilded,
  SiInstagram,
  SiReddit,
  SiReplit,
  SiRoblox,
  SiSteam,
  SiThreads,
  SiTiktok,
  SiTwitch,
  SiX,
  SiYoutube,
} from "react-icons/si";
import type { SocialLink } from "@/config/siteData";
import { cn } from "@/lib/utils";
import medalIconUrl from "@/assets/icons/medal.png";

type IconProps = { className?: string; style?: React.CSSProperties };
type IconComponent = React.ComponentType<IconProps>;

function MedalIcon({ className, style }: IconProps) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return <ExternalLink className={cn("h-6 w-6", className)} style={style} />;
  }

  return (
    <img
      src={medalIconUrl}
      alt=""
      className={cn("h-6 w-6", className)}
      style={style}
      loading="lazy"
      decoding="async"
      onError={() => setErrored(true)}
    />
  );
}

const iconMap: Record<
  string,
  { Icon: IconComponent; color?: string; backgroundColor?: string }
> = {
  roblox: { Icon: SiRoblox, color: "#ffffff", backgroundColor: "#00A2FF" },
  discord: { Icon: SiDiscord, color: "#ffffff", backgroundColor: "#5865F2" },
  medal: { Icon: MedalIcon, backgroundColor: "#000000" },
  steam: { Icon: SiSteam, color: "#ffffff", backgroundColor: "#1b2838" },
  youtube: { Icon: SiYoutube, color: "#ffffff", backgroundColor: "#FF0000" },
  x: { Icon: SiX, color: "#ffffff", backgroundColor: "#000000" },
  github: { Icon: SiGithub, color: "#ffffff", backgroundColor: "#181717" },
  instagram: { Icon: SiInstagram, color: "#ffffff", backgroundColor: "#E4405F" },
  guilded: { Icon: SiGuilded, color: "#000000", backgroundColor: "#F5C400" },
  threads: { Icon: SiThreads, color: "#ffffff", backgroundColor: "#000000" },
  reddit: { Icon: SiReddit, color: "#ffffff", backgroundColor: "#FF4500" },
  replit: { Icon: SiReplit, color: "#ffffff", backgroundColor: "#F26207" },
  tiktok: { Icon: SiTiktok, color: "#ffffff", backgroundColor: "#000000" },
  twitch: { Icon: SiTwitch, color: "#ffffff", backgroundColor: "#9146FF" },
  xbox: { Icon: FaXbox, color: "#ffffff", backgroundColor: "#107C10" },
};

interface SocialCardProps {
  social: SocialLink;
  index: number;
}

export function SocialCard({ social, index }: SocialCardProps) {
  const iconEntry = iconMap[social.icon];
  const Icon = iconEntry?.Icon ?? ExternalLink;
  const iconStyle = iconEntry?.color ? { color: iconEntry.color } : undefined;
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
        "group glass rounded-xl p-6 transition-all duration-300",
        "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
        "hover:-translate-y-1",
        "animate-slide-up"
      )}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="flex items-center gap-4 relative">
        {/* Icon */}
        <div
          className={cn(
            "flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center transition-colors",
            iconEntry?.backgroundColor
              ? "opacity-90 group-hover:opacity-100"
              : "bg-primary/10 group-hover:bg-primary/20"
          )}
          style={iconContainerStyle}
        >
          <Icon className="h-6 w-6" style={iconStyle} />
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
            "w-10 h-10 rounded-lg",
            "bg-secondary hover:bg-primary hover:text-primary-foreground",
            "transition-all duration-300",
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
