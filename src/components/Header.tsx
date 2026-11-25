import { useState } from "react";
import { Link, NavLink } from "react-router";
import { Moon, Sun } from "lucide-react";
import { Brandmark } from "@/components/Brandmark";
import { LocalTime } from "@/components/LocalTime";
import { Container } from "@/components/Section";
import { site } from "@/config/siteData";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Social links", shortLabel: "Social", to: "/social" },
];

export function Header() {
  const { theme, toggle } = useTheme();
  const [brandActive, setBrandActive] = useState(false);
  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <header>
      <Container className="flex h-16 items-center gap-4 sm:gap-6">
        <Link
          to="/"
          className="flex items-center gap-2.5 font-medium tracking-[-0.01em]"
          onMouseEnter={() => setBrandActive(true)}
          onMouseLeave={() => setBrandActive(false)}
          onFocus={() => setBrandActive(true)}
          onBlur={() => setBrandActive(false)}
        >
          <Brandmark active={brandActive} />
          <span className="max-[359px]:sr-only">{site.name}</span>
        </Link>

        <nav aria-label="Main" className="ml-auto sm:ml-6">
          <ul className="flex items-center gap-5 text-[15px]">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  // Only Home needs an exact match; without `end`, /social also matches the /social/ URL GitHub Pages serves.
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    cn(
                      "tap-target inline-block underline-offset-[6px] transition-colors",
                      isActive ? "text-fg underline decoration-accent decoration-2" : "text-muted hover:text-fg",
                    )
                  }
                >
                  {item.shortLabel ? (
                    <>
                      <span className="sm:hidden">{item.shortLabel}</span>
                      <span className="max-sm:hidden">{item.label}</span>
                    </>
                  ) : (
                    item.label
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4 sm:ml-auto">
          <LocalTime className="hidden md:block" />
          <button
            type="button"
            onClick={toggle}
            aria-label={`Switch to ${nextTheme} theme`}
            title={`Switch to ${nextTheme} theme`}
            className="grid size-8 place-items-center rounded-md text-muted transition-colors hover:bg-surface hover:text-fg"
          >
            {theme === "dark" ? <Sun className="size-[18px]" aria-hidden="true" /> : <Moon className="size-[18px]" aria-hidden="true" />}
          </button>
        </div>
      </Container>
    </header>
  );
}
