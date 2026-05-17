import { GetTestimonials } from '@app/application';
import { match } from 'effect/Either';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  TestimonialDto,
  TestimonialMapper,
} from '@app/infrastructure/dtos';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import {
  TestimonialsList,
  TestimonialsToolbar,
} from '@app/presentation/components/internal/testimonials';

export const dynamic = 'force-dynamic';

export default async function TestimonialsPage() {
  const getTestimonials = serverContainer.get<GetTestimonials>(SYMBOLS.GetTestimonials);

  const result = await getTestimonials.execute(undefined, { perPage: 25 });
  const [testimonials, paginationOptions] = match(result, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });

  return (
    <>
      <SectionHeader title="Testimonials">
        <TestimonialsToolbar />
      </SectionHeader>
      <TestimonialsList
        initialTestimonials={
          testimonials.map(TestimonialMapper.fromDomainToDto) as TestimonialDto[]
        }
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </>
  );
}
