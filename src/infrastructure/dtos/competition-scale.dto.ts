import { DateTime } from 'luxon';
import { CompetitionScale } from '@app/domain/entities';

export interface CompetitionScaleDto {
  id: string;
  name: string;
  weight: number;
  created_at: string;
  updated_at: string;
}

export class CompetitionScaleMapper {
  public static fromDomaintoDto(
    competitionScale: Partial<CompetitionScale>,
  ): Partial<CompetitionScaleDto> {
    return {
      id: competitionScale.id,
      name: competitionScale.name,
      weight: competitionScale.weight,
      created_at: competitionScale.createdAt?.toISOString(),
      updated_at: competitionScale.updatedAt?.toISOString(),
    };
  }

  public static fromDtoToDomain(competitionScaleDto: CompetitionScaleDto): CompetitionScale {
    return new CompetitionScale(
      competitionScaleDto.id,
      competitionScaleDto.name,
      competitionScaleDto.weight,
      DateTime.fromISO(competitionScaleDto.created_at).toJSDate(),
      DateTime.fromISO(competitionScaleDto.updated_at).toJSDate(),
    );
  }
}
