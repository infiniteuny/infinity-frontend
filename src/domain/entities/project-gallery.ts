import { FilterOperator } from '.';

export interface ProjectGalleryFilterOptions {
  title?: string;
  description?: string;
  url?: string;
  createdAtOperator?: FilterOperator;
  createdAt?: Date;
  updatedAtOperator?: FilterOperator;
  updatedAt?: Date;
}

export interface ProjectGallerySortOptions {
  id?: 'ASC' | 'DESC';
  title?: 'ASC' | 'DESC';
  createdAt?: 'ASC' | 'DESC';
  updatedAt?: 'ASC' | 'DESC';
}

export class ProjectGallery {
  public id: string;
  public title: string;
  public description: string;
  public url: string;
  public image: string;
  public createdAt: Date;
  public updatedAt: Date;

  public constructor(
    id: string,
    title: string,
    description: string,
    url: string,
    image: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.url = url;
    this.image = image;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
