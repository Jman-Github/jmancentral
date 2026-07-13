export interface GitHubStats {
  username: string;
  profileUrl: string;
  avatarUrl: string;
  publicRepos: number;
  followers: number;
  following: number;
  totalStars: number;
  totalForks: number;
  totalIssues: number;
  totalPullRequests: number;
  activeRepos: number;
  joinedYear: number;
  topLanguages: string[];
  featuredRepo: {
    name: string;
    url: string;
    description: string | null;
    stars: number;
  } | null;
  updatedAt: string;
}

export const githubStatsFallback: GitHubStats = {
  username: "Jman-Github",
  profileUrl: "https://github.com/Jman-Github",
  avatarUrl: "https://avatars.githubusercontent.com/u/128645077?v=4",
  publicRepos: 6,
  followers: 132,
  following: 45,
  totalStars: 2113,
  totalForks: 73,
  totalIssues: 47,
  totalPullRequests: 53,
  activeRepos: 4,
  joinedYear: 2023,
  topLanguages: ["Kotlin", "TypeScript", "Python", "Java"],
  featuredRepo: {
    name: "Universal-ReVanced-Manager",
    url: "https://github.com/Jman-Github/Universal-ReVanced-Manager",
    description: "An Android application to use ReVanced, Morphe, and AmpleReVanced.",
    stars: 1204,
  },
  updatedAt: "2026-07-12T00:00:00.000Z",
};

