# Change: Add Missing Entity Repositories

## Why

Only 5 of 24 entities have repository abstractions, forcing direct data source access in 19 entities and violating clean architecture principles.

## What Changes

- Create 19 repository interface contracts in `src/domain/repositories/`
- Create 19 repository implementations in `src/infrastructure/repositories/`
- Update index.ts exports in both domain and infrastructure layers
- All repositories follow existing CRUD pattern: get{Entities}(), get{Entity}(), create{Entity}(), update{Entity}(), delete{Entity}()
- All methods return Either<T, Error> for error handling
- All methods support AbortSignal and optional authentication

**Entities (by priority):**

1. **Group 1 (Highest - RBAC):** Group, Permission
2. **Group 2 (High - Core Teams & Community Groups):** CoreTeam, CoreTeamDivision, CommunityGroup, CommunityGroupAdmin
3. **Group 3 (Medium - Teams & Competitions):** Persona, Team, Competition, CompetitionOrganizerType, CompetitionOutput, CompetitionRank, CompetitionScale, CompetitionTeamType, CompetitionTimeRange, FundApplication, Achievement
4. **Group 4 (Lower - Public Content):** Testimonial, ProjectGallery

## Impact

- **Affected specs:** repository-layer (new capability)
- **Affected code:**
  - `src/domain/repositories/` - 19 new files
  - `src/infrastructure/repositories/` - 19 new files
  - Both index.ts files updated
- **Files Created:** ~38 new files
- **Breaking Changes:** None - purely additive
- **Dependencies:** Requires DTOs and mappers (may need separate work)
