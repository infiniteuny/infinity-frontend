'use client';

import { clientContainer } from '@app/client-injection';
import { EntityAutocompleteFilterInput } from './entity-autocomplete-filter-input';
import { GetMajor, GetMajors } from '@infiniteuny/infinity-application';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { Major } from '@infiniteuny/infinity-domain';
import { SYMBOLS } from '@config';
import { useCallback, useMemo } from 'react';

const getOptionLabel = (option: Major) => `${option.degree?.name ?? ''} - ${option.name}`;

export function MajorFilterInput(props: GridFilterInputValueProps) {
  const getMany = useMemo(() => clientContainer.get<GetMajors>(SYMBOLS.GetMajors), []);
  const getById = useMemo(() => clientContainer.get<GetMajor>(SYMBOLS.GetMajor), []);

  const fetchById = useCallback(
    (id: string, signal: AbortSignal) => getById.execute(id, ['degree'], signal),
    [getById],
  );

  const search = useCallback(
    (query: string, signal: AbortSignal) =>
      getMany.execute(['degree'], { name: query }, undefined, { perPage: 10 }, signal),
    [getMany],
  );

  return (
    <EntityAutocompleteFilterInput
      {...props}
      fetchById={fetchById}
      search={search}
      getOptionLabel={getOptionLabel}
      emptyText="Type to search major"
      noOptionsText="No majors found"
    />
  );
}
