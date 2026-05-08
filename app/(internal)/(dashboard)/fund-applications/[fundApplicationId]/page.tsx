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
import { GetCompetitionScales, GetFundApplication, GetSession } from '@app/application';
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
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const fundApplicationId = (await params).fundApplicationId;

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (
    fundApplicationId !== 'new' &&
    ['read-fund-application', 'read-own-fund-application'].some((p) => userPermissions.has(p))
  ) {
    const getFundApplication = serverContainer.get<GetFundApplication>(SYMBOLS.GetFundApplication);
    const fundApplicationResult = await getFundApplication.execute(fundApplicationId, [
      'team',
      'competition_instance',
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

    if (
      !['read-fund-application'].some((p) => userPermissions.has(p)) &&
      !fundApplication.team?.members?.some((m) => m.id === session.user.id)
    ) {
      notFound();
    }

    return (
      <>
        <SectionHeader
          title={fundApplication.competitionInstance?.name ?? fundApplication.competitionBranch}
        >
          <FundApplicationToolbar fundApplicationId={fundApplication.id} />
        </SectionHeader>
        <FundApplicationView
          initialFundApplication={
            FundApplicationMapper.fromDomainToDto(fundApplication) as FundApplicationDto
          }
        />
      </>
    );
  } else if (
    fundApplicationId === 'new' &&
    ['create-fund-application', 'create-own-fund-application'].some((p) => userPermissions.has(p))
  ) {
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

    return (
      <FundApplicationForm
        competitionScales={
          competitionScales.map(CompetitionScaleMapper.fromDomainToDto) as CompetitionScaleDto[]
        }
      />
    );
  } else {
    notFound();
  }
}
