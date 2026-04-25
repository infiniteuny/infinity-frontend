import { GetCompetitionOutput } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { CompetitionOutputDto, CompetitionOutputMapper } from '@app/infrastructure/dtos';
import {
  CompetitionOutputForm,
  CompetitionOutputToolbar,
  CompetitionOutputView,
} from '@app/presentation/components/internal/single-competition-output';

type Props = {
  params: Promise<{
    competitionOutputId: string;
  }>;
};

export default async function SingleCompetitionOutputPage({ params }: Props) {
  const competitionOutputId = (await params).competitionOutputId;

  if (competitionOutputId !== 'new') {
    const getCompetitionOutput = serverContainer.get<GetCompetitionOutput>(
      SYMBOLS.GetCompetitionOutput,
    );
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
      <>
        <SectionHeader title={competitionOutput.name}>
          <CompetitionOutputToolbar competitionOutputId={competitionOutput.id} />
        </SectionHeader>
        <CompetitionOutputView
          initialCompetitionOutput={
            CompetitionOutputMapper.fromDomaintoDto(competitionOutput) as CompetitionOutputDto
          }
        />
      </>
    );
  } else {
    return <CompetitionOutputForm />;
  }
}
