import { cache } from 'react';
import { GetCommunityGroup, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { CommunityGroupDto, CommunityGroupMapper } from '@app/infrastructure/dtos';
import { CommunityGroupForm } from '@app/presentation/components/internal/single-community-group';

type Props = {
  params: Promise<{
    communityGroupId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const communityGroupId = (await params).communityGroupId;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-community-group'].some((p) => userPermissions.has(p))) {
    const getCommunityGroup = serverContainer.get<GetCommunityGroup>(SYMBOLS.GetCommunityGroup);

    const communityGroupResult = await cache(
      async () => await getCommunityGroup.execute(communityGroupId),
    )();
    const communityGroup = match(communityGroupResult, {
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
      title: `Edit ${communityGroup.name}`,
    };
  } else {
    notFound();
  }
}

export default async function SingleCommunityGroupEditPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-community-group'].some((p) => userPermissions.has(p))) {
    const getCommunityGroup = serverContainer.get<GetCommunityGroup>(SYMBOLS.GetCommunityGroup);
    const communityGroupId = (await params).communityGroupId;

    const communityGroupResult = await cache(
      async () => await getCommunityGroup.execute(communityGroupId),
    )();
    const communityGroup = match(communityGroupResult, {
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
          { label: 'Settings', url: '/settings' },
          { label: 'Community Groups', url: '/community-groups' },
          { label: communityGroup.name, url: `/community-groups/${communityGroup.id}` },
          { label: 'Edit', url: `/community-groups/${communityGroup.id}/edit` },
        ]}
      >
        <CommunityGroupForm
          initialCommunityGroup={
            CommunityGroupMapper.fromDomainToDto(communityGroup) as CommunityGroupDto
          }
        />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
