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

  public static fromDtoToDomain(dto: CompetitionScaleDto): CompetitionScale {
    return new CompetitionScale(
      dto.id,
      dto.name,
      dto.weight,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
    );
  }
}
