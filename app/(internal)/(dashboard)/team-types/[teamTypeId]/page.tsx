import { GetCompetitionTeamType } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { CompetitionTeamTypeDto, CompetitionTeamTypeMapper } from '@app/infrastructure/dtos';
import {
  CompetitionTeamTypeForm,
  CompetitionTeamTypeToolbar,
  CompetitionTeamTypeView,
} from '@app/presentation/components/internal/single-competition-team-type';

type Props = {
  params: Promise<{
    teamTypeId: string;
  }>;
};

export default async function SingleCompetitionTeamTypePage({ params }: Props) {
  const teamTypeId = (await params).teamTypeId;

  if (teamTypeId !== 'new') {
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
  } else {
    return <CompetitionTeamTypeForm />;
  }
}
