import { GetDegree, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { DegreeDto, DegreeMapper } from '@app/infrastructure/dtos';
import { DegreeForm } from '@app/presentation/components/internal/single-degree';

type Props = {
  params: Promise<{
    degreeId: string;
  }>;
};

export default async function SingleDegreeEditPage({ params }: Props) {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await getSession.execute();

  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (['update-degree'].some((p) => userPermissions.has(p))) {
    const getDegree = serverContainer.get<GetDegree>(SYMBOLS.GetDegree);
    const degreeId = (await params).degreeId;

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

    return <DegreeForm initialDegree={DegreeMapper.fromDomainToDto(degree) as DegreeDto} />;
  } else {
    notFound();
  }
}
