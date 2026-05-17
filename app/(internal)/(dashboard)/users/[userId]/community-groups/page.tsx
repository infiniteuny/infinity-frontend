import { GetUser, GetUserCommunityGroups } from '@app/application';
import { isLeft, match } from 'effect/Either';
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
  const getUser = serverContainer.get<GetUser>(SYMBOLS.GetUser);
  const getUserCommunityGroups = serverContainer.get<GetUserCommunityGroups>(
    SYMBOLS.GetUserCommunityGroups,
  );
  const userId = (await params).userId;

  const [userResult, userCommunityGroupsResult] = await Promise.all([
    getUser.execute(userId),
    getUserCommunityGroups.execute(userId, undefined, { perPage: 25 }),
  ]);

  if (isLeft(userResult)) {
    const error = userResult.left;

    if (error instanceof NotFoundError) {
      notFound();
    } else {
      throw error;
    }
  }

  const [userCommunityGroups, paginationOptions] = match(userCommunityGroupsResult, {
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
