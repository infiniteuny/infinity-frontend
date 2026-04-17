import 'reflect-metadata';
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
  UserPermissionRepository,
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
  UserPermissionRepositoryImpl,
} from '@app/infrastructure/repositories';
import { Container } from 'inversify';
import {
  AuthServerDataSource,
  authServerDataSourceImpl,
  InfinityApiDataSource,
  infinityApiDataSourceImpl,
} from '@app/infrastructure/datasources/server';
import {
  CreateAchievement,
  CreateCommunityGroupAdmin,
  CreateCoreTeam,
  CreateFundApplication,
  CreateGroup,
  CreatePermission,
  CreateProjectGallery,
  CreateTeam,
  CreateTestimonial,
  GetAchievement,
  GetAchievements,
  GetCommunityGroupAdmin,
  GetCommunityGroupAdmins,
  GetCommunityGroups,
  GetCompetitions,
  GetCompetitionOutputs,
  GetCompetitionRanks,
  GetCompetitionScales,
  GetCompetitionTeamTypes,
  GetCompetitionTimeRanges,
  GetCoreTeam,
  GetCoreTeams,
  GetFaculties,
  GetFundApplication,
  GetFundApplications,
  GetGroup,
  GetGroups,
  GetMajors,
  GetPermission,
  GetPermissions,
  GetProjectGallery,
  GetProjectGalleries,
  GetSession,
  GetTeam,
  GetTeams,
  GetTestimonial,
  GetTestimonials,
  GetUser,
  GetUserPermissionsWithToken,
  GetUsers,
  GetUsersWithToken,
  UpdateAchievement,
  UpdateCommunityGroupAdmin,
  UpdateCoreTeam,
  UpdateFundApplication,
  UpdateGroup,
  UpdatePermission,
  UpdateProjectGallery,
  UpdateTeam,
  UpdateTestimonial,
  Logout,
} from '@app/application';
import { SYMBOLS } from '@config';

export const serverContainer = new Container();

// Use Cases
serverContainer.bind<CreateAchievement>(SYMBOLS.CreateAchievement).to(CreateAchievement);
serverContainer
  .bind<CreateCommunityGroupAdmin>(SYMBOLS.CreateCommunityGroupAdmin)
  .to(CreateCommunityGroupAdmin);
serverContainer.bind<CreateCoreTeam>(SYMBOLS.CreateCoreTeam).to(CreateCoreTeam);
serverContainer
  .bind<CreateFundApplication>(SYMBOLS.CreateFundApplication)
  .to(CreateFundApplication);
serverContainer.bind<CreateGroup>(SYMBOLS.CreateGroup).to(CreateGroup);
serverContainer.bind<CreatePermission>(SYMBOLS.CreatePermission).to(CreatePermission);
serverContainer.bind<CreateProjectGallery>(SYMBOLS.CreateProjectGallery).to(CreateProjectGallery);
serverContainer.bind<CreateTeam>(SYMBOLS.CreateTeam).to(CreateTeam);
serverContainer.bind<CreateTestimonial>(SYMBOLS.CreateTestimonial).to(CreateTestimonial);
serverContainer.bind<GetAchievement>(SYMBOLS.GetAchievement).to(GetAchievement);
serverContainer.bind<GetAchievements>(SYMBOLS.GetAchievements).to(GetAchievements);
serverContainer
  .bind<GetCommunityGroupAdmin>(SYMBOLS.GetCommunityGroupAdmin)
  .to(GetCommunityGroupAdmin);
serverContainer
  .bind<GetCommunityGroupAdmins>(SYMBOLS.GetCommunityGroupAdmins)
  .to(GetCommunityGroupAdmins);
serverContainer.bind<GetCommunityGroups>(SYMBOLS.GetCommunityGroups).to(GetCommunityGroups);
serverContainer.bind<GetCompetitions>(SYMBOLS.GetCompetitions).to(GetCompetitions);
serverContainer
  .bind<GetCompetitionOutputs>(SYMBOLS.GetCompetitionOutputs)
  .to(GetCompetitionOutputs);
serverContainer.bind<GetCompetitionRanks>(SYMBOLS.GetCompetitionRanks).to(GetCompetitionRanks);
serverContainer.bind<GetCompetitionScales>(SYMBOLS.GetCompetitionScales).to(GetCompetitionScales);
serverContainer
  .bind<GetCompetitionTeamTypes>(SYMBOLS.GetCompetitionTeamTypes)
  .to(GetCompetitionTeamTypes);
