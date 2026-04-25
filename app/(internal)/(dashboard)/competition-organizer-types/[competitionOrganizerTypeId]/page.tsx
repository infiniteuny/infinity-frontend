import { GetCompetitionOrganizerType } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import {
  CompetitionOrganizerTypeDto,
  CompetitionOrganizerTypeMapper,
} from '@app/infrastructure/dtos';
import {
  CompetitionOrganizerTypeForm,
  CompetitionOrganizerTypeToolbar,
  CompetitionOrganizerTypeView,
} from '@app/presentation/components/internal/single-competition-organizer-type';

type Props = {
  params: Promise<{
    competitionOrganizerTypeId: string;
  }>;
};

export default async function SingleCompetitionOrganizerTypePage({ params }: Props) {
  const competitionOrganizerTypeId = (await params).competitionOrganizerTypeId;

  if (competitionOrganizerTypeId !== 'new') {
    const getCompetitionOrganizerType = serverContainer.get<GetCompetitionOrganizerType>(
      SYMBOLS.GetCompetitionOrganizerType,
    );
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
      <>
        <SectionHeader title={competitionOrganizerType.name}>
          <CompetitionOrganizerTypeToolbar
            competitionOrganizerTypeId={competitionOrganizerType.id}
          />
        </SectionHeader>
        <CompetitionOrganizerTypeView
          initialCompetitionOrganizerType={
            CompetitionOrganizerTypeMapper.fromDomaintoDto(
              competitionOrganizerType,
            ) as CompetitionOrganizerTypeDto
          }
        />
      </>
    );
  } else {
    return <CompetitionOrganizerTypeForm />;
  }
}
