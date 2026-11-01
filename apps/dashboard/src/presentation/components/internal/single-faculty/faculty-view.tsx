'use client';

import { GeneralView } from './general-view';
import { MetadataView } from './metadata-view';
import { FacultyDto, FacultyMapper } from '@infiniteuny/infinity-infrastructure';

type Props = {
  initialFaculty: FacultyDto;
};

export function FacultyView({ initialFaculty }: Props) {
  const faculty = FacultyMapper.fromDtoToDomain(initialFaculty);

  return (
    <>
      <GeneralView faculty={faculty} />
      <MetadataView faculty={faculty} />
    </>
  );
}