serverContainer
  .bind<GetCompetitionTimeRanges>(SYMBOLS.GetCompetitionTimeRanges)
  .to(GetCompetitionTimeRanges);
serverContainer.bind<GetCoreTeam>(SYMBOLS.GetCoreTeam).to(GetCoreTeam);
serverContainer.bind<GetCoreTeams>(SYMBOLS.GetCoreTeams).to(GetCoreTeams);
serverContainer.bind<GetFaculties>(SYMBOLS.GetFaculties).to(GetFaculties);
serverContainer.bind<GetFundApplication>(SYMBOLS.GetFundApplication).to(GetFundApplication);
serverContainer.bind<GetFundApplications>(SYMBOLS.GetFundApplications).to(GetFundApplications);
serverContainer.bind<GetGroup>(SYMBOLS.GetGroup).to(GetGroup);
serverContainer.bind<GetGroups>(SYMBOLS.GetGroups).to(GetGroups);
serverContainer.bind<GetMajors>(SYMBOLS.GetMajors).to(GetMajors);
serverContainer.bind<GetPermission>(SYMBOLS.GetPermission).to(GetPermission);
serverContainer.bind<GetPermissions>(SYMBOLS.GetPermissions).to(GetPermissions);
serverContainer.bind<GetProjectGallery>(SYMBOLS.GetProjectGallery).to(GetProjectGallery);
serverContainer.bind<GetProjectGalleries>(SYMBOLS.GetProjectGalleries).to(GetProjectGalleries);
serverContainer.bind<GetSession>(SYMBOLS.GetSession).to(GetSession);
serverContainer.bind<GetTeam>(SYMBOLS.GetTeam).to(GetTeam);
serverContainer.bind<GetTeams>(SYMBOLS.GetTeams).to(GetTeams);
serverContainer.bind<GetTestimonial>(SYMBOLS.GetTestimonial).to(GetTestimonial);
serverContainer.bind<GetTestimonials>(SYMBOLS.GetTestimonials).to(GetTestimonials);
serverContainer.bind<GetUser>(SYMBOLS.GetUser).to(GetUser);
serverContainer
  .bind<GetUserPermissionsWithToken>(SYMBOLS.GetUserPermissionsWithToken)
  .to(GetUserPermissionsWithToken);
serverContainer.bind<GetUsers>(SYMBOLS.GetUsers).to(GetUsers);
serverContainer.bind<GetUsersWithToken>(SYMBOLS.GetUsersWithToken).to(GetUsersWithToken);
serverContainer.bind<Logout>(SYMBOLS.Logout).to(Logout);
serverContainer.bind<UpdateAchievement>(SYMBOLS.UpdateAchievement).to(UpdateAchievement);
serverContainer
  .bind<UpdateCommunityGroupAdmin>(SYMBOLS.UpdateCommunityGroupAdmin)
  .to(UpdateCommunityGroupAdmin);
serverContainer.bind<UpdateCoreTeam>(SYMBOLS.UpdateCoreTeam).to(UpdateCoreTeam);
serverContainer
  .bind<UpdateFundApplication>(SYMBOLS.UpdateFundApplication)
  .to(UpdateFundApplication);
serverContainer.bind<UpdateGroup>(SYMBOLS.UpdateGroup).to(UpdateGroup);
serverContainer.bind<UpdatePermission>(SYMBOLS.UpdatePermission).to(UpdatePermission);
serverContainer.bind<UpdateProjectGallery>(SYMBOLS.UpdateProjectGallery).to(UpdateProjectGallery);
serverContainer.bind<UpdateTeam>(SYMBOLS.UpdateTeam).to(UpdateTeam);
serverContainer.bind<UpdateTestimonial>(SYMBOLS.UpdateTestimonial).to(UpdateTestimonial);

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
serverContainer
  .bind<UserPermissionRepository>(SYMBOLS.UserPermissionRepository)
  .to(UserPermissionRepositoryImpl);

// Data sources
serverContainer.bind<AuthServerDataSource>(SYMBOLS.AuthDataSource).toDynamicValue(() => {
  const getUsers = serverContainer.get<GetUsersWithToken>(SYMBOLS.GetUsersWithToken);
  const getUserPermissionsWithToken = serverContainer.get<GetUserPermissionsWithToken>(
    SYMBOLS.GetUserPermissionsWithToken,
  );
  return authServerDataSourceImpl(getUsers, getUserPermissionsWithToken);
});
serverContainer
  .bind<InfinityApiDataSource>(SYMBOLS.InfinityApiDataSource)
  .toConstantValue(infinityApiDataSourceImpl);
