import { Either } from 'effect/Either';
import { PaginationOptions, Testimonial, TestimonialFilterOptions } from '@app/domain/entities';

export interface TestimonialRepository {
  getTestimonials(
    filterOptions?: TestimonialFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[Testimonial[], PaginationOptions], Error>>;

  getTestimonial(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Testimonial, Error>>;

  createTestimonial(
    testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Testimonial, Error>>;

  updateTestimonial(
    id: string,
    testimonial: Partial<Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Testimonial, Error>>;

  deleteTestimonial(
    id: string,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Testimonial, Error>>;
}
