import type { TestimonialRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { Testimonial } from '@app/domain/entities';

export type CreateTestimonialParams = [
  testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>,
  abortSignal?: AbortSignal,
];

@injectable()
export class CreateTestimonial implements UseCase<
  Promise<Either<Testimonial, Error>>,
  CreateTestimonialParams
> {
  private readonly testimonialRepository: TestimonialRepository;
  private readonly authRepository: AuthRepository;

  public constructor(
    @inject(SYMBOLS.TestimonialRepository)
    testimonialRepository: TestimonialRepository,
    @inject(SYMBOLS.AuthRepository)
    authRepository: AuthRepository,
  ) {
    this.testimonialRepository = testimonialRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
  ): Promise<Either<Testimonial, Error>> {
    const accessTokenResult = await this.authRepository.getAccessToken();

    if (isRight(accessTokenResult)) {
      return await this.testimonialRepository.createTestimonial(
        testimonial,
        abortSignal,
        accessTokenResult.right,
      );
    } else {
      return left(accessTokenResult.left);
    }
  }
}
