# AGENTS.md

## Commands

```bash
npm run dev:dashboard # Start dashboard dev server
npm run dev:landing   # Start landing dev server
npm run lint          # ESLint check across all projects
npm run format        # ESLint fix + Prettier across all projects
npm run typecheck     # TypeScript project references check
npm run build         # Production build for all apps
```

CI runs `npm run lint` on PRs to main.

## Architecture

Nx package-based / npm workspaces monorepo with Clean Architecture and inversify DI:

```
apps/
  dashboard/           # @infiniteuny/infinity-dashboard — Internal management dashboard (Next.js App Router)
    app/               # Next.js App Router routes
    src/
      presentation/    # Feature views, controllers, stores, hooks
      server-injection.ts   # Server DI container
      client-injection.ts   # Client DI container
    config/            # App-specific fonts & theme re-exports
  landing/             # @infiniteuny/infinity-landing — Public landing website (Next.js App Router)
    app/               # Next.js App Router routes
    src/
      server-injection.ts   # Server DI container
      client-injection.ts   # Client DI container
    config/            # App-specific fonts & theme re-exports
packages/
  domain/              # @infiniteuny/infinity-domain — Entities, repository contracts, errors, DI symbols
  application/         # @infiniteuny/infinity-application — Use cases (depend on domain only)
  infrastructure/      # @infiniteuny/infinity-infrastructure — Repository/datasource/DTO implementations
  ui/                  # @infiniteuny/infinity-ui — Shared UI components, Material 3 theme, Tailwind CSS 4
  utils/               # @infiniteuny/infinity-utils — Pure utility helpers
```

**Dependency rule**: `domain` ← `application` ← `infrastructure` / `presentation` (`apps/dashboard`, `apps/landing`). Composition roots (`apps/*/src/server-injection.ts`, `apps/*/src/client-injection.ts`) wire concrete implementations.

## Key Patterns

- **DI symbols**: defined in `packages/domain/src/symbols.ts` (`@infiniteuny/infinity-domain`); use `SYMBOLS.XxxUseCase` when binding/resolving
- **Path aliases & workspace packages**: `@app/*` → `apps/*/src/*`, `@config/*` → `apps/*/config/*`, plus `@infiniteuny/infinity-{domain,application,infrastructure,ui,utils}`
- **Use cases**: one file per use case in `packages/application/src/` (e.g., `get-user.ts`, `create-team.ts`)
- `reflect-metadata` must be imported before inversify bindings (see top of injection files)

## Code Style

- ESLint flat config with `@typescript-eslint/explicit-member-accessibility` enforced
- Prettier: single quotes, trailing commas, 100 char width, tailwindcss plugin
- TypeScript strict mode with decorators enabled

## Auth

- Uses `better-auth` (v1.6) with SSO via OpenID Connect
- Session/tokens obtained via data sources; access token required for API calls
- Auth routes under `app/(auth)/`

## UI

- MUI v7 + Tailwind CSS 4
- Theme config in `config/themes.ts`
- Prettier sorts Tailwind classes in `sx` attributes

## Testing

No test framework configured yet. Add jest/vitest when needed.

## Git

- Default branch: `main`
- Conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`, `ci:`
- Scope recommended: `feat(auth): add session refresh`

## OpenSpec

Feature specs live in `openspec/specs/`. Context and rules in `openspec/config.yaml`.

<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->
