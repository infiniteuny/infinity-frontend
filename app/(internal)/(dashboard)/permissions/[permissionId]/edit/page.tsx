import { cache } from 'react';
import { GetPermission, GetSession } from '@app/application';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { PermissionDto, PermissionMapper } from '@app/infrastructure/dtos';
import { PermissionForm } from '@app/presentation/components/internal/single-permission';
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

  if (['update-permission'].some((p) => userPermissions.has(p))) {
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
      title: `Edit ${permission.name}`,
    };
  } else {
    notFound();
  }
}

export default async function SinglePermissionEditPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-permission'].some((p) => userPermissions.has(p))) {
    const getPermission = serverContainer.get<GetPermission>(SYMBOLS.GetPermission);
    const permissionId = (await params).permissionId;

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
          { label: 'Edit', url: `/permissions/${permission.id}/edit` },
        ]}
      >
        <PermissionForm
          initialPermission={PermissionMapper.fromDomainToDto(permission) as PermissionDto}
        />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
