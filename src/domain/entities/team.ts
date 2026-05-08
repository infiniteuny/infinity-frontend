import { CompetitionTeamType } from './competition-team-type';
import { FilterOperator } from '.';
import { TeamMember } from './team-member';
import { User } from './user';

export type TeamIncludeOptions = (
  | 'leader'
  | 'members'
  | 'team_type'
  | 'fund_applications'
  | 'achievements'
)[];

export interface TeamFilterOptions {
  leaderId?: string;
  teamTypeId?: string;
  name?: string;
  isPersonal?: boolean;
  createdAtOperator?: FilterOperator;
  createdAt?: Date;
  updatedAtOperator?: FilterOperator;
  updatedAt?: Date;
}

export interface TeamSortOptions {
  id?: 'ASC' | 'DESC';
  leaderId?: 'ASC' | 'DESC';
  teamTypeId?: 'ASC' | 'DESC';
  name?: 'ASC' | 'DESC';
  isPersonal?: 'ASC' | 'DESC';
  createdAt?: 'ASC' | 'DESC';
  updatedAt?: 'ASC' | 'DESC';
}

export class Team {
  public id: string;
  public leaderId: string;
  public teamTypeId: string;
  public name: string;
  public isPersonal: boolean;
  public createdAt: Date;
  public updatedAt: Date;
  public leader?: User;
  public members?: TeamMember[];
  public teamType?: CompetitionTeamType;

  public constructor(
    id: string,
    leaderId: string,
    teamTypeId: string,
    name: string,
    isPersonal: boolean,
    createdAt: Date,
    updatedAt: Date,
    leader?: User,
    members?: TeamMember[],
    teamType?: CompetitionTeamType,
  ) {
    this.id = id;
    this.leaderId = leaderId;
    this.teamTypeId = teamTypeId;
    this.name = name;
    this.isPersonal = isPersonal;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.leader = leader;
    this.members = members;
    this.teamType = teamType;
  }
}
