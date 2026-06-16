import {
  FundApplicationDto,
  FundApplicationMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { FundApplicationsList } from '@app/presentation/components/internal/fund-applications';
import { GetFundApplications, GetSession } from '@app/application';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Fund Applications',
};

export default async function FundApplicationsPage() {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['read-fund-application', 'read-own-fund-application'].some((p) => userPermissions.has(p))) {
    const getFundApplications = serverContainer.get<GetFundApplications>(
      SYMBOLS.GetFundApplications,
    );

    const result = await getFundApplications.execute(
      ['team', 'team.members', 'competition_instance', 'competition_scale'],
      undefined,
      undefined,
      { perPage: 25 },
    );
    const [fundApplications, paginationOptions] = match(result, {
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
        ]}
      >
        <FundApplicationsList
          initialFundApplications={
            fundApplications.map(FundApplicationMapper.fromDomainToDto) as FundApplicationDto[]
          }
          initialPaginationOptions={
            PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
          }
        />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
