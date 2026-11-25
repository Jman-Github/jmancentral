import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"IBM Plex Sans Variable"', ...defaultTheme.fontFamily.sans],
        mono: ['"IBM Plex Mono"', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        bg: token("bg"),
        surface: token("surface"),
        fg: token("fg"),
        muted: token("muted"),
        subtle: token("subtle"),
        line: token("line"),
        "line-strong": token("line-strong"),
        accent: token("accent"),
      },
      maxWidth: {
        page: "68rem",
      },
    },
  },
} satisfies Config;
