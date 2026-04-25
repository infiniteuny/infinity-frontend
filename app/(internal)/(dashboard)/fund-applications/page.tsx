import { GetFundApplications } from '@app/application';
import { match } from 'effect/Either';
import {
  FundApplicationDto,
  FundApplicationMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import {
  FundApplicationsList,
  FundApplicationsToolbar,
} from '@app/presentation/components/internal/fund-applications';

export const dynamic = 'force-dynamic';

export default async function FundApplicationsPage() {
  const getFundApplications = serverContainer.get<GetFundApplications>(SYMBOLS.GetFundApplications);
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
          fundApplications.map(FundApplicationMapper.fromDomaintoDto) as FundApplicationDto[]
        }
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomaintoDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </>
  );
}
