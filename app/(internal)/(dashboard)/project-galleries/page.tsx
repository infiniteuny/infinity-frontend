import { GetProjectGalleries } from '@app/application';
import { InternalMain } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  ProjectGalleryDto,
  ProjectGalleryMapper,
} from '@app/infrastructure/dtos';
import { ProjectGalleriesList } from '@app/presentation/components/internal/project-galleries';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Project Galleries',
};

export default async function ProjectGalleriesPage() {
  const getProjectGalleries = serverContainer.get<GetProjectGalleries>(SYMBOLS.GetProjectGalleries);

  const result = await getProjectGalleries.execute(undefined, undefined, { perPage: 25 });
  const [projectGalleries, paginationOptions] = match(result, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });

  return (
    <InternalMain
      breadcrumbs={[
        { label: 'Overview', url: '/' },
        { label: 'Project Galleries', url: '/project-galleries' },
      ]}
    >
      <ProjectGalleriesList
        initialProjectGalleries={
          projectGalleries.map(ProjectGalleryMapper.fromDomainToDto) as ProjectGalleryDto[]
        }
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </InternalMain>
  );
}
