import { DateTime } from 'luxon';
import { FundApplication } from '@app/domain/entities';
import { TeamDto, TeamMapper } from './team.dto';
import { CompetitionDto, CompetitionMapper } from './competition.dto';
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
  letter_of_acceptance: string | Blob;
  proposal: string | Blob;
  status: 'PENDING' | 'REJECTED' | 'ACCEPTED';
  created_at: string;
  updated_at: string;
  team?: TeamDto;
  competition?: CompetitionDto;
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
      competition_scale: fundApplication.competitionScale
        ? (CompetitionScaleMapper.fromDomaintoDto(
            fundApplication.competitionScale,
          ) as CompetitionScaleDto)
        : undefined,
    };
  }

  public static fromDtoToDomain(dto: FundApplicationDto): FundApplication {
    return new FundApplication(
      dto.id,
      dto.team_id,
      dto.competition_id,
      dto.competition_scale_id,
      dto.competition_branch,
      DateTime.fromISO(dto.competition_start_date).toJSDate(),
      DateTime.fromISO(dto.competition_end_date).toJSDate(),
      dto.letter_of_acceptance,
      dto.proposal,
      dto.status,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
      dto.team ? TeamMapper.fromDtoToDomain(dto.team) : undefined,
      dto.competition ? CompetitionMapper.fromDtoToDomain(dto.competition) : undefined,
      dto.competition_scale
        ? CompetitionScaleMapper.fromDtoToDomain(dto.competition_scale)
        : undefined,
    );
  }
}
