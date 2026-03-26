## Context

The codebase now has list, single-detail, and edit pages for non-user entities (achievement, community group admin, core team, fund application, group, permission, project gallery, team, testimonial). Repository contracts already expose `create*` and `update*` methods for these entities, but the application layer only provides write use cases for `User`. As a result, newer form components either remain read-only or reference missing symbols/use cases, creating a broken path between UI and repository write operations.

## Goals / Non-Goals

**Goals:**

- Add application-layer Create/Update use cases for all 9 non-user dashboard entities
- Add DI symbols and container bindings so forms can resolve write use cases consistently
- Standardize write-usecase signatures to mirror existing `CreateUser`/`UpdateUser` patterns
- Enable single-entity forms to submit create/update operations through application use cases rather than direct repository access or placeholders

**Non-Goals:**

- Changing repository/data-source contracts or API payload schemas
- Adding delete use cases in this change
- Redesigning form UX beyond wiring existing save flows
- Changing list page behavior

## Decisions

### Decision 1: Create one Create and one Update use case per entity

For each target entity, add:

- `Create{Entity}` use case class that delegates to repository `create{Entity}`
- `Update{Entity}` use case class that delegates to repository `update{Entity}`

This matches current architecture and keeps business logic discoverable by entity.

**Alternative considered**: A generic write use case factory. Rejected because it weakens explicit DI typing and makes symbol wiring less transparent.

### Decision 2: Keep use cases in application layer only and reuse existing repository signatures

No new repository methods are introduced. Use cases map directly onto existing repository create/update contracts and preserve `Either`-based error handling.

**Alternative considered**: extending repository interfaces for DTO-shaped inputs. Rejected because repository contracts are already domain-shaped and functional.

### Decision 3: Add write-usecase bindings to both client and server DI containers

Forms resolve use cases from client DI, while server-side operations may need parity for consistency and future usage. Symbols and bindings will be added to:

- `config/symbols.ts`
- `src/client-injection.ts`
- `src/server-injection.ts`
- `src/application/index.ts`

### Decision 4: Update single-entity forms to use dual-mode submit behavior

Each form should choose operation by presence of initial entity data:

- `initialEntity` exists → use `Update{Entity}`
- No `initialEntity` → use `Create{Entity}`

This keeps behavior aligned with existing user form architecture.

## Risks / Trade-offs

- **[Risk] Payload mismatch between form fields and repository write contracts** → Mitigation: define per-entity form input types mapped to repository expected domain write shape.
- **[Risk] DI drift (symbols added but not bound/exported everywhere)** → Mitigation: include dedicated task group for symbols + both container bindings + barrel exports.
- **[Risk] Partial wiring leads to runtime resolution errors** → Mitigation: validate with lint/type-check and test at least one create and one update path.

## Migration Plan

1. Add write use case classes for all target entities
2. Export use cases and add symbols
3. Bind all new use cases in client and server containers
4. Update form components to call create/update use cases on submit
5. Validate with lint and run manual smoke checks for representative entity forms

Rollback strategy: revert new usecase files + symbol/container/export changes as one batch; forms fall back to previous read-only or placeholder behavior.

## Open Questions

- Should every non-user entity also receive delete use cases in the same iteration, or in a follow-up change?
- Should new-create routes (`/entity/new`) be introduced for all entities now, or only after write wiring is stable?
