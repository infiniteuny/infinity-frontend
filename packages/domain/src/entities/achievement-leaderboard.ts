import { FilterOperator } from '.';
import { User } from './user';

export type AchievementLeaderboardIncludeOptions = 'user'[];

export interface AchievementLeaderboardFilterOptions {
  userId?: string;
  totalPointsOperator?: FilterOperator;
  totalPoints?: number;
  createdAtOperator?: FilterOperator;
  createdAt?: Date;
  updatedAtOperator?: FilterOperator;
  updatedAt?: Date;
}

export interface AchievementLeaderboardSortOptions {
  id?: 'ASC' | 'DESC';
  userId?: 'ASC' | 'DESC';
  totalPoints?: 'ASC' | 'DESC';
  createdAt?: 'ASC' | 'DESC';
  updatedAt?: 'ASC' | 'DESC';
}

export class AchievementLeaderboard {
  public id: string;
  public userId: string;
  public year: number;
  public totalPoints: number;
  public createdAt: Date;
  public updatedAt: Date;
  public user?: User;

  public constructor(
    id: string,
    userId: string,
    year: number,
    totalPoints: number,
    createdAt: Date,
    updatedAt: Date,
    user?: User,
  ) {
    this.id = id;
    this.userId = userId;
    this.year = year;
    this.totalPoints = totalPoints;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.user = user;
  }
}
