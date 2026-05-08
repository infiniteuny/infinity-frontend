import { GetCompetitionScales, GetFundApplication, GetSession } from '@app/application';
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
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await getSession.execute();

  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (
    ['update-fund-application', 'update-own-fund-application'].some((p) => userPermissions.has(p))
  ) {
    const getFundApplication = serverContainer.get<GetFundApplication>(SYMBOLS.GetFundApplication);
    const getCompetitionScales = serverContainer.get<GetCompetitionScales>(
      SYMBOLS.GetCompetitionScales,
    );
    const fundApplicationId = (await params).fundApplicationId;

    const fundApplicationResult = await getFundApplication.execute(fundApplicationId, [
      'team',
      'competition_instance',
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

    if (
      !['update-fund-application'].some((p) => userPermissions.has(p)) &&
      !fundApplication.team?.members?.some((member) => member.id === session.user.id)
    ) {
      notFound();
    }

    const competitionScalesResult = await getCompetitionScales.execute(undefined, {
      perPage: 100,
    });
    const [competitionScales] = match(competitionScalesResult, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });

    return (
      <FundApplicationForm
        competitionScales={
          competitionScales.map(CompetitionScaleMapper.fromDomainToDto) as CompetitionScaleDto[]
        }
        initialFundApplication={
          FundApplicationMapper.fromDomainToDto(fundApplication) as FundApplicationDto
        }
      />
    );
  } else {
    notFound();
  }
}
