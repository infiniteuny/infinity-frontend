import { GetUsers } from '@app/application';
import { match } from 'effect/Either';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  UserDto,
  UserMapper,
} from '@app/infrastructure/dtos';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { UsersList, UsersToolbar } from '@app/presentation/components/internal/users';

export default async function UsersPage() {
  const getUsers = serverContainer.get<GetUsers>(SYMBOLS.GetUsers);
  const result = await getUsers.execute(['major'], undefined, { perPage: 25 }, undefined);
  const [users, paginationOptions] = match(result, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });

  return (
    <>
      <SectionHeader title="Users">
        <UsersToolbar />
      </SectionHeader>
      <UsersList
        initialUsers={users.map(UserMapper.fromDomaintoDto) as UserDto[]}
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomaintoDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </>
  );
}
