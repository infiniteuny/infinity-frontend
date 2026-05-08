import { GetSession, GetUser, GetUserGroups } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  UserGroupDto,
  UserGroupMapper,
} from '@app/infrastructure/dtos';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import {
  UserGroupsList,
  UserGroupsToolbar,
} from '@app/presentation/components/internal/user-groups';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function UserGroupsPage({ params }: Props) {
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
      ['read-user-group'].some((p) => userPermissions.has(p)) ||
      (['read-own-user-group'].some((p) => userPermissions.has(p)) && user.id === session.user.id)
    )
  ) {
    notFound();
  } else {
    const getUserGroups = serverContainer.get<GetUserGroups>(SYMBOLS.GetUserGroups);

    const result = await getUserGroups.execute(userId, undefined, { perPage: 25 });
    const [userGroups, paginationOptions] = match(result, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });

    return (
      <>
        <SectionHeader title="User Groups">
          <UserGroupsToolbar userId={userId} />
        </SectionHeader>
        <UserGroupsList
          userId={userId}
          initialUserGroups={userGroups.map(UserGroupMapper.fromDomainToDto) as UserGroupDto[]}
          initialPaginationOptions={
            PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
          }
        />
      </>
    );
  }
}
