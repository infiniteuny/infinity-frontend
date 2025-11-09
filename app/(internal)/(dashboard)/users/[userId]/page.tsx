import { GetFaculties, GetUser } from '@app/application';
import { match } from 'effect/Either';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { FacultyDto, FacultyMapper, UserDto, UserMapper } from '@app/infrastructure/dtos';
import { UserForm, UserToolbar, UserView } from '@app/presentation/components/internal/single-user';
import { NotFoundError } from '@app/domain/errors';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function SingleUserPage({ params }: Props) {
  const userId = (await params).userId;

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
        <UserView initialUser={UserMapper.fromDomaintoDto(user) as UserDto} />
      </>
    );
  } else {
    const getFaculties = serverContainer.get<GetFaculties>(SYMBOLS.GetFaculties);
    const facultiesResult = await getFaculties.execute(undefined, { perPage: 100 });
    const [faculties] = match(facultiesResult, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });

    return <UserForm faculties={faculties.map(FacultyMapper.fromDomaintoDto) as FacultyDto[]} />;
  }
}
