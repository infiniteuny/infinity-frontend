import 'reflect-metadata';
import { Container } from 'inversify';
import { SYMBOLS } from '@config';
import {
  AuthClientDataSource,
  authClientDataSourceImpl,
  InfinityApiDataSource,
  infinityApiDataSourceImpl,
} from '@infiniteuny/infinity-infrastructure/datasources/client';
import {
  AchievementLeaderboardRepository,
  AchievementRepository,
  AuthRepository,
  CommunityGroupAdminMemberRepository,
  CommunityGroupAdminRepository,
  CompetitionInstanceRepository,
  CoreTeamMemberRepository,
  CoreTeamRepository,
  UserCommunityGroupRepository,
  UserPersonaRepository,
  UserRepository,
} from '@infiniteuny/infinity-domain';
import {
  AchievementLeaderboardRepositoryImpl,
  AchievementRepositoryImpl,
  AuthRepositoryImpl,
  CommunityGroupAdminMemberRepositoryImpl,
  CommunityGroupAdminRepositoryImpl,
  CompetitionInstanceRepositoryImpl,
  CoreTeamMemberRepositoryImpl,
  CoreTeamRepositoryImpl,
  UserCommunityGroupRepositoryImpl,
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
  GetCompetitionInstances,
  GetCoreTeamMembers,
  GetCoreTeams,
  GetSession,
  GetUser,
  GetUserCommunityGroups,
  GetUserPersonas,
  GetUsers,
  Login,
  Logout,
} from '@infiniteuny/infinity-application';

const clientContainer = new Container();

// Data sources
clientContainer
  .bind<AuthClientDataSource>(SYMBOLS.AuthDataSource)
  .toConstantValue(authClientDataSourceImpl);
clientContainer
  .bind<InfinityApiDataSource>(SYMBOLS.InfinityApiDataSource)
  .toConstantValue(infinityApiDataSourceImpl);

// Repositories
clientContainer
  .bind<AchievementLeaderboardRepository>(SYMBOLS.AchievementLeaderboardRepository)
  .to(AchievementLeaderboardRepositoryImpl);
clientContainer
  .bind<AchievementRepository>(SYMBOLS.AchievementRepository)
  .to(AchievementRepositoryImpl);
clientContainer.bind<AuthRepository>(SYMBOLS.AuthRepository).to(AuthRepositoryImpl);
clientContainer
  .bind<CommunityGroupAdminMemberRepository>(SYMBOLS.CommunityGroupAdminMemberRepository)
  .to(CommunityGroupAdminMemberRepositoryImpl);
clientContainer
  .bind<CommunityGroupAdminRepository>(SYMBOLS.CommunityGroupAdminRepository)
  .to(CommunityGroupAdminRepositoryImpl);
clientContainer
  .bind<CompetitionInstanceRepository>(SYMBOLS.CompetitionInstanceRepository)
  .to(CompetitionInstanceRepositoryImpl);
clientContainer
  .bind<CoreTeamMemberRepository>(SYMBOLS.CoreTeamMemberRepository)
  .to(CoreTeamMemberRepositoryImpl);
clientContainer.bind<CoreTeamRepository>(SYMBOLS.CoreTeamRepository).to(CoreTeamRepositoryImpl);
clientContainer
  .bind<UserCommunityGroupRepository>(SYMBOLS.UserCommunityGroupRepository)
  .to(UserCommunityGroupRepositoryImpl);
clientContainer
  .bind<UserPersonaRepository>(SYMBOLS.UserPersonaRepository)
  .to(UserPersonaRepositoryImpl);
clientContainer.bind<UserRepository>(SYMBOLS.UserRepository).to(UserRepositoryImpl);

// Use Cases
clientContainer.bind<GetAchievement>(SYMBOLS.GetAchievement).to(GetAchievement);
clientContainer
  .bind<GetAchievementLeaderboardYears>(SYMBOLS.GetAchievementLeaderboardYears)
  .to(GetAchievementLeaderboardYears);
clientContainer
  .bind<GetAchievementLeaderboards>(SYMBOLS.GetAchievementLeaderboards)
  .to(GetAchievementLeaderboards);
clientContainer.bind<GetAchievements>(SYMBOLS.GetAchievements).to(GetAchievements);
clientContainer
  .bind<GetCommunityGroupAdminMembers>(SYMBOLS.GetCommunityGroupAdminMembers)
  .to(GetCommunityGroupAdminMembers);
clientContainer
  .bind<GetCommunityGroupAdmins>(SYMBOLS.GetCommunityGroupAdmins)
  .to(GetCommunityGroupAdmins);
clientContainer
  .bind<GetCompetitionInstances>(SYMBOLS.GetCompetitionInstances)
  .to(GetCompetitionInstances);
clientContainer.bind<GetCoreTeamMembers>(SYMBOLS.GetCoreTeamMembers).to(GetCoreTeamMembers);
clientContainer.bind<GetCoreTeams>(SYMBOLS.GetCoreTeams).to(GetCoreTeams);
clientContainer.bind<GetSession>(SYMBOLS.GetSession).to(GetSession);
clientContainer.bind<GetUser>(SYMBOLS.GetUser).to(GetUser);
clientContainer
  .bind<GetUserCommunityGroups>(SYMBOLS.GetUserCommunityGroups)
  .to(GetUserCommunityGroups);
clientContainer.bind<GetUserPersonas>(SYMBOLS.GetUserPersonas).to(GetUserPersonas);
clientContainer.bind<GetUsers>(SYMBOLS.GetUsers).to(GetUsers);
clientContainer.bind<Login>(SYMBOLS.Login).to(Login);
clientContainer.bind<Logout>(SYMBOLS.Logout).to(Logout);

export { clientContainer };
