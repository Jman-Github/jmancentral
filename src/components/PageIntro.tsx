import type { ReactNode } from "react";
import { Container, labelGrid } from "@/components/Section";

interface PageIntroProps {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}

export function PageIntro({ eyebrow, title, children }: PageIntroProps) {
  return (
    <Container className={`${labelGrid} pb-12 pt-10 md:pb-16 md:pt-20`}>
      <p className="font-mono text-[13px] text-muted md:pt-3">{eyebrow}</p>
      <div className="min-w-0">
        <h1 className="max-w-[20ch] text-balance text-[2.125rem] font-medium leading-[1.08] tracking-[-0.025em] sm:text-5xl md:text-[3.5rem]">
          {title}
        </h1>
        {children}
      </div>
    </Container>
  );
}
