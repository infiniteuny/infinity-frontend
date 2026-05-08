import { GetCompetitionScale, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { CompetitionScaleDto, CompetitionScaleMapper } from '@app/infrastructure/dtos';
import { CompetitionScaleForm } from '@app/presentation/components/internal/single-competition-scale';

type Props = {
  params: Promise<{
    competitionScaleId: string;
  }>;
};

export default async function SingleCompetitionScaleEditPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await getSession.execute();

  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-competition-scale'].some((p) => userPermissions.has(p))) {
    const getCompetitionScale = serverContainer.get<GetCompetitionScale>(
      SYMBOLS.GetCompetitionScale,
    );
    const competitionScaleId = (await params).competitionScaleId;

    const competitionScaleResult = await getCompetitionScale.execute(competitionScaleId);
    const competitionScale = match(competitionScaleResult, {
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
      <CompetitionScaleForm
        initialCompetitionScale={
          CompetitionScaleMapper.fromDomainToDto(competitionScale) as CompetitionScaleDto
        }
      />
    );
  } else {
    notFound();
  }
}
