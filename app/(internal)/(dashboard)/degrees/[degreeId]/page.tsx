import { DegreeDto, DegreeMapper } from '@app/infrastructure/dtos';
import {
  DegreeForm,
  DegreeToolbar,
  DegreeView,
} from '@app/presentation/components/internal/single-degree';
import { GetDegree, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

type Props = {
  params: Promise<{
    degreeId: string;
  }>;
};

export default async function SingleDegreePage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);
  const degreeId = (await params).degreeId;

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (degreeId !== 'new' && ['read-degree'].some((p) => userPermissions.has(p))) {
    const getDegree = serverContainer.get<GetDegree>(SYMBOLS.GetDegree);
    const degreeResult = await getDegree.execute(degreeId);
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
      <>
        <SectionHeader title={degree.name}>
          <DegreeToolbar degreeId={degree.id} />
        </SectionHeader>
        <DegreeView initialDegree={DegreeMapper.fromDomainToDto(degree) as DegreeDto} />
      </>
    );
  } else if (degreeId === 'new' && ['create-degree'].some((p) => userPermissions.has(p))) {
    return <DegreeForm />;
  } else {
    notFound();
  }
}
