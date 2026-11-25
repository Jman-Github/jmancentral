import { Fragment } from "react";
import { ArrowUpRight, Download } from "lucide-react";
import { CopyButton } from "@/components/CopyButton";
import { LocalTime } from "@/components/LocalTime";
import { Container, labelGrid } from "@/components/Section";
import { site } from "@/config/siteData";

export function Footer() {
  return (
    <footer>
      <Container className={`${labelGrid} border-t border-line py-12 md:py-16`}>
        <h2 className="font-mono text-[13px] text-muted">Contact</h2>
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <p className="text-[13px] text-muted">Email</p>
            {/* Both contact rows share min-h-8 so the links sit on the same line beside the 32px copy button. */}
            <div className="mt-1 flex min-h-8 items-center gap-1">
              <a href={`mailto:${site.email}`} className="link tap-target min-w-0 break-all">
                {site.email}
              </a>
              <CopyButton text={site.email} label="Copy email address" />
            </div>
          </div>
          <div>
            <p className="text-[13px] text-muted">PGP public key</p>
            <div className="mt-1 flex min-h-8 items-center">
              <a href={site.pgpKey.href} download className="link tap-target inline-flex items-center gap-1.5">
                <Download className="size-4" aria-hidden="true" />
                jman.public.key.asc
              </a>
            </div>
            <p className="mt-1 font-mono text-xs leading-relaxed text-subtle">
              <span className="sr-only">Fingerprint: </span>
              {/* Wrap between the two halves of the fingerprint, never inside a half. */}
              {site.pgpKey.fingerprint.split(/\s{2,}/).map((half, index) => (
                <Fragment key={index}>
                  {index > 0 && " "}
                  <span className="whitespace-nowrap">{half}</span>
                </Fragment>
              ))}
            </p>
          </div>
        </div>
      </Container>

      <Container className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-line py-6 font-mono text-xs text-subtle">
        <p>© {new Date().getFullYear()} {site.owner}</p>
        <LocalTime className="md:hidden" />
        <a href={site.sourceUrl} target="_blank" rel="noreferrer" className="tap-target inline-flex items-center gap-1 transition-colors hover:text-fg">
          Site source
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </Container>
    </footer>
  );
}
