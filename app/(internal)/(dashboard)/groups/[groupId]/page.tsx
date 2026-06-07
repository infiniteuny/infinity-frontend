import { cache } from 'react';
import { GetGroup, GetSession } from '@app/application';
import { GroupDto, GroupMapper } from '@app/infrastructure/dtos';
import {
  GroupForm,
  GroupToolbar,
  GroupView,
} from '@app/presentation/components/internal/single-group';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
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
  const groupId = (await params).groupId;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (groupId !== 'new' && ['read-group'].some((p) => userPermissions.has(p))) {
    const getGroup = serverContainer.get<GetGroup>(SYMBOLS.GetGroup);

    const groupResult = await cache(async () => await getGroup.execute(groupId))();
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

    return {
      title: group.name,
    };
  } else if (groupId === 'new' && ['create-group'].some((p) => userPermissions.has(p))) {
    return {
      title: 'Create Group',
    };
  } else {
    notFound();
  }
}

export default async function SingleGroupPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const groupId = (await params).groupId;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (groupId !== 'new' && ['read-group'].some((p) => userPermissions.has(p))) {
    const getGroup = serverContainer.get<GetGroup>(SYMBOLS.GetGroup);

    const groupResult = await cache(async () => await getGroup.execute(groupId))();
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

    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Groups', url: '/groups' },
          { label: group.name, url: `/groups/${group.id}` },
        ]}
      >
        <SectionHeader title={group.name} backUrl="/groups">
          <GroupToolbar groupId={group.id} />
        </SectionHeader>
        <GroupView initialGroup={GroupMapper.fromDomainToDto(group) as GroupDto} />
      </InternalMain>
    );
  } else if (groupId === 'new' && ['create-group'].some((p) => userPermissions.has(p))) {
    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Groups', url: '/groups' },
          { label: 'Create Group', url: `/groups/new` },
        ]}
      >
        <GroupForm />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
