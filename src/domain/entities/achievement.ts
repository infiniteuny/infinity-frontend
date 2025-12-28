// $table->uuid('id')->primary();
// $table->foreignUuid('team_id')->constrained()->restrictOnUpdate()->restrictOnDelete();
// $table->foreignUuid('competition_id')->constrained()->restrictOnUpdate()->restrictOnDelete();
// $table->foreignUuid('competition_team_type_id')->constrained()->restrictOnUpdate()->restrictOnDelete();
// $table->foreignUuid('competition_scale_id')->constrained()->restrictOnUpdate()->restrictOnDelete();
// $table->foreignUuid('competition_time_range_id')->constrained()->restrictOnUpdate()->restrictOnDelete();
// $table->foreignUuid('competition_output_id')->constrained()->restrictOnUpdate()->restrictOnDelete();
// $table->foreignUuid('competition_rank_id')->constrained()->restrictOnUpdate()->restrictOnDelete();
// $table->string('competition_branch');
// $table->date('competition_start_date');
// $table->date('competition_end_date');
// $table->text('description');
// $table->string('image');
// $table->enum('status', ['PENDING', 'REJECTED', 'ACCEPTED'])->default('PENDING');
// $table->timestamps();

import { FilterOperator } from '.';
import { Competition } from './competition';
import { CompetitionOutput } from './competition-output';
import { CompetitionRank } from './competition-rank';
import { CompetitionScale } from './competition-scale';
import { CompetitionTeamType } from './competition-team-type';
import { CompetitionTimeRange } from './competition-time-range';
import { Team } from './team';

export interface AchievementFilterOptions {
  teamId?: string;
  competitionId?: string;
  competitionTeamTypeId?: string;
  competitionScaleId?: string;
  competitionTimeRangeId?: string;
  competitionOutputId?: string;
  competitionRankId?: string;
  competitionBranch?: string;
  competitionStartDateOperator?: FilterOperator;
  competitionStartDate?: Date;
  competitionEndDateOperator?: FilterOperator;
  competitionEndDate?: Date;
  description?: string;
  status?: 'PENDING' | 'REJECTED' | 'ACCEPTED';
  createdAtOperator?: FilterOperator;
  createdAt?: Date;
  updatedAtOperator?: FilterOperator;
  updatedAt?: Date;
}

export interface AchievementSortOptions {
  id?: 'ASC' | 'DESC';
  teamId?: 'ASC' | 'DESC';
  competitionId?: 'ASC' | 'DESC';
  competitionTeamTypeId?: 'ASC' | 'DESC';
  competitionScaleId?: 'ASC' | 'DESC';
  competitionTimeRangeId?: 'ASC' | 'DESC';
  competitionOutputId?: 'ASC' | 'DESC';
  competitionRankId?: 'ASC' | 'DESC';
  competitionBranch?: 'ASC' | 'DESC';
  competitionStartDate?: 'ASC' | 'DESC';
  competitionEndDate?: 'ASC' | 'DESC';
  description?: 'ASC' | 'DESC';
  status?: 'ASC' | 'DESC';
  createdAt?: 'ASC' | 'DESC';
  updatedAt?: 'ASC' | 'DESC';
}

export class Achievement {
  public id: string;
  public teamId: string;
  public competitionId: string;
  public competitionTeamTypeId: string;
  public competitionScaleId: string;
  public competitionTimeRangeId: string;
  public competitionOutputId: string;
  public competitionRankId: string;
  public competitionBranch: string;
  public competitionStartDate: Date;
  public competitionEndDate: Date;
  public description: string;
  public image: string;
  public status: 'PENDING' | 'REJECTED' | 'ACCEPTED';
  public createdAt: Date;
  public updatedAt: Date;
  public team?: Team;
  public competition?: Competition;
  public competitionTeamType?: CompetitionTeamType;
  public competitionScale?: CompetitionScale;
  public competitionTimeRange?: CompetitionTimeRange;
  public competitionOutput?: CompetitionOutput;
  public competitionRank?: CompetitionRank;

  public constructor(
    id: string,
    teamId: string,
    competitionId: string,
    competitionTeamTypeId: string,
    competitionScaleId: string,
    competitionTimeRangeId: string,
    competitionOutputId: string,
    competitionRankId: string,
    competitionBranch: string,
    competitionStartDate: Date,
    competitionEndDate: Date,
    description: string,
    image: string,
    status: 'PENDING' | 'REJECTED' | 'ACCEPTED',
    createdAt: Date,
    updatedAt: Date,
    team: Team | undefined,
    competition: Competition | undefined,
    competitionTeamType: CompetitionTeamType | undefined,
    competitionScale: CompetitionScale | undefined,
    competitionTimeRange: CompetitionTimeRange | undefined,
    competitionOutput: CompetitionOutput | undefined,
    competitionRank: CompetitionRank | undefined,
  ) {
    this.id = id;
    this.teamId = teamId;
    this.competitionId = competitionId;
    this.competitionTeamTypeId = competitionTeamTypeId;
    this.competitionScaleId = competitionScaleId;
    this.competitionTimeRangeId = competitionTimeRangeId;
    this.competitionOutputId = competitionOutputId;
    this.competitionRankId = competitionRankId;
    this.competitionBranch = competitionBranch;
    this.competitionStartDate = competitionStartDate;
    this.competitionEndDate = competitionEndDate;
    this.description = description;
    this.image = image;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.team = team;
    this.competition = competition;
    this.competitionTeamType = competitionTeamType;
    this.competitionScale = competitionScale;
    this.competitionTimeRange = competitionTimeRange;
    this.competitionOutput = competitionOutput;
    this.competitionRank = competitionRank;
  }
}
