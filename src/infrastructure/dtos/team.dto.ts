import { DateTime } from 'luxon';
import { Team } from '@app/domain/entities';
import { UserDto, UserMapper } from './user.dto';

export interface TeamDto {
  id: string;
  leader_id: string;
  name: string;
  is_personal: boolean;
  created_at: string;
  updated_at: string;
  leader?: UserDto;
}

export class TeamMapper {
  public static fromDomaintoDto(team: Partial<Team>): Partial<TeamDto> {
    return {
      id: team.id,
      leader_id: team.leaderId,
      name: team.name,
      is_personal: team.isPersonal,
      created_at: team.createdAt?.toISOString(),
      updated_at: team.updatedAt?.toISOString(),
      leader: team.leader ? (UserMapper.fromDomaintoDto(team.leader) as UserDto) : undefined,
    };
  }

  public static fromDtoToDomain(dto: TeamDto): Team {
    return new Team(
      dto.id,
      dto.leader_id,
      dto.name,
      dto.is_personal,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
      dto.leader ? UserMapper.fromDtoToDomain(dto.leader) : undefined,
    );
  }
}
