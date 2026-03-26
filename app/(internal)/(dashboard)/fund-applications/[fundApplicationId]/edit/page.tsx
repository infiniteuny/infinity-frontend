import { GetCompetitionScales, GetFundApplication } from '@app/application';
import { match } from 'effect/Either';
import {
  CompetitionScaleDto,
  CompetitionScaleMapper,
  FundApplicationDto,
  FundApplicationMapper,
} from '@app/infrastructure/dtos';
import { FundApplicationForm } from '@app/presentation/components/internal/single-fund-application';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { NotFoundError } from '@app/domain/errors';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{
    fundApplicationId: string;
  }>;
};

export default async function SingleFundApplicationEditPage({ params }: Props) {
  const getFundApplication = serverContainer.get<GetFundApplication>(SYMBOLS.GetFundApplication);
  const getCompetitionScales = serverContainer.get<GetCompetitionScales>(
    SYMBOLS.GetCompetitionScales,
  );
  const fundApplicationId = (await params).fundApplicationId;

  const [competitionScalesResult, fundApplicationResult] = await Promise.all([
    getCompetitionScales.execute(undefined, { perPage: 100 }),
    getFundApplication.execute(fundApplicationId),
  ]);

  const [competitionScales] = match(competitionScalesResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });
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
    <FundApplicationForm
      competitionScales={
        competitionScales.map(CompetitionScaleMapper.fromDomaintoDto) as CompetitionScaleDto[]
      }
      initialFundApplication={
        FundApplicationMapper.fromDomaintoDto(fundApplication) as FundApplicationDto
      }
    />
  );
}
