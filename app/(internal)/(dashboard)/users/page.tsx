import { GetUsers } from '@app/application';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  UserDto,
  UserMapper,
} from '@app/infrastructure/dtos';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { UsersList } from '@app/presentation/components/internal/users';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Users',
};

export default async function UsersPage() {
  const getUsers = serverContainer.get<GetUsers>(SYMBOLS.GetUsers);

  const result = await getUsers.execute(['major', 'major.faculty'], undefined, undefined, {
    perPage: 25,
  });
  const [users, paginationOptions] = match(result, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });

  return (
    <InternalMain
      breadcrumbs={[
        { label: 'Overview', url: '/' },
        { label: 'Users', url: '/users' },
      ]}
    >
      <UsersList
        initialUsers={users.map(UserMapper.fromDomainToDto) as UserDto[]}
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </InternalMain>
  );
}
