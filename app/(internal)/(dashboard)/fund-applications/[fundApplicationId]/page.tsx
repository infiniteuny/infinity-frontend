import { cache } from 'react';
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
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

type Props = {
  params: Promise<{
    fundApplicationId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const fundApplicationId = (await params).fundApplicationId;

  const sessionResult = await cache(async () => await getSession.execute())();
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

    const fundApplicationResult = await cache(
      async () =>
        await getFundApplication.execute(fundApplicationId, [
          'team',
          'team.members',
          'competition_instance',
          'competition_scale',
        ]),
    )();
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
      !fundApplication.team?.members?.some((member) => member.id === session.user.id)
    ) {
      notFound();
    }

    return {
      title: fundApplication.competitionInstance?.name
        ? `${fundApplication.competitionInstance.shortname || fundApplication.competitionInstance.name} ${fundApplication.competitionBranch}`
        : 'Fund Application Details',
    };
  } else if (
    fundApplicationId === 'new' &&
    ['create-fund-application', 'create-own-fund-application'].some((p) => userPermissions.has(p))
  ) {
    return {
      title: 'Create Fund Application',
    };
  } else {
    notFound();
  }
}

export default async function SingleFundApplicationPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const fundApplicationId = (await params).fundApplicationId;

  const sessionResult = await cache(async () => await getSession.execute())();
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
    const fundApplicationResult = await cache(
      async () =>
        await getFundApplication.execute(fundApplicationId, [
          'team',
          'team.members',
          'competition_instance',
          'competition_scale',
        ]),
    )();
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
      !fundApplication.team?.members?.some((member) => member.id === session.user.id)
    ) {
      notFound();
    }

    const title = fundApplication.competitionInstance?.name
      ? `${fundApplication.competitionInstance.shortname || fundApplication.competitionInstance.name} ${fundApplication.competitionBranch}`
      : 'Fund Application Details';

    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Fund Applications', url: '/fund-applications' },
          { label: title, url: `/fund-applications/${fundApplication.id}` },
        ]}
      >
        <SectionHeader title={title} backUrl="/fund-applications">
          <FundApplicationToolbar
            fundApplication={
              FundApplicationMapper.fromDomainToDto(fundApplication) as FundApplicationDto
            }
          />
        </SectionHeader>
        <FundApplicationView
          initialFundApplication={
            FundApplicationMapper.fromDomainToDto(fundApplication) as FundApplicationDto
          }
        />
      </InternalMain>
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
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Fund Applications', url: '/fund-applications' },
          { label: 'Create Fund Application', url: `/fund-applications/new` },
        ]}
      >
        <FundApplicationForm
          competitionScales={
            competitionScales.map(CompetitionScaleMapper.fromDomainToDto) as CompetitionScaleDto[]
          }
        />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
