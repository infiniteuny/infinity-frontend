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

  public static fromDtoToDomain(competitionRankDto: CompetitionRankDto): CompetitionRank {
    return new CompetitionRank(
      competitionRankDto.id,
      competitionRankDto.name,
      competitionRankDto.weight,
      DateTime.fromISO(competitionRankDto.created_at).toJSDate(),
      DateTime.fromISO(competitionRankDto.updated_at).toJSDate(),
    );
  }
}
