import { GetCompetitionScale, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { CompetitionScaleDto, CompetitionScaleMapper } from '@app/infrastructure/dtos';
import {
  CompetitionScaleForm,
  CompetitionScaleToolbar,
  CompetitionScaleView,
} from '@app/presentation/components/internal/single-competition-scale';

type Props = {
  params: Promise<{
    competitionScaleId: string;
  }>;
};

export default async function SingleCompetitionScalePage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const competitionScaleId = (await params).competitionScaleId;

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (
    competitionScaleId !== 'new' &&
    ['read-competition-scale'].some((p) => userPermissions.has(p))
  ) {
    const getCompetitionScale = serverContainer.get<GetCompetitionScale>(
      SYMBOLS.GetCompetitionScale,
    );
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
      <>
        <SectionHeader title={competitionScale.name}>
          <CompetitionScaleToolbar competitionScaleId={competitionScale.id} />
        </SectionHeader>
        <CompetitionScaleView
          initialCompetitionScale={
            CompetitionScaleMapper.fromDomainToDto(competitionScale) as CompetitionScaleDto
          }
        />
      </>
    );
  } else if (
    competitionScaleId === 'new' &&
    ['create-competition-scale'].some((p) => userPermissions.has(p))
  ) {
    return <CompetitionScaleForm />;
  } else {
    notFound();
  }
}
