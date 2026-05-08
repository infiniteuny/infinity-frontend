import { GetFaculty, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { FacultyDto, FacultyMapper } from '@app/infrastructure/dtos';
import { FacultyForm } from '@app/presentation/components/internal/single-faculty';

type Props = {
  params: Promise<{
    facultyId: string;
  }>;
};

export default async function SingleFacultyEditPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await getSession.execute();

  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-faculty'].some((p) => userPermissions.has(p))) {
    const getFaculty = serverContainer.get<GetFaculty>(SYMBOLS.GetFaculty);
    const facultyId = (await params).facultyId;

    const facultyResult = await getFaculty.execute(facultyId);
    const faculty = match(facultyResult, {
      onLeft: (error) => {
        if (error instanceof NotFoundError) {
          notFound();
        } else {
          throw error;
        }
      },
      onRight: (data) => data,
    });

    return <FacultyForm initialFaculty={FacultyMapper.fromDomainToDto(faculty) as FacultyDto} />;
  } else {
    notFound();
  }
}
