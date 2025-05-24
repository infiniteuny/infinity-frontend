import { SectionHeader } from '@app/presentation/components/internal/shared';

type Props = {
  params: Promise<{
    coreTeamId: string;
  }>;
};

export default function SingleCoreTeamPage({ params }: Props) {
  return (
    <>
      <SectionHeader title="Overview" />
    </>
  );
}
