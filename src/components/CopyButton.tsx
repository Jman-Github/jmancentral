import { Check, Copy, X } from "lucide-react";
import { useCopy } from "@/hooks/use-copy";
import { cn } from "@/lib/utils";

// A live region only announces changed text, so repeated results alternate a trailing no-break space.
const NO_BREAK_SPACE = String.fromCharCode(0xa0);

interface CopyButtonProps {
  text: string;
  /** Accessible name, e.g. "Copy Discord username". */
  label: string;
  className?: string;
}

export function CopyButton({ text, label, className }: CopyButtonProps) {
  const { state, attempt, copy } = useCopy();
  const message = state === "copied" ? "Copied to clipboard" : state === "failed" ? "Couldn't copy to clipboard" : "";
  const status = message && `${message}${attempt % 2 === 0 ? NO_BREAK_SPACE : ""}`;
  const Icon = state === "copied" ? Check : state === "failed" ? X : Copy;

  return (
    <>
      <button
        type="button"
        onClick={() => void copy(text)}
        aria-label={label}
        title={state === "copied" ? "Copied" : state === "failed" ? "Couldn't copy" : label}
        className={cn(
          "relative z-10 grid size-8 shrink-0 place-items-center rounded-md text-subtle transition-colors hover:bg-surface hover:text-fg",
          state === "copied" && "text-accent hover:text-accent",
          state === "failed" && "text-fg hover:text-fg",
          className,
        )}
      >
        <Icon className="size-4" aria-hidden="true" />
      </button>
      <span role="status" className="sr-only">
        {status}
      </span>
    </>
  );
}
