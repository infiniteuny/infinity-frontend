## 1. Application Use Cases and DI Wiring

- [x] 1.1 Create `GetAchievement` use case in `src/application/get-achievement.ts` following the `GetUser` pattern (injectable class, inject `AchievementRepository`, delegate to `getAchievement()`)
- [x] 1.2 Create `GetCommunityGroupAdmin` use case in `src/application/get-community-group-admin.ts`
- [x] 1.3 Create `GetCoreTeam` use case in `src/application/get-core-team.ts`
- [x] 1.4 Create `GetFundApplication` use case in `src/application/get-fund-application.ts`
- [x] 1.5 Create `GetGroup` use case in `src/application/get-group.ts`
- [x] 1.6 Create `GetPermission` use case in `src/application/get-permission.ts`
- [x] 1.7 Create `GetProjectGallery` use case in `src/application/get-project-gallery.ts`
- [x] 1.8 Create `GetTeam` use case in `src/application/get-team.ts`
- [x] 1.9 Create `GetTestimonial` use case in `src/application/get-testimonial.ts`
- [x] 1.10 Export all 9 new use cases from `src/application/index.ts`
- [x] 1.11 Add DI symbols for all 9 use cases in `config/symbols.ts` (`GetAchievement`, `GetCommunityGroupAdmin`, `GetCoreTeam`, `GetFundApplication`, `GetGroup`, `GetPermission`, `GetProjectGallery`, `GetTeam`, `GetTestimonial`)
- [x] 1.12 Add server container bindings for all 9 use cases in `src/server-injection.ts`

## 2. Single Achievement Components and Pages

- [x] 2.1 Create `src/presentation/components/internal/single-achievement/` with `achievement-view.tsx` (client component: accepts `AchievementDto`, converts to domain, renders general + competition + metadata sections), `achievement-toolbar.tsx` (edit button linking to `/achievements/{id}/edit`), and `index.ts` barrel export
- [x] 2.2 Replace stub `app/(internal)/(dashboard)/achievements/[achievementId]/page.tsx` with server-side `GetAchievement` fetch, `NotFoundError` handling, section header, toolbar, and `AchievementView`
- [x] 2.3 Replace stub `app/(internal)/(dashboard)/achievements/[achievementId]/edit/page.tsx` with server-side fetch and read-only `AchievementForm` component rendering
- [x] 2.4 Create `src/presentation/components/internal/single-achievement/achievement-form.tsx` with zod schema and form sections for achievement fields

## 3. Single Community Group Admin Components and Pages

- [x] 3.1 Create `src/presentation/components/internal/single-community-group-admin/` with `community-group-admin-view.tsx` (sections: general with year/group/active, metadata), `community-group-admin-toolbar.tsx`, and `index.ts`
- [x] 3.2 Replace stub `app/(internal)/(dashboard)/community-group-admins/[communityGroupAdminId]/page.tsx` with data-fetching and view rendering
- [x] 3.3 Replace stub `app/(internal)/(dashboard)/community-group-admins/[communityGroupAdminId]/edit/page.tsx` with data-fetching and form rendering
- [x] 3.4 Create `src/presentation/components/internal/single-community-group-admin/community-group-admin-form.tsx`

## 4. Single Core Team Components and Pages

- [x] 4.1 Create `src/presentation/components/internal/single-core-team/` with `core-team-view.tsx` (sections: general with year/group/active, metadata), `core-team-toolbar.tsx`, and `index.ts`
- [x] 4.2 Replace stub `app/(internal)/(dashboard)/core-teams/[coreTeamId]/page.tsx` with data-fetching and view rendering
- [x] 4.3 Replace stub `app/(internal)/(dashboard)/core-teams/[coreTeamId]/edit/page.tsx` with data-fetching and form rendering
- [x] 4.4 Create `src/presentation/components/internal/single-core-team/core-team-form.tsx`

## 5. Single Fund Application Components and Pages

