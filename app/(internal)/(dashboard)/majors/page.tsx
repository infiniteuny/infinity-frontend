import { GetMajors, GetSession } from '@app/application';
import { InternalMain } from '@app/presentation/components/internal/shared';
import {
  MajorDto,
  MajorMapper,
  PaginationOptionsDto,
  PaginationOptionsMapper,
} from '@app/infrastructure/dtos';
import { MajorsList } from '@app/presentation/components/internal/majors';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Majors',
};

export default async function MajorsPage() {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['read-major'].some((p) => userPermissions.has(p))) {
    const getMajors = serverContainer.get<GetMajors>(SYMBOLS.GetMajors);

    const result = await getMajors.execute(['degree', 'faculty'], undefined, undefined, {
      perPage: 25,
    });
    const [majors, paginationOptions] = match(result, {
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
        ]}
      >
        <MajorsList
          initialMajors={majors.map(MajorMapper.fromDomainToDto) as MajorDto[]}
          initialPaginationOptions={
            PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
          }
        />
      </InternalMain>
    );
  } else {
    notFound();
  }
}
