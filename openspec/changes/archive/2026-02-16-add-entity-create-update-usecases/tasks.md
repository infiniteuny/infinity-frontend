## 1. Application Write Use Cases

- [x] 1.1 Create `src/application/create-achievement.ts` and `src/application/update-achievement.ts`
- [x] 1.2 Create `src/application/create-community-group-admin.ts` and `src/application/update-community-group-admin.ts`
- [x] 1.3 Create `src/application/create-core-team.ts` and `src/application/update-core-team.ts`
- [x] 1.4 Create `src/application/create-fund-application.ts` and `src/application/update-fund-application.ts`
- [x] 1.5 Create `src/application/create-group.ts` and `src/application/update-group.ts`
- [x] 1.6 Create `src/application/create-permission.ts` and `src/application/update-permission.ts`
- [x] 1.7 Create `src/application/create-project-gallery.ts` and `src/application/update-project-gallery.ts`
- [x] 1.8 Create `src/application/create-team.ts` and `src/application/update-team.ts`
- [x] 1.9 Create `src/application/create-testimonial.ts` and `src/application/update-testimonial.ts`

## 2. Exports, Symbols, and DI Bindings

- [x] 2.1 Export all new create/update use cases from `src/application/index.ts`
- [x] 2.2 Add `Create*` and `Update*` symbols for the 9 entities in `config/symbols.ts`
- [x] 2.3 Bind all new write use cases in `src/client-injection.ts`
- [x] 2.4 Bind all new write use cases in `src/server-injection.ts`

## 3. Single-Entity Form Integration

- [x] 3.1 Wire `single-achievement/achievement-form.tsx` to `CreateAchievement` and `UpdateAchievement` submit flow
- [x] 3.2 Wire `single-community-group-admin/community-group-admin-form.tsx` to `CreateCommunityGroupAdmin` and `UpdateCommunityGroupAdmin` submit flow
- [x] 3.3 Wire `single-core-team/core-team-form.tsx` to `CreateCoreTeam` and `UpdateCoreTeam` submit flow
- [x] 3.4 Wire `single-fund-application/fund-application-form.tsx` to `CreateFundApplication` and `UpdateFundApplication` submit flow
- [x] 3.5 Wire `single-group/group-form.tsx` to `CreateGroup` and `UpdateGroup` submit flow
- [x] 3.6 Wire `single-permission/permission-form.tsx` to `CreatePermission` and `UpdatePermission` submit flow
- [x] 3.7 Wire `single-project-gallery/project-gallery-form.tsx` to `CreateProjectGallery` and `UpdateProjectGallery` submit flow
- [x] 3.8 Wire `single-team/team-form.tsx` to `CreateTeam` and `UpdateTeam` submit flow
- [x] 3.9 Wire `single-testimonial/testimonial-form.tsx` to `CreateTestimonial` and `UpdateTestimonial` submit flow

## 4. Route and Save Behavior Alignment

- [x] 4.1 Ensure edit pages pass initial DTO data required for update-mode submit across all 9 entities
- [x] 4.2 Ensure create-mode and update-mode forms navigate to resulting single-entity pages on successful submission
- [x] 4.3 Remove obsolete read-only save placeholders once submit wiring is active

## 5. Validation

- [x] 5.1 Run `npm run lint` and address issues caused by new write use-case wiring
- [x] 5.2 Run `npm run format` to normalize formatting
