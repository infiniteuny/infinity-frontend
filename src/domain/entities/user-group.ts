import { Group, GroupFilterOptions, GroupSortOptions } from './group';

export type UserGroupFilterOptions = GroupFilterOptions;

export type UserGroupSortOptions = GroupSortOptions;

export class UserGroup extends Group {
  public entitlement: {
    id: string;
    userId: string;
    groupId: string;
  };

  public constructor(
    id: string,
    name: string,
    guardName: 'api',
    createdAt: Date,
    updatedAt: Date,
    entitlement: {
      id: string;
      userId: string;
      groupId: string;
    },
  ) {
    super(id, name, guardName, createdAt, updatedAt);
    this.entitlement = entitlement;
  }
}
