import { CoreTeamDivision } from './core-team-division';
import { Major } from './major';
import { User, UserFilterOptions, UserIncludeOptions, UserSortOptions } from './user';

export type CoreTeamMemberIncludeOptions = (
  | UserIncludeOptions[number]
  | 'membership.core_team_division'
)[];

export type CoreTeamMemberFilterOptions = UserFilterOptions;

export type CoreTeamMemberSortOptions = UserSortOptions;

export class CoreTeamMember extends User {
  public membership: {
    id: string;
    userId: string;
    coreTeamId: string;
    coreTeamDivisionId: string;
    photo: string | File;
    animation?: string | File;
    createdAt: Date;
    updatedAt: Date;
    coreTeamDivision?: CoreTeamDivision;
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
      coreTeamId: string;
      coreTeamDivisionId: string;
      photo: string | File;
      animation?: string | File;
      createdAt: Date;
      updatedAt: Date;
      coreTeamDivision?: CoreTeamDivision;
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
