export const SYMBOLS = {
  // Use cases
  GetSidebarExtendedState: Symbol.for('GetSidebarExtendedState'),
  SetSidebarExtendedState: Symbol.for('SetSidebarExtendedState'),
  Login: Symbol.for('Login'),
  CreateUser: Symbol.for('CreateUser'),
  DeleteUser: Symbol.for('DeleteUser'),
  GetSession: Symbol.for('GetSession'),
  GetFaculties: Symbol.for('GetFaculties'),
  GetMajors: Symbol.for('GetMajors'),
  GetUser: Symbol.for('GetUser'),
  GetUsers: Symbol.for('GetUsers'),
  UpdateUser: Symbol.for('UpdateUser'),

  // Controllers
  AuthController: Symbol.for('AuthController'),

  // Repositories
  AchievementRepository: Symbol.for('AchievementRepository'),
  AuthRepository: Symbol.for('AuthRepository'),
  CommunityGroupAdminRepository: Symbol.for('CommunityGroupAdminRepository'),
  CommunityGroupRepository: Symbol.for('CommunityGroupRepository'),
  CompetitionOrganizerTypeRepository: Symbol.for('CompetitionOrganizerTypeRepository'),
  CompetitionOutputRepository: Symbol.for('CompetitionOutputRepository'),
  CompetitionRankRepository: Symbol.for('CompetitionRankRepository'),
  CompetitionScaleRepository: Symbol.for('CompetitionScaleRepository'),
  CompetitionTeamTypeRepository: Symbol.for('CompetitionTeamTypeRepository'),
  CompetitionTimeRangeRepository: Symbol.for('CompetitionTimeRangeRepository'),
  CompetitionRepository: Symbol.for('CompetitionRepository'),
  CoreTeamDivisionRepository: Symbol.for('CoreTeamDivisionRepository'),
  CoreTeamRepository: Symbol.for('CoreTeamRepository'),
  InternalRepository: Symbol.for('InternalRepository'),
  FacultyRepository: Symbol.for('FacultyRepository'),
  FundApplicationRepository: Symbol.for('FundApplicationRepository'),
  GroupRepository: Symbol.for('GroupRepository'),
  MajorRepository: Symbol.for('MajorRepository'),
  PermissionRepository: Symbol.for('PermissionRepository'),
  PersonaRepository: Symbol.for('PersonaRepository'),
  ProjectGalleryRepository: Symbol.for('ProjectGalleryRepository'),
  TeamRepository: Symbol.for('TeamRepository'),
  TestimonialRepository: Symbol.for('TestimonialRepository'),
  UserRepository: Symbol.for('UserRepository'),

  // Data sources
  AuthDataSource: Symbol.for('AuthDataSource'),
  AccessTokenDataSource: Symbol.for('AccessTokenDataSource'),
  InfinityApiDataSource: Symbol.for('InfinityApiDataSource'),
  SessionStorageDataSource: Symbol.for('SessionStorageDataSource'),
};
