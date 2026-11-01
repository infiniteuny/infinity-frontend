import { FilterOperator } from '.';

export interface CommunityGroupAdminFilterOptions {
  year?: number;
  isActive?: boolean;
  createdAtOperator?: FilterOperator;
  createdAt?: Date;
  updatedAtOperator?: FilterOperator;
  updatedAt?: Date;
}

export interface CommunityGroupAdminSortOptions {
  id?: 'ASC' | 'DESC';
  year?: 'ASC' | 'DESC';
  isActive?: 'ASC' | 'DESC';
  createdAt?: 'ASC' | 'DESC';
  updatedAt?: 'ASC' | 'DESC';
}

export class CommunityGroupAdmin {
  public id: string;
  public year: number;
  public isActive: boolean;
  public createdAt: Date;
  public updatedAt: Date;

  public constructor(
    id: string,
    year: number,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.year = year;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
