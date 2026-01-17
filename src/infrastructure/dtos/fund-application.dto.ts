import { DateTime } from 'luxon';
import { FundApplication } from '@app/domain/entities';
import { TeamDto, TeamMapper } from './team.dto';
import { CompetitionDto, CompetitionMapper } from './competition.dto';
import { CompetitionTeamTypeDto, CompetitionTeamTypeMapper } from './competition-team-type.dto';
import { CompetitionScaleDto, CompetitionScaleMapper } from './competition-scale.dto';

export interface FundApplicationDto {
  id: string;
  team_id: string;
  competition_id: string;
  competition_team_type_id: string;
  competition_scale_id: string;
  competition_branch: string;
  competition_start_date: string;
  competition_end_date: string;
  letter_of_acceptance: string;
  proposal: string;
  status: 'PENDING' | 'REJECTED' | 'ACCEPTED';
  created_at: string;
  updated_at: string;
  team?: TeamDto;
  competition?: CompetitionDto;
  competition_team_type?: CompetitionTeamTypeDto;
  competition_scale?: CompetitionScaleDto;
}

export class FundApplicationMapper {
  public static fromDomaintoDto(
    fundApplication: Partial<FundApplication>,
  ): Partial<FundApplicationDto> {
    return {
      id: fundApplication.id,
      team_id: fundApplication.teamId,
      competition_id: fundApplication.competitionId,
      competition_team_type_id: fundApplication.competitionTeamTypeId,
      competition_scale_id: fundApplication.competitionScaleId,
      competition_branch: fundApplication.competitionBranch,
      competition_start_date: fundApplication.competitionStartDate?.toISOString().split('T')[0],
      competition_end_date: fundApplication.competitionEndDate?.toISOString().split('T')[0],
      letter_of_acceptance: fundApplication.letterOfAcceptance,
      proposal: fundApplication.proposal,
      status: fundApplication.status,
      created_at: fundApplication.createdAt?.toISOString(),
      updated_at: fundApplication.updatedAt?.toISOString(),
      team: fundApplication.team
        ? (TeamMapper.fromDomaintoDto(fundApplication.team) as TeamDto)
        : undefined,
      competition: fundApplication.competition
        ? (CompetitionMapper.fromDomaintoDto(fundApplication.competition) as CompetitionDto)
        : undefined,
      competition_team_type: fundApplication.competitionTeamType
        ? (CompetitionTeamTypeMapper.fromDomaintoDto(
            fundApplication.competitionTeamType,
          ) as CompetitionTeamTypeDto)
        : undefined,
      competition_scale: fundApplication.competitionScale
        ? (CompetitionScaleMapper.fromDomaintoDto(
            fundApplication.competitionScale,
          ) as CompetitionScaleDto)
        : undefined,
    };
  }

  public static fromDtoToDomain(fundApplicationDto: FundApplicationDto): FundApplication {
    return new FundApplication(
      fundApplicationDto.id,
      fundApplicationDto.team_id,
      fundApplicationDto.competition_id,
      fundApplicationDto.competition_team_type_id,
      fundApplicationDto.competition_scale_id,
      fundApplicationDto.competition_branch,
      DateTime.fromISO(fundApplicationDto.competition_start_date).toJSDate(),
      DateTime.fromISO(fundApplicationDto.competition_end_date).toJSDate(),
      fundApplicationDto.letter_of_acceptance,
      fundApplicationDto.proposal,
      fundApplicationDto.status,
      DateTime.fromISO(fundApplicationDto.created_at).toJSDate(),
      DateTime.fromISO(fundApplicationDto.updated_at).toJSDate(),
      fundApplicationDto.team ? TeamMapper.fromDtoToDomain(fundApplicationDto.team) : undefined,
      fundApplicationDto.competition
        ? CompetitionMapper.fromDtoToDomain(fundApplicationDto.competition)
        : undefined,
      fundApplicationDto.competition_team_type
        ? CompetitionTeamTypeMapper.fromDtoToDomain(fundApplicationDto.competition_team_type)
        : undefined,
      fundApplicationDto.competition_scale
        ? CompetitionScaleMapper.fromDtoToDomain(fundApplicationDto.competition_scale)
        : undefined,
    );
  }
}
