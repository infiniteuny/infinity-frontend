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
  public static fromDomainToDto(
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

  public static fromDtoToDomain(dto: CompetitionTeamTypeDto): CompetitionTeamType {
    return new CompetitionTeamType(
      dto.id,
      dto.name,
      dto.weight,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
    );
  }
}
