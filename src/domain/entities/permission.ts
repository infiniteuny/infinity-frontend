import { FilterOperator } from '.';

export interface PermissionFilterOptions {
  name?: string;
  guardName?: string;
  createdAtOperator?: FilterOperator;
  createdAt?: Date;
  updatedAtOperator?: FilterOperator;
  updatedAt?: Date;
}

export interface PermissionSortOptions {
  id?: 'ASC' | 'DESC';
  name?: 'ASC' | 'DESC';
  guardName?: 'ASC' | 'DESC';
  createdAt?: 'ASC' | 'DESC';
  updatedAt?: 'ASC' | 'DESC';
}

export class Permission {
  public id: string;
  public name: string;
  public guardName: string;
  public createdAt: Date;
  public updatedAt: Date;

  public constructor(
    id: string,
    name: string,
    guardName: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.guardName = guardName;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
