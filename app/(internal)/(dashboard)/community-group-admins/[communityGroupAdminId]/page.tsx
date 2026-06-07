import { cache } from 'react';
import { CommunityGroupAdminDto, CommunityGroupAdminMapper } from '@app/infrastructure/dtos';
import {
  CommunityGroupAdminForm,
  CommunityGroupAdminToolbar,
  CommunityGroupAdminView,
} from '@app/presentation/components/internal/single-community-group-admin';
import { GetCommunityGroupAdmin, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

type Props = {
  params: Promise<{
    communityGroupAdminId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const communityGroupAdminId = (await params).communityGroupAdminId;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (communityGroupAdminId !== 'new') {
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
      title: communityGroupAdmin.year.toString(),
    };
  } else if (
    communityGroupAdminId === 'new' &&
    ['create-community-group-admin'].some((p) => userPermissions.has(p))
  ) {
    return {
      title: 'Create Community Group Admin',
    };
  } else {
    notFound();
  }
}

export default async function SingleCommunityGroupAdminPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const communityGroupAdminId = (await params).communityGroupAdminId;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (communityGroupAdminId !== 'new') {
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

    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Community Group Administrators', url: '/community-group-admins' },
          {
            label: communityGroupAdmin.year.toString(),
            url: `/community-group-admins/${communityGroupAdmin.id}`,
          },
        ]}
      >
        <SectionHeader
          title={communityGroupAdmin.year.toString()}
          backUrl="/community-group-admins"
        >
          <CommunityGroupAdminToolbar communityGroupAdminId={communityGroupAdmin.id} />
        </SectionHeader>
        <CommunityGroupAdminView
          initialCommunityGroupAdmin={
            CommunityGroupAdminMapper.fromDomainToDto(communityGroupAdmin) as CommunityGroupAdminDto
          }
        />
      </InternalMain>
    );
  } else if (
    communityGroupAdminId === 'new' &&
    ['create-community-group-admin'].some((p) => userPermissions.has(p))
  ) {
    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Community Group Administrators', url: '/community-group-admins' },
          { label: 'Create Community Group Admin', url: `/community-group-admins/new` },
        ]}
      >
        <CommunityGroupAdminForm />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
