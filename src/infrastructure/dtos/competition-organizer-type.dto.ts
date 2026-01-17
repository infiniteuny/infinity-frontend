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

  public static fromDtoToDomain(
    competitionOrganizerTypeDto: CompetitionOrganizerTypeDto,
  ): CompetitionOrganizerType {
    return new CompetitionOrganizerType(
      competitionOrganizerTypeDto.id,
      competitionOrganizerTypeDto.name,
      competitionOrganizerTypeDto.weight,
      DateTime.fromISO(competitionOrganizerTypeDto.created_at).toJSDate(),
      DateTime.fromISO(competitionOrganizerTypeDto.updated_at).toJSDate(),
    );
  }
}
