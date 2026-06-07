import { cache } from 'react';
import { GetCommunityGroup, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { CommunityGroupDto, CommunityGroupMapper } from '@app/infrastructure/dtos';
import {
  CommunityGroupForm,
  CommunityGroupToolbar,
  CommunityGroupView,
} from '@app/presentation/components/internal/single-community-group';

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

  if (communityGroupId !== 'new') {
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
      title: communityGroup.name,
    };
  } else if (
    communityGroupId === 'new' &&
    ['create-community-group'].some((p) => userPermissions.has(p))
  ) {
    return {
      title: 'Create Community Group',
    };
  } else {
    notFound();
  }
}

export default async function SingleCommunityGroupPage({ params }: Props) {
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

  if (communityGroupId !== 'new') {
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

    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Settings', url: '/settings' },
          { label: 'Community Groups', url: '/community-groups' },
          { label: communityGroup.name, url: `/community-groups/${communityGroup.id}` },
        ]}
      >
        <SectionHeader title={communityGroup.name} backUrl="/community-groups">
          <CommunityGroupToolbar communityGroupId={communityGroup.id} />
        </SectionHeader>
        <CommunityGroupView
          initialCommunityGroup={
            CommunityGroupMapper.fromDomainToDto(communityGroup) as CommunityGroupDto
          }
        />
      </InternalMain>
    );
  } else if (
    communityGroupId === 'new' &&
    ['create-community-group'].some((p) => userPermissions.has(p))
  ) {
    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Settings', url: '/settings' },
          { label: 'Community Groups', url: '/community-groups' },
          { label: 'Create Community Group', url: `/community-groups/new` },
        ]}
      >
        <CommunityGroupForm />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
