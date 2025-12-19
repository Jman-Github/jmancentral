import { useEffect, useState } from "react";
import { Copy } from "lucide-react";
import { siteConfig } from "@/config/siteData";

export function Footer() {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(id);
  }, [copied]);

  const handleCopy = async () => {
    const text = siteConfig.email;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
    } catch (err) {
      console.error("Failed to copy email", err);
    }
  };

  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container py-6 flex flex-col items-center gap-3 px-4">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-xs text-muted-foreground text-center">
          <span className="uppercase tracking-wide">Contact Me</span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={`Copy ${siteConfig.email} to clipboard`}
          >
            <Copy className="h-4 w-4" aria-hidden="true" />
            <span className="text-sm font-medium">
              {copied ? "Copied!" : siteConfig.email}
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
