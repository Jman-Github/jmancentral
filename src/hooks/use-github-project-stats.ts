import { useQuery } from "@tanstack/react-query";

import type { Project } from "@/config/siteData";

export interface GitHubProjectStats {
  lastUpdated: string;
  latestRelease: string;
  stars: number;
}

interface GitHubRelease {
  created_at?: string;
  draft?: boolean;
  name?: string;
  published_at?: string;
  tag_name?: string;
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatUpdatedDate(value: string) {
  return dateFormatter.format(new Date(value));
}

function getReleaseTimestamp(release: GitHubRelease) {
  const releaseDate = release.published_at ?? release.created_at;

  return releaseDate ? new Date(releaseDate).getTime() : 0;
}

function getLatestReleaseName(releases: GitHubRelease[]) {
  const latestRelease = releases
    .filter((release) => !release.draft)
    .reduce<GitHubRelease | null>((latest, release) => {
      if (!latest) {
        return release;
      }

      return getReleaseTimestamp(release) > getReleaseTimestamp(latest) ? release : latest;
    }, null);

  return latestRelease?.tag_name ?? latestRelease?.name ?? "N/A";
}

async function fetchRepoStats(repo: string): Promise<GitHubProjectStats> {
  const headers = {
    Accept: "application/vnd.github+json",
  };

  const [repoResponse, releaseResponse] = await Promise.all([
    fetch(`https://api.github.com/repos/${repo}`, { headers }),
    fetch(`https://api.github.com/repos/${repo}/releases?per_page=100`, { headers }),
  ]);

  if (!repoResponse.ok) {
    throw new Error(`Failed to load GitHub stats for ${repo}`);
  }

  const data = await repoResponse.json() as {
    pushed_at?: string;
    stargazers_count?: number;
    updated_at?: string;
  };
  const latestRelease = releaseResponse.ok
    ? await releaseResponse.json().then(
        (releases: GitHubRelease[]) => getLatestReleaseName(releases),
      )
    : "N/A";

  return {
    stars: data.stargazers_count ?? 0,
    lastUpdated: formatUpdatedDate(data.pushed_at ?? data.updated_at ?? new Date().toISOString()),
    latestRelease,
  };
}

export function useGitHubProjectStats(projects: Project[]) {
  const githubProjects = projects.filter((project) => project.githubRepo);

  return useQuery({
    queryKey: ["github-project-stats", githubProjects.map((project) => project.githubRepo)],
    queryFn: async () => {
      const entries = await Promise.all(
        githubProjects.map(async (project) => {
          try {
            const stats = await fetchRepoStats(project.githubRepo!);
            return [project.id, stats] as const;
          } catch {
            return [project.id, null] as const;
          }
        }),
      );

      return Object.fromEntries(entries.filter((entry) => entry[1] !== null));
    },
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60 * 12,
  });
}
