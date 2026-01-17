import { DateTime } from 'luxon';
import { CoreTeamDivision } from '@app/domain/entities';

export interface CoreTeamDivisionDto {
  id: string;
  name: string;
  priority: number;
  created_at: string;
  updated_at: string;
}

export class CoreTeamDivisionMapper {
  public static fromDomaintoDto(
    coreTeamDivision: Partial<CoreTeamDivision>,
  ): Partial<CoreTeamDivisionDto> {
    return {
      id: coreTeamDivision.id,
      name: coreTeamDivision.name,
      priority: coreTeamDivision.priority,
      created_at: coreTeamDivision.createdAt?.toISOString(),
      updated_at: coreTeamDivision.updatedAt?.toISOString(),
    };
  }

  public static fromDtoToDomain(dto: CoreTeamDivisionDto): CoreTeamDivision {
    return new CoreTeamDivision(
      dto.id,
      dto.name,
      dto.priority,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
    );
  }
}
