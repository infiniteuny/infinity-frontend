import { GetUserPermissions } from '@app/application';
import { match } from 'effect/Either';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  UserPermissionDto,
  UserPermissionMapper,
} from '@app/infrastructure/dtos';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import {
  UserPermissionsList,
  UserPermissionsToolbar,
} from '@app/presentation/components/internal/user-permissions';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function UserPermissionsPage({ params }: Props) {
  const getUserPermissions = serverContainer.get<GetUserPermissions>(SYMBOLS.GetUserPermissions);
  const userId = (await params).userId;
  const result = await getUserPermissions.execute(userId, undefined, { perPage: 25 });
  const [userPermissions, paginationOptions] = match(result, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });

  return (
    <>
      <SectionHeader title="User Permissions">
        <UserPermissionsToolbar userId={userId} />
      </SectionHeader>
      <UserPermissionsList
        userId={userId}
        initialUserPermissions={
          userPermissions.map(UserPermissionMapper.fromDomainToDto) as UserPermissionDto[]
        }
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </>
  );
}
