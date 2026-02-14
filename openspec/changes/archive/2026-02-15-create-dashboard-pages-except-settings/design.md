## Context

The dashboard currently has one fully implemented module page (`users`) that loads data through application use-cases and renders list + toolbar UI, while most sibling module routes are placeholder pages with section headers only. Internal users need consistent, functional module pages for operational entities without changing route topology or clean-architecture boundaries.

## Goals / Non-Goals

**Goals:**

- Implement top-level dashboard module pages so they follow the same composition pattern as `users`.
- Standardize page composition as: server-side data load → section header (with toolbar) → list component with initial DTO data.
- Cover routes for achievements, community group admins, core teams, fund applications, groups, permissions, project galleries, teams, and testimonials.
- Keep `settings` excluded from this change.

**Non-Goals:**

- Redesigning dashboard UX, routing, or navigation.
- Changing backend API contracts.
- Building create/edit/detail workflows beyond list-page parity.
- Refactoring unrelated modules.

## Decisions

- Adopt `users` page as the canonical page composition template.
  - Rationale: It already aligns with current architecture (use-case + mapper + DI + list/toolbar split) and minimizes divergence.
  - Alternative considered: building per-page custom compositions; rejected due to inconsistent behavior and higher maintenance.

- Implement each module page as a server component that resolves its use-case from `serverContainer`.
  - Rationale: Preserves current SSR-first data hydration pattern and keeps DI responsibility at composition root.
  - Alternative considered: full client-side data fetching on page mount; rejected due to slower first render and inconsistent pattern.

- Create/extend module-specific list and toolbar components only where absent, while preserving shared table conventions.
  - Rationale: Keeps UI cohesive while allowing entity-specific fields and actions.
  - Alternative considered: one generic table for all entities; rejected because entity schemas and row actions differ.

- Add missing use-cases and DI symbol bindings only for entities needed by these pages.
  - Rationale: Enables page-level data loading without broad architectural churn.
  - Alternative considered: directly calling repositories from pages; rejected because it bypasses application layer rules.

## Risks / Trade-offs

- [Risk] Incomplete entity use-case/component availability may delay parity across all modules. → Mitigation: implement module-by-module with shared composition contract and fail-fast type checks.
- [Risk] Data-grid column definitions may diverge from expected operational needs. → Mitigation: start with existing DTO/domain fields and iterate with product feedback.
- [Risk] Increased DI bindings can raise maintenance overhead. → Mitigation: keep symbol/use-case naming consistent with existing conventions and update barrel exports.
- [Risk] Excluding `settings` can create temporary UX inconsistency. → Mitigation: explicitly mark scope in spec/tasks and defer settings to a separate change.
