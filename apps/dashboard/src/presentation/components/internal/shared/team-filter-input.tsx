'use client';

import { clientContainer } from '@app/client-injection';
import { EntityAutocompleteFilterInput } from './entity-autocomplete-filter-input';
import { GetTeam, GetTeams } from '@infiniteuny/infinity-application';
import { GridFilterInputValueProps } from '@mui/x-data-grid';
import { Team } from '@infiniteuny/infinity-domain';
import { SYMBOLS } from '@config';
import { useCallback, useMemo } from 'react';

const getOptionLabel = (option: Team) => option.name;

export function TeamFilterInput(props: GridFilterInputValueProps) {
  const getMany = useMemo(() => clientContainer.get<GetTeams>(SYMBOLS.GetTeams), []);
  const getById = useMemo(() => clientContainer.get<GetTeam>(SYMBOLS.GetTeam), []);

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
      emptyText="Type to search team"
      noOptionsText="No teams found"
    />
  );
}
