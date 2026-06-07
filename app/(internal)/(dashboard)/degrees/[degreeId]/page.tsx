import { cache } from 'react';
import { DegreeDto, DegreeMapper } from '@app/infrastructure/dtos';
import {
  DegreeForm,
  DegreeToolbar,
  DegreeView,
} from '@app/presentation/components/internal/single-degree';
import { GetDegree, GetSession } from '@app/application';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

type Props = {
  params: Promise<{
    degreeId: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const degreeId = (await params).degreeId;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (degreeId !== 'new' && ['read-degree'].some((p) => userPermissions.has(p))) {
    const getDegree = serverContainer.get<GetDegree>(SYMBOLS.GetDegree);

    const degreeResult = await cache(async () => await getDegree.execute(degreeId))();
    const degree = match(degreeResult, {
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
      title: degree.name,
    };
  } else if (degreeId === 'new' && ['create-degree'].some((p) => userPermissions.has(p))) {
    return {
      title: 'Create Degree',
    };
  } else {
    notFound();
  }
}

export default async function SingleDegreePage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const degreeId = (await params).degreeId;

  const sessionResult = await cache(async () => await getSession.execute())();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (degreeId !== 'new' && ['read-degree'].some((p) => userPermissions.has(p))) {
    const getDegree = serverContainer.get<GetDegree>(SYMBOLS.GetDegree);

    const degreeResult = await cache(async () => await getDegree.execute(degreeId))();
    const degree = match(degreeResult, {
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
          { label: 'Degrees', url: '/degrees' },
          { label: degree.name, url: `/degrees/${degree.id}` },
        ]}
      >
        <SectionHeader title={degree.name} backUrl="/degrees">
          <DegreeToolbar degreeId={degree.id} />
        </SectionHeader>
        <DegreeView initialDegree={DegreeMapper.fromDomainToDto(degree) as DegreeDto} />
      </InternalMain>
    );
  } else if (degreeId === 'new' && ['create-degree'].some((p) => userPermissions.has(p))) {
    return (
      <InternalMain
        breadcrumbs={[
          { label: 'Overview', url: '/' },
          { label: 'Settings', url: '/settings' },
          { label: 'Degrees', url: '/degrees' },
          { label: 'Create Degree', url: `/degrees/new` },
        ]}
      >
        <DegreeForm />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
