export const SYMBOLS = {
  // Controllers
  AuthController: Symbol.for('AuthController'),

  // Repositories
  InternalRepository: Symbol.for('InternalRepository'),
  UserRepository: Symbol.for('UserRepository'),

  // Data sources
  InfinityApiDataSource: Symbol.for('InfinityApiDataSource'),
  SessionStorageDataSource: Symbol.for('SessionStorageDataSource'),
};
