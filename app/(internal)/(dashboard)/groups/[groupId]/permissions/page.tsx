import { GetGroup, GetGroupPermissions, GetSession } from '@app/application';
import {
  GroupPermissionDto,
  GroupPermissionMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import {
  GroupPermissionsList,
  GroupPermissionsToolbar,
} from '@app/presentation/components/internal/group-permissions';
import { isLeft, match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{
    groupId: string;
  }>;
};

export default async function GroupPermissionsPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const getGroup = serverContainer.get<GetGroup>(SYMBOLS.GetGroup);
  const groupId = (await params).groupId;

  const [groupResult, sessionResult] = await Promise.all([
    getGroup.execute(groupId),
    getSession.execute(),
  ]);

  if (isLeft(groupResult)) {
    const error = groupResult.left;

    if (error instanceof NotFoundError) {
      notFound();
    } else {
      throw error;
    }
  }

  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (!['read-group-permission'].some((p) => userPermissions.has(p))) {
    notFound();
  } else {
    const getGroupPermissions = serverContainer.get<GetGroupPermissions>(
      SYMBOLS.GetGroupPermissions,
    );

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
}
