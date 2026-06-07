import { cache } from 'react';
import { GetDegrees, GetFaculties, GetMajor, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import {
  DegreeDto,
  DegreeMapper,
  FacultyDto,
  FacultyMapper,
  MajorDto,
  MajorMapper,
} from '@app/infrastructure/dtos';
import {
  MajorForm,
  MajorToolbar,
  MajorView,
} from '@app/presentation/components/internal/single-major';

type Props = {
  params: Promise<{
    majorId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const majorId = (await params).majorId;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (majorId !== 'new' && ['read-major'].some((p) => userPermissions.has(p))) {
    const getMajor = serverContainer.get<GetMajor>(SYMBOLS.GetMajor);

    const majorResult = await cache(async () => await getMajor.execute(majorId))();
    const major = match(majorResult, {
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
      title: major.name,
    };
  } else if (majorId === 'new' && ['create-major'].some((p) => userPermissions.has(p))) {
    return {
      title: 'Create Major',
    };
  } else {
    notFound();
  }
}

export default async function SingleMajorPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const majorId = (await params).majorId;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (majorId !== 'new' && ['read-major'].some((p) => userPermissions.has(p))) {
    const getMajor = serverContainer.get<GetMajor>(SYMBOLS.GetMajor);
    const majorResult = await cache(
      async () => await getMajor.execute(majorId, ['degree', 'faculty']),
    )();
    const major = match(majorResult, {
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
          { label: 'Majors', url: '/majors' },
          { label: major.name, url: `/majors/${major.id}` },
        ]}
      >
        <SectionHeader title={major.name} backUrl="/majors">
          <MajorToolbar majorId={major.id} />
        </SectionHeader>
        <MajorView initialMajor={MajorMapper.fromDomainToDto(major) as MajorDto} />
      </InternalMain>
    );
  } else if (majorId === 'new' && ['create-major'].some((p) => userPermissions.has(p))) {
    const getDegrees = serverContainer.get<GetDegrees>(SYMBOLS.GetDegrees);
    const getFaculties = serverContainer.get<GetFaculties>(SYMBOLS.GetFaculties);

    const degreesResult = await getDegrees.execute(undefined, { perPage: 100 });
    const [degrees] = match(degreesResult, {
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

    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Settings', url: '/settings' },
          { label: 'Majors', url: '/majors' },
          { label: 'Create Major', url: `/majors/new` },
        ]}
      >
        <MajorForm
          degrees={degrees.map(DegreeMapper.fromDomainToDto) as DegreeDto[]}
          faculties={faculties.map(FacultyMapper.fromDomainToDto) as FacultyDto[]}
        />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
