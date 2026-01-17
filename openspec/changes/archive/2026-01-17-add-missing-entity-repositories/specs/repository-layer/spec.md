# Repository Layer Specification

## ADDED Requirements

### Requirement: Domain repository interfaces SHALL be created for all entities

All domain entities SHALL have corresponding repository interfaces in `src/domain/repositories/` that define the contract for data access operations without implementation details.

#### Scenario: Achievement repository contract exists
- **WHEN** the Achievement entity is part of the domain and a developer needs achievement data
- **THEN** an `AchievementRepository` interface SHALL exist in `src/domain/repositories/achievement.repository.ts`
- **AND** it SHALL export an interface named `AchievementRepository`
- **AND** it SHALL define methods: `getAchievements()`, `getAchievement()`, `createAchievement()`, `updateAchievement()`, `deleteAchievement()`

#### Scenario: Team repository contract exists
- **WHEN** the Team entity is part of the domain and a developer needs team data
- **THEN** a `TeamRepository` interface SHALL exist in `src/domain/repositories/team.repository.ts`
- **AND** it SHALL export an interface named `TeamRepository`
- **AND** it SHALL define methods: `getTeams()`, `getTeam()`, `createTeam()`, `updateTeam()`, `deleteTeam()`

#### Scenario: All 19 entities have repository contracts
- **WHEN** the change is implemented for missing entities
- **THEN** ALL of the following SHALL have repository contracts: Achievement, Team, Testimonial, CommunityGroup, CommunityGroupAdmin, Group, CoreTeam, CoreTeamDivision, Competition, CompetitionOrganizerType, CompetitionOutput, CompetitionRank, CompetitionScale, CompetitionTeamType, CompetitionTimeRange, FundApplication, Permission, Persona, ProjectGallery

### Requirement: Repository methods SHALL return Either monad for error handling

All repository methods SHALL use the Either monad from effect/Either to represent success or failure explicitly.

#### Scenario: Single entity retrieval returns Either
- **WHEN** a repository method retrieves a single entity
- **THEN** it SHALL return `Promise<Either<Entity, Error>>`
- **AND** success SHALL be represented by `right(entity)`
- **AND** failure SHALL be represented by `left(error)`

#### Scenario: Collection retrieval returns Either with pagination
- **WHEN** a repository method retrieves multiple entities
- **THEN** it SHALL return `Promise<Either<[Entity[], PaginationOptions], Error>>`
- **AND** success SHALL include both the entity array and updated pagination options

### Requirement: Repository methods SHALL support request cancellation

All repository methods SHALL accept an optional AbortSignal parameter to allow request cancellation.

#### Scenario: Repository method accepts abort signal
- **WHEN** a repository method signature is defined
- **THEN** it SHALL accept an optional `abortSignal?: AbortSignal` parameter
- **AND** the parameter SHALL be passed to the underlying HTTP client

### Requirement: Repository methods SHALL support optional authentication

All repository methods SHALL accept an optional authenticate parameter to control whether authentication is required.

#### Scenario: Repository method with authentication enabled
- **WHEN** a repository method is called with `authenticate: true`
- **THEN** it SHALL include an `Authorization: Bearer {token}` header in the request

#### Scenario: Repository method with authentication disabled
- **WHEN** a repository method is called with `authenticate: false`
- **THEN** it SHALL NOT include any Authorization header in the request

### Requirement: Infrastructure repository implementations SHALL be created for all entities

All repository interfaces SHALL have concrete implementations in `src/infrastructure/repositories/` that handle HTTP communication and data transformation.

#### Scenario: Achievement repository implementation exists
- **WHEN** the AchievementRepository interface exists
- **THEN** an `AchievementRepositoryImpl` class SHALL exist in `src/infrastructure/repositories/achievement.repository-impl.ts`
- **AND** it SHALL implement the `AchievementRepository` interface
- **AND** it SHALL inject `InfinityApiDataSource` and `AccessTokenDataSource` via constructor

#### Scenario: Repository implementation uses HTTP client
- **WHEN** a repository implementation method is called
- **THEN** it SHALL use `InfinityApiDataSource` to make HTTP requests
- **AND** it SHALL use appropriate HTTP verbs (GET, POST, PUT/PATCH, DELETE)

### Requirement: Repository implementations SHALL handle errors consistently

All repository implementations SHALL catch and transform errors using the handleAxiosError utility.

#### Scenario: HTTP error is caught and transformed
- **WHEN** an HTTP request fails in a repository method
- **THEN** the error SHALL be caught in a try-catch block
- **AND** the error SHALL be passed to `handleAxiosError()`
- **AND** the method SHALL return `left(transformedError)`

### Requirement: Repository implementations SHALL map DTOs to domain entities

All repository implementations SHALL use mapper classes to transform API responses into domain entities.

#### Scenario: Response is mapped to domain entity
- **WHEN** a repository method receives a successful API response
- **THEN** the implementation SHALL call `{Entity}Mapper.toDomain(response.data)`
- **AND** it SHALL return `right(domainEntity)`

### Requirement: New repositories SHALL be exported from index files

All new repository contracts and implementations SHALL be exported from their respective index files.

#### Scenario: Domain repositories are exported
- **WHEN** `src/domain/repositories/index.ts` is checked
- **THEN** it SHALL export all new repository interfaces using `export * from './{entity}.repository'`

#### Scenario: Infrastructure repositories are exported
- **WHEN** `src/infrastructure/repositories/index.ts` is checked
- **THEN** it SHALL export all new repository implementations using `export * from './{entity}.repository-impl'`

### Requirement: Repositories SHALL support entity-specific filter options

Repository list methods SHALL accept entity-specific filter options for querying.

#### Scenario: Achievement repository supports filtering
- **WHEN** `getAchievements()` is called with filter options
- **THEN** the filters SHALL be mapped to query parameters like `filters[field_name]=value`

### Requirement: Repositories SHALL support entity-specific include options

Repository methods SHALL accept entity-specific include options for related entities.

#### Scenario: Team repository supports including related entities
- **WHEN** `getTeams()` is called with `includeOptions: ['leader']`
- **THEN** the request SHALL include `?includes=leader` query parameter
- **AND** the response SHALL include the related leader data

### Requirement: Include options SHALL be deduplicated

Repository implementations SHALL deduplicate include options before sending requests.

#### Scenario: Duplicate includes are removed
- **WHEN** `getTeams()` is called with `includeOptions: ['leader', 'leader', 'members']`
- **THEN** the query parameter SHALL be `?includes=leader,members`

### Requirement: Repositories SHALL support cursor-based pagination

Repository list methods SHALL accept and return pagination options for cursor-based pagination.

#### Scenario: Paginated request includes cursor and per_page
- **WHEN** `getAchievements()` is called with `paginationOptions: { cursor: 'abc123', perPage: 20 }`
- **THEN** it SHALL include query parameters `cursor=abc123&per_page=20`

#### Scenario: Paginated response returns updated pagination
- **WHEN** a paginated repository method receives a response with pagination metadata
- **THEN** the method SHALL return `right([entities, updatedPaginationOptions])`
- **AND** `updatedPaginationOptions` SHALL reflect the current pagination state

## MODIFIED Requirements

None - this is net new functionality.

## REMOVED Requirements

None - this is net new functionality.
