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
import { GetCompetition, GetCompetitionInstances } from '@app/application';
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
  const getCompetition = serverContainer.get<GetCompetition>(SYMBOLS.GetCompetition);
  const getCompetitionInstances = serverContainer.get<GetCompetitionInstances>(
    SYMBOLS.GetCompetitionInstances,
  );
  const competitionId = (await params).competitionId;

  const [competitionResult, competitionInstancesResult] = await Promise.all([
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
    onRight: (competition) => competition,
  });

  const [competitionInstances, paginationOptions] = match(competitionInstancesResult, {
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
