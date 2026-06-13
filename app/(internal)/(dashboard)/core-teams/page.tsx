import {
  CoreTeamDto,
  CoreTeamMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { CoreTeamsList, CoreTeamsToolbar } from '@app/presentation/components/internal/core-teams';
import { GetCoreTeams } from '@app/application';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Core Teams',
};

export default async function CoreTeamsPage() {
  const getCoreTeams = serverContainer.get<GetCoreTeams>(SYMBOLS.GetCoreTeams);

  const result = await getCoreTeams.execute(undefined, undefined, { perPage: 25 });
  const [coreTeams, paginationOptions] = match(result, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });

  return (
    <InternalMain
      breadcrumbs={[
        { label: 'Overview', url: '/' },
        { label: 'Core Teams', url: '/core-teams' },
      ]}
    >
      <SectionHeader title="Core Teams">
        <CoreTeamsToolbar />
      </SectionHeader>
      <CoreTeamsList
        initialCoreTeams={coreTeams.map(CoreTeamMapper.fromDomainToDto) as CoreTeamDto[]}
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </InternalMain>
  );
}
