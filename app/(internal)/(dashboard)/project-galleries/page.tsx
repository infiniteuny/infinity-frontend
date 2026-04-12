import { GetProjectGalleries } from '@app/application';
import { match } from 'effect/Either';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  ProjectGalleryDto,
  ProjectGalleryMapper,
} from '@app/infrastructure/dtos';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';
import {
  ProjectGalleriesList,
  ProjectGalleriesToolbar,
} from '@app/presentation/components/internal/project-galleries';

export const dynamic = 'force-dynamic';

export default async function ProjectGalleriesPage() {
  const getProjectGalleries = serverContainer.get<GetProjectGalleries>(SYMBOLS.GetProjectGalleries);
  const result = await getProjectGalleries.execute(undefined, { perPage: 25 });
  const [projectGalleries, paginationOptions] = match(result, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });

  return (
    <>
      <SectionHeader title="Project Galleries">
        <ProjectGalleriesToolbar />
      </SectionHeader>
      <ProjectGalleriesList
        initialProjectGalleries={
          projectGalleries.map(ProjectGalleryMapper.fromDomaintoDto) as ProjectGalleryDto[]
        }
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomaintoDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </>
  );
}
