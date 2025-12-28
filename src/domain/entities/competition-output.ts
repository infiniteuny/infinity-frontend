import { FilterOperator } from '.';

export interface CompetitionOutputFilterOptions {
  name?: string;
  weight?: number;
  createdAtOperator?: FilterOperator;
  createdAt?: Date;
  updatedAtOperator?: FilterOperator;
  updatedAt?: Date;
}

export interface CompetitionOutputSortOptions {
  id?: 'ASC' | 'DESC';
  name?: 'ASC' | 'DESC';
  weight?: 'ASC' | 'DESC';
  createdAt?: 'ASC' | 'DESC';
  updatedAt?: 'ASC' | 'DESC';
}

export class CompetitionOutput {
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
