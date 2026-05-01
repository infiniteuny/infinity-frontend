import { DateTime } from 'luxon';
import { Competition } from '@app/domain/entities';

export interface CompetitionDto {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export class CompetitionMapper {
  public static fromDomainToDto(competition: Partial<Competition>): Partial<CompetitionDto> {
    return {
      id: competition.id,
      name: competition.name,
      description: competition.description,
      created_at: competition.createdAt?.toISOString(),
      updated_at: competition.updatedAt?.toISOString(),
    };
  }

  public static fromDtoToDomain(dto: CompetitionDto): Competition {
    return new Competition(
      dto.id,
      dto.name,
      dto.description,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
    );
  }
}
