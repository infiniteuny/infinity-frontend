import type { TestimonialRepository, AuthRepository } from '@app/domain/repositories';
import { Either, match } from 'effect/Either';
import { inject, injectable } from 'inversify';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';
import { Testimonial } from '@app/domain/entities';

export type CreateTestimonialParams = [
  testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
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
    authenticate?: boolean,
  ): Promise<Either<Testimonial, Error>> {
    let accessToken: string | undefined;

    if (authenticate) {
      const accessTokenResult = await this.authRepository.getAccessToken();

      accessToken = match(accessTokenResult, {
        onLeft: (error) => {
          throw error;
        },
        onRight: (token) => token,
      });
    }

    return await this.testimonialRepository.createTestimonial(
      testimonial,
      abortSignal,
      accessToken,
    );
  }
}
