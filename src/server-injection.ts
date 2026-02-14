import 'reflect-metadata';
import type { AuthDataSource } from '@app/infrastructure/datasources/auth.data-source';
import { AuthController, AuthControllerImpl } from '@app/presentation/controllers';
import {
  AchievementRepository,
  AuthRepository,
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
  AuthRepositoryImpl,
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
  MajorRepositoryImpl,
  PermissionRepositoryImpl,
  PersonaRepositoryImpl,
  ProjectGalleryRepositoryImpl,
  TeamRepositoryImpl,
  TestimonialRepositoryImpl,
  UserRepositoryImpl,
} from '@app/infrastructure/repositories';
import { Container } from 'inversify';
import {
  createAuthDataSourceImpl,
  InfinityApiDataSource,
  infinityApiDataSourceImpl,
} from '@app/infrastructure/datasources/server';
import {
  GetAchievements,
  GetCommunityGroupAdmins,
  GetCommunityGroups,
  GetCoreTeams,
  GetFaculties,
  GetFundApplications,
  GetGroups,
  GetMajors,
  GetPermissions,
  GetProjectGalleries,
  GetSession,
  GetTeams,
  GetTestimonials,
  GetUser,
  GetUsers,
  Login,
} from '@app/application';
import { SYMBOLS } from '@config';

export const serverContainer = new Container();

// Use Cases
serverContainer.bind<Login>(SYMBOLS.Login).to(Login);
serverContainer.bind<GetSession>(SYMBOLS.GetSession).to(GetSession);
serverContainer.bind<GetAchievements>(SYMBOLS.GetAchievements).to(GetAchievements);
serverContainer
  .bind<GetCommunityGroupAdmins>(SYMBOLS.GetCommunityGroupAdmins)
  .to(GetCommunityGroupAdmins);
serverContainer.bind<GetCommunityGroups>(SYMBOLS.GetCommunityGroups).to(GetCommunityGroups);
serverContainer.bind<GetCoreTeams>(SYMBOLS.GetCoreTeams).to(GetCoreTeams);
serverContainer.bind<GetFaculties>(SYMBOLS.GetFaculties).to(GetFaculties);
serverContainer.bind<GetFundApplications>(SYMBOLS.GetFundApplications).to(GetFundApplications);
serverContainer.bind<GetGroups>(SYMBOLS.GetGroups).to(GetGroups);
serverContainer.bind<GetMajors>(SYMBOLS.GetMajors).to(GetMajors);
serverContainer.bind<GetPermissions>(SYMBOLS.GetPermissions).to(GetPermissions);
serverContainer.bind<GetProjectGalleries>(SYMBOLS.GetProjectGalleries).to(GetProjectGalleries);
serverContainer.bind<GetTeams>(SYMBOLS.GetTeams).to(GetTeams);
serverContainer.bind<GetTestimonials>(SYMBOLS.GetTestimonials).to(GetTestimonials);
serverContainer.bind<GetUsers>(SYMBOLS.GetUsers).to(GetUsers);
serverContainer.bind<GetUser>(SYMBOLS.GetUser).to(GetUser);

// Controllers
serverContainer.bind<AuthController>(SYMBOLS.AuthController).to(AuthControllerImpl);

// Repositories
serverContainer
  .bind<AchievementRepository>(SYMBOLS.AchievementRepository)
  .to(AchievementRepositoryImpl);
serverContainer.bind<AuthRepository>(SYMBOLS.AuthRepository).to(AuthRepositoryImpl);
serverContainer
  .bind<CommunityGroupAdminRepository>(SYMBOLS.CommunityGroupAdminRepository)
  .to(CommunityGroupAdminRepositoryImpl);
serverContainer
  .bind<CommunityGroupRepository>(SYMBOLS.CommunityGroupRepository)
  .to(CommunityGroupRepositoryImpl);
serverContainer
  .bind<CompetitionOrganizerTypeRepository>(SYMBOLS.CompetitionOrganizerTypeRepository)
  .to(CompetitionOrganizerTypeRepositoryImpl);
serverContainer
  .bind<CompetitionOutputRepository>(SYMBOLS.CompetitionOutputRepository)
  .to(CompetitionOutputRepositoryImpl);
serverContainer
  .bind<CompetitionRankRepository>(SYMBOLS.CompetitionRankRepository)
  .to(CompetitionRankRepositoryImpl);
serverContainer
  .bind<CompetitionScaleRepository>(SYMBOLS.CompetitionScaleRepository)
  .to(CompetitionScaleRepositoryImpl);
serverContainer
  .bind<CompetitionTeamTypeRepository>(SYMBOLS.CompetitionTeamTypeRepository)
  .to(CompetitionTeamTypeRepositoryImpl);
serverContainer
  .bind<CompetitionTimeRangeRepository>(SYMBOLS.CompetitionTimeRangeRepository)
  .to(CompetitionTimeRangeRepositoryImpl);
serverContainer
  .bind<CompetitionRepository>(SYMBOLS.CompetitionRepository)
  .to(CompetitionRepositoryImpl);
serverContainer
  .bind<CoreTeamDivisionRepository>(SYMBOLS.CoreTeamDivisionRepository)
  .to(CoreTeamDivisionRepositoryImpl);
serverContainer.bind<CoreTeamRepository>(SYMBOLS.CoreTeamRepository).to(CoreTeamRepositoryImpl);
serverContainer.bind<FacultyRepository>(SYMBOLS.FacultyRepository).to(FacultyRepositoryImpl);
serverContainer
  .bind<FundApplicationRepository>(SYMBOLS.FundApplicationRepository)
  .to(FundApplicationRepositoryImpl);
serverContainer.bind<GroupRepository>(SYMBOLS.GroupRepository).to(GroupRepositoryImpl);
serverContainer.bind<MajorRepository>(SYMBOLS.MajorRepository).to(MajorRepositoryImpl);
serverContainer
  .bind<PermissionRepository>(SYMBOLS.PermissionRepository)
  .to(PermissionRepositoryImpl);
serverContainer.bind<PersonaRepository>(SYMBOLS.PersonaRepository).to(PersonaRepositoryImpl);
serverContainer
  .bind<ProjectGalleryRepository>(SYMBOLS.ProjectGalleryRepository)
  .to(ProjectGalleryRepositoryImpl);
serverContainer.bind<TeamRepository>(SYMBOLS.TeamRepository).to(TeamRepositoryImpl);
serverContainer
  .bind<TestimonialRepository>(SYMBOLS.TestimonialRepository)
  .to(TestimonialRepositoryImpl);
serverContainer.bind<UserRepository>(SYMBOLS.UserRepository).to(UserRepositoryImpl);

// Data sources
serverContainer.bind<AuthDataSource>(SYMBOLS.AuthDataSource).toDynamicValue(() => {
  const getUsers = serverContainer.get<GetUsers>(SYMBOLS.GetUsers);
  return createAuthDataSourceImpl(getUsers);
});

serverContainer
  .bind<() => Promise<string>>(SYMBOLS.AccessTokenDataSource)
  .toDynamicValue(() => async () => {
    const authDataSource = serverContainer.get<AuthDataSource>(SYMBOLS.AuthDataSource);
    const session = await authDataSource.auth();
    return session?.accessToken || '';
  });
serverContainer
  .bind<InfinityApiDataSource>(SYMBOLS.InfinityApiDataSource)
  .toConstantValue(infinityApiDataSourceImpl);
