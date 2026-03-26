## ADDED Requirements

### Requirement: Application layer SHALL provide create use cases for non-user dashboard entities

The system SHALL provide `Create{Entity}` use cases for Achievement, CommunityGroupAdmin, CoreTeam, FundApplication, Group, Permission, ProjectGallery, Team, and Testimonial.

#### Scenario: Create use case exists for each target entity

- **WHEN** the application layer is inspected
- **THEN** `CreateAchievement`, `CreateCommunityGroupAdmin`, `CreateCoreTeam`, `CreateFundApplication`, `CreateGroup`, `CreatePermission`, `CreateProjectGallery`, `CreateTeam`, and `CreateTestimonial` SHALL exist under `src/application/`
- **AND** each use case SHALL delegate to the corresponding repository `create{Entity}` method

### Requirement: Application layer SHALL provide update use cases for non-user dashboard entities

The system SHALL provide `Update{Entity}` use cases for Achievement, CommunityGroupAdmin, CoreTeam, FundApplication, Group, Permission, ProjectGallery, Team, and Testimonial.

#### Scenario: Update use case exists for each target entity

- **WHEN** the application layer is inspected
- **THEN** `UpdateAchievement`, `UpdateCommunityGroupAdmin`, `UpdateCoreTeam`, `UpdateFundApplication`, `UpdateGroup`, `UpdatePermission`, `UpdateProjectGallery`, `UpdateTeam`, and `UpdateTestimonial` SHALL exist under `src/application/`
- **AND** each use case SHALL delegate to the corresponding repository `update{Entity}` method

### Requirement: New write use cases SHALL be resolvable via DI

All new create/update use cases SHALL be exported, symbolized, and bound in dependency-injection containers.

#### Scenario: DI symbols and bindings exist for all write use cases

- **WHEN** DI configuration is inspected
- **THEN** `config/symbols.ts` SHALL define symbols for every new `Create{Entity}` and `Update{Entity}` use case
- **AND** `src/application/index.ts` SHALL export every new write use case
- **AND** `src/client-injection.ts` and `src/server-injection.ts` SHALL bind every new write use case to its symbol
