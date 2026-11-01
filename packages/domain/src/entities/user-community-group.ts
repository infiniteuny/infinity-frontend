import {
  CommunityGroup,
  CommunityGroupFilterOptions,
  CommunityGroupSortOptions,
} from './community-group';

export type UserCommunityGroupFilterOptions = CommunityGroupFilterOptions;

export type UserCommunityGroupSortOptions = CommunityGroupSortOptions;

export class UserCommunityGroup extends CommunityGroup {
  public membership: {
    id: string;
    userId: string;
    communityGroupId: string;
    createdAt: Date;
    updatedAt: Date;
  };

  public constructor(
    id: string,
    name: string,
    description: string,
    priority: number,
    logo: string | File,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
    membership: {
      id: string;
      userId: string;
      communityGroupId: string;
      createdAt: Date;
      updatedAt: Date;
    },
  ) {
    super(id, name, description, priority, logo, isActive, createdAt, updatedAt);
    this.membership = membership;
  }
}
