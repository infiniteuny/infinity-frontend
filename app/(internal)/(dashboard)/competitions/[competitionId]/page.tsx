import { GetCompetition } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { CompetitionDto, CompetitionMapper } from '@app/infrastructure/dtos';
import {
  CompetitionForm,
  CompetitionToolbar,
  CompetitionView,
} from '@app/presentation/components/internal/single-competition';

type Props = {
  params: Promise<{
    competitionId: string;
  }>;
};

export default async function SingleCompetitionPage({ params }: Props) {
  const competitionId = (await params).competitionId;

  if (competitionId !== 'new') {
    const getCompetition = serverContainer.get<GetCompetition>(SYMBOLS.GetCompetition);
    const competitionResult = await getCompetition.execute(competitionId);
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

    return (
      <>
        <SectionHeader title={competition.name}>
          <CompetitionToolbar competitionId={competition.id} />
        </SectionHeader>
        <CompetitionView
          initialCompetition={CompetitionMapper.fromDomaintoDto(competition) as CompetitionDto}
        />
      </>
    );
  } else {
    return <CompetitionForm />;
  }
}
