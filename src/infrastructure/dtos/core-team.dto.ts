import { DateTime } from 'luxon';
import { CoreTeam } from '@app/domain/entities';

export interface CoreTeamDto {
  id: string;
  year: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class CoreTeamMapper {
  public static fromDomaintoDto(coreTeam: Partial<CoreTeam>): Partial<CoreTeamDto> {
    return {
      id: coreTeam.id,
      year: coreTeam.year,
      is_active: coreTeam.isActive,
      created_at: coreTeam.createdAt?.toISOString(),
      updated_at: coreTeam.updatedAt?.toISOString(),
    };
  }

  public static fromDtoToDomain(dto: CoreTeamDto): CoreTeam {
    return new CoreTeam(
      dto.id,
      dto.year,
      dto.is_active,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
    );
  }
}
