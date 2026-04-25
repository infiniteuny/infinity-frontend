'use client';

import { GeneralView } from './general-view';
import { MetadataView } from './metadata-view';
import { MajorDto, MajorMapper } from '@app/infrastructure/dtos';

type Props = {
  initialMajor: MajorDto;
};

export function MajorView({ initialMajor }: Props) {
  const major = MajorMapper.fromDtoToDomain(initialMajor);

  return (
    <>
      <GeneralView major={major} />
      <MetadataView major={major} />
    </>
  );
}
