import { FilterOperator } from '.';

export interface CompetitionFilterOptions {
  name?: string;
  description?: string;
  createdAtOperator?: FilterOperator;
  createdAt?: Date;
  updatedAtOperator?: FilterOperator;
  updatedAt?: Date;
}

export interface CompetitionSortOptions {
  id?: 'ASC' | 'DESC';
  name?: 'ASC' | 'DESC';
  createdAt?: 'ASC' | 'DESC';
  updatedAt?: 'ASC' | 'DESC';
}

export class Competition {
  public id: string;
  public name: string;
  public description: string;
  public createdAt: Date;
  public updatedAt: Date;

  public constructor(
    id: string,
    name: string,
    description: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
