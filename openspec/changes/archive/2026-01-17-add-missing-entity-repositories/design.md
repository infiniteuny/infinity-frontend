# Repository Layer Design

## Architecture Overview

### Current State

The application follows clean architecture with three main layers:

1. **Domain Layer** (`src/domain/`) - Business entities, repository interfaces, errors
2. **Infrastructure Layer** (`src/infrastructure/`) - Data sources, DTOs, repository implementations
3. **Application Layer** (`src/application/`) - Use cases orchestrating domain and infrastructure

Currently, only 5 entities have complete repository abstraction:

- User, Faculty, Major (full CRUD)
- Auth (authentication operations)
- Internal (internal system operations)

### Target State

All domain entities will have repository contracts and implementations following the established pattern.

## Design Patterns

### 1. Repository Pattern

Each entity gets:

- **Interface** in domain layer - defines contract, no implementation details
- **Implementation** in infrastructure layer - handles HTTP calls, error mapping, DTO transformations

### 2. Error Handling with Effect Either

All repository methods return `Either<T, Error>`:

```typescript
Promise<Either<User, Error>>; // Single entity
Promise<Either<[User[], PaginationOptions], Error>>; // Collection with pagination
```

Benefits:

- Explicit error handling at compile time
- No exceptions thrown
- Composable error handling

### 3. Dependency Injection

Repositories use constructor injection:

```typescript
@inject(SYMBOLS.InfinityApiDataSource) private infinityApiDataSource
@inject(SYMBOLS.AccessTokenDataSource) private accessTokenDataSource
```

### 4. Data Transfer Objects (DTOs)

Infrastructure layer uses DTOs to:

- Map external API responses to domain entities
- Validate incoming data
- Handle API-specific fields (snake_case → camelCase)

### 5. Abort Signal Support

All methods accept `AbortSignal?` for request cancellation, crucial for:

- User navigation away from pages
- Timeout scenarios
- Component unmounting

## Method Signatures

### Standard CRUD Operations

#### List/Query

```typescript
get{Entities}(
  includeOptions?: {Entity}IncludeOptions,
  filterOptions?: {Entity}FilterOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean = true,
): Promise<Either<[{Entity}[], PaginationOptions], Error>>
```

#### Get Single

```typescript
get{Entity}(
  id: string,
  includeOptions?: {Entity}IncludeOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean = true,
): Promise<Either<{Entity}, Error>>
```

#### Create

```typescript
create{Entity}(
  entity: Omit<{Entity}, 'id' | 'createdAt' | 'updatedAt'>,
  abortSignal?: AbortSignal,
  authenticate?: boolean = true,
): Promise<Either<{Entity}, Error>>
```

#### Update

```typescript
update{Entity}(
  id: string,
  entity: Partial<Omit<{Entity}, 'id' | 'createdAt' | 'updatedAt'>>,
  abortSignal?: AbortSignal,
  authenticate?: boolean = true,
): Promise<Either<{Entity}, Error>>
```

#### Delete

```typescript
delete{Entity}(
  id: string,
  abortSignal?: AbortSignal,
  authenticate?: boolean = true,
): Promise<Either<{Entity}, Error>>
```

## Implementation Details

### HTTP Client (InfinityApiDataSource)

- Wraps Axios instance
- Provides `.get()`, `.post()`, `.put()`, `.patch()`, `.delete()` methods
- Handles base URL and common headers
- Returns Axios response objects

### Authentication Flow

1. Check `authenticate` parameter (default: true)
2. If true, call `accessTokenDataSource()` to get token
3. Add `Authorization: Bearer {token}` header
4. If false, proceed without authentication

### Error Handling

```typescript
try {
  const response = await this.infinityApiDataSource.get('/endpoint', { ... });
  return right(EntityMapper.toDomain(response.data));
} catch (error) {
  return left(handleAxiosError(error));
}
```

### Filter Options Mapping

Entity filter options map to query parameters:

```typescript
params: {
  'filters[field_name]': filterOptions?.fieldName,
  'filters[created_at][operator]': filterOptions?.createdAtOperator,
  'filters[created_at][value]': filterOptions?.createdAt?.toISOString(),
}
```

### Include Options

Related entities can be included:

```typescript
params: {
  includes: includeOptions
    ?.filter((value, index, self) => self.indexOf(value) === index)  // dedupe
    .join(','),
}
```

### Pagination

```typescript
params: {
  per_page: paginationOptions?.perPage,
  cursor: paginationOptions?.cursor,
}
```

## Naming Conventions

### Files

- Domain: `{entity}.repository.ts` (lowercase, hyphen-separated)
- Infrastructure: `{entity}.repository-impl.ts`

### Interfaces/Classes

- Domain: `{Entity}Repository` (PascalCase)
- Infrastructure: `{Entity}RepositoryImpl` (PascalCase + Impl suffix)

### Methods

- `get{Entities}` - plural for lists
- `get{Entity}` - singular for single item
- `create{Entity}`, `update{Entity}`, `delete{Entity}`

## Dependencies Required

### For Domain Repositories

```typescript
import { Either } from 'effect/Either';
import { PaginationOptions, {Entity}, ... } from '@app/domain/entities';
```

### For Infrastructure Implementations

```typescript
import { Either, left, right } from 'effect/Either';
import { inject } from 'inversify';
import { SYMBOLS } from '@config';
import { {Entity}Repository } from '@app/domain/repositories';
import { {Entity}Mapper } from '@app/infrastructure/dtos';
import { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { handleAxiosError } from '@app/utils';
```

## Trade-offs

### Benefits

- **Testability**: Mock repositories easily in tests
- **Flexibility**: Change data sources without affecting business logic
- **Consistency**: Uniform API across all entities
- **Type Safety**: TypeScript enforces contracts
- **Error Handling**: Explicit, composable error handling

### Costs

- **Boilerplate**: More files and code per entity
- **Initial Setup**: Requires DTOs, mappers, and dependency injection setup
- **Learning Curve**: Developers must understand clean architecture and Either monad

### Mitigation

- Code generation scripts could reduce boilerplate
- Comprehensive examples and documentation
- Established patterns make new repositories predictable

## Open Questions

1. Should repositories handle caching, or is that an application layer concern?
2. Do we need a generic base repository to reduce duplication?
3. Should soft-delete entities have a `restore{Entity}()` method?
4. How do we handle batch operations (bulk create/update/delete)?
5. Should filter operators be standardized across all repositories?

## Next Steps

After proposal approval:

1. **Phase 1 (Highest Priority - RBAC):** Implement Group and Permission repositories first as they are foundational for the permission system
2. **Phase 2 (High Priority - Core Teams & Community Groups):** Implement CoreTeam, CoreTeamDivision, CommunityGroup, and CommunityGroupAdmin repositories
3. **Phase 3 (Medium Priority - Teams & Competitions):** Implement Persona, Team, Competition-related (7 types), FundApplication, and Achievement repositories
4. **Phase 4 (Lower Priority - Public Content):** Implement Testimonial and ProjectGallery repositories
5. Gather feedback and refine pattern after Phase 4
