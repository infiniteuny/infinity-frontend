import { cache } from 'react';
import { GetSession, GetTestimonial } from '@app/application';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { TestimonialDto, TestimonialMapper } from '@app/infrastructure/dtos';
import { TestimonialForm } from '@app/presentation/components/internal/single-testimonial';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { NotFoundError } from '@app/domain/errors';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{
    testimonialId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const testimonialId = (await params).testimonialId;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-testimonial'].some((p) => userPermissions.has(p))) {
    const getTestimonial = serverContainer.get<GetTestimonial>(SYMBOLS.GetTestimonial);

    const testimonialResult = await cache(
      async () => await getTestimonial.execute(testimonialId),
    )();
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

    return {
      title: `Edit ${testimonial.name}`,
    };
  } else {
    notFound();
  }
}

export default async function SingleTestimonialEditPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-testimonial'].some((p) => userPermissions.has(p))) {
    const getTestimonial = serverContainer.get<GetTestimonial>(SYMBOLS.GetTestimonial);
    const testimonialId = (await params).testimonialId;

    const testimonialResult = await cache(
      async () => await getTestimonial.execute(testimonialId),
    )();
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
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Testimonials', url: '/testimonials' },
          { label: testimonial.name, url: `/testimonials/${testimonial.id}` },
          { label: 'Edit', url: `/testimonials/${testimonial.id}/edit` },
        ]}
      >
        <TestimonialForm
          initialTestimonial={TestimonialMapper.fromDomainToDto(testimonial) as TestimonialDto}
        />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
