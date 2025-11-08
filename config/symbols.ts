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
  AuthRepository: Symbol.for('AuthRepository'),
  InternalRepository: Symbol.for('InternalRepository'),
  FacultyRepository: Symbol.for('FacultyRepository'),
  MajorRepository: Symbol.for('MajorRepository'),
  UserRepository: Symbol.for('UserRepository'),

  // Data sources
  AuthDataSource: Symbol.for('AuthDataSource'),
  AccessTokenDataSource: Symbol.for('AccessTokenDataSource'),
  InfinityApiDataSource: Symbol.for('InfinityApiDataSource'),
  SessionStorageDataSource: Symbol.for('SessionStorageDataSource'),
};
