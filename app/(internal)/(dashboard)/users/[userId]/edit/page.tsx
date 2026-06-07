import { cache } from 'react';
import {
  FacultyDto,
  FacultyMapper,
  MajorDto,
  MajorMapper,
  UserDto,
  UserMapper,
} from '@app/infrastructure/dtos';
import { GetFaculties, GetMajors, GetSession, GetUser } from '@app/application';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { UserForm } from '@app/presentation/components/internal/single-user';

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

  if (
    ['update-user'].some((p) => userPermissions.has(p)) ||
    (['update-own-user'].some((p) => userPermissions.has(p)) && userId === session.user.id)
  ) {
    const getUser = serverContainer.get<GetUser>(SYMBOLS.GetUser);

    const userResult = await cache(
      async () => await getUser.execute(userId, ['major', 'major.faculty']),
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
      title: `Edit ${user.name}`,
    };
  } else {
    notFound();
  }
}

export default async function SingleUserEditPage({ params }: Props) {
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

  if (
    ['update-user'].some((p) => userPermissions.has(p)) ||
    (['update-own-user'].some((p) => userPermissions.has(p)) && userId === session.user.id)
  ) {
    const getUser = serverContainer.get<GetUser>(SYMBOLS.GetUser);
    const getFaculties = serverContainer.get<GetFaculties>(SYMBOLS.GetFaculties);
    const getMajors = serverContainer.get<GetMajors>(SYMBOLS.GetMajors);

    const [userResult, facultiesResult] = await Promise.all([
      cache(async () => await getUser.execute(userId, ['major', 'major.faculty']))(),
      getFaculties.execute(undefined, { perPage: 100 }),
    ]);

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
    const [faculties] = match(facultiesResult, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });

    const majorsResult = await getMajors.execute(
      ['degree'],
      { facultyId: user.major?.facultyId },
      { perPage: 100 },
    );
    const [majors] = match(majorsResult, {
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
          { label: user.name, url: `/users/${user.id}` },
          { label: 'Edit', url: `/users/${user.id}/edit` },
        ]}
      >
        <UserForm
          faculties={faculties.map(FacultyMapper.fromDomainToDto) as FacultyDto[]}
          majors={majors.map(MajorMapper.fromDomainToDto) as MajorDto[]}
          initialUser={UserMapper.fromDomainToDto(user) as UserDto}
        />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
