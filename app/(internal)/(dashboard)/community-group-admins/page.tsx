import { GetCommunityGroupAdmins } from '@app/application';
import { match } from 'effect/Either';
import {
  CommunityGroupAdminDto,
  CommunityGroupAdminMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import {
  CommunityGroupAdminsList,
  CommunityGroupAdminsToolbar,
} from '@app/presentation/components/internal/community-group-admins';

export const dynamic = 'force-dynamic';

export default async function CommunityGroupAdminsPage() {
  const getCommunityGroupAdmins = serverContainer.get<GetCommunityGroupAdmins>(
    SYMBOLS.GetCommunityGroupAdmins,
  );
  const result = await getCommunityGroupAdmins.execute(undefined, { perPage: 25 });
  const [communityGroupAdmins, paginationOptions] = match(result, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });

  return (
    <>
      <SectionHeader title="Community Group Administrators">
        <CommunityGroupAdminsToolbar />
      </SectionHeader>
      <CommunityGroupAdminsList
        initialCommunityGroupAdmins={
          communityGroupAdmins.map(
            CommunityGroupAdminMapper.fromDomaintoDto,
          ) as CommunityGroupAdminDto[]
        }
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomaintoDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </>
  );
}
