## Why

The dashboard now has single-entity and edit pages for multiple entities, but only `User` has application-layer Create/Update use cases. Several new edit forms already reference missing use cases (for example group form), which blocks implementation of writable edit flows and breaks dependency-injection consistency.

## What Changes

- Add application-layer `Create{Entity}` and `Update{Entity}` use cases for all non-user dashboard entities that currently lack write use cases: Achievement, CommunityGroupAdmin, CoreTeam, FundApplication, Group, Permission, ProjectGallery, Team, and Testimonial
- Add corresponding DI symbols and container bindings for new write use cases
- Export all new write use cases from the application barrel
- Wire affected edit form components to use the new use cases for submit/create/update flows (removing temporary read-only behavior where applicable)
- Keep repository and data-source layers unchanged; reuse existing repository `create*` and `update*` methods

## Capabilities

### New Capabilities

- `entity-write-usecases`: Defines application-layer create/update use-case coverage and DI wiring for all non-user dashboard entities

### Modified Capabilities

- `single-entity-pages`: Extend edit-page behavior from read-only form rendering to writable create/update submission via application-layer use cases

## Impact

- **Application layer**: New `create-*` and `update-*` use case files for 9 entities in `src/application/`
- **DI config**: Additional use-case symbols in `config/symbols.ts` and bindings in `src/server-injection.ts` and `src/client-injection.ts` (for client form usage)
- **Presentation forms**: Update single-entity form components under `src/presentation/components/internal/single-*/` to submit through use cases
- **No API contract changes**: Existing repository/data-source contracts are reused
