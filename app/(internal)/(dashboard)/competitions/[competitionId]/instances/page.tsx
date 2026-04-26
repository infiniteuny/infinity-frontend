import { GetCompetition, GetCompetitionInstances } from '@app/application';
import { match } from 'effect/Either';
import {
  CompetitionInstanceDto,
  CompetitionInstanceMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import {
  CompetitionInstancesList,
  CompetitionInstancesToolbar,
} from '@app/presentation/components/internal/competition-instances';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';

type Props = {
  params: Promise<{
    competitionId: string;
  }>;
};

export const dynamic = 'force-dynamic';

export default async function CompetitionInstancesPage({ params }: Props) {
  const competitionId = (await params).competitionId;

  const getCompetition = serverContainer.get<GetCompetition>(SYMBOLS.GetCompetition);
  const getCompetitionInstances = serverContainer.get<GetCompetitionInstances>(
    SYMBOLS.GetCompetitionInstances,
  );

  const [competitionResult, instancesResult] = await Promise.all([
    getCompetition.execute(competitionId),
    getCompetitionInstances.execute(['competition'], { competitionId }, { perPage: 25 }),
  ]);

  const competition = match(competitionResult, {
    onLeft: (error) => {
      if (error instanceof NotFoundError) {
        notFound();
      } else {
        throw error;
      }
    },
    onRight: (data) => data,
  });

  const [competitionInstances, paginationOptions] = match(instancesResult, {
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
            CompetitionInstanceMapper.fromDomaintoDto,
          ) as CompetitionInstanceDto[]
        }
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomaintoDto(paginationOptions) as PaginationOptionsDto
        }
        competitionId={competitionId}
      />
    </>
  );
}
