'use client';

import { clientContainer } from '@app/client-injection';
import { EntityAutocompleteFilterInput } from './entity-autocomplete-filter-input';
import { GetDegree, GetDegrees } from '@infiniteuny/infinity-application';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { Degree } from '@infiniteuny/infinity-domain';
import { SYMBOLS } from '@config';
import { useCallback, useMemo } from 'react';

const getOptionLabel = (option: Degree) => option.name;

export function DegreeFilterInput(props: GridFilterInputValueProps) {
  const getMany = useMemo(() => clientContainer.get<GetDegrees>(SYMBOLS.GetDegrees), []);
  const getById = useMemo(() => clientContainer.get<GetDegree>(SYMBOLS.GetDegree), []);

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
      emptyText="Type to search degree"
      noOptionsText="No degrees found"
    />
  );
}
