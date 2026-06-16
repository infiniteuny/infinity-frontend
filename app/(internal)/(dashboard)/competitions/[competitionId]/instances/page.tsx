import { cache } from 'react';
import {
  CompetitionDto,
  CompetitionInstanceDto,
  CompetitionInstanceMapper,
  CompetitionMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { CompetitionInstancesList } from '@app/presentation/components/internal/competition-instances';
import { GetCompetition, GetCompetitionInstances } from '@app/application';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{
    competitionId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getCompetition = serverContainer.get<GetCompetition>(SYMBOLS.GetCompetition);
  const competitionId = (await params).competitionId;

  const competitionResult = await cache(async () => await getCompetition.execute(competitionId))();
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

  return {
    title: `${competition.shortname || competition.name}'s Instances`,
  };
}

export default async function CompetitionInstancesPage({ params }: Props) {
  const getCompetition = serverContainer.get<GetCompetition>(SYMBOLS.GetCompetition);
  const getCompetitionInstances = serverContainer.get<GetCompetitionInstances>(
    SYMBOLS.GetCompetitionInstances,
  );
  const competitionId = (await params).competitionId;

  const [competitionResult, competitionInstancesResult] = await Promise.all([
    cache(async () => await getCompetition.execute(competitionId))(),
    getCompetitionInstances.execute(
      ['competition', 'organizer_type'],
      { competitionId },
      undefined,
      { perPage: 25 },
    ),
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
    <InternalMain
      breadcrumbs={[
        { label: 'Overview', url: '/' },
        { label: 'Competitions', url: '/competitions' },
        { label: competition.name, url: `/competitions/${competitionId}` },
        { label: 'Instances', url: `/competitions/${competitionId}/instances` },
      ]}
    >
      <CompetitionInstancesList
        initialCompetitionInstances={
          competitionInstances.map(
            CompetitionInstanceMapper.fromDomainToDto,
          ) as CompetitionInstanceDto[]
        }
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
        }
        competition={CompetitionMapper.fromDomainToDto(competition) as CompetitionDto}
      />
    </InternalMain>
  );
}
