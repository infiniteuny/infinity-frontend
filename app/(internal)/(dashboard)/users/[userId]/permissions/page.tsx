import { GetSession, GetUser, GetUserPermissions } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
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
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const getUser = serverContainer.get<GetUser>(SYMBOLS.GetUser);
  const userId = (await params).userId;

  const [userResult, sessionResult] = await Promise.all([
    getUser.execute(userId),
    getSession.execute(),
  ]);

  const user = match(userResult, {
    onLeft: (error) => {
      if (error instanceof NotFoundError) {
        notFound();
      } else {
        throw error;
      }
    },
    onRight: (user) => user,
  });
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (
    !(
      ['read-user-permission'].some((p) => userPermissions.has(p)) ||
      (['read-own-user-permission'].some((p) => userPermissions.has(p)) &&
        user.id === session.user.id)
    )
  ) {
    notFound();
  } else {
    const getUserPermissions = serverContainer.get<GetUserPermissions>(SYMBOLS.GetUserPermissions);

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
}
