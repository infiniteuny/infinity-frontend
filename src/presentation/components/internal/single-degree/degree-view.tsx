'use client';

import { GeneralView } from './general-view';
import { MetadataView } from './metadata-view';
import { DegreeDto, DegreeMapper } from '@app/infrastructure/dtos';

type Props = {
  initialDegree: DegreeDto;
};

export function DegreeView({ initialDegree }: Props) {
  const degree = DegreeMapper.fromDtoToDomain(initialDegree);

  return (
    <>
      <GeneralView degree={degree} />
      <MetadataView degree={degree} />
    </>
  );
}
