import { socialIconPaths } from "@/config/socialIconPaths";
import { cn } from "@/lib/utils";

interface PlatformIconProps {
  name: string;
  className?: string;
}

/** Monochrome brand glyph that inherits the current text color. */
export function PlatformIcon({ name, className }: PlatformIconProps) {
  const path = socialIconPaths[name];

  if (path) {
    return (
      <svg viewBox={path.viewBox} className={cn("size-[18px] shrink-0", className)} fill="currentColor" aria-hidden="true" focusable="false">
        <path d={path.d} />
      </svg>
    );
  }

  // Medal has no vector glyph; its PNG is used as an alpha mask (see .icon-medal in index.css)
  // so it still takes the text color.
  if (name === "medal") {
    return <span aria-hidden="true" className={cn("icon-medal size-[18px] shrink-0 bg-current", className)} />;
  }

  return null;
}
