export type ProjectLink = {
  label: string;
  href: string;
};

export type CaseStudySection = {
  readonly title: string;
  readonly paragraphs: readonly string[];
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  stack: string[];
  highlights: string[];
  links?: ProjectLink[];
  status?: "Active" | "Completed" | "Archived";
  caseStudy?: {
    readonly sections: readonly CaseStudySection[];
  };
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
    caseStudy: {
      sections: [
        {
          title: "Goal",
          paragraphs: [
            "Create a fast, credible portfolio that showcases engineering judgment—not just visuals.",
            "Support dedicated project pages (case studies) with clean routing and scalable structure.",
            "Maintain full UI control while keeping styling consistent across pages.",
          ],
        },
        {
          title: "Key Decisions",
          paragraphs: [
            "Vite + React + TypeScript for a modern DX with strong typing and fast builds.",
            "HashRouter to avoid deep-link 404s on GitHub Pages (static hosting constraint).",
            "Design tokens + global base styles for consistency; CSS Modules for page-level personality and isolation.",
          ],
        },
        {
          title: "CI/CD and Deployment",
          paragraphs: [
            "GitHub Actions pipeline builds the site on every push to main using npm ci + Vite build.",
            "Build artifacts (dist/) are deployed to GitHub Pages to keep source and output separated.",
            "Manual workflow_dispatch remains available for forced redeploys when needed.",
          ],
        },
        {
          title: "Implementation Notes",
          paragraphs: [
            "Projects are modeled as typed data to keep content updates simple and predictable.",
            "Project index renders from the content model; detail pages resolve by slug for stable URLs.",
            "Page styling follows a layered approach: tokens → globals → page modules.",
          ],
        },
        {
          title: "Next Improvements",
          paragraphs: [
            "Add OpenGraph metadata and better SEO per route (titles/descriptions).",
            "Add screenshots/diagrams per project and a lightweight image strategy.",
            "Improve accessibility pass (focus states, contrast checks) and run a Lighthouse sweep.",
          ],
        },
      ],
    },
  },
];
