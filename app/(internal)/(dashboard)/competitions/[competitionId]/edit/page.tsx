import { GetCompetition, GetSession } from '@app/application';
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
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await getSession.execute();

  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-competition'].some((p) => userPermissions.has(p))) {
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
        initialCompetition={CompetitionMapper.fromDomainToDto(competition) as CompetitionDto}
      />
    );
  } else {
    notFound();
  }
}
