import { Testimonial } from '@infiniteuny/infinity-domain';
import { EntityMetadataView } from '@app/presentation/components/internal/shared';

type Props = {
  testimonial: Testimonial;
};

export function MetadataView({ testimonial }: Props) {
  return (
    <EntityMetadataView
      id={testimonial.id}
      createdAt={testimonial.createdAt}
      updatedAt={testimonial.updatedAt}
    />
  );
}
