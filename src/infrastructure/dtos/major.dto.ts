import { DateTime } from 'luxon';
import { DegreeDto, DegreeMapper } from './degree.dto';
import { FacultyDto, FacultyMapper } from './faculty.dto';
import { Major } from '@app/domain/entities';

export interface MajorDto {
  id: string;
  degree_id: string;
  faculty_id: string;
  code: string;
  name: string;
  created_at: string;
  updated_at: string;
  degree?: DegreeDto;
  faculty?: FacultyDto;
}

export class MajorMapper {
  public static fromDomaintoDto(major: Partial<Major>): Partial<MajorDto> {
    return {
      id: major.id,
      degree_id: major.degreeId,
      faculty_id: major.facultyId,
      code: major.code,
      name: major.name,
      created_at: major.createdAt?.toISOString(),
      updated_at: major.updatedAt?.toISOString(),
      degree: major.degree ? (DegreeMapper.fromDomaintoDto(major.degree) as DegreeDto) : undefined,
      faculty: major.faculty
        ? (FacultyMapper.fromDomaintoDto(major.faculty) as FacultyDto)
        : undefined,
    };
  }

  public static fromDtoToDomain(dto: MajorDto): Major {
    return new Major(
      dto.id,
      dto.degree_id,
      dto.faculty_id,
      dto.code,
      dto.name,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
      dto.degree ? DegreeMapper.fromDtoToDomain(dto.degree) : undefined,
      dto.faculty ? FacultyMapper.fromDtoToDomain(dto.faculty) : undefined,
    );
  }
}
