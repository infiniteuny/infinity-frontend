import {
  CompetitionTimeRangesList,
  CompetitionTimeRangesToolbar,
} from '@app/presentation/components/internal/competition-time-ranges';
import {
  CompetitionTimeRangeDto,
  CompetitionTimeRangeMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { GetCompetitionTimeRanges, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

export default async function CompetitionTimeRangesPage() {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (!['read-competition-time-range'].some((p) => userPermissions.has(p))) {
    notFound();
  } else {
    const getCompetitionTimeRanges = serverContainer.get<GetCompetitionTimeRanges>(
      SYMBOLS.GetCompetitionTimeRanges,
    );

    const result = await getCompetitionTimeRanges.execute(undefined, { perPage: 25 });
    const [competitionTimeRanges, paginationOptions] = match(result, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });

    return (
      <>
        <SectionHeader title="Competition Time Ranges">
          <CompetitionTimeRangesToolbar />
        </SectionHeader>
        <CompetitionTimeRangesList
          initialCompetitionTimeRanges={
            competitionTimeRanges.map(
              CompetitionTimeRangeMapper.fromDomainToDto,
            ) as CompetitionTimeRangeDto[]
          }
          initialPaginationOptions={
            PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
          }
        />
      </>
    );
  }
}
