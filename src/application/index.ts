export * from './create-user';
export * from './delete-user';
export * from './get-achievements';
export * from './get-community-group-admins';
export * from './get-community-groups';
export * from './get-faculties';
export * from './get-fund-applications';
export * from './get-groups';
export * from './get-majors';
export * from './get-permissions';
export * from './get-project-galleries';
export * from './get-session';
export * from './get-sidebar-extended-state';
export * from './get-core-teams';
export * from './get-teams';
export * from './get-testimonials';
export * from './get-user';
export * from './get-users';
export * from './update-user';
export * from './set-sidebar-extended-state';
export * from './login';

export abstract class UseCase<S, T extends unknown[] = []> {
  public abstract execute(...[param]: T): S;
}
