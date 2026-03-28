import {
  CompetitionScaleDto,
  CompetitionScaleMapper,
  FundApplicationDto,
  FundApplicationMapper,
} from '@app/infrastructure/dtos';
import {
  FundApplicationForm,
  FundApplicationToolbar,
  FundApplicationView,
} from '@app/presentation/components/internal/single-fund-application';
import { GetCompetitionScales, GetFundApplication } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

type Props = {
  params: Promise<{
    fundApplicationId: string;
  }>;
};

export default async function SingleFundApplicationPage({ params }: Props) {
  const getCompetitionScales = serverContainer.get<GetCompetitionScales>(
    SYMBOLS.GetCompetitionScales,
  );
  const competitionScalesResult = await getCompetitionScales.execute(undefined, { perPage: 100 });
  const [competitionScales] = match(competitionScalesResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });

  const fundApplicationId = (await params).fundApplicationId;

  if (fundApplicationId !== 'new') {
    const getFundApplication = serverContainer.get<GetFundApplication>(SYMBOLS.GetFundApplication);
    const fundApplicationResult = await getFundApplication.execute(fundApplicationId, [
      'team',
      'competition',
      'competition_scale',
    ]);
    const fundApplication = match(fundApplicationResult, {
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
        <SectionHeader
          title={fundApplication.competition?.name ?? fundApplication.competitionBranch}
        >
          <FundApplicationToolbar fundApplicationId={fundApplication.id} />
        </SectionHeader>
        <FundApplicationView
          initialFundApplication={
            FundApplicationMapper.fromDomaintoDto(fundApplication) as FundApplicationDto
          }
        />
      </>
    );
  } else {
    return (
      <FundApplicationForm
        competitionScales={
          competitionScales.map(CompetitionScaleMapper.fromDomaintoDto) as CompetitionScaleDto[]
        }
      />
    );
  }
}
