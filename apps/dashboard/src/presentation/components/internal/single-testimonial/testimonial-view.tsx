'use client';

import { GeneralView } from './general-view';
import { MetadataView } from './metadata-view';
import { TestimonialDto, TestimonialMapper } from '@infiniteuny/infinity-infrastructure';

type Props = {
  initialTestimonial: TestimonialDto;
};

export function TestimonialView({ initialTestimonial }: Props) {
  const testimonial = TestimonialMapper.fromDtoToDomain(initialTestimonial);

  return (
    <>
      <GeneralView testimonial={testimonial} />
      <MetadataView testimonial={testimonial} />
    </>
  );
}
