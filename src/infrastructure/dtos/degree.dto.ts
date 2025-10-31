import { DateTime } from 'effect';
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
      DateTime.unsafeMake(dto.created_at).pipe(DateTime.toDate),
      DateTime.unsafeMake(dto.updated_at).pipe(DateTime.toDate),
    );
  }
}
