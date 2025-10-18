import { GetUsers } from '@app/application';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  UserDto,
  UserMapper,
} from '@app/infrastructure/dtos';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { UsersList } from '@app/presentation/components/internal/users';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { match } from 'effect/Either';
import { SessionProvider } from 'next-auth/react';

export default async function UsersPage() {
  const getUsers = serverContainer.get<GetUsers>(SYMBOLS.GetUsers);
  const result = await getUsers.execute(undefined, { perPage: 25 }, undefined);
  const [users, paginationOptions] = match(result, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });

  return (
    <>
      <SessionProvider basePath="/auth">
        <SectionHeader title="Users" />
        <UsersList
          initialUsers={users.map(UserMapper.fromDomaintoDto) as UserDto[]}
          initialPaginationOptions={
            PaginationOptionsMapper.fromDomaintoDto(paginationOptions) as PaginationOptionsDto
          }
        />
      </SessionProvider>
    </>
  );
}
