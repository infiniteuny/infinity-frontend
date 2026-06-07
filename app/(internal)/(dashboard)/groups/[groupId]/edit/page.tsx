import { cache } from 'react';
import { GetGroup, GetSession } from '@app/application';
import { GroupDto, GroupMapper } from '@app/infrastructure/dtos';
import { GroupForm } from '@app/presentation/components/internal/single-group';
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
  const groupId = (await params).groupId;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-group'].some((p) => userPermissions.has(p))) {
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
      title: `Edit ${group.name}`,
    };
  } else {
    notFound();
  }
}

export default async function SingleGroupEditPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-group'].some((p) => userPermissions.has(p))) {
    const getGroup = serverContainer.get<GetGroup>(SYMBOLS.GetGroup);
    const groupId = (await params).groupId;

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
          { label: 'Edit', url: `/groups/${group.id}/edit` },
        ]}
      >
        <GroupForm initialGroup={GroupMapper.fromDomainToDto(group) as GroupDto} />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
