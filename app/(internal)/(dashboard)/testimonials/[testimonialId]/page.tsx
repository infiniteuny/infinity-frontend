import { cache } from 'react';
import { GetSession, GetTestimonial } from '@app/application';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { NotFoundError } from '@app/domain/errors';
import { notFound } from 'next/navigation';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
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

  if (testimonialId !== 'new') {
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
      title: testimonial.name,
    };
  } else if (
    testimonialId === 'new' &&
    ['create-testimonial'].some((p) => userPermissions.has(p))
  ) {
    return { title: 'Create Testimonial' };
  } else {
    notFound();
  }
}

export default async function SingleTestimonialPage({ params }: Props) {
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

  if (testimonialId !== 'new') {
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

    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Testimonials', url: '/testimonials' },
          { label: testimonial.name, url: `/testimonials/${testimonial.id}` },
        ]}
      >
        <SectionHeader title={testimonial.name} backUrl="/testimonials">
          <TestimonialToolbar testimonialId={testimonial.id} />
        </SectionHeader>
        <TestimonialView
          initialTestimonial={TestimonialMapper.fromDomainToDto(testimonial) as TestimonialDto}
        />
      </InternalMain>
    );
  } else if (
    testimonialId === 'new' &&
    ['create-testimonial'].some((p) => userPermissions.has(p))
  ) {
    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Testimonials', url: '/testimonials' },
          { label: 'Create Testimonial', url: `/testimonials/new` },
        ]}
      >
        <TestimonialForm />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
