import { SectionHeader } from '@app/presentation/components/internal/shared';

type Props = {
  params: Promise<{
    communityGroupId: string;
  }>;
};

export default function SingleCommunityGroupPage({ params }: Props) {
  return (
    <>
      <SectionHeader title="Community Group" />
    </>
  );
}
