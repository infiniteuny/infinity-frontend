import { SectionHeader } from '@app/presentation/components/internal/shared';

type Props = {
  params: Promise<{
    achievementId: string;
  }>;
};

export default function SingleAchievementPage({ params }: Props) {
  return (
    <>
      <SectionHeader title="Achievement" />
    </>
  );
}
