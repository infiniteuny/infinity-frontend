import { DateTime } from 'luxon';
import { Faculty } from '@app/domain/entities';

export interface FacultyDto {
  id: string;
  code: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export class FacultyMapper {
  public static fromDomainToDto(major: Partial<Faculty>): Partial<FacultyDto> {
    return {
      id: major.id,
      code: major.code,
      name: major.name,
      created_at: major.createdAt?.toISOString(),
      updated_at: major.updatedAt?.toISOString(),
    };
  }

  public static fromDtoToDomain(dto: FacultyDto): Faculty {
    return new Faculty(
      dto.id,
      dto.code,
      dto.name,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
    );
  }
}
