import { GetFaculty } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { FacultyDto, FacultyMapper } from '@app/infrastructure/dtos';
import {
  FacultyForm,
  FacultyToolbar,
  FacultyView,
} from '@app/presentation/components/internal/single-faculty';

type Props = {
  params: Promise<{
    facultyId: string;
  }>;
};

export default async function SingleFacultyPage({ params }: Props) {
  const facultyId = (await params).facultyId;

  if (facultyId !== 'new') {
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
        <FacultyView initialFaculty={FacultyMapper.fromDomaintoDto(faculty) as FacultyDto} />
      </>
    );
  } else {
    return <FacultyForm />;
  }
}
