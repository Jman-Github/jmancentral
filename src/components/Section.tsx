import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Page-width container shared by header, content, and footer. */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="mx-auto w-full max-w-page px-5 sm:px-8">
      <div className={className}>{children}</div>
    </div>
  );
}

/** Two-column grid: a small label column on the left, content on the right (stacked on mobile). */
export const labelGrid = "grid gap-y-5 md:grid-cols-[10rem_minmax(0,1fr)] md:gap-x-12";

interface SectionProps {
  id: string;
  label: string;
  aside?: ReactNode;
  children: ReactNode;
}

export function Section({ id, label, aside, children }: SectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-label`} className="scroll-mt-6">
      <Container className={cn(labelGrid, "border-t border-line py-12 md:py-16")}>
        <div className="space-y-2">
          <h2 id={`${id}-label`} className="font-mono text-[13px] text-muted">
            {label}
          </h2>
          {aside}
        </div>
        <div className="min-w-0">{children}</div>
      </Container>
    </section>
  );
}
