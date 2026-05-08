import {
  FundApplicationDto,
  FundApplicationMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import {
  FundApplicationsList,
  FundApplicationsToolbar,
} from '@app/presentation/components/internal/fund-applications';
import { GetFundApplications, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

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

  if (!['read-fund-application', 'read-own-fund-application'].some((p) => userPermissions.has(p))) {
    notFound();
  } else {
    const getFundApplications = serverContainer.get<GetFundApplications>(
      SYMBOLS.GetFundApplications,
    );

    const result = await getFundApplications.execute(
      ['team', 'competition_instance', 'competition_scale'],
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
      <>
        <SectionHeader title="Fund Applications">
          <FundApplicationsToolbar />
        </SectionHeader>
        <FundApplicationsList
          initialFundApplications={
            fundApplications.map(FundApplicationMapper.fromDomainToDto) as FundApplicationDto[]
          }
          initialPaginationOptions={
            PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
          }
        />
      </>
    );
  }
}
