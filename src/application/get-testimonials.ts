import type { TestimonialRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { PaginationOptions, Testimonial, TestimonialFilterOptions } from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetTestimonialsParams = [
  filterOptions?: TestimonialFilterOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetTestimonials
  implements
    UseCase<Promise<Either<[Testimonial[], PaginationOptions], Error>>, GetTestimonialsParams>
{
  private readonly testimonialRepository: TestimonialRepository;

  public constructor(
    @inject(SYMBOLS.TestimonialRepository)
    testimonialRepository: TestimonialRepository,
  ) {
    this.testimonialRepository = testimonialRepository;
  }

  public async execute(
    filterOptions?: TestimonialFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<[Testimonial[], PaginationOptions], Error>> {
    return await this.testimonialRepository.getTestimonials(
      filterOptions,
      paginationOptions,
      abortSignal,
      authenticate,
    );
  }
}
