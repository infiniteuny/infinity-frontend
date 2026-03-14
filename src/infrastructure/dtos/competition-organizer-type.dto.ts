import { DateTime } from 'luxon';
import { CompetitionOrganizerType } from '@app/domain/entities';

export interface CompetitionOrganizerTypeDto {
  id: string;
  name: string;
  weight: number;
  created_at: string;
  updated_at: string;
}

export class CompetitionOrganizerTypeMapper {
  public static fromDomaintoDto(
    competitionOrganizerType: Partial<CompetitionOrganizerType>,
  ): Partial<CompetitionOrganizerTypeDto> {
    return {
      id: competitionOrganizerType.id,
      name: competitionOrganizerType.name,
      weight: competitionOrganizerType.weight,
      created_at: competitionOrganizerType.createdAt?.toISOString(),
      updated_at: competitionOrganizerType.updatedAt?.toISOString(),
    };
  }

  public static fromDtoToDomain(dto: CompetitionOrganizerTypeDto): CompetitionOrganizerType {
    return new CompetitionOrganizerType(
      dto.id,
      dto.name,
      dto.weight,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
    );
  }
}
