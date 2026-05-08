import {
  CompetitionInstanceDto,
  CompetitionInstanceMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import {
  CompetitionInstancesList,
  CompetitionInstancesToolbar,
} from '@app/presentation/components/internal/competition-instances';
import { GetCompetition, GetCompetitionInstances, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

type Props = {
  params: Promise<{
    competitionId: string;
  }>;
};

export const dynamic = 'force-dynamic';

export default async function CompetitionInstancesPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const getCompetition = serverContainer.get<GetCompetition>(SYMBOLS.GetCompetition);
  const competitionId = (await params).competitionId;

  const [competitionResult, sessionResult] = await Promise.all([
    getCompetition.execute(competitionId),
    getSession.execute(),
  ]);

  const competition = match(competitionResult, {
    onLeft: (error) => {
      if (error instanceof NotFoundError) {
        notFound();
      } else {
        throw error;
      }
    },
    onRight: (competition) => competition,
  });
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (!['read-competition'].some((p) => userPermissions.has(p))) {
    notFound();
  } else {
    const getCompetitionInstances = serverContainer.get<GetCompetitionInstances>(
      SYMBOLS.GetCompetitionInstances,
    );

    const result = await getCompetitionInstances.execute(
      ['competition'],
      { competitionId },
      { perPage: 25 },
    );
    const [competitionInstances, paginationOptions] = match(result, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });

    return (
      <>
        <SectionHeader title={`${competition.name} Instances`}>
          <CompetitionInstancesToolbar competitionId={competitionId} />
        </SectionHeader>
        <CompetitionInstancesList
          initialCompetitionInstances={
            competitionInstances.map(
              CompetitionInstanceMapper.fromDomainToDto,
            ) as CompetitionInstanceDto[]
          }
          initialPaginationOptions={
            PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
          }
          competitionId={competitionId}
        />
      </>
    );
  }
}
