import { GetSession, GetUser, GetUserCommunityGroups } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  UserCommunityGroupDto,
  UserCommunityGroupMapper,
} from '@app/infrastructure/dtos';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import {
  UserCommunityGroupsList,
  UserCommunityGroupsToolbar,
} from '@app/presentation/components/internal/user-community-groups';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function UserCommunityGroupsPage({ params }: Props) {
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
      ['read-community-group-member'].some((p) => userPermissions.has(p)) ||
      (['read-own-community-group-member'].some((p) => userPermissions.has(p)) &&
        user.id === session.user.id)
    )
  ) {
    notFound();
  } else {
    const getUserCommunityGroups = serverContainer.get<GetUserCommunityGroups>(
      SYMBOLS.GetUserCommunityGroups,
    );

    const result = await getUserCommunityGroups.execute(userId, undefined, { perPage: 25 });
    const [userCommunityGroups, paginationOptions] = match(result, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });

    return (
      <>
        <SectionHeader title="User Community Groups">
          <UserCommunityGroupsToolbar userId={userId} />
        </SectionHeader>
        <UserCommunityGroupsList
          userId={userId}
          initialUserCommunityGroups={
            userCommunityGroups.map(
              UserCommunityGroupMapper.fromDomaintoDto,
            ) as UserCommunityGroupDto[]
          }
          initialPaginationOptions={
            PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
          }
        />
      </>
    );
  }
}
