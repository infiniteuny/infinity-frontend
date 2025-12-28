import { FilterOperator } from '.';
import { User } from './user';

export type TokenIncludeOptions = 'user'[];

export interface TokenFilterOptions {
  ssoId?: string;
  userId?: string;
  lastUsedAtOperator?: FilterOperator;
  lastUsedAt?: Date;
  createdAtOperator?: FilterOperator;
  createdAt?: Date;
  expiresAtOperator?: FilterOperator;
  expiresAt?: Date;
}

export interface TokenSortOptions {
  id?: 'ASC' | 'DESC';
  ssoId?: 'ASC' | 'DESC';
  userId?: 'ASC' | 'DESC';
  lastUsedAt?: 'ASC' | 'DESC';
  createdAt?: 'ASC' | 'DESC';
  expiresAt?: 'ASC' | 'DESC';
}

export class Token {
  public id: string;
  public ssoId: string;
  public userId: string;
  public lastUsedAt: Date;
  public createdAt: Date;
  public expiresAt: Date;
  public deletedAt: Date | null;
  public user?: User;

  public constructor(
    id: string,
    ssoId: string,
    userId: string,
    lastUsedAt: Date,
    createdAt: Date,
    expiresAt: Date,
    deletedAt: Date | null,
    user: User | undefined,
  ) {
    this.id = id;
    this.ssoId = ssoId;
    this.userId = userId;
    this.lastUsedAt = lastUsedAt;
    this.createdAt = createdAt;
    this.expiresAt = expiresAt;
    this.deletedAt = deletedAt;
    this.user = user;
  }
}
