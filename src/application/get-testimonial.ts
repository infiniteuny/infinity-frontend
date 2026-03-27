import type { TestimonialRepository } from '@app/domain/repositories';
import { Either } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { Testimonial } from '@app/domain/entities';

export type GetTestimonialParams = [id: string, abortSignal?: AbortSignal, authenticate?: boolean];

@injectable()
export class GetTestimonial implements UseCase<
  Promise<Either<Testimonial, Error>>,
  GetTestimonialParams
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
    abortSignal?: AbortSignal,
    authenticate?: boolean,
  ): Promise<Either<Testimonial, Error>> {
    return await this.testimonialRepository.getTestimonial(id, abortSignal, authenticate);
  }
}
