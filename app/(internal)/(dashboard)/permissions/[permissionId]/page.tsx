import { cache } from 'react';
import { GetPermission, GetSession } from '@app/application';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { PermissionDto, PermissionMapper } from '@app/infrastructure/dtos';
import {
  PermissionForm,
  PermissionToolbar,
  PermissionView,
} from '@app/presentation/components/internal/single-permission';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

type Props = {
  params: Promise<{
    permissionId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const permissionId = (await params).permissionId;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (permissionId !== 'new' && ['read-permission'].some((p) => userPermissions.has(p))) {
    const getPermission = serverContainer.get<GetPermission>(SYMBOLS.GetPermission);

    const permissionResult = await cache(async () => await getPermission.execute(permissionId))();
    const permission = match(permissionResult, {
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
      title: permission.name,
    };
  } else if (permissionId === 'new' && ['create-permission'].some((p) => userPermissions.has(p))) {
    return {
      title: 'Create Permission',
    };
  } else {
    notFound();
  }
}

export default async function SinglePermissionPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const permissionId = (await params).permissionId;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (permissionId !== 'new' && ['read-permission'].some((p) => userPermissions.has(p))) {
    const getPermission = serverContainer.get<GetPermission>(SYMBOLS.GetPermission);

    const permissionResult = await cache(async () => await getPermission.execute(permissionId))();
    const permission = match(permissionResult, {
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
          { label: 'Permissions', url: '/permissions' },
          { label: permission.name, url: `/permissions/${permission.id}` },
        ]}
      >
        <SectionHeader title={permission.name} backUrl="/permissions">
          <PermissionToolbar permissionId={permission.id} />
        </SectionHeader>
        <PermissionView
          initialPermission={PermissionMapper.fromDomainToDto(permission) as PermissionDto}
        />
      </InternalMain>
    );
  } else if (permissionId === 'new' && ['create-permission'].some((p) => userPermissions.has(p))) {
    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Permissions', url: '/permissions' },
          { label: 'Create Permission', url: `/permissions/new` },
        ]}
      >
        <PermissionForm />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
