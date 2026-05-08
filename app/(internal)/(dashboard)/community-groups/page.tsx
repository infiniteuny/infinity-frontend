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
import { GetCommunityGroups, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

export default async function CommunityGroupsPage() {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (!['read-community-group'].some((p) => userPermissions.has(p))) {
    notFound();
  } else {
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
            communityGroups.map(CommunityGroupMapper.fromDomainToDto) as CommunityGroupDto[]
          }
          initialPaginationOptions={
            PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
          }
        />
      </>
    );
  }
}
