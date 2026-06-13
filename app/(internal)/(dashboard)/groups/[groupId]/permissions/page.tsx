import { cache } from 'react';
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
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{
    groupId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const getGroup = serverContainer.get<GetGroup>(SYMBOLS.GetGroup);
  const groupId = (await params).groupId;

  const [groupResult, sessionResult] = await Promise.all([
    cache(async () => await getGroup.execute(groupId))(),
    cache(async () => await getSession.execute())(),
  ]);

  const group = match(groupResult, {
    onLeft: (error) => {
      if (error instanceof NotFoundError) {
        notFound();
      } else {
        throw error;
      }
    },
    onRight: (data) => data,
  });
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['read-group-permission'].some((p) => userPermissions.has(p))) {
    return {
      title: `${group.name}'s Permissions`,
    };
  } else {
    notFound();
  }
}

export default async function GroupPermissionsPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const getGroup = serverContainer.get<GetGroup>(SYMBOLS.GetGroup);
  const groupId = (await params).groupId;

  const [groupResult, sessionResult] = await Promise.all([
    cache(async () => await getGroup.execute(groupId))(),
    cache(async () => await getSession.execute())(),
  ]);

  const group = match(groupResult, {
    onLeft: (error) => {
      if (error instanceof NotFoundError) {
        notFound();
      } else {
        throw error;
      }
    },
    onRight: (data) => data,
  });
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['read-group-permission'].some((p) => userPermissions.has(p))) {
    const getGroupPermissions = serverContainer.get<GetGroupPermissions>(
      SYMBOLS.GetGroupPermissions,
    );

    const result = await getGroupPermissions.execute(groupId, undefined, undefined, {
      perPage: 25,
    });
    const [groupPermissions, paginationOptions] = match(result, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });

    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Groups', url: '/groups' },
          { label: group.name, url: `/groups/${groupId}` },
          { label: 'Permissions', url: `/groups/${groupId}/permissions` },
        ]}
      >
        <SectionHeader title={`${group.name}'s Permissions`} backUrl={`/groups/${groupId}`}>
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
      </InternalMain>
    );
  } else {
    notFound();
  }
}
