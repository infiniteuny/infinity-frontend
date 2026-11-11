import type { TestimonialRepository, AuthRepository } from '@infiniteuny/infinity-domain';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable, optional } from 'inversify';
import { SYMBOLS } from '@infiniteuny/infinity-domain';
import { UseCase } from './use-case';
import { Testimonial } from '@infiniteuny/infinity-domain';

export type GetTestimonialParams = [id: string, abortSignal?: AbortSignal, authenticate?: boolean];

@injectable()
export class GetTestimonial implements UseCase<
  Promise<Either<Testimonial, Error>>,
  GetTestimonialParams
> {
  private readonly testimonialRepository: TestimonialRepository;
  private readonly authRepository?: AuthRepository;

  public constructor(
    @inject(SYMBOLS.TestimonialRepository)
    testimonialRepository: TestimonialRepository,
    @inject(SYMBOLS.AuthRepository)
    @optional()
    authRepository?: AuthRepository,
  ) {
    this.testimonialRepository = testimonialRepository;
    this.authRepository = authRepository;
  }

  public async execute(
    id: string,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<Testimonial, Error>> {
    let accessToken: string | undefined;

    if (authenticate && this.authRepository) {
      const accessTokenResult = await this.authRepository.getAccessToken();

      if (isRight(accessTokenResult)) {
        accessToken = accessTokenResult.right;
      } else {
        return left(accessTokenResult.left);
      }
    }

    return await this.testimonialRepository.getTestimonial(id, abortSignal, accessToken);
  }
}
