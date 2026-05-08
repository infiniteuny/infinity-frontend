import { GetCompetitionTimeRange, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { CompetitionTimeRangeDto, CompetitionTimeRangeMapper } from '@app/infrastructure/dtos';
import {
  CompetitionTimeRangeForm,
  CompetitionTimeRangeToolbar,
  CompetitionTimeRangeView,
} from '@app/presentation/components/internal/single-competition-time-range';

type Props = {
  params: Promise<{
    competitionTimeRangeId: string;
  }>;
};

export default async function SingleCompetitionTimeRangePage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const competitionTimeRangeId = (await params).competitionTimeRangeId;

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (
    competitionTimeRangeId !== 'new' &&
    ['read-competition-time-range'].some((p) => userPermissions.has(p))
  ) {
    const getCompetitionTimeRange = serverContainer.get<GetCompetitionTimeRange>(
      SYMBOLS.GetCompetitionTimeRange,
    );
    const competitionTimeRangeResult =
      await getCompetitionTimeRange.execute(competitionTimeRangeId);
    const competitionTimeRange = match(competitionTimeRangeResult, {
      onLeft: (error) => {
        if (error instanceof NotFoundError) {
          notFound();
        } else {
          throw error;
        }
      },
      onRight: (data) => data,
    });

    return (
      <>
        <SectionHeader title={competitionTimeRange.name}>
          <CompetitionTimeRangeToolbar competitionTimeRangeId={competitionTimeRange.id} />
        </SectionHeader>
        <CompetitionTimeRangeView
          initialCompetitionTimeRange={
            CompetitionTimeRangeMapper.fromDomainToDto(
              competitionTimeRange,
            ) as CompetitionTimeRangeDto
          }
        />
      </>
    );
  } else if (
    competitionTimeRangeId === 'new' &&
    ['create-competition-time-range'].some((p) => userPermissions.has(p))
  ) {
    return <CompetitionTimeRangeForm />;
  } else {
    notFound();
  }
}
