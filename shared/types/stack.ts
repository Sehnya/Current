// Shared TypeScript types that mirror the Python Pydantic models

export interface InstallCommands {
  npm?: string;
  bun?: string;
  pip?: string;
  yarn?: string;
}

export interface Stack {
  name: string;
  language: string;
  latest_version: string;
  release_date: string;
  docs_url: string;
  github_url?: string;
  install: InstallCommands;
  github_stars?: number;
  github_forks?: number;
  downloads_weekly?: number;
  downloads_monthly?: number;
  last_checked?: string;
  category: StackCategory;
  last_updated?: string;
}

export enum StackCategory {
  FRONTEND = "frontend",
  BACKEND = "backend",
  DATABASE = "database",
  TESTING = "testing",
  STYLING = "styling",
  BUILD_TOOLS = "build-tools",
  STATE_MANAGEMENT = "state-management",
  DATA_SCIENCE = "data-science",
  ANIMATION = "animation",
  NETWORKING = "networking",
  RUNTIME = "runtime",
  PACKAGE_MANAGER = "package-manager",
  CODE_QUALITY = "code-quality",
  MONOREPO = "monorepo",
  VISUALIZATION = "visualization",
  ML_APPS = "ml-apps",
  VALIDATION = "validation",
  FORMS = "forms",
  ROUTING = "routing",
  REALTIME = "realtime",
  GRAPHQL = "graphql",
  UTILITY = "utility",
  OTHER = "other",
}

export interface StackResponse {
  stacks: Record<string, Stack>;
  total_count: number;
  last_refresh?: string;
}

export interface CategoryResponse {
  category: string;
  stacks: Record<string, Stack>;
  total_count: number;
}

export interface SearchResponse {
  query: string;
  stacks: Record<string, Stack>;
  total_count: number;
}

export interface TrendingResponse {
  stacks: Stack[];
  sort_by: string;
  total_count: number;
}

export interface OutdatedResponse {
  stacks: Record<string, Stack>;
  threshold_days: number;
  total_count: number;
}

export interface RefreshResponse {
  success: boolean;
  updated_stacks: number;
  errors: Record<string, string>;
  timestamp: string;
}
