import { Major } from './major';
import { User, UserFilterOptions, UserIncludeOptions, UserSortOptions } from './user';

export type TeamMemberIncludeOptions = UserIncludeOptions;

export type TeamMemberFilterOptions = UserFilterOptions;

export type TeamMemberSortOptions = UserSortOptions;

export class TeamMember extends User {
  public membership: {
    id: string;
    userId: string;
    teamId: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
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
      teamId: string;
      role: string;
      createdAt: Date;
      updatedAt: Date;
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
