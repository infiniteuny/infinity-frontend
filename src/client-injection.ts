import { Container } from 'inversify';
import {
  AchievementRepository,
  CommunityGroupAdminRepository,
  CommunityGroupRepository,
  CompetitionOrganizerTypeRepository,
  CompetitionOutputRepository,
  CompetitionRankRepository,
  CompetitionScaleRepository,
  CompetitionTeamTypeRepository,
  CompetitionTimeRangeRepository,
  CompetitionRepository,
  CoreTeamDivisionRepository,
  CoreTeamRepository,
  FacultyRepository,
  FundApplicationRepository,
  GroupRepository,
  InternalRepository,
  MajorRepository,
  PermissionRepository,
  PersonaRepository,
  ProjectGalleryRepository,
  TeamRepository,
  TestimonialRepository,
  UserRepository,
} from '@app/domain/repositories';
import {
  AchievementRepositoryImpl,
  CommunityGroupAdminRepositoryImpl,
  CommunityGroupRepositoryImpl,
  CompetitionOrganizerTypeRepositoryImpl,
  CompetitionOutputRepositoryImpl,
  CompetitionRankRepositoryImpl,
  CompetitionScaleRepositoryImpl,
  CompetitionTeamTypeRepositoryImpl,
  CompetitionTimeRangeRepositoryImpl,
  CompetitionRepositoryImpl,
  CoreTeamDivisionRepositoryImpl,
  CoreTeamRepositoryImpl,
  FacultyRepositoryImpl,
  FundApplicationRepositoryImpl,
  GroupRepositoryImpl,
  InternalRepositoryImpl,
  MajorRepositoryImpl,
  PermissionRepositoryImpl,
  PersonaRepositoryImpl,
  ProjectGalleryRepositoryImpl,
  TeamRepositoryImpl,
  TestimonialRepositoryImpl,
  UserRepositoryImpl,
} from '@app/infrastructure/repositories';
import {
  CreateUser,
  DeleteUser,
  GetFaculties,
  GetMajors,
  GetSidebarExtendedState,
  GetUsers,
  SetSidebarExtendedState,
  UpdateUser,
} from '@app/application';
import {
  InfinityApiDataSource,
  infinityApiDataSourceImpl,
} from '@app/infrastructure/datasources/server';
import {
  SessionStorageDataSource,
  SessionStorageDataSourceImpl,
} from '@app/infrastructure/datasources/client';
import { SYMBOLS } from '@config';
import { getSession } from 'next-auth/react';

export const clientContainer = new Container();

// Use cases
clientContainer
  .bind<GetSidebarExtendedState>(SYMBOLS.GetSidebarExtendedState)
  .to(GetSidebarExtendedState);
clientContainer
  .bind<SetSidebarExtendedState>(SYMBOLS.SetSidebarExtendedState)
  .to(SetSidebarExtendedState);
clientContainer.bind<CreateUser>(SYMBOLS.CreateUser).to(CreateUser);
clientContainer.bind<DeleteUser>(SYMBOLS.DeleteUser).to(DeleteUser);
clientContainer.bind<GetFaculties>(SYMBOLS.GetFaculties).to(GetFaculties);
clientContainer.bind<GetMajors>(SYMBOLS.GetMajors).to(GetMajors);
clientContainer.bind<GetUsers>(SYMBOLS.GetUsers).to(GetUsers);
clientContainer.bind<UpdateUser>(SYMBOLS.UpdateUser).to(UpdateUser);

// Repositories
clientContainer
  .bind<AchievementRepository>(SYMBOLS.AchievementRepository)
  .to(AchievementRepositoryImpl);
clientContainer
  .bind<CommunityGroupAdminRepository>(SYMBOLS.CommunityGroupAdminRepository)
  .to(CommunityGroupAdminRepositoryImpl);
clientContainer
  .bind<CommunityGroupRepository>(SYMBOLS.CommunityGroupRepository)
  .to(CommunityGroupRepositoryImpl);
clientContainer
  .bind<CompetitionOrganizerTypeRepository>(SYMBOLS.CompetitionOrganizerTypeRepository)
  .to(CompetitionOrganizerTypeRepositoryImpl);
clientContainer
  .bind<CompetitionOutputRepository>(SYMBOLS.CompetitionOutputRepository)
  .to(CompetitionOutputRepositoryImpl);
clientContainer
  .bind<CompetitionRankRepository>(SYMBOLS.CompetitionRankRepository)
  .to(CompetitionRankRepositoryImpl);
clientContainer
  .bind<CompetitionScaleRepository>(SYMBOLS.CompetitionScaleRepository)
  .to(CompetitionScaleRepositoryImpl);
clientContainer
  .bind<CompetitionTeamTypeRepository>(SYMBOLS.CompetitionTeamTypeRepository)
  .to(CompetitionTeamTypeRepositoryImpl);
clientContainer
  .bind<CompetitionTimeRangeRepository>(SYMBOLS.CompetitionTimeRangeRepository)
  .to(CompetitionTimeRangeRepositoryImpl);
clientContainer
  .bind<CompetitionRepository>(SYMBOLS.CompetitionRepository)
  .to(CompetitionRepositoryImpl);
clientContainer
  .bind<CoreTeamDivisionRepository>(SYMBOLS.CoreTeamDivisionRepository)
  .to(CoreTeamDivisionRepositoryImpl);
clientContainer.bind<CoreTeamRepository>(SYMBOLS.CoreTeamRepository).to(CoreTeamRepositoryImpl);
clientContainer.bind<InternalRepository>(SYMBOLS.InternalRepository).to(InternalRepositoryImpl);
clientContainer.bind<FacultyRepository>(SYMBOLS.FacultyRepository).to(FacultyRepositoryImpl);
clientContainer
  .bind<FundApplicationRepository>(SYMBOLS.FundApplicationRepository)
  .to(FundApplicationRepositoryImpl);
clientContainer.bind<GroupRepository>(SYMBOLS.GroupRepository).to(GroupRepositoryImpl);
clientContainer.bind<MajorRepository>(SYMBOLS.MajorRepository).to(MajorRepositoryImpl);
clientContainer
  .bind<PermissionRepository>(SYMBOLS.PermissionRepository)
  .to(PermissionRepositoryImpl);
clientContainer.bind<PersonaRepository>(SYMBOLS.PersonaRepository).to(PersonaRepositoryImpl);
clientContainer
  .bind<ProjectGalleryRepository>(SYMBOLS.ProjectGalleryRepository)
  .to(ProjectGalleryRepositoryImpl);
clientContainer.bind<TeamRepository>(SYMBOLS.TeamRepository).to(TeamRepositoryImpl);
clientContainer
  .bind<TestimonialRepository>(SYMBOLS.TestimonialRepository)
  .to(TestimonialRepositoryImpl);
clientContainer.bind<UserRepository>(SYMBOLS.UserRepository).to(UserRepositoryImpl);

// Data sources
clientContainer
  .bind<SessionStorageDataSource>(SYMBOLS.SessionStorageDataSource)
  .to(SessionStorageDataSourceImpl);
clientContainer.bind<() => Promise<string>>(SYMBOLS.AccessTokenDataSource).toDynamicValue(() => {
  return async () => (await getSession())?.accessToken || '';
});
clientContainer
  .bind<InfinityApiDataSource>(SYMBOLS.InfinityApiDataSource)
  .toConstantValue(infinityApiDataSourceImpl);
