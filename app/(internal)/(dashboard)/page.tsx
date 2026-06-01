import { OverviewView } from '@app/presentation/components/internal/overview';

export const dynamic = 'force-dynamic';

export default async function OverviewPage() {
  // eslint-disable-next-line react-hooks/purity
  const random = Math.random();

  return (
    <>
      <OverviewView random={random} />
    </>
  );
}
