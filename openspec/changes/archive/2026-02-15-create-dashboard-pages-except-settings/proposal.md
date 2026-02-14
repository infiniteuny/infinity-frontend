## Why

Most dashboard modules under `app/(internal)/(dashboard)` are still placeholder pages with only section headers, while `users` already provides a complete list experience. This inconsistency blocks internal teams from browsing and managing key entities from the dashboard.

## What Changes

- Implement all top-level dashboard list pages to follow the same implementation pattern as `users`.
- Add consistent data-loading, section header + toolbar composition, and list rendering for each module route.
- Exclude the `settings` page from this rollout.
- Keep route structure and existing clean-architecture layering intact.

## Capabilities

### New Capabilities

- `dashboard-entity-pages`: Standardized, implemented dashboard list pages for internal entity modules (except settings), aligned with the existing `users` page UX and architecture pattern.

### Modified Capabilities

- None.

## Impact

- Affected routes: `app/(internal)/(dashboard)/achievements`, `community-group-admins`, `core-teams`, `fund-applications`, `groups`, `permissions`, `project-galleries`, `teams`, `testimonials`.
- Affected UI layer: internal dashboard components for list/toolbars and page composition.
- May require additional application use-cases and DI symbol bindings for non-user entities to support server-side page data loading.
- No API contract change expected; uses existing repository/data-source integrations.
