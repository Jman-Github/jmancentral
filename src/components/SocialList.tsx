import { ArrowUpRight } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { PlatformIcon } from "@/components/PlatformIcon";
import type { SocialLink } from "@/config/siteData";

export function SocialList({ links }: { links: SocialLink[] }) {
  return (
    <ul className="grid md:grid-cols-2 md:gap-x-10">
      {links.map((link) => (
        <li
          key={link.id}
          className="group relative flex items-center gap-4 border-b border-line py-4 first:pt-0 last:border-b-0 last:pb-0 md:[&:nth-child(2)]:pt-0 md:[&:nth-last-child(2):nth-child(odd)]:border-b-0 md:[&:nth-last-child(2):nth-child(odd)]:pb-0 has-[a:focus-visible]:rounded-sm has-[a:focus-visible]:outline has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-accent"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-[10px] border border-line bg-surface text-muted transition-colors group-hover:text-fg">
            <PlatformIcon name={link.icon} />
          </span>
          <div className="min-w-0 flex-1">
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="font-medium decoration-1 underline-offset-4 after:absolute after:inset-0 supports-[selector(:has(*))]:focus-visible:outline-none group-hover:underline"
            >
              {link.platform}
              {/* Phones have no hover and hide the arrow column, so show the link cue inline. */}
              <ArrowUpRight className="ml-1 inline size-3.5 align-[-1px] text-subtle sm:hidden" aria-hidden="true" />
              <span className="sr-only"> profile (opens in a new tab)</span>
            </a>
            <p className="font-mono text-[13px] text-muted [overflow-wrap:anywhere]">{link.username}</p>
          </div>
          <CopyButton text={link.username} label={`Copy ${link.platform} username`} />
          <ArrowUpRight
            className="hidden size-4 shrink-0 text-subtle transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent sm:block"
            aria-hidden="true"
          />
        </li>
      ))}
    </ul>
  );
}
