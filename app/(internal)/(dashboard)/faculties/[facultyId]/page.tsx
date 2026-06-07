import { cache } from 'react';
import { FacultyDto, FacultyMapper } from '@app/infrastructure/dtos';
import {
  FacultyForm,
  FacultyToolbar,
  FacultyView,
} from '@app/presentation/components/internal/single-faculty';
import { GetFaculty, GetSession } from '@app/application';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
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

  if (facultyId !== 'new' && ['read-faculty'].some((p) => userPermissions.has(p))) {
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
      title: faculty.name,
    };
  } else if (facultyId === 'new' && ['create-faculty'].some((p) => userPermissions.has(p))) {
    return {
      title: 'Create Faculty',
    };
  } else {
    notFound();
  }
}

export default async function SingleFacultyPage({ params }: Props) {
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

  if (facultyId !== 'new' && ['read-faculty'].some((p) => userPermissions.has(p))) {
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

    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Settings', url: '/settings' },
          { label: 'Faculties', url: '/faculties' },
          { label: faculty.name, url: `/faculties/${faculty.id}` },
        ]}
      >
        <SectionHeader title={faculty.name} backUrl="/faculties">
          <FacultyToolbar facultyId={faculty.id} />
        </SectionHeader>
        <FacultyView initialFaculty={FacultyMapper.fromDomainToDto(faculty) as FacultyDto} />
      </InternalMain>
    );
  } else if (facultyId === 'new' && ['create-faculty'].some((p) => userPermissions.has(p))) {
    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Settings', url: '/settings' },
          { label: 'Faculties', url: '/faculties' },
          { label: 'Create Faculty', url: `/faculties/new` },
        ]}
      >
        <FacultyForm />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
