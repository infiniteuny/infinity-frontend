import { GetPermission } from '@app/application';
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
      initialPermission={PermissionMapper.fromDomaintoDto(permission) as PermissionDto}
    />
  );
}
