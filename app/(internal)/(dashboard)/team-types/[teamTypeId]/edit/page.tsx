import { GetCompetitionTeamType } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { CompetitionTeamTypeDto, CompetitionTeamTypeMapper } from '@app/infrastructure/dtos';
import { CompetitionTeamTypeForm } from '@app/presentation/components/internal/single-competition-team-type';

type Props = {
  params: Promise<{
    teamTypeId: string;
  }>;
};

export default async function SingleCompetitionTeamTypeEditPage({ params }: Props) {
  const getCompetitionTeamType = serverContainer.get<GetCompetitionTeamType>(
    SYMBOLS.GetCompetitionTeamType,
  );
  const teamTypeId = (await params).teamTypeId;

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
    <CompetitionTeamTypeForm
      initialCompetitionTeamType={
        CompetitionTeamTypeMapper.fromDomaintoDto(competitionTeamType) as CompetitionTeamTypeDto
      }
    />
  );
}
