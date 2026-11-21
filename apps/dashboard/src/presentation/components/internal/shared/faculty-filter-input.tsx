'use client';

import { clientContainer } from '@app/client-injection';
import { EntityAutocompleteFilterInput } from './entity-autocomplete-filter-input';
import { GetFaculties, GetFaculty } from '@infiniteuny/infinity-application';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { Faculty } from '@infiniteuny/infinity-domain';
import { SYMBOLS } from '@config';
import { useCallback, useMemo } from 'react';

const getOptionLabel = (option: Faculty) => option.name;

export function FacultyFilterInput(props: GridFilterInputValueProps) {
  const getMany = useMemo(() => clientContainer.get<GetFaculties>(SYMBOLS.GetFaculties), []);
  const getById = useMemo(() => clientContainer.get<GetFaculty>(SYMBOLS.GetFaculty), []);

  const fetchById = useCallback(
    (id: string, signal: AbortSignal) => getById.execute(id, signal),
    [getById],
  );

  const search = useCallback(
    (query: string, signal: AbortSignal) =>
      getMany.execute({ name: query }, undefined, { perPage: 10 }, signal),
    [getMany],
  );

  return (
    <EntityAutocompleteFilterInput
      {...props}
      fetchById={fetchById}
      search={search}
      getOptionLabel={getOptionLabel}
      emptyText="Type to search faculty"
      noOptionsText="No faculties found"
    />
  );
}
