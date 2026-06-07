import { cache } from 'react';
import { GetGroup, GetSession } from '@app/application';
import { GroupDto, GroupMapper } from '@app/infrastructure/dtos';
import { GroupPermissionForm } from '@app/presentation/components/internal/single-group-permission';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

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

  if (['create-group-permission'].some((p) => userPermissions.has(p))) {
    return {
      title: `Add ${group.name}'s Permissions`,
    };
  } else {
    notFound();
  }
}

export default async function SingleGroupPermissionNewPage({ params }: Props) {
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

  if (['create-group-permission'].some((p) => userPermissions.has(p))) {
    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Groups', url: '/groups' },
          { label: group.name, url: `/groups/${groupId}` },
          { label: 'Permissions', url: `/groups/${groupId}/permissions` },
          { label: 'Add', url: `/groups/${groupId}/permissions/new` },
        ]}
      >
        <GroupPermissionForm group={GroupMapper.fromDomainToDto(group) as GroupDto} />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
