import type { TestimonialRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { Testimonial } from '@app/domain/entities';

export type UpdateTestimonialParams = [
  id: string,
  testimonial: Partial<Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>>,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class UpdateTestimonial implements UseCase<
  Promise<Either<Testimonial, Error>>,
  UpdateTestimonialParams
> {
  private readonly testimonialRepository: TestimonialRepository;

  public constructor(
    @inject(SYMBOLS.TestimonialRepository)
    testimonialRepository: TestimonialRepository,
  ) {
    this.testimonialRepository = testimonialRepository;
  }

  public async execute(
    id: string,
    testimonial: Partial<Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Testimonial, Error>> {
    return await this.testimonialRepository.updateTestimonial(
      id,
      testimonial,
      abortSignal,
      authenticate,
    );
  }
}
