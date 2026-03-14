import { FilterOperator } from '.';
import { User } from './user';

export type TeamIncludeOptions = ('leader' | 'members' | 'fund_applications' | 'achievements')[];

export interface TeamFilterOptions {
  leaderId?: string;
  name?: string;
  isPersonal?: boolean;
  createdAtOperator?: FilterOperator;
  createdAt?: Date;
  updatedAtOperator?: FilterOperator;
  updatedAt?: Date;
}

export interface TeamSortOptions {
  id?: 'ASC' | 'DESC';
  leaderId?: 'ASC' | 'DESC';
  name?: 'ASC' | 'DESC';
  isPersonal?: 'ASC' | 'DESC';
  createdAt?: 'ASC' | 'DESC';
  updatedAt?: 'ASC' | 'DESC';
}

export class Team {
  public id: string;
  public leaderId: string;
  public name: string;
  public isPersonal: boolean;
  public createdAt: Date;
  public updatedAt: Date;
  public leader?: User;

  public constructor(
    id: string,
    leaderId: string,
    name: string,
    isPersonal: boolean,
    createdAt: Date,
    updatedAt: Date,
    leader: User,
  ) {
    this.id = id;
    this.leaderId = leaderId;
    this.name = name;
    this.isPersonal = isPersonal;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.leader = leader;
  }
}
