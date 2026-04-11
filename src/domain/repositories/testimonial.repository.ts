import { Either } from 'effect/Either';
import { PaginationOptions, Testimonial, TestimonialFilterOptions } from '@app/domain/entities';

export interface TestimonialRepository {
  getTestimonials(
    filterOptions?: TestimonialFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[Testimonial[], PaginationOptions], Error>>;

  getTestimonial(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Testimonial, Error>>;

  createTestimonial(
    testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Testimonial, Error>>;

  updateTestimonial(
    id: string,
    testimonial: Partial<Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Testimonial, Error>>;

  deleteTestimonial(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Testimonial, Error>>;
}
