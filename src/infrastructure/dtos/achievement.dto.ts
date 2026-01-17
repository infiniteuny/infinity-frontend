import { DateTime } from 'luxon';
import { Achievement } from '@app/domain/entities';
import { TeamDto, TeamMapper } from './team.dto';
import { CompetitionDto, CompetitionMapper } from './competition.dto';
import { CompetitionTeamTypeDto, CompetitionTeamTypeMapper } from './competition-team-type.dto';
import { CompetitionScaleDto, CompetitionScaleMapper } from './competition-scale.dto';
import { CompetitionTimeRangeDto, CompetitionTimeRangeMapper } from './competition-time-range.dto';
import { CompetitionOutputDto, CompetitionOutputMapper } from './competition-output.dto';
import { CompetitionRankDto, CompetitionRankMapper } from './competition-rank.dto';

export interface AchievementDto {
  id: string;
  team_id: string;
  competition_id: string;
  competition_team_type_id: string;
  competition_scale_id: string;
  competition_time_range_id: string;
  competition_output_id: string;
  competition_rank_id: string;
  competition_branch: string;
  competition_start_date: string;
  competition_end_date: string;
  description: string;
  image: string;
  status: 'PENDING' | 'REJECTED' | 'ACCEPTED';
  created_at: string;
  updated_at: string;
  team?: TeamDto;
  competition?: CompetitionDto;
  competition_team_type?: CompetitionTeamTypeDto;
  competition_scale?: CompetitionScaleDto;
  competition_time_range?: CompetitionTimeRangeDto;
  competition_output?: CompetitionOutputDto;
  competition_rank?: CompetitionRankDto;
}

export class AchievementMapper {
  public static fromDomaintoDto(achievement: Partial<Achievement>): Partial<AchievementDto> {
    return {
      id: achievement.id,
      team_id: achievement.teamId,
      competition_id: achievement.competitionId,
      competition_team_type_id: achievement.competitionTeamTypeId,
      competition_scale_id: achievement.competitionScaleId,
      competition_time_range_id: achievement.competitionTimeRangeId,
      competition_output_id: achievement.competitionOutputId,
      competition_rank_id: achievement.competitionRankId,
      competition_branch: achievement.competitionBranch,
      competition_start_date: achievement.competitionStartDate?.toISOString().split('T')[0],
      competition_end_date: achievement.competitionEndDate?.toISOString().split('T')[0],
      description: achievement.description,
      image: achievement.image,
      status: achievement.status,
      created_at: achievement.createdAt?.toISOString(),
      updated_at: achievement.updatedAt?.toISOString(),
      team: achievement.team
        ? (TeamMapper.fromDomaintoDto(achievement.team) as TeamDto)
        : undefined,
      competition: achievement.competition
        ? (CompetitionMapper.fromDomaintoDto(achievement.competition) as CompetitionDto)
        : undefined,
      competition_team_type: achievement.competitionTeamType
        ? (CompetitionTeamTypeMapper.fromDomaintoDto(
            achievement.competitionTeamType,
          ) as CompetitionTeamTypeDto)
        : undefined,
      competition_scale: achievement.competitionScale
        ? (CompetitionScaleMapper.fromDomaintoDto(
            achievement.competitionScale,
          ) as CompetitionScaleDto)
        : undefined,
      competition_time_range: achievement.competitionTimeRange
        ? (CompetitionTimeRangeMapper.fromDomaintoDto(
            achievement.competitionTimeRange,
          ) as CompetitionTimeRangeDto)
        : undefined,
      competition_output: achievement.competitionOutput
        ? (CompetitionOutputMapper.fromDomaintoDto(
            achievement.competitionOutput,
          ) as CompetitionOutputDto)
        : undefined,
      competition_rank: achievement.competitionRank
        ? (CompetitionRankMapper.fromDomaintoDto(achievement.competitionRank) as CompetitionRankDto)
        : undefined,
    };
  }

  public static fromDtoToDomain(achievementDto: AchievementDto): Achievement {
    return new Achievement(
      achievementDto.id,
      achievementDto.team_id,
      achievementDto.competition_id,
      achievementDto.competition_team_type_id,
      achievementDto.competition_scale_id,
      achievementDto.competition_time_range_id,
      achievementDto.competition_output_id,
      achievementDto.competition_rank_id,
      achievementDto.competition_branch,
      DateTime.fromISO(achievementDto.competition_start_date).toJSDate(),
      DateTime.fromISO(achievementDto.competition_end_date).toJSDate(),
      achievementDto.description,
      achievementDto.image,
      achievementDto.status,
      DateTime.fromISO(achievementDto.created_at).toJSDate(),
      DateTime.fromISO(achievementDto.updated_at).toJSDate(),
      achievementDto.team ? TeamMapper.fromDtoToDomain(achievementDto.team) : undefined,
      achievementDto.competition
        ? CompetitionMapper.fromDtoToDomain(achievementDto.competition)
        : undefined,
      achievementDto.competition_team_type
        ? CompetitionTeamTypeMapper.fromDtoToDomain(achievementDto.competition_team_type)
        : undefined,
      achievementDto.competition_scale
        ? CompetitionScaleMapper.fromDtoToDomain(achievementDto.competition_scale)
        : undefined,
      achievementDto.competition_time_range
        ? CompetitionTimeRangeMapper.fromDtoToDomain(achievementDto.competition_time_range)
        : undefined,
      achievementDto.competition_output
        ? CompetitionOutputMapper.fromDtoToDomain(achievementDto.competition_output)
        : undefined,
      achievementDto.competition_rank
        ? CompetitionRankMapper.fromDtoToDomain(achievementDto.competition_rank)
        : undefined,
    );
  }
}
