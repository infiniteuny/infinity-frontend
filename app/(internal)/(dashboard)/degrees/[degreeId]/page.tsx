import { GetDegree } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import { DegreeDto, DegreeMapper } from '@app/infrastructure/dtos';
import {
  DegreeForm,
  DegreeToolbar,
  DegreeView,
} from '@app/presentation/components/internal/single-degree';

type Props = {
  params: Promise<{
    degreeId: string;
  }>;
};

export default async function SingleDegreePage({ params }: Props) {
  const degreeId = (await params).degreeId;

  if (degreeId !== 'new') {
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
        <DegreeView initialDegree={DegreeMapper.fromDomaintoDto(degree) as DegreeDto} />
      </>
    );
  } else {
    return <DegreeForm />;
  }
}
