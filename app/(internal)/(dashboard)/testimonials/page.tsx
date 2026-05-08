import { GetSession, GetTestimonials } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
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
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (!['read-testimonal'].some((p) => userPermissions.has(p))) {
    notFound();
  } else {
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
}
