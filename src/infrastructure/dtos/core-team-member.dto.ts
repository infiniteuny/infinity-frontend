import { DateTime } from 'luxon';
import { CoreTeamMember } from '@app/domain/entities';
import { MajorDto, MajorMapper } from './major.dto';

interface CoreTeamMemberMembershipDto {
  id: string;
  user_id: string;
  core_team_id: string;
  core_team_division_id: string;
  photo: string | File;
  animation?: string | File;
  created_at: string;
  updated_at: string;
}

export interface CoreTeamMemberDto {
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
  membership: CoreTeamMemberMembershipDto;
}

export class CoreTeamMemberMapper {
  public static fromDomainToDto(member: Partial<CoreTeamMember>): Partial<CoreTeamMemberDto> {
    return {
      id: member.id,
      name: member.name,
      username: member.username,
      email_address: member.emailAddress,
      phone_number: member.phoneNumber,
      student_id: member.studentId,
      major_id: member.majorId,
      links: member.links,
      start_date: member.startDate ? member.startDate.toISOString() : null,
      end_date: member.endDate ? member.endDate.toISOString() : null,
      is_member: member.isMember,
      is_extraordinary: member.isExtraordinary,
      is_active: member.isActive,
      created_at: member.createdAt?.toISOString(),
      updated_at: member.updatedAt?.toISOString(),
      major: member.major ? (MajorMapper.fromDomainToDto(member.major) as MajorDto) : undefined,
      membership: member.membership
        ? {
            id: member.membership.id,
            user_id: member.membership.userId,
            core_team_id: member.membership.coreTeamId,
            core_team_division_id: member.membership.coreTeamDivisionId,
            photo: member.membership.photo,
            animation: member.membership.animation,
            created_at: member.membership.createdAt.toISOString(),
            updated_at: member.membership.updatedAt.toISOString(),
          }
        : undefined,
    };
  }

  public static fromDtoToDomain(dto: CoreTeamMemberDto): CoreTeamMember {
    return new CoreTeamMember(
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
      {
        id: dto.membership.id,
        userId: dto.membership.user_id,
        coreTeamId: dto.membership.core_team_id,
        coreTeamDivisionId: dto.membership.core_team_division_id,
        photo: dto.membership.photo,
        animation: dto.membership.animation,
        createdAt: DateTime.fromISO(dto.membership.created_at).toJSDate(),
        updatedAt: DateTime.fromISO(dto.membership.updated_at).toJSDate(),
      },
      dto.major ? MajorMapper.fromDtoToDomain(dto.major) : undefined,
    );
  }
}
