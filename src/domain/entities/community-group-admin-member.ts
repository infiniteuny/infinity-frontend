import { CommunityGroup } from './community-group';
import { Major } from './major';
import { User, UserFilterOptions, UserIncludeOptions, UserSortOptions } from './user';

export type CommunityGroupAdminMemberIncludeOptions = (
  | UserIncludeOptions[number]
  | 'membership.community_group'
)[];

export type CommunityGroupAdminMemberFilterOptions = UserFilterOptions;

export type CommunityGroupAdminMemberSortOptions = UserSortOptions;

export class CommunityGroupAdminMember extends User {
  public membership: {
    id: string;
    userId: string;
    communityGroupAdminId: string;
    communityGroupId: string;
    photo: string;
    animation: string;
    createdAt: Date;
    updatedAt: Date;
    communityGroup?: CommunityGroup;
  };

  public constructor(
    id: string,
    name: string,
    username: string,
    emailAddress: string,
    phoneNumber: string,
    studentId: string,
    majorId: string,
    links: Record<string, string>,
    startDate: Date | null,
    endDate: Date | null,
    isMember: boolean,
    isExtraordinary: boolean,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
    membership: {
      id: string;
      userId: string;
      communityGroupAdminId: string;
      communityGroupId: string;
      photo: string;
      animation: string;
      createdAt: Date;
      updatedAt: Date;
      communityGroup?: CommunityGroup;
    },
    major?: Major,
  ) {
    super(
      id,
      name,
      username,
      emailAddress,
      phoneNumber,
      studentId,
      majorId,
      links,
      startDate,
      endDate,
      isMember,
      isExtraordinary,
      isActive,
      createdAt,
      updatedAt,
      major,
    );
    this.membership = membership;
  }
}
