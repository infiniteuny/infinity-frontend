import { FilterOperator } from '.';

export interface CommunityGroupFilterOptions {
  name?: string;
  description?: string;
  priority?: number;
  isActive?: boolean;
  createdAtOperator?: FilterOperator;
  createdAt?: Date;
  updatedAtOperator?: FilterOperator;
  updatedAt?: Date;
}

export interface CommunityGroupSortOptions {
  id?: 'ASC' | 'DESC';
  name?: 'ASC' | 'DESC';
  priority?: 'ASC' | 'DESC';
  isActive?: 'ASC' | 'DESC';
  createdAt?: 'ASC' | 'DESC';
  updatedAt?: 'ASC' | 'DESC';
}

export class CommunityGroup {
  public id: string;
  public name: string;
  public description: string;
  public priority: number;
  public logo: string;
  public isActive: boolean;
  public createdAt: Date;
  public updatedAt: Date;

  public constructor(
    id: string,
    name: string,
    description: string,
    priority: number,
    logo: string,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.priority = priority;
    this.logo = logo;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
