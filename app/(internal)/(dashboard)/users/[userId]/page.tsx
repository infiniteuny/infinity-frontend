import { FacultyDto, FacultyMapper, UserDto, UserMapper } from '@app/infrastructure/dtos';
import { GetFaculties, GetSession, GetUser } from '@app/application';
import { match } from 'effect/Either';
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

export default async function SingleUserPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const userId = (await params).userId;

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (userId !== 'new') {
    const getUser = serverContainer.get<GetUser>(SYMBOLS.GetUser);
    const userResult = await getUser.execute(userId, ['major', 'major.faculty', 'major.degree']);
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
      <>
        <SectionHeader title={user.name}>
          <UserToolbar userId={user.id} />
        </SectionHeader>
        <UserView initialUser={UserMapper.fromDomainToDto(user) as UserDto} />
      </>
    );
  } else if (userId === 'new' && ['create-user'].some((p) => userPermissions.has(p))) {
    const getFaculties = serverContainer.get<GetFaculties>(SYMBOLS.GetFaculties);
    const facultiesResult = await getFaculties.execute(undefined, { perPage: 100 });
    const [faculties] = match(facultiesResult, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });

    return <UserForm faculties={faculties.map(FacultyMapper.fromDomainToDto) as FacultyDto[]} />;
  } else {
    notFound();
  }
}
