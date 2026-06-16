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
    isManaged: boolean,
    createdAt: Date,
    updatedAt: Date,
    entitlement: {
      id: string;
      userId: string;
      groupId: string;
    },
  ) {
    super(id, name, guardName, isManaged, createdAt, updatedAt);
    this.entitlement = entitlement;
  }
}
