import { FilterOperator } from '.';

export interface TestimonialFilterOptions {
  name?: string;
  position?: string;
  createdAtOperator?: FilterOperator;
  createdAt?: Date;
  updatedAtOperator?: FilterOperator;
  updatedAt?: Date;
}

export interface TestimonialSortOptions {
  id?: 'ASC' | 'DESC';
  name?: 'ASC' | 'DESC';
  position?: 'ASC' | 'DESC';
  createdAt?: 'ASC' | 'DESC';
  updatedAt?: 'ASC' | 'DESC';
}

export class Testimonial {
  public id: string;
  public name: string;
  public position: string;
  public photo: string;
  public content: string;
  public createdAt: Date;
  public updatedAt: Date;

  public constructor(
    id: string,
    name: string,
    position: string,
    photo: string,
    content: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.position = position;
    this.photo = photo;
    this.content = content;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
