import { Group, GroupFilterOptions, GroupSortOptions } from './group';

export type UserGroupFilterOptions = GroupFilterOptions;

export type UserGroupSortOptions = GroupSortOptions;

export class UserGroup extends Group {
  public membership: {
    id: string;
    userId: string;
    groupId: string;
    createdAt: Date;
    updatedAt: Date;
  };

  public constructor(
    id: string,
    name: string,
    guardName: 'api',
    createdAt: Date,
    updatedAt: Date,
    membership: {
      id: string;
      userId: string;
      groupId: string;
      createdAt: Date;
      updatedAt: Date;
    },
  ) {
    super(id, name, guardName, createdAt, updatedAt);
    this.membership = membership;
  }
}
