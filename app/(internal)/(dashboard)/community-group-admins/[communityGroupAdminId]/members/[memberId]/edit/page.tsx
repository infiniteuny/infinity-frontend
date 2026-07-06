import { cache } from 'react';
import {
  CommunityGroupAdminDto,
  CommunityGroupAdminMapper,
  CommunityGroupAdminMemberDto,
  CommunityGroupAdminMemberMapper,
  CommunityGroupDto,
  CommunityGroupMapper,
} from '@app/infrastructure/dtos';
import { CommunityGroupAdminMemberForm } from '@app/presentation/components/internal/single-community-group-admin-member';
import {
  GetCommunityGroupAdmin,
  GetCommunityGroupAdminMember,
  GetCommunityGroups,
  GetSession,
} from '@app/application';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { isLeft, match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

type Props = {
  params: Promise<{
    communityGroupAdminId: string;
    memberId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const getCommunityGroupAdmin = serverContainer.get<GetCommunityGroupAdmin>(
    SYMBOLS.GetCommunityGroupAdmin,
  );
  const { communityGroupAdminId, memberId } = await params;

  const [communityGroupAdminResult, sessionResult] = await Promise.all([
    cache(async () => await getCommunityGroupAdmin.execute(communityGroupAdminId))(),
    cache(async () => await getSession.execute())(),
  ]);

  if (isLeft(communityGroupAdminResult)) {
    const error = communityGroupAdminResult.left;

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

  if (['update-community-group-admin-member'].some((p) => userPermissions.has(p))) {
    const getCommunityGroupAdminMember = serverContainer.get<GetCommunityGroupAdminMember>(
      SYMBOLS.GetCommunityGroupAdminMember,
    );

    const communityGroupAdminMemberResult = await cache(
      async () =>
        await getCommunityGroupAdminMember.execute(memberId, ['membership.community_group']),
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
      title: `Edit ${communityGroupAdminMember.name}`,
    };
  } else {
    notFound();
  }
}

export default async function SingleCommunityGroupAdminMemberEditPage({ params }: Props) {
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

  if (['update-community-group-admin-member'].some((p) => userPermissions.has(p))) {
    const getCommunityGroupAdminMember = serverContainer.get<GetCommunityGroupAdminMember>(
      SYMBOLS.GetCommunityGroupAdminMember,
    );
    const getCommunityGroups = serverContainer.get<GetCommunityGroups>(SYMBOLS.GetCommunityGroups);

    const [communityGroupAdminMemberResult, communityGroupsResult] = await Promise.all([
      cache(
        async () =>
          await getCommunityGroupAdminMember.execute(memberId, ['membership.community_group']),
      )(),
      getCommunityGroups.execute(undefined, undefined, { perPage: 100 }),
    ]);

    const [communityGroups] = match(communityGroupsResult, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });
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
          {
            label: 'Edit',
            url: `/community-group-admins/${communityGroupAdminId}/members/${communityGroupAdminMember.membership.id}/edit`,
          },
        ]}
      >
        <CommunityGroupAdminMemberForm
          communityGroupAdmin={
            CommunityGroupAdminMapper.fromDomainToDto(communityGroupAdmin) as CommunityGroupAdminDto
          }
          initialCommunityGroupAdminMember={
            CommunityGroupAdminMemberMapper.fromDomainToDto(
              communityGroupAdminMember,
            ) as CommunityGroupAdminMemberDto
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
