import {
  CommunityGroupsList,
  CommunityGroupsToolbar,
} from '@app/presentation/components/internal/community-groups';
import {
  CommunityGroupDto,
  CommunityGroupMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { GetCommunityGroups } from '@app/application';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Community Groups',
};

export default async function CommunityGroupsPage() {
  const getCommunityGroups = serverContainer.get<GetCommunityGroups>(SYMBOLS.GetCommunityGroups);

  const result = await getCommunityGroups.execute(undefined, undefined, { perPage: 25 });
  const [communityGroups, paginationOptions] = match(result, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });

  return (
    <InternalMain
      breadcrumbs={[
        { label: 'Overview', url: '/' },
        { label: 'Settings', url: '/settings' },
        { label: 'Community Groups', url: '/community-groups' },
      ]}
    >
      <SectionHeader title="Community Groups" backUrl="/settings">
        <CommunityGroupsToolbar />
      </SectionHeader>
      <CommunityGroupsList
        initialCommunityGroups={
          communityGroups.map(CommunityGroupMapper.fromDomainToDto) as CommunityGroupDto[]
        }
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </InternalMain>
  );
}
