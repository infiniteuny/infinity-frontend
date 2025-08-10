import { SectionHeader } from '@app/presentation/components/internal/shared';

type Props = {
  params: Promise<{
    testimonialId: string;
  }>;
};

export default function SingleTestimonialPage({ params }: Props) {
  return (
    <>
      <SectionHeader title="Testimonial" />
    </>
  );
}
