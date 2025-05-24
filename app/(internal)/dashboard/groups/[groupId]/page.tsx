import { SectionHeader } from '@app/presentation/components/internal/shared';

type Props = {
  params: Promise<{
    groupId: string;
  }>;
};

export default function SingleGroupPage({ params }: Props) {
  return (
    <>
      <SectionHeader title="Group" />
    </>
  );
}
