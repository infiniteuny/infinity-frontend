import { CompetitionScalesList } from '@app/presentation/components/internal/competition-scales';
import {
  CompetitionScaleDto,
  CompetitionScaleMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { GetCompetitionScales, GetSession } from '@app/application';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Competition Scales',
};

export default async function CompetitionScalesPage() {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['read-competition-scale'].some((p) => userPermissions.has(p))) {
    const getCompetitionScales = serverContainer.get<GetCompetitionScales>(
      SYMBOLS.GetCompetitionScales,
    );

    const result = await getCompetitionScales.execute(undefined, undefined, { perPage: 25 });
    const [competitionScales, paginationOptions] = match(result, {
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
          { label: 'Competition Scales', url: '/competition-scales' },
        ]}
      >
        <CompetitionScalesList
          initialCompetitionScales={
            competitionScales.map(CompetitionScaleMapper.fromDomainToDto) as CompetitionScaleDto[]
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
