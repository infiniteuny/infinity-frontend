import { SectionHeader } from '@app/presentation/components/internal/shared';

type Props = {
  params: Promise<{
    teamId: string;
  }>;
};

export default function SingleTeamPage({ params }: Props) {
  return (
    <>
      <SectionHeader title="Team" />
    </>
  );
}
