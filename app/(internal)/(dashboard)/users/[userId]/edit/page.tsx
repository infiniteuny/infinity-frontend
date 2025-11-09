import {
  FacultyDto,
  FacultyMapper,
  MajorDto,
  MajorMapper,
  UserDto,
  UserMapper,
} from '@app/infrastructure/dtos';
import { GetFaculties, GetMajors, GetUser } from '@app/application';
import { match } from 'effect/Either';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { UserForm } from '@app/presentation/components/internal/single-user';

type Props = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function SingleUserEditPage({ params }: Props) {
  const getUser = serverContainer.get<GetUser>(SYMBOLS.GetUser);
  const getFaculties = serverContainer.get<GetFaculties>(SYMBOLS.GetFaculties);
  const getMajors = serverContainer.get<GetMajors>(SYMBOLS.GetMajors);
  const userId = (await params).userId;

  const userResult = await getUser.execute(userId, ['major', 'major.faculty']);
  const user = match(userResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });

  const facultiesResult = await getFaculties.execute(undefined, { perPage: 100 });
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
    <UserForm
      faculties={faculties.map(FacultyMapper.fromDomaintoDto) as FacultyDto[]}
      majors={majors.map(MajorMapper.fromDomaintoDto) as MajorDto[]}
      initialUser={UserMapper.fromDomaintoDto(user) as UserDto}
    />
  );
}
