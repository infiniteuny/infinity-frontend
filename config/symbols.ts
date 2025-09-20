export const SYMBOLS = {
  // Controllers
  AuthController: Symbol.for('AuthController'),

  // Repositories
  AuthRepository: Symbol.for('AuthRepository'),
  InternalRepository: Symbol.for('InternalRepository'),
  UserRepository: Symbol.for('UserRepository'),

  // Data sources
  AuthDataSource: Symbol.for('AuthDataSource'),
  InfinityApiDataSource: Symbol.for('InfinityApiDataSource'),
  SessionStorageDataSource: Symbol.for('SessionStorageDataSource'),
};
