import { User } from '@app/domain/entities';
import { DateTime } from 'effect';

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
}

export class UserMapper {
  public static fromDomaintoDto(user: Partial<User>): Partial<UserDto> {
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
      dto.start_date ? DateTime.unsafeMake(dto.start_date).pipe(DateTime.toDate) : null,
      dto.end_date ? DateTime.unsafeMake(dto.end_date).pipe(DateTime.toDate) : null,
      dto.is_member,
      dto.is_extraordinary,
      dto.is_active,
      DateTime.unsafeMake(dto.created_at).pipe(DateTime.toDate),
      DateTime.unsafeMake(dto.updated_at).pipe(DateTime.toDate),
    );
  }
}
