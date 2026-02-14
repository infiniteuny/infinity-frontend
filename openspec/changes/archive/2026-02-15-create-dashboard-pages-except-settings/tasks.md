## 1. Application and DI groundwork

- [x] 1.1 Audit target dashboard entities and map each route to existing repository contracts and DTO mappers.
- [x] 1.2 Add missing application-layer get/list use-cases for target entities following `GetUsers` conventions.
- [x] 1.3 Export new use-cases from `src/application/index.ts` and add required symbols in `config/symbols.ts`.
- [x] 1.4 Bind new use-cases in `src/server-injection.ts` and `src/client-injection.ts` where needed.

## 2. Presentation components for entity list pages

- [x] 2.1 Create or complete module toolbar components for achievements, community group admins, community groups, core teams, fund applications, groups, permissions, project galleries, teams, and testimonials.
- [x] 2.2 Create or complete module list components with initial DTO hydration and pagination behavior aligned to current dashboard table conventions.
- [x] 2.3 Add or update internal component barrel exports to expose all new module page components.

## 3. Dashboard route implementation

- [x] 3.1 Implement `app/(internal)/(dashboard)/teams/page.tsx` with users-pattern server composition.
- [x] 3.2 Implement `app/(internal)/(dashboard)/achievements/page.tsx` and `fund-applications/page.tsx` with users-pattern server composition.
- [x] 3.3 Implement `app/(internal)/(dashboard)/community-group-admins/page.tsx` with users-pattern server composition.
- [x] 3.4 Implement `app/(internal)/(dashboard)/core-teams/page.tsx` with users-pattern server composition.
- [x] 3.5 Implement `app/(internal)/(dashboard)/groups/page.tsx` and `permissions/page.tsx` with users-pattern server composition.
- [x] 3.6 Implement `app/(internal)/(dashboard)/project-galleries/page.tsx` and `testimonials/page.tsx` with users-pattern server composition.
- [x] 3.7 Verify `app/(internal)/(dashboard)/settings/page.tsx` remains unchanged.

## 4. Validation and readiness

- [x] 4.1 Run lint/type-check and resolve issues introduced by this change.
- [x] 4.2 Perform manual smoke checks for each implemented dashboard module route.
- [x] 4.3 Confirm all routes respect clean-architecture boundaries and do not call repositories directly from page components.
