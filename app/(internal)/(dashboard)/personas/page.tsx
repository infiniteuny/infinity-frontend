import { GetPersonas } from '@app/application';
import { InternalMain, SectionHeader } from '@app/presentation/components/internal/shared';
import { match } from 'effect/Either';
import { Metadata } from 'next';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  PersonaDto,
  PersonaMapper,
} from '@app/infrastructure/dtos';
import { PersonasList, PersonasToolbar } from '@app/presentation/components/internal/personas';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Personas',
};

export default async function PersonasPage() {
  const getPersonas = serverContainer.get<GetPersonas>(SYMBOLS.GetPersonas);

  const result = await getPersonas.execute(undefined, undefined, { perPage: 25 });
  const [personas, paginationOptions] = match(result, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });

  return (
    <InternalMain
      breadcrumbs={[
        { label: 'Overview', url: '/' },
        { label: 'Settings', url: '/settings' },
        { label: 'Personas', url: '/personas' },
      ]}
    >
      <SectionHeader title="Personas" backUrl="/settings">
        <PersonasToolbar />
      </SectionHeader>
      <PersonasList
        initialPersonas={personas.map(PersonaMapper.fromDomainToDto) as PersonaDto[]}
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </InternalMain>
  );
}
