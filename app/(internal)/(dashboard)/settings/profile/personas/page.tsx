import { GetSession, GetUser, GetUserPersonas } from '@app/application';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  UserDto,
  UserMapper,
  UserPersonaDto,
  UserPersonaMapper,
} from '@app/infrastructure/dtos';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { UserPersonasList } from '@app/presentation/components/internal/user-personas';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'My Personas',
};

export default async function ProfilePersonasPage() {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const getUser = serverContainer.get<GetUser>(SYMBOLS.GetUser);
  const getUserPersonas = serverContainer.get<GetUserPersonas>(SYMBOLS.GetUserPersonas);

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });

  const userResult = await getUser.execute(session.user.id);
  const user = match(userResult, {
    onLeft: (error) => {
      if (error instanceof NotFoundError) {
        notFound();
      } else {
        throw error;
      }
    },
    onRight: (data) => data,
  });

  const userPersonasResult = await getUserPersonas.execute(user.id, undefined, undefined, {
    perPage: 25,
  });
  const [userPersonas, paginationOptions] = match(userPersonasResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });

  return (
    <InternalMain
      breadcrumbs={[
        { label: 'Overview', url: '/' },
        { label: 'Settings', url: '/settings' },
        { label: 'Profile', url: '/settings/profile' },
        { label: 'Personas', url: '/settings/profile/personas' },
      ]}
    >
      <UserPersonasList
        initialUserPersonas={
          userPersonas.map(UserPersonaMapper.fromDomainToDto) as UserPersonaDto[]
        }
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
        }
        user={UserMapper.fromDomainToDto(user) as UserDto}
        isProfileView
      />
    </InternalMain>
  );
}
