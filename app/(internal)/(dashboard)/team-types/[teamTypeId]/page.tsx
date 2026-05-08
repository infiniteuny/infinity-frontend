import { CompetitionTeamTypeDto, CompetitionTeamTypeMapper } from '@app/infrastructure/dtos';
import {
  CompetitionTeamTypeForm,
  CompetitionTeamTypeToolbar,
  CompetitionTeamTypeView,
} from '@app/presentation/components/internal/single-competition-team-type';
import { GetCompetitionTeamType, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

type Props = {
  params: Promise<{
    teamTypeId: string;
  }>;
};

export default async function SingleCompetitionTeamTypePage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const teamTypeId = (await params).teamTypeId;

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (teamTypeId !== 'new' && ['read-competition-team-type'].some((p) => userPermissions.has(p))) {
    const getCompetitionTeamType = serverContainer.get<GetCompetitionTeamType>(
      SYMBOLS.GetCompetitionTeamType,
    );
    const competitionTeamTypeResult = await getCompetitionTeamType.execute(teamTypeId);
    const competitionTeamType = match(competitionTeamTypeResult, {
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
        <SectionHeader title={competitionTeamType.name}>
          <CompetitionTeamTypeToolbar competitionTeamTypeId={competitionTeamType.id} />
        </SectionHeader>
        <CompetitionTeamTypeView
          initialCompetitionTeamType={
            CompetitionTeamTypeMapper.fromDomainToDto(competitionTeamType) as CompetitionTeamTypeDto
          }
        />
      </>
    );
  } else if (
    teamTypeId === 'new' &&
    ['create-competition-team-type'].some((p) => userPermissions.has(p))
  ) {
    return <CompetitionTeamTypeForm />;
  } else {
    notFound();
  }
}
