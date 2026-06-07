import { GetTestimonials } from '@app/application';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  TestimonialDto,
  TestimonialMapper,
} from '@app/infrastructure/dtos';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import {
  TestimonialsList,
  TestimonialsToolbar,
} from '@app/presentation/components/internal/testimonials';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Testimonials',
};

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
    <InternalMain
      breadcrumbs={[
        { label: 'Overview', url: '/' },
        { label: 'Testimonials', url: '/testimonials' },
      ]}
    >
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
    </InternalMain>
  );
}
