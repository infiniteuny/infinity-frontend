import { GetPermissions } from '@app/application';
import { match } from 'effect/Either';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  PermissionDto,
  PermissionMapper,
} from '@app/infrastructure/dtos';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import {
  PermissionsList,
  PermissionsToolbar,
} from '@app/presentation/components/internal/permissions';

export default async function PermissionsPage() {
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
        initialPermissions={permissions.map(PermissionMapper.fromDomaintoDto) as PermissionDto[]}
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomaintoDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </>
  );
}
