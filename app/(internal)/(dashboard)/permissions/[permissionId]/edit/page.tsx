import { GetPermission, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { PermissionDto, PermissionMapper } from '@app/infrastructure/dtos';
import { PermissionForm } from '@app/presentation/components/internal/single-permission';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { NotFoundError } from '@app/domain/errors';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{
    permissionId: string;
  }>;
};

export default async function SinglePermissionEditPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await getSession.execute();

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

    const permissionResult = await getPermission.execute(permissionId);
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
      <PermissionForm
        initialPermission={PermissionMapper.fromDomainToDto(permission) as PermissionDto}
      />
    );
  } else {
    notFound();
  }
}
