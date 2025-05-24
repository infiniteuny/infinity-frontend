import { SectionHeader } from '@app/presentation/components/internal/shared';

type Props = {
  params: Promise<{
    fundApplicationId: string;
  }>;
};

export default function SingleFundApplicationPage({ params }: Props) {
  return (
    <>
      <SectionHeader title="Fund Application" />
    </>
  );
}
