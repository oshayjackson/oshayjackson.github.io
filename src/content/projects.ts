export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  stack: string[];
  highlights: string[];
  links?: ProjectLink[];
  status?: "Active" | "Completed" | "Archived";
};

export const projects: Project[] = [
  {
    slug: "portfolio-site",
    title: "Developer Portfolio (This Site)",
    summary:
      "A React + TypeScript portfolio built with Vite and deployed to GitHub Pages via GitHub Actions. Designed with a tokenized styling system and page-scoped CSS Modules.",
    stack: [
      "React",
      "TypeScript",
      "Vite",
      "React Router",
      "GitHub Actions",
      "GitHub Pages",
    ],
    highlights: [
      "Push-to-deploy CI/CD pipeline using GitHub Actions",
      "HashRouter routing to support static hosting without deep-link 404s",
      "Global design tokens with page-level CSS Modules for consistent UI and page personality",
    ],
    links: [
      {
        label: "Live Site",
        href: "https://oshayjackson.github.io",
      },
      {
        label: "Repository",
        href: "https://github.com/oshayjackson/oshayjackson.github.io",
      },
    ],
    status: "Active",
  },
];
