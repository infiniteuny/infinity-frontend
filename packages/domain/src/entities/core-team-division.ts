import { FilterOperator } from '.';

export interface CoreTeamDivisionFilterOptions {
  name?: string;
  priority?: number;
  createdAtOperator?: FilterOperator;
  createdAt?: Date;
  updatedAtOperator?: FilterOperator;
  updatedAt?: Date;
}

export interface CoreTeamDivisionSortOptions {
  id?: 'ASC' | 'DESC';
  name?: 'ASC' | 'DESC';
  priority?: 'ASC' | 'DESC';
  createdAt?: 'ASC' | 'DESC';
  updatedAt?: 'ASC' | 'DESC';
}

export class CoreTeamDivision {
  public id: string;
  public name: string;
  public priority: number;
  public createdAt: Date;
  public updatedAt: Date;

  public constructor(id: string, name: string, priority: number, createdAt: Date, updatedAt: Date) {
    this.id = id;
    this.name = name;
    this.priority = priority;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
