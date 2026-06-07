import { cache } from 'react';
import { GetDegrees, GetFaculties, GetMajor, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { InternalMain } from '@app/presentation/components/internal/shared';
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
import { MajorForm } from '@app/presentation/components/internal/single-major';

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

  if (['update-major'].some((p) => userPermissions.has(p))) {
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
      title: `Edit ${major.name}`,
    };
  } else {
    notFound();
  }
}

export default async function SingleMajorEditPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-major'].some((p) => userPermissions.has(p))) {
    const getMajor = serverContainer.get<GetMajor>(SYMBOLS.GetMajor);
    const getDegrees = serverContainer.get<GetDegrees>(SYMBOLS.GetDegrees);
    const getFaculties = serverContainer.get<GetFaculties>(SYMBOLS.GetFaculties);
    const majorId = (await params).majorId;

    const [majorResult, degreesResult, facultiesResult] = await Promise.all([
      getMajor.execute(majorId, ['degree', 'faculty']),
      getDegrees.execute(undefined, { perPage: 100 }),
      getFaculties.execute(undefined, { perPage: 100 }),
    ]);

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
    const [degrees] = match(degreesResult, {
      onLeft: (error) => {
        throw error;
      },
      onRight: (data) => data,
    });
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
          { label: major.name, url: `/majors/${major.id}` },
          { label: 'Edit', url: `/majors/${major.id}/edit` },
        ]}
      >
        <MajorForm
          initialMajor={MajorMapper.fromDomainToDto(major) as MajorDto}
          degrees={degrees.map(DegreeMapper.fromDomainToDto) as DegreeDto[]}
          faculties={faculties.map(FacultyMapper.fromDomainToDto) as FacultyDto[]}
        />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
