'use client';

import { clientContainer } from '@app/client-injection';
import { EntityAutocompleteFilterInput } from './entity-autocomplete-filter-input';
import { GetCompetition, GetCompetitions } from '@infiniteuny/infinity-application';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { Competition } from '@infiniteuny/infinity-domain';
import { SYMBOLS } from '@config';
import { useCallback, useMemo } from 'react';

const getOptionLabel = (option: Competition) => option.name;

export function CompetitionFilterInput(props: GridFilterInputValueProps) {
  const getMany = useMemo(() => clientContainer.get<GetCompetitions>(SYMBOLS.GetCompetitions), []);
  const getById = useMemo(() => clientContainer.get<GetCompetition>(SYMBOLS.GetCompetition), []);

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
      emptyText="Type to search competition series"
      noOptionsText="No competition series found"
    />
  );
}
