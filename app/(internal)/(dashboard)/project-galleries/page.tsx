import { GetProjectGalleries, GetSession } from '@app/application';
import { match } from 'effect/Either';
import { notFound } from 'next/navigation';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  ProjectGalleryDto,
  ProjectGalleryMapper,
} from '@app/infrastructure/dtos';
import {
  ProjectGalleriesList,
  ProjectGalleriesToolbar,
} from '@app/presentation/components/internal/project-galleries';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

export default async function ProjectGalleriesPage() {
  const getSession = serverContainer.get<GetSession>(SYMBOLS.GetSession);

  const sessionResult = await getSession.execute();
  const session = match(sessionResult, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (session) => session,
  });
  const userPermissions = new Set(session.permissions);

  if (!['read-project-gallery'].some((p) => userPermissions.has(p))) {
    notFound();
  } else {
    const getProjectGalleries = serverContainer.get<GetProjectGalleries>(
      SYMBOLS.GetProjectGalleries,
    );

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
            projectGalleries.map(ProjectGalleryMapper.fromDomainToDto) as ProjectGalleryDto[]
          }
          initialPaginationOptions={
            PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
          }
        />
      </>
    );
  }
}
