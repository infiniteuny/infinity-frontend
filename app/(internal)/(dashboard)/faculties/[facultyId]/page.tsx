import { FacultyDto, FacultyMapper } from '@app/infrastructure/dtos';
import {
  FacultyForm,
  FacultyToolbar,
  FacultyView,
} from '@app/presentation/components/internal/single-faculty';
import { GetFaculty, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

type Props = {
  params: Promise<{
    facultyId: string;
  }>;
};

export default async function SingleFacultyPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const facultyId = (await params).facultyId;

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (facultyId !== 'new' && ['read-faculty'].some((p) => userPermissions.has(p))) {
    const getFaculty = serverContainer.get<GetFaculty>(SYMBOLS.GetFaculty);
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

    return (
      <>
        <SectionHeader title={faculty.name}>
          <FacultyToolbar facultyId={faculty.id} />
        </SectionHeader>
        <FacultyView initialFaculty={FacultyMapper.fromDomainToDto(faculty) as FacultyDto} />
      </>
    );
  } else if (facultyId === 'new' && ['create-faculty'].some((p) => userPermissions.has(p))) {
    return <FacultyForm />;
  } else {
    notFound();
  }
}
