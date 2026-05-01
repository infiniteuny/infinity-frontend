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
  public static fromDomainToDto(
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

  public static fromDtoToDomain(dto: CompetitionTimeRangeDto): CompetitionTimeRange {
    return new CompetitionTimeRange(
      dto.id,
      dto.name,
      dto.weight,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
    );
  }
}
