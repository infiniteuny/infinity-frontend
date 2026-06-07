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

export const metadata: Metadata = {
  title: 'Edit Profile',
};

export default async function ProfileEditPage() {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await getSession.execute();

  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-own-user'].some((p) => userPermissions.has(p))) {
    const getUser = serverContainer.get<GetUser>(SYMBOLS.GetUser);
    const getFaculties = serverContainer.get<GetFaculties>(SYMBOLS.GetFaculties);
    const getMajors = serverContainer.get<GetMajors>(SYMBOLS.GetMajors);

    const [userResult, facultiesResult] = await Promise.all([
      getUser.execute(session.user.id, ['major', 'major.faculty']),
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
          { label: 'Settings', url: '/settings' },
          { label: 'Profile', url: '/settings/profile' },
          { label: 'Edit', url: '/settings/profile/edit' },
        ]}
      >
        <UserForm
          faculties={faculties.map(FacultyMapper.fromDomainToDto) as FacultyDto[]}
          majors={majors.map(MajorMapper.fromDomainToDto) as MajorDto[]}
          initialUser={UserMapper.fromDomainToDto(user) as UserDto}
          isProfileForm={true}
        />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
