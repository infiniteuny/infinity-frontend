import { DateTime } from 'luxon';
import { CompetitionTimeRange } from '@app/domain/entities';

export interface CompetitionTimeRangeDto {
  id: string;
  name: string;
  weight: number;
  created_at: string;
  updated_at: string;
}

export class CompetitionTimeRangeMapper {
  public static fromDomaintoDto(
    competitionTimeRange: Partial<CompetitionTimeRange>,
  ): Partial<CompetitionTimeRangeDto> {
    return {
      id: competitionTimeRange.id,
      name: competitionTimeRange.name,
      weight: competitionTimeRange.weight,
      created_at: competitionTimeRange.createdAt?.toISOString(),
      updated_at: competitionTimeRange.updatedAt?.toISOString(),
    };
  }

  public static fromDtoToDomain(
    competitionTimeRangeDto: CompetitionTimeRangeDto,
  ): CompetitionTimeRange {
    return new CompetitionTimeRange(
      competitionTimeRangeDto.id,
      competitionTimeRangeDto.name,
      competitionTimeRangeDto.weight,
      DateTime.fromISO(competitionTimeRangeDto.created_at).toJSDate(),
      DateTime.fromISO(competitionTimeRangeDto.updated_at).toJSDate(),
    );
  }
}
