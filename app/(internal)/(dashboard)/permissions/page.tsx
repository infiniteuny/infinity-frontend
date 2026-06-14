import { GetPermissions, GetSession } from '@app/application';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  PermissionDto,
  PermissionMapper,
} from '@app/infrastructure/dtos';
import { PermissionsList } from '@app/presentation/components/internal/permissions';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Permissions',
};

export default async function PermissionsPage() {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['read-permission'].some((p) => userPermissions.has(p))) {
    const getPermissions = serverContainer.get<GetPermissions>(SYMBOLS.GetPermissions);

    const result = await getPermissions.execute(undefined, undefined, { perPage: 25 });
    const [permissions, paginationOptions] = match(result, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });

    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Permissions', url: '/permissions' },
        ]}
      >
        <PermissionsList
          initialPermissions={permissions.map(PermissionMapper.fromDomainToDto) as PermissionDto[]}
          initialPaginationOptions={
            PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
          }
        />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
