import { GetTestimonial } from '@app/application';
import { match } from 'effect/Either';
import { TestimonialDto, TestimonialMapper } from '@app/infrastructure/dtos';
import { TestimonialForm } from '@app/presentation/components/internal/single-testimonial';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { NotFoundError } from '@app/domain/errors';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{
    testimonialId: string;
  }>;
};

export default async function SingleTestimonialEditPage({ params }: Props) {
  const getTestimonial = serverContainer.get<GetTestimonial>(SYMBOLS.GetTestimonial);
  const testimonialId = (await params).testimonialId;

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
    <TestimonialForm
      initialTestimonial={TestimonialMapper.fromDomainToDto(testimonial) as TestimonialDto}
    />
  );
}
