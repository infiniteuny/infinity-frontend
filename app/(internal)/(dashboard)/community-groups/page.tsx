import {
  CommunityGroupsList,
  CommunityGroupsToolbar,
} from '@app/presentation/components/internal/community-groups';
import { GetCommunityGroups } from '@app/application';
import {
  CommunityGroupDto,
  CommunityGroupMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { match } from 'effect/Either';

export const dynamic = 'force-dynamic';

export default async function CommunityGroupsPage() {
  const getCommunityGroups = serverContainer.get<GetCommunityGroups>(SYMBOLS.GetCommunityGroups);
  const result = await getCommunityGroups.execute(undefined, { perPage: 25 });
  const [communityGroups, paginationOptions] = match(result, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });

  return (
    <>
      <SectionHeader title="Community Groups">
        <CommunityGroupsToolbar />
      </SectionHeader>
      <CommunityGroupsList
        initialCommunityGroups={
          communityGroups.map(CommunityGroupMapper.fromDomaintoDto) as CommunityGroupDto[]
        }
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomaintoDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </>
  );
}
