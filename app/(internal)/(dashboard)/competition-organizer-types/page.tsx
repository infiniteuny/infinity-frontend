import {
  CompetitionOrganizerTypesList,
  CompetitionOrganizerTypesToolbar,
} from '@app/presentation/components/internal/competition-organizer-types';
import {
  CompetitionOrganizerTypeDto,
  CompetitionOrganizerTypeMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { GetCompetitionOrganizerTypes, GetSession } from '@app/application';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Competition Organizer Types',
};

export default async function CompetitionOrganizerTypesPage() {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['read-competition-organizer-type'].some((p) => userPermissions.has(p))) {
    const getCompetitionOrganizerTypes = serverContainer.get<GetCompetitionOrganizerTypes>(
      SYMBOLS.GetCompetitionOrganizerTypes,
    );

    const result = await getCompetitionOrganizerTypes.execute(undefined, { perPage: 25 });
    const [competitionOrganizerTypes, paginationOptions] = match(result, {
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
          { label: 'Competition Organizer Types', url: '/competition-organizer-types' },
        ]}
      >
        <SectionHeader title="Competition Organizer Types" backUrl="/settings">
          <CompetitionOrganizerTypesToolbar />
        </SectionHeader>
        <CompetitionOrganizerTypesList
          initialCompetitionOrganizerTypes={
            competitionOrganizerTypes.map(
              CompetitionOrganizerTypeMapper.fromDomainToDto,
            ) as CompetitionOrganizerTypeDto[]
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
