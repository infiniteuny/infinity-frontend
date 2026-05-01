import { GetCompetitionOrganizerType } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import {
  CompetitionOrganizerTypeDto,
  CompetitionOrganizerTypeMapper,
} from '@app/infrastructure/dtos';
import { CompetitionOrganizerTypeForm } from '@app/presentation/components/internal/single-competition-organizer-type';

type Props = {
  params: Promise<{
    competitionOrganizerTypeId: string;
  }>;
};

export default async function SingleCompetitionOrganizerTypeEditPage({ params }: Props) {
  const getCompetitionOrganizerType = serverContainer.get<GetCompetitionOrganizerType>(
    SYMBOLS.GetCompetitionOrganizerType,
  );
  const competitionOrganizerTypeId = (await params).competitionOrganizerTypeId;

  const competitionOrganizerTypeResult = await getCompetitionOrganizerType.execute(
    competitionOrganizerTypeId,
  );
  const competitionOrganizerType = match(competitionOrganizerTypeResult, {
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
    <CompetitionOrganizerTypeForm
      initialCompetitionOrganizerType={
        CompetitionOrganizerTypeMapper.fromDomainToDto(
          competitionOrganizerType,
        ) as CompetitionOrganizerTypeDto
      }
    />
  );
}
