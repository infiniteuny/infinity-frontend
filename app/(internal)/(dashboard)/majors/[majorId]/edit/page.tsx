import { GetDegrees, GetFaculties, GetMajor } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import { NotFoundError } from '@app/domain/errors';
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

export default async function SingleMajorEditPage({ params }: Props) {
  const getMajor = serverContainer.get<GetMajor>(SYMBOLS.GetMajor);
  const getDegrees = serverContainer.get<GetDegrees>(SYMBOLS.GetDegrees);
  const getFaculties = serverContainer.get<GetFaculties>(SYMBOLS.GetFaculties);
  const majorId = (await params).majorId;

  const majorResult = await getMajor.execute(majorId, ['degree', 'faculty']);
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
    <MajorForm
      initialMajor={MajorMapper.fromDomaintoDto(major) as MajorDto}
      degrees={degrees.map(DegreeMapper.fromDomaintoDto) as DegreeDto[]}
      faculties={faculties.map(FacultyMapper.fromDomaintoDto) as FacultyDto[]}
    />
  );
}
