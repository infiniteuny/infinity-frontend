import {
  CommunityGroupAdminDto,
  CommunityGroupAdminMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import {
  CommunityGroupAdminsList,
  CommunityGroupAdminsToolbar,
} from '@app/presentation/components/internal/community-group-admins';
import { GetCommunityGroupAdmins } from '@app/application';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Community Group Administrators',
};

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
    <InternalMain
      breadcrumbs={[
        { label: 'Overview', url: '/' },
        { label: 'Community Group Administrators', url: '/community-group-admins' },
      ]}
    >
      <SectionHeader title="Community Group Administrators">
        <CommunityGroupAdminsToolbar />
      </SectionHeader>
      <CommunityGroupAdminsList
        initialCommunityGroupAdmins={
          communityGroupAdmins.map(
            CommunityGroupAdminMapper.fromDomainToDto,
          ) as CommunityGroupAdminDto[]
        }
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </InternalMain>
  );
}
