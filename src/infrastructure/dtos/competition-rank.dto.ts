import { DateTime } from 'luxon';
import { CompetitionRank } from '@app/domain/entities';

export interface CompetitionRankDto {
  id: string;
  name: string;
  weight: number;
  created_at: string;
  updated_at: string;
}

export class CompetitionRankMapper {
  public static fromDomaintoDto(
    competitionRank: Partial<CompetitionRank>,
  ): Partial<CompetitionRankDto> {
    return {
      id: competitionRank.id,
      name: competitionRank.name,
      weight: competitionRank.weight,
      created_at: competitionRank.createdAt?.toISOString(),
      updated_at: competitionRank.updatedAt?.toISOString(),
    };
  }

  public static fromDtoToDomain(dto: CompetitionRankDto): CompetitionRank {
    return new CompetitionRank(
      dto.id,
      dto.name,
      dto.weight,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
    );
  }
}
