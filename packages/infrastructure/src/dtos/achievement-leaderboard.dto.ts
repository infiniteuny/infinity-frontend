import { AchievementLeaderboard } from '@infiniteuny/infinity-domain';
import { DateTime } from 'luxon';
import { UserDto, UserMapper } from './user.dto';

export interface AchievementLeaderboardDto {
  id: string;
  user_id: string;
  year: number;
  total_points: number;
  created_at: string;
  updated_at: string;
  user?: UserDto;
}

export class AchievementLeaderboardMapper {
  public static fromDomainToDto(
    leaderboard: Partial<AchievementLeaderboard>,
  ): Partial<AchievementLeaderboardDto> {
    return {
      id: leaderboard.id,
      user_id: leaderboard.userId,
      year: leaderboard.year,
      total_points: leaderboard.totalPoints,
      created_at: leaderboard.createdAt?.toISOString(),
      updated_at: leaderboard.updatedAt?.toISOString(),
      user: leaderboard.user
        ? (UserMapper.fromDomainToDto(leaderboard.user) as UserDto)
        : undefined,
    };
  }

  public static fromDtoToDomain(dto: AchievementLeaderboardDto): AchievementLeaderboard {
    return new AchievementLeaderboard(
      dto.id,
      dto.user_id,
      dto.year,
      dto.total_points,
      DateTime.fromISO(dto.created_at).toJSDate(),
      DateTime.fromISO(dto.updated_at).toJSDate(),
      dto.user ? UserMapper.fromDtoToDomain(dto.user) : undefined,
    );
  }
}
