import { GetCompetitionOutput, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { CompetitionOutputDto, CompetitionOutputMapper } from '@app/infrastructure/dtos';
import { CompetitionOutputForm } from '@app/presentation/components/internal/single-competition-output';

type Props = {
  params: Promise<{
    competitionOutputId: string;
  }>;
};

export default async function SingleCompetitionOutputEditPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await getSession.execute();

  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-competition-output'].some((p) => userPermissions.has(p))) {
    const getCompetitionOutput = serverContainer.get<GetCompetitionOutput>(
      SYMBOLS.GetCompetitionOutput,
    );
    const competitionOutputId = (await params).competitionOutputId;

    const competitionOutputResult = await getCompetitionOutput.execute(competitionOutputId);
    const competitionOutput = match(competitionOutputResult, {
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
      <CompetitionOutputForm
        initialCompetitionOutput={
          CompetitionOutputMapper.fromDomainToDto(competitionOutput) as CompetitionOutputDto
        }
      />
    );
  } else {
    notFound();
  }
}
