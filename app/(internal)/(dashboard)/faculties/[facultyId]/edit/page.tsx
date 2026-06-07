import { cache } from 'react';
import { FacultyDto, FacultyMapper } from '@app/infrastructure/dtos';
import { FacultyForm } from '@app/presentation/components/internal/single-faculty';
import { GetFaculty, GetSession } from '@app/application';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

type Props = {
  params: Promise<{
    facultyId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const facultyId = (await params).facultyId;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-faculty'].some((p) => userPermissions.has(p))) {
    const getFaculty = serverContainer.get<GetFaculty>(SYMBOLS.GetFaculty);

    const facultyResult = await cache(async () => await getFaculty.execute(facultyId))();
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

    return {
      title: `Edit ${faculty.name}`,
    };
  } else {
    notFound();
  }
}

export default async function SingleFacultyEditPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await cache(async () => await getSession.execute())();
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

    const facultyResult = await cache(async () => await getFaculty.execute(facultyId))();
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
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Settings', url: '/settings' },
          { label: 'Faculties', url: '/faculties' },
          { label: faculty.name, url: `/faculties/${faculty.id}` },
          { label: 'Edit', url: `/faculties/${faculty.id}/edit` },
        ]}
      >
        <FacultyForm initialFaculty={FacultyMapper.fromDomainToDto(faculty) as FacultyDto} />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
