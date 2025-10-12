export const SYMBOLS = {
  // Use cases
  GetSidebarExtendedState: Symbol.for('GetSidebarExtendedState'),
  SetSidebarExtendedState: Symbol.for('SetSidebarExtendedState'),
  Login: Symbol.for('Login'),
  GetSession: Symbol.for('GetSession'),
  GetUsers: Symbol.for('GetUsers'),

  // Controllers
  AuthController: Symbol.for('AuthController'),

  // Repositories
  AuthRepository: Symbol.for('AuthRepository'),
  InternalRepository: Symbol.for('InternalRepository'),
  UserRepository: Symbol.for('UserRepository'),

  // Data sources
  AuthDataSource: Symbol.for('AuthDataSource'),
  AccessTokenDataSource: Symbol.for('AccessTokenDataSource'),
  InfinityApiDataSource: Symbol.for('InfinityApiDataSource'),
  SessionStorageDataSource: Symbol.for('SessionStorageDataSource'),
};
