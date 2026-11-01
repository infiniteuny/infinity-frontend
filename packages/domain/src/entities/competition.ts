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
  shortname?: 'ASC' | 'DESC';
  createdAt?: 'ASC' | 'DESC';
  updatedAt?: 'ASC' | 'DESC';
}

export class Competition {
  public id: string;
  public name: string;
  public shortname: string | null;
  public description: string;
  public createdAt: Date;
  public updatedAt: Date;

  public constructor(
    id: string,
    name: string,
    shortname: string | null,
    description: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.shortname = shortname;
    this.description = description;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
