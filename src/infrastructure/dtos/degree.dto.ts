import { DateTime } from 'luxon';
import { Degree } from '@app/domain/entities';

export interface DegreeDto {
  id: string;
  code: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export class DegreeMapper {
  public static fromDomaintoDto(major: Partial<Degree>): Partial<DegreeDto> {
    return {
      id: major.id,
      code: major.code,
      name: major.name,
      created_at: major.createdAt?.toISOString(),
      updated_at: major.updatedAt?.toISOString(),
    };
  }

  public static fromDtoToDomain(dto: DegreeDto): Degree {
    return new Degree(
      dto.id,
      dto.code,
      dto.name,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
    );
  }
}
