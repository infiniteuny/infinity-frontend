import {
  CompetitionInstanceDto,
  CompetitionInstanceMapper,
} from '@infiniteuny/infinity-infrastructure';
import { CompetitionsView } from '@app/presentation/components/competitions';
import { GetCompetitionInstances } from '@infiniteuny/infinity-application';
import { isRight } from 'effect/Either';
import { Main } from '@app/presentation/components/shared';
import { Metadata } from 'next';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Kompetisi',
  description:
    'Daftar ajang kompetisi yang sedang berlangsung, akan datang, maupun arsip kompetisi terdahulu.',
};

export default async function CompetitionsPage() {
  const getCompetitionInstances = serverContainer.get<GetCompetitionInstances>(
    SYMBOLS.GetCompetitionInstances,
  );

  let instances: CompetitionInstanceDto[] = [];
  let nextCursor: string | undefined;

  try {
    const result = await getCompetitionInstances.execute(
      ['competition', 'organizer_type'],
      undefined,
      { startDate: 'DESC' },
      { perPage: 10 },
      undefined,
      false,
    );

    if (isRight(result)) {
      const [items, pagination] = result.right;
      instances = items.map(
        (item) => CompetitionInstanceMapper.fromDomainToDto(item) as CompetitionInstanceDto,
      );
      nextCursor = pagination.nextCursor;
    }
  } catch {
    // Fallback to empty state
  }

  return (
    <Main>
      <CompetitionsView initialInstances={instances} initialNextCursor={nextCursor} />
    </Main>
  );
}
