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
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Competition Time Ranges',
};

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

  if (['read-competition-time-range'].some((p) => userPermissions.has(p))) {
    const getCompetitionTimeRanges = serverContainer.get<GetCompetitionTimeRanges>(
      SYMBOLS.GetCompetitionTimeRanges,
    );

    const result = await getCompetitionTimeRanges.execute(undefined, undefined, { perPage: 25 });
    const [competitionTimeRanges, paginationOptions] = match(result, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });

    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Settings', url: '/settings' },
          { label: 'Competition Time Ranges', url: '/competition-time-ranges' },
        ]}
      >
        <SectionHeader title="Competition Time Ranges" backUrl="/settings">
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
      </InternalMain>
    );
  } else {
    notFound();
  }
}
