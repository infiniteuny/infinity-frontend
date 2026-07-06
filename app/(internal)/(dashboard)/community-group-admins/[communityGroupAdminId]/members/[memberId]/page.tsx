import { cache } from 'react';
import {
  CommunityGroupAdminDto,
  CommunityGroupAdminMapper,
  CommunityGroupAdminMemberDto,
  CommunityGroupAdminMemberMapper,
  CommunityGroupDto,
  CommunityGroupMapper,
} from '@app/infrastructure/dtos';
import {
  CommunityGroupAdminMemberForm,
  CommunityGroupAdminMemberToolbar,
  CommunityGroupAdminMemberView,
} from '@app/presentation/components/internal/single-community-group-admin-member';
import {
  GetCommunityGroupAdmin,
  GetCommunityGroupAdminMember,
  GetCommunityGroups,
  GetSession,
} from '@app/application';
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
    communityGroupAdminId: string;
    memberId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const { communityGroupAdminId, memberId } = await params;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (memberId !== 'new') {
    const getCommunityGroupAdminMember = serverContainer.get<GetCommunityGroupAdminMember>(
      SYMBOLS.GetCommunityGroupAdminMember,
    );

    const communityGroupAdminMemberResult = await cache(
      async () =>
        await getCommunityGroupAdminMember.execute(memberId, [
          'major',
          'major.faculty',
          'membership.community_group',
        ]),
    )();
    const communityGroupAdminMember = match(communityGroupAdminMemberResult, {
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
      title: communityGroupAdminMember.name,
    };
  } else if (
    memberId === 'new' &&
    ['create-community-group-admin-member'].some((p) => userPermissions.has(p))
  ) {
    const getCommunityGroupAdmin = serverContainer.get<GetCommunityGroupAdmin>(
      SYMBOLS.GetCommunityGroupAdmin,
    );

    const communityGroupAdminResult = await cache(
      async () => await getCommunityGroupAdmin.execute(communityGroupAdminId),
    )();
    const communityGroupAdmin = match(communityGroupAdminResult, {
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
      title: `Add ${communityGroupAdmin.year}'s Member`,
    };
  } else {
    notFound();
  }
}

export default async function SingleCommunityGroupAdminMemberPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const getCommunityGroupAdmin = serverContainer.get<GetCommunityGroupAdmin>(
    SYMBOLS.GetCommunityGroupAdmin,
  );
  const { communityGroupAdminId, memberId } = await params;

  const [communityGroupAdminResult, sessionResult] = await Promise.all([
    cache(async () => await getCommunityGroupAdmin.execute(communityGroupAdminId))(),
    cache(async () => await getSession.execute())(),
  ]);

  const communityGroupAdmin = match(communityGroupAdminResult, {
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

  if (memberId !== 'new') {
    const getCommunityGroupAdminMember = serverContainer.get<GetCommunityGroupAdminMember>(
      SYMBOLS.GetCommunityGroupAdminMember,
    );
    const communityGroupAdminMemberResult = await cache(
      async () =>
        await getCommunityGroupAdminMember.execute(memberId, [
          'major',
          'major.faculty',
          'membership.community_group',
        ]),
    )();
    const communityGroupAdminMember = match(communityGroupAdminMemberResult, {
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
          { label: 'Community Group Administrators', url: '/community-group-admins' },
          {
            label: communityGroupAdmin.year.toString(),
            url: `/community-group-admins/${communityGroupAdminId}`,
          },
          { label: 'Members', url: `/community-group-admins/${communityGroupAdminId}/members` },
          {
            label: communityGroupAdminMember.name,
            url: `/community-group-admins/${communityGroupAdminId}/members/${communityGroupAdminMember.membership.id}`,
          },
        ]}
      >
        <SectionHeader
          title={communityGroupAdminMember.name}
          backUrl={`/community-group-admins/${communityGroupAdminId}/members`}
        >
          <CommunityGroupAdminMemberToolbar
            communityGroupAdminId={communityGroupAdminId}
            communityGroupAdminMemberId={communityGroupAdminMember.membership.id}
          />
        </SectionHeader>
        <CommunityGroupAdminMemberView
          initialCommunityGroupAdminMember={
            CommunityGroupAdminMemberMapper.fromDomainToDto(
              communityGroupAdminMember,
            ) as CommunityGroupAdminMemberDto
          }
        />
      </InternalMain>
    );
  } else if (
    memberId === 'new' &&
    ['create-community-group-admin-member'].some((p) => userPermissions.has(p))
  ) {
    const getCommunityGroups = serverContainer.get<GetCommunityGroups>(SYMBOLS.GetCommunityGroups);

    const communityGroupsResult = await getCommunityGroups.execute(undefined, undefined, {
      perPage: 100,
    });
    const [communityGroups] = match(communityGroupsResult, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });

    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Community Group Administrators', url: '/community-group-admins' },
          {
            label: communityGroupAdmin.year.toString(),
            url: `/community-group-admins/${communityGroupAdminId}`,
          },
          { label: 'Members', url: `/community-group-admins/${communityGroupAdminId}/members` },
          {
            label: 'Add',
            url: `/community-group-admins/${communityGroupAdminId}/members/new`,
          },
        ]}
      >
        <CommunityGroupAdminMemberForm
          communityGroupAdmin={
            CommunityGroupAdminMapper.fromDomainToDto(communityGroupAdmin) as CommunityGroupAdminDto
          }
          communityGroups={
            communityGroups.map(CommunityGroupMapper.fromDomainToDto) as CommunityGroupDto[]
          }
        />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
