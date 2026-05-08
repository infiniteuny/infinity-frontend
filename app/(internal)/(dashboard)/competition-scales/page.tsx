import {
  CompetitionScalesList,
  CompetitionScalesToolbar,
} from '@app/presentation/components/internal/competition-scales';
import {
  CompetitionScaleDto,
  CompetitionScaleMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { GetCompetitionScales, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

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

  if (!['read-competition-scale'].some((p) => userPermissions.has(p))) {
    notFound();
  } else {
    const getCompetitionScales = serverContainer.get<GetCompetitionScales>(
      SYMBOLS.GetCompetitionScales,
    );

    const result = await getCompetitionScales.execute(undefined, { perPage: 25 });
    const [competitionScales, paginationOptions] = match(result, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });

    return (
      <>
        <SectionHeader title="Competition Scales">
          <CompetitionScalesToolbar />
        </SectionHeader>
        <CompetitionScalesList
          initialCompetitionScales={
            competitionScales.map(CompetitionScaleMapper.fromDomainToDto) as CompetitionScaleDto[]
          }
          initialPaginationOptions={
            PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
          }
        />
      </>
    );
  }
}
