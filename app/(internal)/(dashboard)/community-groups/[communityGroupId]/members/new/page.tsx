import { CommunityGroupDto, CommunityGroupMapper } from '@app/infrastructure/dtos';
import { CommunityGroupMemberForm } from '@app/presentation/components/internal/single-community-group-member';
import { GetCommunityGroup, GetSession } from '@app/application';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { cache } from 'react';

type Props = {
  params: Promise<{
    communityGroupId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const getCommunityGroup = serverContainer.get<GetCommunityGroup>(SYMBOLS.GetCommunityGroup);
  const communityGroupId = (await params).communityGroupId;

  const [communityGroupResult, sessionResult] = await Promise.all([
    cache(async () => await getCommunityGroup.execute(communityGroupId))(),
    cache(async () => await getSession.execute())(),
  ]);

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
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['create-community-group-member'].some((p) => userPermissions.has(p))) {
    return {
      title: `Add ${communityGroup.name}'s Members`,
    };
  } else {
    notFound();
  }
}

export default async function SingleCommunityGroupMemberNewPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const getCommunityGroup = serverContainer.get<GetCommunityGroup>(SYMBOLS.GetCommunityGroup);
  const communityGroupId = (await params).communityGroupId;

  const [communityGroupResult, sessionResult] = await Promise.all([
    cache(async () => await getCommunityGroup.execute(communityGroupId))(),
    cache(async () => await getSession.execute())(),
  ]);

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
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['create-community-group-member'].some((p) => userPermissions.has(p))) {
    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Settings', url: '/settings' },
          { label: 'Community Groups', url: '/community-groups' },
          { label: communityGroup.name, url: `/community-groups/${communityGroupId}` },
          { label: 'Members', url: `/community-groups/${communityGroupId}/members` },
          { label: 'Add', url: `/community-groups/${communityGroupId}/members/new` },
        ]}
      >
        <CommunityGroupMemberForm
          communityGroup={CommunityGroupMapper.fromDomainToDto(communityGroup) as CommunityGroupDto}
        />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
