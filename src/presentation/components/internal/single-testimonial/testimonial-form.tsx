'use client';

import { Box } from '@mui/material';
import { clientContainer } from '@app/client-injection';
import { CreateTestimonial, UpdateTestimonial } from '@app/application';
import { GeneralForm } from './general-form';
import { match } from 'effect/Either';
import { Resolver, useForm, useWatch } from 'react-hook-form';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { SYMBOLS } from '@config';
import { TestimonialDto, TestimonialMapper } from '@app/infrastructure/dtos';
import { TestimonialToolbar } from './testimonial-toolbar';
import { useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const testimonialInputSchema = z.object({
  name: z.string().min(1, 'Name must not be empty'),
  position: z.string().min(1, 'Position must not be empty'),
  photo: z.union([
    z
      .file('Photo must not be empty')
      .max(5120 * 1024, 'Photo must be less than 5MB')
      .mime(['image/png', 'image/jpeg', 'image/webp'], 'Photo must be a PNG, JPEG, or WebP file'),
    z.string(),
  ]),
  content: z.string().min(1, 'Content must not be empty'),
});

export type TestimonialInput = z.infer<typeof testimonialInputSchema>;

type Props = {
  initialTestimonial?: TestimonialDto;
};

export function TestimonialForm({ initialTestimonial }: Props) {
  const createTestimonial = useMemo(
    () => clientContainer.get<CreateTestimonial>(SYMBOLS.CreateTestimonial),
    [],
  );
  const updateTestimonial = useMemo(
    () => clientContainer.get<UpdateTestimonial>(SYMBOLS.UpdateTestimonial),
    [],
  );
  const router = useRouter();

  const testimonial = initialTestimonial
    ? TestimonialMapper.fromDtoToDomain(initialTestimonial)
    : null;
  const ref = useRef<HTMLFormElement>(null);
  const methods = useForm<TestimonialInput>({
    mode: 'all',
    // Bug workaround for https://github.com/colinhacks/zod/issues/3537
    resolver: zodResolver(testimonialInputSchema) as Resolver<TestimonialInput>,
    defaultValues: testimonial
      ? {
          ...testimonial,
        }
      : {
          name: '',
          position: '',
          photo: undefined,
          content: '',
        },
  });

  const { handleSubmit: submit, control, formState } = methods;

  const name = useWatch({ name: 'name', control });

  const handleSubmit = submit(async (data) => {
    if (formState.isDirty) {
      try {
        if (!testimonial) {
          const testimonialResult = await createTestimonial.execute({
            ...data,
            photo: data.photo as File,
          });

          match(testimonialResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              // TODO: Add snackbar for success state
              router.push(`/testimonials/${data.id}`);
            },
          });
        } else {
          const testimonialResult = await updateTestimonial.execute(testimonial.id, data);

          match(testimonialResult, {
            onLeft: (error) => {
              throw error;
            },
            onRight: (data) => {
              // TODO: Add snackbar for success state
              router.push(`/testimonials/${data.id}`);
            },
          });
        }
      } catch (error) {
        // TODO: Implement proper error handling and add snackbar for error state
        console.error('Error submitting testimonial form:', error);
      }
    }
  });

  return (
    <>
      <SectionHeader
        title={testimonial ? `Edit ${name}` : 'Create Testimonial'}
        backUrl={testimonial ? `/testimonials/${testimonial.id}` : '/testimonials'}
      >
        <TestimonialToolbar ref={ref} methods={methods} />
      </SectionHeader>
      <Box component="form" ref={ref} noValidate onSubmit={handleSubmit}>
        <GeneralForm methods={methods} />
      </Box>
    </>
  );
}
