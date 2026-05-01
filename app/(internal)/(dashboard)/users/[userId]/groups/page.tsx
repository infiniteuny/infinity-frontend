import { GetUserGroups } from '@app/application';
import { match } from 'effect/Either';
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
  const getUserGroups = serverContainer.get<GetUserGroups>(SYMBOLS.GetUserGroups);
  const userId = (await params).userId;
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
