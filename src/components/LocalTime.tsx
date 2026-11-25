import { site } from "@/config/siteData";
import { useLocalTime } from "@/hooks/use-local-time";
import { cn } from "@/lib/utils";

export function LocalTime({ className }: { className?: string }) {
  const { time, zone, iso } = useLocalTime(site.timeZone);

  return (
    <p className={cn("whitespace-nowrap font-mono text-xs text-subtle", className)}>
      <span className="text-muted">{site.owner}&apos;s local time </span>
      <time dateTime={iso}>
        <span className="text-fg">{time}</span> {zone}
      </time>
    </p>
  );
}
