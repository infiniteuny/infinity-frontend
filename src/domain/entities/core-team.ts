import { FilterOperator } from '.';
import { Group } from './group';

export interface CoreTeamFilterOptions {
  year?: number;
  isActive?: boolean;
  createdAtOperator?: FilterOperator;
  createdAt?: Date;
  updatedAtOperator?: FilterOperator;
  updatedAt?: Date;
}

export interface CoreTeamSortOptions {
  id?: 'ASC' | 'DESC';
  year?: 'ASC' | 'DESC';
  isActive?: 'ASC' | 'DESC';
  createdAt?: 'ASC' | 'DESC';
  updatedAt?: 'ASC' | 'DESC';
}

export class CoreTeam {
  public id: string;
  public year: number;
  public groupId: string;
  public isActive: boolean;
  public createdAt: Date;
  public updatedAt: Date;
  public group?: Group;

  public constructor(
    id: string,
    year: number,
    groupId: string,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
    group?: Group,
  ) {
    this.id = id;
    this.year = year;
    this.groupId = groupId;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.group = group;
  }
}
