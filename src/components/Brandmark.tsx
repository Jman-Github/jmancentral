import { useState } from "react";
import brandmarkAnimated from "@/assets/brandmark-animated.webp";
import brandmarkStill from "@/assets/brandmark.png";

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Static mascot; spins while `active` unless the visitor prefers reduced motion. */
export function Brandmark({ active }: { active: boolean }) {
  const [canAnimate] = useState(() => !prefersReducedMotion());
  return (
    <img
      src={active && canAnimate ? brandmarkAnimated : brandmarkStill}
      alt=""
      width={28}
      height={28}
      decoding="async"
      className="size-7 shrink-0 rounded-md"
    />
  );
}
