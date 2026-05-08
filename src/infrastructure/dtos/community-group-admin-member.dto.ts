import { CommunityGroupAdminMember } from '@app/domain/entities';
import { CommunityGroupDto, CommunityGroupMapper } from './community-group.dto';
import { DateTime } from 'luxon';
import { MajorDto, MajorMapper } from './major.dto';

interface CommunityGroupAdminMemberMembershipDto {
  id: string;
  user_id: string;
  community_group_admin_id: string;
  community_group_id: string;
  photo: string | File;
  animation?: string | File;
  created_at: string;
  updated_at: string;
  community_group?: CommunityGroupDto;
}

export interface CommunityGroupAdminMemberDto {
  id: string;
  name: string;
  username: string;
  email_address: string;
  phone_number: string;
  student_id: string;
  major_id: string;
  links: Record<string, string | undefined>;
  start_date: string | null;
  end_date: string | null;
  is_member: boolean;
  is_extraordinary: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  major?: MajorDto;
  membership: CommunityGroupAdminMemberMembershipDto;
}

export class CommunityGroupAdminMemberMapper {
  public static fromDomainToDto(
    member: Partial<CommunityGroupAdminMember>,
  ): Partial<CommunityGroupAdminMemberDto> {
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
            community_group_admin_id: member.membership.communityGroupAdminId,
            community_group_id: member.membership.communityGroupId,
            photo: member.membership.photo,
            animation: member.membership.animation,
            created_at: member.membership.createdAt.toISOString(),
            updated_at: member.membership.updatedAt.toISOString(),
            community_group: member.membership.communityGroup
              ? (CommunityGroupMapper.fromDomainToDto(
                  member.membership.communityGroup,
                ) as CommunityGroupDto)
              : undefined,
          }
        : undefined,
    };
  }

  public static fromDtoToDomain(dto: CommunityGroupAdminMemberDto): CommunityGroupAdminMember {
    return new CommunityGroupAdminMember(
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
        communityGroupAdminId: dto.membership.community_group_admin_id,
        communityGroupId: dto.membership.community_group_id,
        photo: dto.membership.photo,
        animation: dto.membership.animation,
        createdAt: DateTime.fromISO(dto.membership.created_at).toJSDate(),
        updatedAt: DateTime.fromISO(dto.membership.updated_at).toJSDate(),
        communityGroup: dto.membership.community_group
          ? CommunityGroupMapper.fromDtoToDomain(dto.membership.community_group)
          : undefined,
      },
      dto.major ? MajorMapper.fromDtoToDomain(dto.major) : undefined,
    );
  }
}
