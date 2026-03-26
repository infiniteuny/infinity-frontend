## Why

All dashboard entity pages currently have only stub implementations for their single-entity detail views and edit pages. The user entity is the sole fully-implemented example, with proper data fetching, view components, toolbar, and edit form. The remaining nine entities (achievements, community group admins, core teams, fund applications, groups, permissions, project galleries, teams, testimonials) need equivalent single-entity and edit pages to make the dashboard functional for entity management workflows.

## What Changes

- Add single-entity application use cases (`GetAchievement`, `GetCommunityGroupAdmin`, `GetCoreTeam`, `GetFundApplication`, `GetGroup`, `GetPermission`, `GetProjectGallery`, `GetTeam`, `GetTestimonial`) following the `GetUser` pattern
- Add corresponding DI symbols and server container bindings for each new use case
- Create presentation view components for each entity (`single-{entity}/` directories) with entity-specific field views, toolbar, and barrel exports following the `single-user` component pattern
- Replace stub `[entityId]/page.tsx` routes with server-side data fetching, error handling (NotFoundError → notFound()), section header, toolbar, and view rendering
- Replace stub `[entityId]/edit/page.tsx` routes with server-side data fetching and form component rendering

## Capabilities

### New Capabilities

- `single-entity-pages`: Defines the behavior and composition of single-entity detail view pages and edit pages across all dashboard modules, including data fetching, view rendering, toolbar actions, and form handling

### Modified Capabilities

- `dashboard-entity-pages`: Existing spec covers list pages only; single-entity pages add new requirements for individual entity viewing and editing routes
- `repository-layer`: Existing repository contracts already include single-entity `get` methods; the change adds application use-case wrappers and DI wiring but no new repository-level requirements

## Impact

- **Application layer**: 9 new use case classes in `src/application/`; updated barrel export in `src/application/index.ts`
- **Config**: 9 new symbols in `config/symbols.ts`
- **DI containers**: 9 new bindings in `src/server-injection.ts`
- **Presentation**: 9 new `single-{entity}/` component directories under `src/presentation/components/internal/`, each containing view components, toolbar, and barrel export
- **Routes**: 18 updated page files (9 detail pages + 9 edit pages) under `app/(internal)/(dashboard)/`
- **No breaking changes**: Existing list pages and settings remain unaffected
