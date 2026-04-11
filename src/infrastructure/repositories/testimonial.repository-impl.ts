import type { InfinityApiDataSource } from '@app/infrastructure/datasources/server';
import { Either, left, right } from 'effect/Either';
import { handleAxiosError } from '@app/utils';
import { inject } from 'inversify';
import { PaginationOptions, Testimonial, TestimonialFilterOptions } from '@app/domain/entities';
import { SYMBOLS } from '@config';
import { TestimonialMapper } from '@app/infrastructure/dtos';
import { TestimonialRepository } from '@app/domain/repositories';

export class TestimonialRepositoryImpl implements TestimonialRepository {
  public constructor(
    @inject(SYMBOLS.InfinityApiDataSource)
    private infinityApiDataSource: InfinityApiDataSource,
  ) {}

  public async getTestimonials(
    filterOptions?: TestimonialFilterOptions,
    paginationOptions?: PaginationOptions,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<[Testimonial[], PaginationOptions], Error>> {
    try {
      const response = await this.infinityApiDataSource.get('/testimonials', {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        params: {
          per_page: paginationOptions?.perPage,
          cursor: paginationOptions?.cursor,
          'filters[name]': filterOptions?.name,
          'filters[position]': filterOptions?.position,
          'filters[created_at]':
            filterOptions?.createdAt != null
              ? (filterOptions.createdAtOperator ?? '') + filterOptions.createdAt.toISOString()
              : undefined,
          'filters[updated_at]':
            filterOptions?.updatedAt != null
              ? (filterOptions.updatedAtOperator ?? '') + filterOptions?.updatedAt?.toISOString()
              : undefined,
        },
      });

      const testimonialsResponse = response.data.data.testimonials.map(
        TestimonialMapper.fromDtoToDomain,
      );

      const paginationOptionsResponse = new PaginationOptions(
        response.data.data.meta.per_page,
        paginationOptions?.cursor,
        response.data.data.meta.next_cursor ?? undefined,
        response.data.data.meta.prev_cursor ?? undefined,
      );

      return right([testimonialsResponse, paginationOptionsResponse]);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async getTestimonial(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Testimonial, Error>> {
    try {
      const response = await this.infinityApiDataSource.get(`/testimonials/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const testimonialResponse = TestimonialMapper.fromDtoToDomain(response.data.data.testimonial);

      return right(testimonialResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async createTestimonial(
    testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Testimonial, Error>> {
    try {
      const testimonialDto = TestimonialMapper.fromDomaintoDto(testimonial);

      const response = await this.infinityApiDataSource.postForm(
        '/testimonials',
        {
          ...testimonialDto,
          photo: testimonialDto.photo instanceof File ? testimonialDto.photo : undefined,
        },
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const testimonialResponse = TestimonialMapper.fromDtoToDomain(response.data.data.testimonial);

      return right(testimonialResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async updateTestimonial(
    id: string,
    testimonial: Partial<Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>>,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Testimonial, Error>> {
    try {
      const testimonialDto = TestimonialMapper.fromDomaintoDto(testimonial);

      const response = await this.infinityApiDataSource.putForm(
        `/testimonials/${id}`,
        {
          ...testimonialDto,
          photo: testimonialDto.photo instanceof File ? testimonialDto.photo : undefined,
        },
        {
          signal: abortSignal,
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        },
      );

      const testimonialResponse = TestimonialMapper.fromDtoToDomain(response.data.data.testimonial);

      return right(testimonialResponse);
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }

  public async deleteTestimonial(
    id: string,
    abortSignal?: AbortSignal,
    token?: string,
  ): Promise<Either<Testimonial, Error>> {
    try {
      const response = await this.infinityApiDataSource.delete(`/testimonials/${id}`, {
        signal: abortSignal,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      return right(TestimonialMapper.fromDtoToDomain(response.data.data));
    } catch (error) {
      return left(handleAxiosError(error));
    }
  }
}
