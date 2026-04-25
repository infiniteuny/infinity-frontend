# AGENTS.md

## Commands

```bash
npm run dev       # Start dev server (localhost:3000)
npm run lint      # ESLint check
npm run format    # ESLint fix + Prettier
npm run build     # Production build
```

CI runs `npm run lint` on PRs to main/develop.

## Architecture

Clean architecture with inversify DI:

```
app/               # Next.js App Router routes
src/
  domain/          # Entities, repository contracts (no dependencies)
  application/     # Use cases (depend on domain only)
  infrastructure/  # Repository/datasource implementations
  presentation/    # Controllers, components, stores, hooks
  server-injection.ts   # Server DI container
  client-injection.ts   # Client DI container
config/            # DI symbols, themes, fonts
```

**Dependency rule**: domain ← application ← infrastructure/presentation. Composition roots (`src/server-injection.ts`, `src/client-injection.ts`) wire concrete implementations.

## Key Patterns

- **DI symbols**: defined in `config/symbols.ts`; use `SYMBOLS.XxxUseCase` when binding/resolving
- **Path aliases**: `@app/*` → `src/*`, `@config/*` → `config/*`
- **Use cases**: one file per use case in `src/application/` (e.g., `get-user.ts`, `create-team.ts`)
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
