export * from './create-user';
export * from './delete-user';
export * from './get-faculties';
export * from './get-majors';
export * from './get-session';
export * from './get-sidebar-extended-state';
export * from './get-user';
export * from './get-users';
export * from './update-user';
export * from './set-sidebar-extended-state';
export * from './login';

export abstract class UseCase<S, T extends unknown[] = []> {
  public abstract execute(...[param]: T): S;
}
