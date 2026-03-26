## ADDED Requirements

### Requirement: Single-entity detail pages SHALL display entity data with section-based layout

Each dashboard entity module SHALL have a single-entity detail page at `/{module}/[entityId]` that fetches the entity by ID on the server, converts it to a DTO, and renders a client-side view component with section-based layout using MUI Grid.

#### Scenario: View a single achievement

- **WHEN** an authenticated user navigates to `/achievements/{achievementId}`
- **THEN** the page SHALL fetch the achievement with its relations via the `GetAchievement` use case
- **AND** render a section header with the achievement's competition name or description
- **AND** render view sections showing achievement fields grouped logically (general info, competition details, metadata)

#### Scenario: View a single community group admin

- **WHEN** an authenticated user navigates to `/community-group-admins/{communityGroupAdminId}`
- **THEN** the page SHALL fetch the community group admin with its group relation via the `GetCommunityGroupAdmin` use case
- **AND** render a section header with the admin's group name
- **AND** render view sections showing fields (year, group, active status, metadata)

#### Scenario: View a single core team

- **WHEN** an authenticated user navigates to `/core-teams/{coreTeamId}`
- **THEN** the page SHALL fetch the core team with its group relation via the `GetCoreTeam` use case
- **AND** render a section header with the group name
- **AND** render view sections showing fields (year, group, active status, metadata)

#### Scenario: View a single fund application

- **WHEN** an authenticated user navigates to `/fund-applications/{fundApplicationId}`
- **THEN** the page SHALL fetch the fund application with its relations via the `GetFundApplication` use case
- **AND** render a section header with the competition branch
- **AND** render view sections showing fields (team, competition details, documents, status, metadata)

#### Scenario: View a single group

- **WHEN** an authenticated user navigates to `/groups/{groupId}`
- **THEN** the page SHALL fetch the group via the `GetGroup` use case
- **AND** render a section header with the group name
- **AND** render view sections showing fields (name, guard name, metadata)

#### Scenario: View a single permission

- **WHEN** an authenticated user navigates to `/permissions/{permissionId}`
- **THEN** the page SHALL fetch the permission via the `GetPermission` use case
- **AND** render a section header with the permission name
- **AND** render view sections showing fields (name, guard name, metadata)

#### Scenario: View a single project gallery

- **WHEN** an authenticated user navigates to `/project-galleries/{projectGalleryId}`
- **THEN** the page SHALL fetch the project gallery via the `GetProjectGallery` use case
- **AND** render a section header with the project title
- **AND** render view sections showing fields (title, description, URL, image, metadata)

#### Scenario: View a single team

- **WHEN** an authenticated user navigates to `/teams/{teamId}`
- **THEN** the page SHALL fetch the team with its leader relation via the `GetTeam` use case
- **AND** render a section header with the team name
- **AND** render view sections showing fields (name, leader, personal status, metadata)

#### Scenario: View a single testimonial

- **WHEN** an authenticated user navigates to `/testimonials/{testimonialId}`
- **THEN** the page SHALL fetch the testimonial via the `GetTestimonial` use case
- **AND** render a section header with the testimonial name
- **AND** render view sections showing fields (name, position, content, photo, metadata)

### Requirement: Single-entity pages SHALL handle not-found errors

When the requested entity ID does not exist, the page SHALL return a 404 not-found response.

#### Scenario: Navigate to a non-existent entity

- **WHEN** a user navigates to `/{module}/{nonExistentId}`
- **THEN** the page SHALL catch the `NotFoundError` from the use case result
- **AND** call Next.js `notFound()` to render the 404 page

### Requirement: Single-entity pages SHALL include a toolbar with edit navigation

Each single-entity detail page SHALL render a toolbar in the section header that includes an Edit button linking to the entity's edit route.

#### Scenario: Click edit on a single entity page

- **WHEN** a user views a single entity detail page
- **THEN** a toolbar SHALL be rendered with an Edit button
- **AND** clicking the Edit button SHALL navigate to `/{module}/{entityId}/edit`

### Requirement: Single-entity view components SHALL convert DTOs to domain entities

Each entity's view component SHALL accept an initial DTO prop, convert it to a domain entity using the entity's mapper, and render domain entity fields.

#### Scenario: View component receives DTO and renders domain fields

- **WHEN** the server page passes a mapped DTO to the client view component
- **THEN** the component SHALL call `{Entity}Mapper.fromDtoToDomain()` to reconstruct the domain entity
- **AND** render fields from the domain entity

### Requirement: Edit pages SHALL display entity data in form layout

Each dashboard entity module SHALL have an edit page at `/{module}/[entityId]/edit` that fetches the entity by ID on the server, converts it to a DTO, and renders a client-side form component with fields pre-populated from entity data.

#### Scenario: Open edit page for a single entity

- **WHEN** an authenticated user navigates to `/{module}/{entityId}/edit`
- **THEN** the page SHALL fetch the entity via the corresponding `Get{Entity}` use case
- **AND** render a form component with fields pre-populated from the entity data
- **AND** the form SHALL include section groupings consistent with the detail view layout

### Requirement: Single-entity pages SHALL use application use cases via dependency injection

All single-entity pages SHALL obtain data through application-layer use cases resolved from the server DI container, never calling repositories or data sources directly.

#### Scenario: Review single-entity page implementation dependencies

- **WHEN** a target single-entity page implementation is inspected
- **THEN** data retrieval SHALL be performed through a `Get{Entity}` use case resolved from `serverContainer`
- **AND** the use case SHALL be resolved using the corresponding DI symbol from `SYMBOLS`

### Requirement: Each entity SHALL have a dedicated Get use case for single-entity retrieval

Each of the 9 non-user entities SHALL have a `Get{Entity}` application use case class that delegates to the corresponding repository's `get{Entity}()` method.

#### Scenario: GetAchievement use case exists and follows pattern

- **WHEN** the application layer is inspected
- **THEN** a `GetAchievement` class SHALL exist in `src/application/get-achievement.ts`
- **AND** it SHALL be `@injectable()` and inject `AchievementRepository` via `@inject(SYMBOLS.AchievementRepository)`
- **AND** its `execute()` method SHALL delegate to `achievementRepository.getAchievement()`

#### Scenario: All 9 single-entity use cases exist

- **WHEN** the application layer is inspected
- **THEN** `GetAchievement`, `GetCommunityGroupAdmin`, `GetCoreTeam`, `GetFundApplication`, `GetGroup`, `GetPermission`, `GetProjectGallery`, `GetTeam`, `GetTestimonial` SHALL all exist
- **AND** each SHALL follow the same injectable pattern as `GetUser`
