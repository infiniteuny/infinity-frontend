import { FilterOperator } from '.';

export interface GroupFilterOptions {
  name?: string;
  guardName?: 'api';
  createdAtOperator?: FilterOperator;
  createdAt?: Date;
  updatedAtOperator?: FilterOperator;
  updatedAt?: Date;
}

export interface GroupSortOptions {
  id?: 'ASC' | 'DESC';
  name?: 'ASC' | 'DESC';
  guardName?: 'ASC' | 'DESC';
  createdAt?: 'ASC' | 'DESC';
  updatedAt?: 'ASC' | 'DESC';
}

export class Group {
  public id: string;
  public name: string;
  public guardName: 'api';
  public createdAt: Date;
  public updatedAt: Date;

  public constructor(id: string, name: string, guardName: 'api', createdAt: Date, updatedAt: Date) {
    this.id = id;
    this.name = name;
    this.guardName = guardName;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
