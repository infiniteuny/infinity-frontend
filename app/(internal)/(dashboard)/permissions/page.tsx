import { GetPermissions, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  PermissionDto,
  PermissionMapper,
} from '@app/infrastructure/dtos';
import {
  PermissionsList,
  PermissionsToolbar,
} from '@app/presentation/components/internal/permissions';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

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

    const result = await getPermissions.execute(undefined, { perPage: 25 });
    const [permissions, paginationOptions] = match(result, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });

    return (
      <>
        <SectionHeader title="Permissions">
          <PermissionsToolbar />
        </SectionHeader>
        <PermissionsList
          initialPermissions={permissions.map(PermissionMapper.fromDomainToDto) as PermissionDto[]}
          initialPaginationOptions={
            PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
          }
        />
      </>
    );
  } else {
    notFound();
  }
}
