import { FilterOperator } from '.';

export interface CommunityGroupFilterOptions {
  name?: string;
  priority?: number;
  description?: string;
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
  public priority: number;
  public description: string;
  public logo: string;
  public isActive: boolean;
  public createdAt: Date;
  public updatedAt: Date;

  public constructor(
    id: string,
    name: string,
    priority: number,
    description: string,
    logo: string,
    isActive: boolean,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.priority = priority;
    this.description = description;
    this.logo = logo;
    this.isActive = isActive;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
