import { GetCompetition } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { CompetitionDto, CompetitionMapper } from '@app/infrastructure/dtos';
import { CompetitionForm } from '@app/presentation/components/internal/single-competition';

type Props = {
  params: Promise<{
    competitionId: string;
  }>;
};

export default async function SingleCompetitionEditPage({ params }: Props) {
  const getCompetition = serverContainer.get<GetCompetition>(SYMBOLS.GetCompetition);
  const competitionId = (await params).competitionId;

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
    <CompetitionForm
      initialCompetition={CompetitionMapper.fromDomaintoDto(competition) as CompetitionDto}
    />
  );
}
