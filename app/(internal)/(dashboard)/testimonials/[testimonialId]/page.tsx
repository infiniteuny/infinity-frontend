import { GetSession, GetTestimonial } from '@app/application';
import { match } from 'effect/Either';
import { NotFoundError } from '@app/domain/errors';
import { notFound } from 'next/navigation';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { TestimonialDto, TestimonialMapper } from '@app/infrastructure/dtos';
import {
  TestimonialForm,
  TestimonialToolbar,
  TestimonialView,
} from '@app/presentation/components/internal/single-testimonial';

type Props = {
  params: Promise<{
    testimonialId: string;
  }>;
};

export default async function SingleTestimonialPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const testimonialId = (await params).testimonialId;

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (testimonialId !== 'new' && ['read-testimonial'].some((p) => userPermissions.has(p))) {
    const getTestimonial = serverContainer.get<GetTestimonial>(SYMBOLS.GetTestimonial);
    const testimonialResult = await getTestimonial.execute(testimonialId);
    const testimonial = match(testimonialResult, {
      onLeft: (error) => {
        if (error instanceof NotFoundError) {
          notFound();
        } else {
          throw error;
        }
      },
      onRight: (data) => data,
    });

    return (
      <>
        <SectionHeader title={testimonial.name}>
          <TestimonialToolbar testimonialId={testimonial.id} />
        </SectionHeader>
        <TestimonialView
          initialTestimonial={TestimonialMapper.fromDomainToDto(testimonial) as TestimonialDto}
        />
      </>
    );
  } else if (
    testimonialId === 'new' &&
    ['create-testimonial'].some((p) => userPermissions.has(p))
  ) {
    return <TestimonialForm />;
  } else {
    notFound();
  }
}
