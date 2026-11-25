import { formatDate, formatNumber, githubStats as stats } from "@/lib/github-stats";

const items = [
  { label: "Stars earned", value: stats.totalStars },
  { label: "Followers", value: stats.followers },
  { label: "Pull requests", value: stats.totalPullRequests },
  { label: "Issues opened", value: stats.totalIssues },
  { label: "Public repos", value: stats.publicRepos },
  { label: "Forks", value: stats.totalForks },
];

function listFormat(values: string[]) {
  return new Intl.ListFormat("en-US", { style: "long", type: "conjunction" }).format(values);
}

export function GitHubSummary() {
  const updated = formatDate(stats.updatedAt);

  return (
    <div>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
        {items.map(({ label, value }) => (
          <div key={label} className="flex flex-col-reverse gap-1">
            <dt className="text-[13px] text-muted">{label}</dt>
            <dd className="text-[1.75rem] font-medium leading-none tracking-[-0.02em] tabular-nums">{formatNumber(value)}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-10 max-w-[65ch] text-[15px] leading-relaxed text-muted">
        {stats.topLanguages.length > 0 && `Mostly ${listFormat(stats.topLanguages)}. `}On GitHub since {stats.joinedYear}.
      </p>
      {updated && <p className="mt-2 font-mono text-xs text-subtle">Numbers as of {updated}</p>}
    </div>
  );
}
