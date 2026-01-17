import { DateTime } from 'luxon';
import { CompetitionTeamType } from '@app/domain/entities';

export interface CompetitionTeamTypeDto {
  id: string;
  name: string;
  weight: number;
  created_at: string;
  updated_at: string;
}

export class CompetitionTeamTypeMapper {
  public static fromDomaintoDto(
    competitionTeamType: Partial<CompetitionTeamType>,
  ): Partial<CompetitionTeamTypeDto> {
    return {
      id: competitionTeamType.id,
      name: competitionTeamType.name,
      weight: competitionTeamType.weight,
      created_at: competitionTeamType.createdAt?.toISOString(),
      updated_at: competitionTeamType.updatedAt?.toISOString(),
    };
  }

  public static fromDtoToDomain(
    competitionTeamTypeDto: CompetitionTeamTypeDto,
  ): CompetitionTeamType {
    return new CompetitionTeamType(
      competitionTeamTypeDto.id,
      competitionTeamTypeDto.name,
      competitionTeamTypeDto.weight,
      DateTime.fromISO(competitionTeamTypeDto.created_at).toJSDate(),
      DateTime.fromISO(competitionTeamTypeDto.updated_at).toJSDate(),
    );
  }
}
