import { GetPermission } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { PermissionDto, PermissionMapper } from '@app/infrastructure/dtos';
import {
  PermissionForm,
  PermissionToolbar,
  PermissionView,
} from '@app/presentation/components/internal/single-permission';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

type Props = {
  params: Promise<{
    permissionId: string;
  }>;
};

export default async function SinglePermissionPage({ params }: Props) {
  const permissionId = (await params).permissionId;

  if (permissionId !== 'new') {
    const getPermission = serverContainer.get<GetPermission>(SYMBOLS.GetPermission);
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
      <>
        <SectionHeader title={permission.name}>
          <PermissionToolbar permissionId={permission.id} />
        </SectionHeader>
        <PermissionView
          initialPermission={PermissionMapper.fromDomainToDto(permission) as PermissionDto}
        />
      </>
    );
  } else {
    return <PermissionForm />;
  }
}
