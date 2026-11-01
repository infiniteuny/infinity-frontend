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

CI runs `npm run lint` on PRs to main/develop.

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

- Default branch: `develop`
- Conventional commits: `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`, `ci:`
- Scope recommended: `feat(auth): add session refresh`

## OpenSpec

Feature specs live in `openspec/specs/`. Context and rules in `openspec/config.yaml`.
