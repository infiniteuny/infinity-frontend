'use client';

import { clientContainer } from '@app/client-injection';
import { EntityAutocompleteFilterInput } from './entity-autocomplete-filter-input';
import { GetCompetitionInstance, GetCompetitionInstances } from '@infiniteuny/infinity-application';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { CompetitionInstance } from '@infiniteuny/infinity-domain';
import { SYMBOLS } from '@config';
import { useCallback, useMemo } from 'react';

const getOptionLabel = (option: CompetitionInstance) => option.name;

export function CompetitionInstanceFilterInput(props: GridFilterInputValueProps) {
  const getMany = useMemo(
    () => clientContainer.get<GetCompetitionInstances>(SYMBOLS.GetCompetitionInstances),
    [],
  );
  const getById = useMemo(
    () => clientContainer.get<GetCompetitionInstance>(SYMBOLS.GetCompetitionInstance),
    [],
  );

  const fetchById = useCallback(
    (id: string, signal: AbortSignal) => getById.execute(id, undefined, signal),
    [getById],
  );

  const search = useCallback(
    (query: string, signal: AbortSignal) =>
      getMany.execute(undefined, { name: query }, undefined, { perPage: 10 }, signal),
    [getMany],
  );

  return (
    <EntityAutocompleteFilterInput
      {...props}
      fetchById={fetchById}
      search={search}
      getOptionLabel={getOptionLabel}
      emptyText="Type to search competition"
      noOptionsText="No competitions found"
    />
  );
}