- [x] 5.1 Create `src/presentation/components/internal/single-fund-application/` with `fund-application-view.tsx` (sections: general with team/competition/dates, documents with letter/proposal, status, metadata), `fund-application-toolbar.tsx`, and `index.ts`
- [x] 5.2 Replace stub `app/(internal)/(dashboard)/fund-applications/[fundApplicationId]/page.tsx` with data-fetching and view rendering
- [x] 5.3 Replace stub `app/(internal)/(dashboard)/fund-applications/[fundApplicationId]/edit/page.tsx` with data-fetching and form rendering
- [x] 5.4 Create `src/presentation/components/internal/single-fund-application/fund-application-form.tsx`

## 6. Single Group Components and Pages

- [x] 6.1 Create `src/presentation/components/internal/single-group/` with `group-view.tsx` (sections: general with name/guard name, metadata), `group-toolbar.tsx`, and `index.ts`
- [x] 6.2 Replace stub `app/(internal)/(dashboard)/groups/[groupId]/page.tsx` with data-fetching and view rendering
- [x] 6.3 Replace stub `app/(internal)/(dashboard)/groups/[groupId]/edit/page.tsx` with data-fetching and form rendering
- [x] 6.4 Create `src/presentation/components/internal/single-group/group-form.tsx`

## 7. Single Permission Components and Pages

- [x] 7.1 Create `src/presentation/components/internal/single-permission/` with `permission-view.tsx` (sections: general with name/guard name, metadata), `permission-toolbar.tsx`, and `index.ts`
- [x] 7.2 Replace stub `app/(internal)/(dashboard)/permissions/[permissionId]/page.tsx` with data-fetching and view rendering
- [x] 7.3 Replace stub `app/(internal)/(dashboard)/permissions/[permissionId]/edit/page.tsx` with data-fetching and form rendering
- [x] 7.4 Create `src/presentation/components/internal/single-permission/permission-form.tsx`

## 8. Single Project Gallery Components and Pages

- [x] 8.1 Create `src/presentation/components/internal/single-project-gallery/` with `project-gallery-view.tsx` (sections: general with title/description/url/image, metadata), `project-gallery-toolbar.tsx`, and `index.ts`
- [x] 8.2 Replace stub `app/(internal)/(dashboard)/project-galleries/[projectGalleryId]/page.tsx` with data-fetching and view rendering
- [x] 8.3 Replace stub `app/(internal)/(dashboard)/project-galleries/[projectGalleryId]/edit/page.tsx` with data-fetching and form rendering
- [x] 8.4 Create `src/presentation/components/internal/single-project-gallery/project-gallery-form.tsx`

## 9. Single Team Components and Pages

- [x] 9.1 Create `src/presentation/components/internal/single-team/` with `team-view.tsx` (sections: general with name/leader/personal, metadata), `team-toolbar.tsx`, and `index.ts`
- [x] 9.2 Replace stub `app/(internal)/(dashboard)/teams/[teamId]/page.tsx` with data-fetching and view rendering
- [x] 9.3 Replace stub `app/(internal)/(dashboard)/teams/[teamId]/edit/page.tsx` with data-fetching and form rendering
- [x] 9.4 Create `src/presentation/components/internal/single-team/team-form.tsx`

## 10. Single Testimonial Components and Pages

- [x] 10.1 Create `src/presentation/components/internal/single-testimonial/` with `testimonial-view.tsx` (sections: general with name/position/content/photo, metadata), `testimonial-toolbar.tsx`, and `index.ts`
- [x] 10.2 Replace stub `app/(internal)/(dashboard)/testimonials/[testimonialId]/page.tsx` with data-fetching and view rendering
- [x] 10.3 Replace stub `app/(internal)/(dashboard)/testimonials/[testimonialId]/edit/page.tsx` with data-fetching and form rendering
- [x] 10.4 Create `src/presentation/components/internal/single-testimonial/testimonial-form.tsx`

## 11. Validation

- [x] 11.1 Run `npm run lint` to verify no lint errors across all new and modified files
- [x] 11.2 Run `npm run format` to ensure code formatting compliance
