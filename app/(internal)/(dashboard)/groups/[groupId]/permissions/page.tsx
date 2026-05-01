import { GetGroupPermissions } from '@app/application';
import { match } from 'effect/Either';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  GroupPermissionDto,
  GroupPermissionMapper,
} from '@app/infrastructure/dtos';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import {
  GroupPermissionsList,
  GroupPermissionsToolbar,
} from '@app/presentation/components/internal/group-permissions';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{
    groupId: string;
  }>;
};

export default async function GroupPermissionsPage({ params }: Props) {
  const getGroupPermissions = serverContainer.get<GetGroupPermissions>(SYMBOLS.GetGroupPermissions);
  const groupId = (await params).groupId;
  const result = await getGroupPermissions.execute(groupId, undefined, { perPage: 25 });
  const [groupPermissions, paginationOptions] = match(result, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });

  return (
    <>
      <SectionHeader title="Group Permissions">
        <GroupPermissionsToolbar groupId={groupId} />
      </SectionHeader>
      <GroupPermissionsList
        groupId={groupId}
        initialGroupPermissions={
          groupPermissions.map(GroupPermissionMapper.fromDomainToDto) as GroupPermissionDto[]
        }
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </>
  );
}
