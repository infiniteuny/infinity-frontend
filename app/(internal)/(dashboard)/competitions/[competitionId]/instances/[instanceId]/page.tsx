import {
  GetCompetition,
  GetCompetitionInstance,
  GetCompetitionOrganizerTypes,
} from '@app/application';
import { match } from 'effect/Either';
import {
  CompetitionInstanceDto,
  CompetitionInstanceMapper,
  CompetitionOrganizerTypeDto,
  CompetitionOrganizerTypeMapper,
} from '@app/infrastructure/dtos';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import {
  CompetitionInstanceForm,
  CompetitionInstanceToolbar,
  CompetitionInstanceView,
} from '@app/presentation/components/internal/single-competition-instance';
import { NotFoundError } from '@app/domain/errors';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{
    competitionId: string;
    instanceId: string;
  }>;
};

export default async function SingleCompetitionInstancePage({ params }: Props) {
  const { competitionId, instanceId } = await params;

  if (instanceId !== 'new') {
    const getCompetitionInstance = serverContainer.get<GetCompetitionInstance>(
      SYMBOLS.GetCompetitionInstance,
    );
    const instanceResult = await getCompetitionInstance.execute(instanceId, [
      'competition',
      'organizer_type',
    ]);
    const competitionInstance = match(instanceResult, {
      onLeft: (error) => {
        if (error instanceof NotFoundError) {
          notFound();
        } else {
          throw error;
        }
      },
      onRight: (data) => data,
    });

    return (
      <>
        <SectionHeader title={competitionInstance.name}>
          <CompetitionInstanceToolbar
            competitionInstanceId={competitionInstance.id}
            competitionId={competitionInstance.competitionId}
          />
        </SectionHeader>
        <CompetitionInstanceView
          initialCompetitionInstance={
            CompetitionInstanceMapper.fromDomaintoDto(competitionInstance) as CompetitionInstanceDto
          }
        />
      </>
    );
  } else {
    const getCompetition = serverContainer.get<GetCompetition>(SYMBOLS.GetCompetition);
    const getCompetitionOrganizerTypes = serverContainer.get<GetCompetitionOrganizerTypes>(
      SYMBOLS.GetCompetitionOrganizerTypes,
    );

    const [competitionResult, organizerTypesResult] = await Promise.all([
      getCompetition.execute(competitionId),
      getCompetitionOrganizerTypes.execute(undefined, { perPage: 100 }),
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

    const [competitionOrganizerTypes] = match(organizerTypesResult, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });

    return (
      <CompetitionInstanceForm
        competitionId={competitionId}
        competitionName={competition.name}
        competitionOrganizerTypes={
          competitionOrganizerTypes.map(
            CompetitionOrganizerTypeMapper.fromDomaintoDto,
          ) as CompetitionOrganizerTypeDto[]
        }
      />
    );
  }
}
