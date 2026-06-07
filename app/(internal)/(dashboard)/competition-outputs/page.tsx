import {
  CompetitionOutputsList,
  CompetitionOutputsToolbar,
} from '@app/presentation/components/internal/competition-outputs';
import {
  CompetitionOutputDto,
  CompetitionOutputMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { GetCompetitionOutputs, GetSession } from '@app/application';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Competition Outputs',
};

export default async function CompetitionOutputsPage() {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['read-competition-output'].some((p) => userPermissions.has(p))) {
    const getCompetitionOutputs = serverContainer.get<GetCompetitionOutputs>(
      SYMBOLS.GetCompetitionOutputs,
    );

    const result = await getCompetitionOutputs.execute(undefined, { perPage: 25 });
    const [competitionOutputs, paginationOptions] = match(result, {
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
          { label: 'Competition Outputs', url: '/competition-outputs' },
        ]}
      >
        <SectionHeader title="Competition Outputs" backUrl="/settings">
          <CompetitionOutputsToolbar />
        </SectionHeader>
        <CompetitionOutputsList
          initialCompetitionOutputs={
            competitionOutputs.map(
              CompetitionOutputMapper.fromDomainToDto,
            ) as CompetitionOutputDto[]
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
