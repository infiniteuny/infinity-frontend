export * from './get-session';
export * from './get-sidebar-extended-state';
export * from './get-users';
export * from './set-sidebar-extended-state';
export * from './login';

export abstract class UseCase<S, T extends unknown[] = []> {
  public abstract execute(...[param]: T): S;
}
