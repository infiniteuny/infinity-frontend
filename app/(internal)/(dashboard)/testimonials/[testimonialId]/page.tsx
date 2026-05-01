import { GetTestimonial } from '@app/application';
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
  const testimonialId = (await params).testimonialId;

  if (testimonialId !== 'new') {
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
  } else {
    return <TestimonialForm />;
  }
}
