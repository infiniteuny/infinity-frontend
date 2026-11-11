import 'reflect-metadata';
import { AuthController, AuthControllerImpl } from '@app/presentation/controllers';
import { Container } from 'inversify';
import { SYMBOLS } from '@config';
import {
  AuthServerDataSource,
  authServerDataSourceImpl,
  InfinityApiDataSource,
  infinityApiDataSourceImpl,
} from '@infiniteuny/infinity-infrastructure/datasources/server';
import {
  AchievementLeaderboardRepository,
  AchievementRepository,
  AuthRepository,
  CommunityGroupAdminMemberRepository,
  CommunityGroupAdminRepository,
  CommunityGroupMemberRepository,
  CommunityGroupRepository,
  CompetitionInstanceRepository,
  CompetitionRepository,
  CoreTeamMemberRepository,
  CoreTeamRepository,
  PersonaRepository,
  ProjectGalleryRepository,
  TestimonialRepository,
  UserCommunityGroupRepository,
  UserPermissionRepository,
  UserPersonaRepository,
  UserRepository,
} from '@infiniteuny/infinity-domain';
import {
  AchievementLeaderboardRepositoryImpl,
  AchievementRepositoryImpl,
  AuthRepositoryImpl,
  CommunityGroupAdminMemberRepositoryImpl,
  CommunityGroupAdminRepositoryImpl,
  CommunityGroupMemberRepositoryImpl,
  CommunityGroupRepositoryImpl,
  CompetitionInstanceRepositoryImpl,
  CompetitionRepositoryImpl,
  CoreTeamMemberRepositoryImpl,
  CoreTeamRepositoryImpl,
  PersonaRepositoryImpl,
  ProjectGalleryRepositoryImpl,
  TestimonialRepositoryImpl,
  UserCommunityGroupRepositoryImpl,
  UserPermissionRepositoryImpl,
  UserPersonaRepositoryImpl,
  UserRepositoryImpl,
} from '@infiniteuny/infinity-infrastructure';
import {
  GetAchievement,
  GetAchievementLeaderboardYears,
  GetAchievementLeaderboards,
  GetAchievements,
  GetCommunityGroupAdminMembers,
  GetCommunityGroupAdmins,
  GetCommunityGroupMembers,
  GetCommunityGroups,
  GetCompetitionInstances,
  GetCompetitions,
  GetCoreTeamMembers,
  GetCoreTeams,
  GetPersonas,
  GetProjectGalleries,
  GetSession,
  GetTestimonials,
  GetUser,
  GetUserCommunityGroups,
  GetUserPermissionsWithToken,
  GetUserPersonas,
  GetUsers,
  GetUsersWithToken,
  Logout,
} from '@infiniteuny/infinity-application';

const serverContainer = new Container();

// Data sources
serverContainer
  .bind<AuthServerDataSource>(SYMBOLS.AuthDataSource)
  .toDynamicValue(() => {
    const getUsers = serverContainer.get<GetUsersWithToken>(SYMBOLS.GetUsersWithToken);
    const getUserPermissionsWithToken = serverContainer.get<GetUserPermissionsWithToken>(
      SYMBOLS.GetUserPermissionsWithToken,
    );
    return authServerDataSourceImpl(getUsers, getUserPermissionsWithToken);
  })
  .inSingletonScope();
serverContainer
  .bind<InfinityApiDataSource>(SYMBOLS.InfinityApiDataSource)
  .toConstantValue(infinityApiDataSourceImpl);

// Controllers
serverContainer.bind<AuthController>(SYMBOLS.AuthController).to(AuthControllerImpl);

// Repositories
serverContainer
  .bind<AchievementLeaderboardRepository>(SYMBOLS.AchievementLeaderboardRepository)
  .to(AchievementLeaderboardRepositoryImpl);
serverContainer
  .bind<AchievementRepository>(SYMBOLS.AchievementRepository)
  .to(AchievementRepositoryImpl);
serverContainer.bind<AuthRepository>(SYMBOLS.AuthRepository).to(AuthRepositoryImpl);
serverContainer
  .bind<CommunityGroupAdminMemberRepository>(SYMBOLS.CommunityGroupAdminMemberRepository)
  .to(CommunityGroupAdminMemberRepositoryImpl);
serverContainer
  .bind<CommunityGroupAdminRepository>(SYMBOLS.CommunityGroupAdminRepository)
  .to(CommunityGroupAdminRepositoryImpl);
serverContainer
  .bind<CommunityGroupMemberRepository>(SYMBOLS.CommunityGroupMemberRepository)
  .to(CommunityGroupMemberRepositoryImpl);
serverContainer
  .bind<CommunityGroupRepository>(SYMBOLS.CommunityGroupRepository)
  .to(CommunityGroupRepositoryImpl);
