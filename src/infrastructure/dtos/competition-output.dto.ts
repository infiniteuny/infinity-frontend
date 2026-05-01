import { DateTime } from 'luxon';
import { CompetitionOutput } from '@app/domain/entities';

export interface CompetitionOutputDto {
  id: string;
  name: string;
  weight: number;
  created_at: string;
  updated_at: string;
}

export class CompetitionOutputMapper {
  public static fromDomainToDto(
    competitionOutput: Partial<CompetitionOutput>,
  ): Partial<CompetitionOutputDto> {
    return {
      id: competitionOutput.id,
      name: competitionOutput.name,
      weight: competitionOutput.weight,
      created_at: competitionOutput.createdAt?.toISOString(),
      updated_at: competitionOutput.updatedAt?.toISOString(),
    };
  }

  public static fromDtoToDomain(dto: CompetitionOutputDto): CompetitionOutput {
    return new CompetitionOutput(
      dto.id,
      dto.name,
      dto.weight,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
    );
  }
}
