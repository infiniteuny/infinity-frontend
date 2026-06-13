import type { TestimonialRepository, AuthRepository } from '@app/domain/repositories';
import { Either, left, isRight } from 'effect/Either';
import { inject, injectable } from 'inversify';
import {
  PaginationOptions,
  Testimonial,
  TestimonialFilterOptions,
  TestimonialSortOptions,
} from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { UseCase } from '@app/application';

export type GetTestimonialsParams = [
  filterOptions?: TestimonialFilterOptions,
  sortOptions?: TestimonialSortOptions,
  paginationOptions?: PaginationOptions,
  abortSignal?: AbortSignal,
  authenticate?: boolean,
];

@injectable()
export class GetTestimonials implements UseCase<
  Promise<Either<[Testimonial[], PaginationOptions], Error>>,
  GetTestimonialsParams
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
    filterOptions?: TestimonialFilterOptions,
    sortOptions?: TestimonialSortOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    authenticate: boolean = true,
  ): Promise<Either<[Testimonial[], PaginationOptions], Error>> {
    let accessToken: string | undefined;

    if (authenticate) {
      const accessTokenResult = await this.authRepository.getAccessToken();

      if (isRight(accessTokenResult)) {
        accessToken = accessTokenResult.right;
      } else {
        return left(accessTokenResult.left);
      }
    }

    return await this.testimonialRepository.getTestimonials(
      filterOptions,
      sortOptions,
      paginationOptions,
      abortSignal,
      accessToken,
    );
  }
}
