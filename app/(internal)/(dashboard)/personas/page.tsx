import { GetPersonas } from '@app/application';
import { match } from 'effect/Either';
import {
  PaginationOptionsDto,
  PaginationOptionsMapper,
  PersonaDto,
  PersonaMapper,
} from '@app/infrastructure/dtos';
import { PersonasList, PersonasToolbar } from '@app/presentation/components/internal/personas';
import { SectionHeader } from '@app/presentation/components/internal/shared';
import { serverContainer } from '@app/server-injection';
import { SYMBOLS } from '@config';

export const dynamic = 'force-dynamic';

export default async function PersonasPage() {
  const getPersonas = serverContainer.get<GetPersonas>(SYMBOLS.GetPersonas);

  const result = await getPersonas.execute(undefined, { perPage: 25 });
  const [personas, paginationOptions] = match(result, {
    onLeft: (error) => {
      throw error;
    },
    onRight: (data) => data,
  });

  return (
    <>
      <SectionHeader title="Personas">
        <PersonasToolbar />
      </SectionHeader>
      <PersonasList
        initialPersonas={personas.map(PersonaMapper.fromDomainToDto) as PersonaDto[]}
        initialPaginationOptions={
          PaginationOptionsMapper.fromDomainToDto(paginationOptions) as PaginationOptionsDto
        }
      />
    </>
  );
}
