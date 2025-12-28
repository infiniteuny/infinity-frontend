import { FilterOperator } from '.';
import { Competition } from './competition';
import { CompetitionScale } from './competition-scale';
import { CompetitionTeamType } from './competition-team-type';
import { Team } from './team';

export interface FundApplicationFilterOptions {
  teamId?: string;
  competitionId?: string;
  competitionTeamTypeId?: string;
  competitionScaleId?: string;
  competitionBranch?: string;
  competitionStartDateOperator?: FilterOperator;
  competitionStartDate?: Date;
  competitionEndDateOperator?: FilterOperator;
  competitionEndDate?: Date;
  status?: 'PENDING' | 'REJECTED' | 'ACCEPTED';
  createdAtOperator?: FilterOperator;
  createdAt?: Date;
  updatedAtOperator?: FilterOperator;
  updatedAt?: Date;
}

export interface FundApplicationSortOptions {
  id?: 'ASC' | 'DESC';
  teamId?: 'ASC' | 'DESC';
  competitionId?: 'ASC' | 'DESC';
  competitionTeamTypeId?: 'ASC' | 'DESC';
  competitionScaleId?: 'ASC' | 'DESC';
  competitionBranch?: 'ASC' | 'DESC';
  competitionStartDate?: 'ASC' | 'DESC';
  competitionEndDate?: 'ASC' | 'DESC';
  status?: 'ASC' | 'DESC';
  createdAt?: 'ASC' | 'DESC';
  updatedAt?: 'ASC' | 'DESC';
}

export class FundApplication {
  public id: string;
  public teamId: string;
  public competitionId: string;
  public competitionTeamTypeId: string;
  public competitionScaleId: string;
  public competitionBranch: string;
  public competitionStartDate: Date;
  public competitionEndDate: Date;
  public letterOfAcceptance: string;
  public proposal: string;
  public status: 'PENDING' | 'REJECTED' | 'ACCEPTED';
  public createdAt: Date;
  public updatedAt: Date;
  public team?: Team;
  public competition?: Competition;
  public competitionTeamType?: CompetitionTeamType;
  public competitionScale?: CompetitionScale;

  public constructor(
    id: string,
    teamId: string,
    competitionId: string,
    competitionTeamTypeId: string,
    competitionScaleId: string,
    competitionBranch: string,
    competitionStartDate: Date,
    competitionEndDate: Date,
    letterOfAcceptance: string,
    proposal: string,
    status: 'PENDING' | 'REJECTED' | 'ACCEPTED',
    createdAt: Date,
    updatedAt: Date,
    team: Team | undefined,
    competition: Competition | undefined,
    competitionTeamType: CompetitionTeamType | undefined,
    competitionScale: CompetitionScale | undefined,
  ) {
    this.id = id;
    this.teamId = teamId;
    this.competitionId = competitionId;
    this.competitionTeamTypeId = competitionTeamTypeId;
    this.competitionScaleId = competitionScaleId;
    this.competitionBranch = competitionBranch;
    this.competitionStartDate = competitionStartDate;
    this.competitionEndDate = competitionEndDate;
    this.letterOfAcceptance = letterOfAcceptance;
    this.proposal = proposal;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.team = team;
    this.competition = competition;
    this.competitionTeamType = competitionTeamType;
    this.competitionScale = competitionScale;
  }
}
