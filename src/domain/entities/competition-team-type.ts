import { FilterOperator } from '.';

export interface CompetitionTeamTypeFilterOptions {
  name?: string;
  weight?: number;
  createdAtOperator?: FilterOperator;
  createdAt?: Date;
  updatedAtOperator?: FilterOperator;
  updatedAt?: Date;
}

export interface CompetitionTeamTypeSortOptions {
  id?: 'ASC' | 'DESC';
  name?: 'ASC' | 'DESC';
  weight?: 'ASC' | 'DESC';
  createdAt?: 'ASC' | 'DESC';
  updatedAt?: 'ASC' | 'DESC';
}

export class CompetitionTeamType {
  public id: string;
  public name: string;
  public weight: number;
  public createdAt: Date;
  public updatedAt: Date;

  public constructor(id: string, name: string, weight: number, createdAt: Date, updatedAt: Date) {
    this.id = id;
    this.name = name;
    this.weight = weight;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
