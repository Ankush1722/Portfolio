/**
 * Single source of truth for the developer capabilities map.
 *
 * To edit the section later, change ONLY this file:
 *  - `tier`  controls typographic weight/size of the group (visual hierarchy)
 *  - `span`  controls the group's width on the 12-column editorial grid
 *            (kept as complete literal class strings so Tailwind can detect them)
 */

export type SkillTier = "primary" | "standard";

export type SkillGroupData = {
  id: string;
  title: string;
  tier: SkillTier;
  span: string;
  skills: string[];
};

export const SKILL_GROUPS: SkillGroupData[] = [
  {
    id: "frontend-react",
    title: "Frontend / React",
    tier: "primary",
    span: "lg:col-span-12",
    skills: [
      "React.js",
      "JavaScript (JS)",
      "TypeScript",
      "HTML / CSS",
      "Responsive Web Development",
      "React Hooks",
      "Props / State Management",
      "Dynamic Rendering",
      "Dynamic Routing",
      "Protected Routes",
      "Error Boundaries",
      "Lazy Loading",
      "Dynamic Imports",
      "Pagination",
      "Infinite Scroll",
      "Client-side Rendering (CSR)",
      "Server-side Rendering (SSR)",
      "Static Site Generation (SSG)",
      "React Server Components (RSC)",
    ],
  },
  {
    id: "nextjs",
    title: "Next.js",
    tier: "primary",
    span: "lg:col-span-6",
    skills: [
      "Next.js",
      "App Router",
      "Routing & Dynamic Routing",
      "Server Components",
      "Client Components",
      "Server Actions",
      "SSR / SSG / CSR",
      "SEO Optimization",
      "Dynamic Imports / Lazy Loading",
      "Image Optimization",
      "Middleware",
      "Error Handling / Error Boundaries",
    ],
  },
  {
    id: "state-data-performance",
    title: "State, Data Fetching & Performance",
    tier: "primary",
    span: "lg:col-span-6",
    skills: [
      "TanStack Query / React Query",
      "API Integration",
      "REST APIs",
      "Server-Sent Events (SSE)",
      "WebSockets",
      "Webhooks",
      "Optimistic Updates",
      "Caching",
      "CDN",
      "Revalidation",
      "Code Splitting",
      "Performance Optimization",
      "Client-side API Calls",
      "Pagination & Infinite Scroll",
    ],
  },
  {
    id: "security",
    title: "Security",
    tier: "standard",
    span: "lg:col-span-4",
    skills: [
      "RBAC (Role-Based Access Control)",
      "Authentication",
      "OAuth",
      "Authorization",
      "CORS",
      "CSP (Content Security Policy)",
      "ORB (Opaque Response Blocking)",
      "Input Sanitization",
      "Secure API Handling",
      "Protected Routes",
    ],
  },
  {
    id: "seo-architecture",
    title: "SEO & Web Architecture",
    tier: "standard",
    span: "lg:col-span-4",
    skills: [
      "SEO Optimization",
      "Sitemap",
      "Robots.txt",
      "Metadata",
      "SSR / SSG",
      "Dynamic Rendering",
      "Web Performance Optimization",
    ],
  },
  {
    id: "version-control",
    title: "Git / Version Control",
    tier: "standard",
    span: "lg:col-span-4",
    skills: [
      "Git",
      "GitHub",
      "Bitbucket",
      "Pull Requests (PRs)",
      "PR Reviews",
      "Conflict Resolution",
      "Git Workflows",
    ],
  },
  {
    id: "backend-api",
    title: "Backend / API Concepts",
    tier: "standard",
    span: "lg:col-span-6",
    skills: [
      "REST API Integration",
      "API Calls",
      "WebSockets",
      "Webhooks",
      "SSE",
      "Authentication & Authorization",
      "OAuth",
      "API Security",
      "Client-side API Patterns",
    ],
  },
  {
    id: "advanced-react",
    title: "Advanced React Concepts",
    tier: "standard",
    span: "lg:col-span-6",
    skills: [
      "Refs",
      "Props",
      "Hooks",
      "Server Actions",
      "Optimistic UI Updates",
      "Error Boundaries",
      "Lazy Loading",
      "Dynamic Imports",
      "Single-page / Client-side Application Patterns",
    ],
  },
  {
    id: "ai",
    title: "AI / AI-Assisted Development",
    tier: "standard",
    span: "lg:col-span-6",
    skills: [
      "AI-generated Code",
      "AI Agent Integration",
      "AI-assisted Development",
      "Claude Code",
      "AI-based Coding Workflows",
    ],
  },
  {
    id: "practices",
    title: "Documentation & Development Practices",
    tier: "standard",
    span: "lg:col-span-6",
    skills: [
      "Technical Documentation",
      "Code Review",
      "PR Reviews",
      "Conflict Resolution",
      "Debugging & Error Handling",
    ],
  },
];

/** Headline stats are derived, never hardcoded, so they stay true as the data changes. */
export const CORE_AREA_COUNT = SKILL_GROUPS.length;

export const TECHNOLOGY_COUNT = new Set(
  SKILL_GROUPS.flatMap((group) => group.skills)
).size;

/** The short, scannable stack shown before the user opens the full map. */
export const PRIMARY_STACK = [
  "React",
  "Next.js",
  "TypeScript",
  "APIs",
  "Security",
  "AI",
];
