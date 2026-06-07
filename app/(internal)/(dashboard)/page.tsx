import { InternalMain } from '@app/presentation/components/internal/shared';
import { Metadata } from 'next';
import { OverviewView } from '@app/presentation/components/internal/overview';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Overview',
};

export default async function OverviewPage() {
  // eslint-disable-next-line react-hooks/purity
  const random = Math.random();

  return (
    <InternalMain>
      <OverviewView random={random} />
    </InternalMain>
  );
}
