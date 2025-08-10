import { SectionHeader } from '@app/presentation/components/internal/shared';

type Props = {
  params: Promise<{
    projectGalleryId: string;
  }>;
};

export default function SingleProjectGalleryPage({ params }: Props) {
  return (
    <>
      <SectionHeader title="Project Gallery" />
    </>
  );
}
