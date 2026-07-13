import { useEffect, useState } from "react";
import { ArrowUpRight, Code2, FolderGit2, CircleDot, GitFork, GitPullRequest, Github, Sparkles, Star, Users } from "lucide-react";
import { githubStatsFallback, type GitHubStats } from "@/config/githubStats";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const numberFormat = new Intl.NumberFormat("en-US");

export function GitHubStatsPanel() {
  const [stats, setStats] = useState<GitHubStats>(githubStatsFallback);
  const description = stats.featuredRepo?.description ?? "";
  const statItems = [
    { label: "Total issues", value: numberFormat.format(stats.totalIssues), icon: CircleDot, description: "Total number of public issues I have opened on GitHub." },
    { label: "Public repos", value: numberFormat.format(stats.publicRepos), icon: FolderGit2, description: "Total number of public repositories I own." },
    { label: "Stars earned", value: numberFormat.format(stats.totalStars), icon: Star, description: "Total number of stars my public repositories have received." },
    { label: "Followers", value: numberFormat.format(stats.followers), icon: Users, description: "Total number of GitHub users who follow me." },
    { label: "Total PRs", value: numberFormat.format(stats.totalPullRequests), icon: GitPullRequest, description: "Total number of public pull requests I have opened on GitHub." },
    { label: "Forks received", value: numberFormat.format(stats.totalForks), icon: GitFork, description: "Total number of times my public repositories have been forked." },
  ];

  useEffect(() => {
    let cancelled = false;
    fetch("/github-stats.json")
      .then((response) => (response.ok ? response.json() : Promise.reject(new Error("Stats unavailable"))))
      .then((data: GitHubStats) => !cancelled && setStats(data))
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, []);

  return (
    <section id="developer" className="pb-8 pt-14 md:pb-12 md:pt-20">
      <div className="container">
        <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-card shadow-2xl shadow-primary/5">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_10%,hsl(var(--primary)/0.2),transparent_27%),radial-gradient(circle_at_90%_100%,hsl(var(--primary)/0.12),transparent_35%)]" />
          <div className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full border border-primary/20" />
          <div className="relative p-5 sm:p-8 lg:p-10">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]" />
                Developer profile
              </div>
              <a href={stats.profileUrl} target="_blank" rel="noreferrer" className="motion-interactive inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/50 hover:text-primary">
                github.com/{stats.username}<ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-start">
              <div>
                <div className="flex items-center gap-4">
                  <img src={stats.avatarUrl} alt="Jman" className="h-14 w-14 rounded-2xl border border-primary/30 object-cover shadow-lg shadow-primary/15" />
                  <div><p className="text-sm font-medium text-muted-foreground">Open-source work by</p><h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Jman</h2></div>
                </div>
                <p className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-muted-foreground"><Github className="h-3.5 w-3.5 text-primary" />On GitHub since {stats.joinedYear}</p>
                <div className="mt-6">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Most used languages</p>
                  <div className="flex flex-wrap gap-2">
                    {stats.topLanguages.map((language) => <span key={language} className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"><Code2 className="h-3.5 w-3.5" />{language}</span>)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
                {statItems.map(({ label, value, icon: Icon, description: statDescription }) => (
                  <Tooltip key={label}>
                    <TooltipTrigger asChild>
                      <div
                        tabIndex={0}
                        aria-label={statDescription}
                        className="rounded-2xl border border-border/80 bg-background/45 p-4 backdrop-blur-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                      >
                        <Icon className="mb-5 h-4 w-4 text-primary" />
                        <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
                        <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs text-center leading-relaxed">
                      {statDescription}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>

            <div className="mt-7 flex flex-col items-center border-t border-border/70 pt-6 text-center">
              <div className="rounded-xl bg-primary/10 p-2 text-primary"><Sparkles className="h-4 w-4" /></div>
              <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-primary">Top repository</p>
              {stats.featuredRepo ? <a href={stats.featuredRepo.url} target="_blank" rel="noreferrer" className="group mt-1 inline-flex max-w-full items-center gap-1 text-sm font-semibold text-foreground hover:text-primary"><span className="truncate">{stats.featuredRepo.name}</span><ArrowUpRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a> : <p className="mt-1 text-sm font-semibold text-foreground">Open-source projects</p>}
              {description && (
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      title={description}
                      aria-label={`Top repository description: ${description}`}
                      className="mt-1 block w-full max-w-2xl cursor-pointer truncate text-xs leading-5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                    >
                      {description}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    side="bottom"
                    align="center"
                    sideOffset={8}
                    className="max-w-xs text-sm leading-relaxed"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {description}
                  </PopoverContent>
                </Popover>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

