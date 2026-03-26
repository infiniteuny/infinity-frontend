## ADDED Requirements

### Requirement: Single-entity retrieval use cases SHALL exist for all dashboard entities

Each dashboard entity SHALL have a `Get{Entity}` application use case that wraps the repository's single-entity retrieval method with DI symbol registration and server container binding.

#### Scenario: All 9 non-user entities have single retrieval use cases

- **WHEN** the application layer and DI configuration are inspected
- **THEN** `GetAchievement`, `GetCommunityGroupAdmin`, `GetCoreTeam`, `GetFundApplication`, `GetGroup`, `GetPermission`, `GetProjectGallery`, `GetTeam`, `GetTestimonial` SHALL each have a DI symbol in `config/symbols.ts`
- **AND** each SHALL be bound in `src/server-injection.ts`
- **AND** each SHALL be exported from `src/application/index.ts`
