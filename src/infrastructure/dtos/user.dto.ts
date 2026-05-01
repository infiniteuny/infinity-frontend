import { DateTime } from 'luxon';
import { MajorDto, MajorMapper } from './major.dto';
import { User } from '@app/domain/entities';

export interface UserDto {
  id: string;
  name: string;
  username: string;
  email_address: string;
  phone_number: string;
  student_id: string;
  major_id: string;
  links: Record<string, string>;
  start_date: string | null;
  end_date: string | null;
  is_member: boolean;
  is_extraordinary: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  major?: MajorDto;
}

export class UserMapper {
  public static fromDomainToDto(user: Partial<User>): Partial<UserDto> {
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      email_address: user.emailAddress,
      phone_number: user.phoneNumber,
      student_id: user.studentId,
      major_id: user.majorId,
      links: user.links,
      start_date: user.startDate ? user.startDate.toISOString() : null,
      end_date: user.endDate ? user.endDate.toISOString() : null,
      is_member: user.isMember,
      is_extraordinary: user.isExtraordinary,
      is_active: user.isActive,
      created_at: user.createdAt?.toISOString(),
      updated_at: user.updatedAt?.toISOString(),
      major: user.major ? (MajorMapper.fromDomainToDto(user.major) as MajorDto) : undefined,
    };
  }

  public static fromDtoToDomain(dto: UserDto): User {
    return new User(
      dto.id,
      dto.name,
      dto.username,
      dto.email_address,
      dto.phone_number,
      dto.student_id,
      dto.major_id,
      dto.links,
      dto.start_date ? DateTime.fromISO(dto.start_date).toJSDate() : null,
      dto.end_date ? DateTime.fromISO(dto.end_date).toJSDate() : null,
      dto.is_member,
      dto.is_extraordinary,
      dto.is_active,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
      dto.major ? MajorMapper.fromDtoToDomain(dto.major) : undefined,
    );
  }
}
