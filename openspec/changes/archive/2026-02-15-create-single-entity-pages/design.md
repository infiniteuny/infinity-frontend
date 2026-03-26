## Context

The Infinity front-end dashboard has nine entity modules (achievements, community group admins, core teams, fund applications, groups, permissions, project galleries, teams, testimonials) whose single-entity detail and edit pages are currently stubs. The user entity is the only module with a fully-implemented single-entity page and edit page. The repository contracts and data sources already support single-entity retrieval (`get{Entity}(id)`) for all entities, but no application-layer use cases or presentation components exist for single-entity access outside of users.

## Goals / Non-Goals

**Goals:**

- Implement single-entity detail view pages for all 9 remaining entities, following the established `single-user` composition pattern (server-side data fetching → DTO mapping → client view components)
- Implement edit pages for all 9 entities with form components, zod validation, and client-side create/update use case execution
- Add application-layer `Get{Entity}` single-entity use cases with corresponding DI symbols and server container bindings
- Maintain clean-architecture boundaries: routes call use cases via DI, never repositories directly

**Non-Goals:**

- Modifying existing list pages or list components
- Adding new repository methods or data source endpoints (all single-entity methods already exist)
- Implementing delete functionality on single-entity pages (delete already exists on the user toolbar but extending it to other entities is out of scope)
- Changing the settings page
- Adding client-side data fetching for single entities (edit pages use server-side fetching)
- Adding create/update/delete use cases for non-user entities (edit forms will be view-only scaffolds initially since those use cases don't exist yet)

## Decisions

### Decision 1: View-only single-entity pages (no CRUD use cases for non-user entities)

Since only the user entity has `CreateUser`, `UpdateUser`, `DeleteUser` use cases, the single-entity pages for other entities will be **view-only detail pages** for now. Edit page routes will exist with form components, but form submission will not be wired to backend operations. The toolbar will include an Edit button linking to the edit route, but the edit page forms will be read-only displays of data formatted as form fields.

**Rationale**: Creating CRUD use cases for all 9 entities is a separate scope of work. Delivering view pages first provides immediate value for data inspection and navigation.

**Alternative considered**: Creating all CRUD use cases alongside the pages. Rejected because it significantly expands scope and requires additional repository validation for create/update operations that may have entity-specific business rules.

### Decision 2: Edit pages render read-only forms pre-populated with entity data

Edit pages will render form components with fields pre-populated from the entity data, but without save/submit functionality. The components will be structured so that adding CRUD use cases later requires minimal changes (just wiring submit handlers).

**Rationale**: This establishes the form structure and validates field layouts without needing backend write operations. It follows the progressive enhancement principle.

### Decision 3: Reuse the single-user component architecture

Each entity gets a `single-{entity}/` directory under `src/presentation/components/internal/` containing:

- `{entity}-view.tsx` — client component that converts DTO to domain and renders section views
- Section view components (e.g., `general-view.tsx`, `metadata-view.tsx`) — display entity fields in MUI Grid layout
- `{entity}-toolbar.tsx` — toolbar with edit button (view mode)
- `{entity}-form.tsx` — form component with zod validation schema and field sections
- `index.ts` — barrel export

**Rationale**: Direct consistency with the established pattern. No new architectural patterns introduced.

### Decision 4: Every entity gets a metadata view section

All entities share `id`, `createdAt`, `updatedAt` fields. A common metadata view pattern (same as `single-user/metadata-view.tsx`) will be replicated per entity rather than extracted to a shared component.

**Rationale**: While a shared metadata component could reduce duplication, each entity has its own domain type, and keeping components entity-scoped avoids cross-entity coupling. Extraction can happen in a future refactor.

### Decision 5: Single application use case per entity for retrieval

Each use case follows the `GetUser` pattern: an `@injectable()` class that injects the entity repository and delegates to the `get{Entity}()` method. Include options (relations) are passed through to support eager loading.

**Rationale**: Consistent with the existing architecture. One use case class per entity keeps responsibilities clear.

## Risks / Trade-offs

- **Edit pages without save functionality may confuse users** → Mitigated by disabling save buttons and/or showing a "read-only" state. Forms will be pre-populated but not submittable until CRUD use cases are added.
- **Large number of files to create (70+ files)** → Mitigated by following the established pattern mechanically. Each entity follows the same template with entity-specific field mappings.
- **Entity relations may not be fully loaded** → Mitigated by passing appropriate include options to use cases. For entities with many relations (e.g., Achievement with 7 optional relations), include all necessary relations in the server-side fetch.
