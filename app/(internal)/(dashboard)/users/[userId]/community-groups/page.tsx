import { GetUserCommunityGroups } from '@app/application';
import { match } from 'effect/Either';
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
  const getUserCommunityGroups = serverContainer.get<GetUserCommunityGroups>(
    SYMBOLS.GetUserCommunityGroups,
  );
  const userId = (await params).userId;
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