serverContainer
  .bind<CompetitionInstanceRepository>(SYMBOLS.CompetitionInstanceRepository)
  .to(CompetitionInstanceRepositoryImpl);
serverContainer
  .bind<CompetitionRepository>(SYMBOLS.CompetitionRepository)
  .to(CompetitionRepositoryImpl);
serverContainer
  .bind<CoreTeamMemberRepository>(SYMBOLS.CoreTeamMemberRepository)
  .to(CoreTeamMemberRepositoryImpl);
serverContainer.bind<CoreTeamRepository>(SYMBOLS.CoreTeamRepository).to(CoreTeamRepositoryImpl);
serverContainer.bind<PersonaRepository>(SYMBOLS.PersonaRepository).to(PersonaRepositoryImpl);
serverContainer
  .bind<ProjectGalleryRepository>(SYMBOLS.ProjectGalleryRepository)
  .to(ProjectGalleryRepositoryImpl);
serverContainer
  .bind<TestimonialRepository>(SYMBOLS.TestimonialRepository)
  .to(TestimonialRepositoryImpl);
serverContainer
  .bind<UserCommunityGroupRepository>(SYMBOLS.UserCommunityGroupRepository)
  .to(UserCommunityGroupRepositoryImpl);
serverContainer
  .bind<UserPermissionRepository>(SYMBOLS.UserPermissionRepository)
  .to(UserPermissionRepositoryImpl);
serverContainer
  .bind<UserPersonaRepository>(SYMBOLS.UserPersonaRepository)
  .to(UserPersonaRepositoryImpl);
serverContainer.bind<UserRepository>(SYMBOLS.UserRepository).to(UserRepositoryImpl);

// Use Cases
serverContainer.bind<GetAchievement>(SYMBOLS.GetAchievement).to(GetAchievement);
serverContainer
  .bind<GetAchievementLeaderboardYears>(SYMBOLS.GetAchievementLeaderboardYears)
  .to(GetAchievementLeaderboardYears);
serverContainer
  .bind<GetAchievementLeaderboards>(SYMBOLS.GetAchievementLeaderboards)
  .to(GetAchievementLeaderboards);
serverContainer.bind<GetAchievements>(SYMBOLS.GetAchievements).to(GetAchievements);
serverContainer
  .bind<GetCommunityGroupAdminMembers>(SYMBOLS.GetCommunityGroupAdminMembers)
  .to(GetCommunityGroupAdminMembers);
serverContainer
  .bind<GetCommunityGroupAdmins>(SYMBOLS.GetCommunityGroupAdmins)
  .to(GetCommunityGroupAdmins);
serverContainer
  .bind<GetCommunityGroupMembers>(SYMBOLS.GetCommunityGroupMembers)
  .to(GetCommunityGroupMembers);
serverContainer.bind<GetCommunityGroups>(SYMBOLS.GetCommunityGroups).to(GetCommunityGroups);
serverContainer
  .bind<GetCompetitionInstances>(SYMBOLS.GetCompetitionInstances)
  .to(GetCompetitionInstances);
serverContainer.bind<GetCompetitions>(SYMBOLS.GetCompetitions).to(GetCompetitions);
serverContainer.bind<GetCoreTeamMembers>(SYMBOLS.GetCoreTeamMembers).to(GetCoreTeamMembers);
serverContainer.bind<GetCoreTeams>(SYMBOLS.GetCoreTeams).to(GetCoreTeams);
serverContainer.bind<GetPersonas>(SYMBOLS.GetPersonas).to(GetPersonas);
serverContainer.bind<GetProjectGalleries>(SYMBOLS.GetProjectGalleries).to(GetProjectGalleries);
serverContainer.bind<GetSession>(SYMBOLS.GetSession).to(GetSession);
serverContainer.bind<GetTestimonials>(SYMBOLS.GetTestimonials).to(GetTestimonials);
serverContainer.bind<GetUser>(SYMBOLS.GetUser).to(GetUser);
serverContainer
  .bind<GetUserCommunityGroups>(SYMBOLS.GetUserCommunityGroups)
  .to(GetUserCommunityGroups);
serverContainer
  .bind<GetUserPermissionsWithToken>(SYMBOLS.GetUserPermissionsWithToken)
  .to(GetUserPermissionsWithToken);
serverContainer.bind<GetUserPersonas>(SYMBOLS.GetUserPersonas).to(GetUserPersonas);
serverContainer.bind<GetUsers>(SYMBOLS.GetUsers).to(GetUsers);
serverContainer.bind<GetUsersWithToken>(SYMBOLS.GetUsersWithToken).to(GetUsersWithToken);
serverContainer.bind<Logout>(SYMBOLS.Logout).to(Logout);

export { serverContainer };
