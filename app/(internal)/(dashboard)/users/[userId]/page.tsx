import { cache } from 'react';
import { FacultyDto, FacultyMapper, UserDto, UserMapper } from '@app/infrastructure/dtos';
import { GetFaculties, GetSession, GetUser } from '@app/application';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { UserForm, UserToolbar, UserView } from '@app/presentation/components/internal/single-user';

type Props = {
  params: Promise<{
    userId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const userId = (await params).userId;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (userId !== 'new') {
    const getUser = serverContainer.get<GetUser>(SYMBOLS.GetUser);

    const userResult = await cache(
      async () => await getUser.execute(userId, ['major', 'major.faculty', 'major.degree']),
    )();
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

    return {
      title: user.name,
    };
  } else if (userId === 'new' && ['create-user'].some((p) => userPermissions.has(p))) {
    return {
      title: 'Create User',
    };
  } else {
    notFound();
  }
}

export default async function SingleUserPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const userId = (await params).userId;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (userId !== 'new') {
    const getUser = serverContainer.get<GetUser>(SYMBOLS.GetUser);
    const userResult = await cache(
      async () => await getUser.execute(userId, ['major', 'major.faculty', 'major.degree']),
    )();
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

    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Users', url: '/users' },
          { label: user.name, url: `/users/${user.id}` },
        ]}
      >
        <SectionHeader title={user.name} backUrl="/users">
          <UserToolbar user={UserMapper.fromDomainToDto(user) as UserDto} />
        </SectionHeader>
        <UserView initialUser={UserMapper.fromDomainToDto(user) as UserDto} />
      </InternalMain>
    );
  } else if (userId === 'new' && ['create-user'].some((p) => userPermissions.has(p))) {
    const getFaculties = serverContainer.get<GetFaculties>(SYMBOLS.GetFaculties);

    const facultiesResult = await getFaculties.execute(undefined, undefined, { perPage: 100 });
    const [faculties] = match(facultiesResult, {
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
          { label: 'Create User', url: '/users/new' },
        ]}
      >
        <UserForm faculties={faculties.map(FacultyMapper.fromDomainToDto) as FacultyDto[]} />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
